"use server";

import { DB } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized Access");

    // 👤 Sync with internal user model ID record layout mapping
    const user = await DB.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) throw new Error("User mapping container not found.");

    // Extract input values securely from the form object
    const description = formData.get("description");
    const amountInput = formData.get("amount");
    const type = formData.get("type"); // "INCOME" or "EXPENSE"
    const category = formData.get("category") || "OTHERS"; // 👈 Grabs your new dropdown menu values
    const accountId = formData.get("accountId");

    if (!description || !amountInput || !type || !accountId) {
      throw new Error("Missing required transaction data parameters.");
    }

    const amount = new Prisma.Decimal(amountInput);

    // 💳 Execute an isolated database transaction to write the item and update account balances simultaneously
    await DB.$transaction(async (tx) => {
      // Find the balance target profile record
      const account = await tx.account.findUnique({
        where: { id: accountId },
      });
      if (!account) throw new Error("Target account container does not exist.");

      // 1. Log the transaction row item entity entry
      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId,
          description,
          type,
          amount,
          category, // Saved accurately to database records
          date: new Date(),
        },
      });

      // 2. Adjust account liquidity balance pools based on classification structures
      let updatedBalance;
      if (type === "INCOME") {
        updatedBalance = account.balance.add(amount);
      } else {
        updatedBalance = account.balance.sub(amount);
      }

      await tx.account.update({
        where: { id: accountId },
        data: { balance: updatedBalance },
      });
    });

    // Purge cached values to update UI states across all relevant routes
    revalidatePath("/dashboard");
    revalidatePath("/transaction");
    revalidatePath("/account"); // 🔄 Sync account balance display after atomic update

    return { success: true };

  } catch (error) {
    console.error("❌ Transaction write failure:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserTransactions() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return [];

    const user = await DB.user.findUnique({ where: { clerkUserId } });
    if (!user) return [];

    const transactions = await DB.transaction.findMany({
      where: { userId: user.id },
      include: { account: true },
      orderBy: { date: "desc" },
    });

    return transactions.map(tx => ({
      id: tx.id,
      description: tx.description,
      amount: tx.amount.toString(),
      type: tx.type,
      category: tx.category,
      date: tx.date.toISOString(),
      accountName: tx.account.name,
    }));
  } catch (error) {
    console.error("❌ Failed to query transactions:", error);
    return [];
  }
}