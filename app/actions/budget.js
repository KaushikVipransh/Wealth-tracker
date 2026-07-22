"use server";

import { DB } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getMonthExpenses } from "@/lib/budgetUtils";

export async function getCurrentBudget() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized Access");

    const user = await DB.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User mapping container not found.");

    const [budget, currentExpenses] = await Promise.all([
      DB.budget.findUnique({ where: { userId: user.id } }),
      getMonthExpenses(user.id),
    ]);

    return {
      success: true,
      budget: budget
        ? { amount: budget.amount.toString(), lastAlertSent: budget.lastAlertSent?.toISOString() || null }
        : null,
      currentExpenses: currentExpenses.toString(),
    };
  } catch (error) {
    console.error("❌ Budget query failure:", error);
    return { success: false, error: error.message, budget: null, currentExpenses: "0" };
  }
}

export async function updateBudget(amount) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized Access");

    const user = await DB.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User mapping container not found.");

    const numeric = parseFloat(amount);
    if (isNaN(numeric) || numeric <= 0) {
      throw new Error("Budget must be a positive amount.");
    }

    const budget = await DB.budget.upsert({
      where: { userId: user.id },
      update: { amount: new Prisma.Decimal(numeric) },
      create: { userId: user.id, amount: new Prisma.Decimal(numeric) },
    });

    revalidatePath("/dashboard");

    return { success: true, budget: { amount: budget.amount.toString() } };
  } catch (error) {
    console.error("❌ Budget upsert failure:", error);
    return { success: false, error: error.message };
  }
}
