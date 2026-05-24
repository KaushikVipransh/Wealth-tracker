"use server";

import { auth } from "@clerk/nextjs/server";
import { DB } from "@/lib/prisma";
import { Prisma, AccountType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createBankAccount(formData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const name = formData.get("name");
    const rawType = formData.get("type"); 
    const rawBalance = formData.get("balance") || "0.00";

    if (!AccountType[rawType]) {
      throw new Error(`Invalid account type: ${rawType}`);
    }

    const dbUser = await DB.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!dbUser) throw new Error("User not found.");

    const newAccount = await DB.account.create({
      data: {
        userId: dbUser.id,
        name,
        type: AccountType[rawType], 
        balance: new Prisma.Decimal(rawBalance),
        isDefault: false,
      },
    });

    revalidatePath("/account");
    return { success: true, account: JSON.parse(JSON.stringify(newAccount)) };
  } catch (error) {
    console.error("❌ Account Creation Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const dbUser = await DB.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!dbUser) return [];

    const accounts = await DB.account.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    // 🎯 FIX: Force deep serialization of the entire array using native JSON primitives 
    // before it crosses the Turbopack react-server-dom wire.
    return JSON.parse(JSON.stringify(accounts));
  } catch (error) {
    console.error("❌ Failed to fetch accounts:", error);
    return [];
  }
}