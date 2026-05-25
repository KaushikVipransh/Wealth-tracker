"use server";

import { DB } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardAnalytics() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized Access Attempt");

    // 👤 Find internal relational DB user entry
    const user = await DB.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User record mapping not found");

    // 📊 Fetch accounts and transactions in parallel
    const [accounts, transactions] = await Promise.all([
      DB.account.findMany({
        where: { userId: user.id },
      }),
      DB.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
      }),
    ]);

    // 🧮 Calculate Core Metrics
    let totalAssetBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};

    accounts.forEach((acc) => {
      // Prisma Decimal types need to be converted to primitive numbers for JS aggregation
      const bal = parseFloat(acc.balance);
      if (acc.type === "CREDIT") {
        totalAssetBalance -= bal; // Credit cards count against your net asset pool
      } else {
        totalAssetBalance += bal;
      }
    });

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount);
      if (tx.type === "INCOME") {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }

      // 🔄 FIX: Moved outside the if/else block so BOTH Income and Expenses populate the chart
      const cat = tx.category || "OTHERS";
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });

    // Convert category map into an array sorted by highest expenditure
    const categoryBreakdown = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    })).sort((a, b) => b.value - a.value);

    return {
      success: true,
      totalAssetBalance,
      totalIncome,
      totalExpense,
      categoryBreakdown,
      // 🎯 Serialize to strip Prisma Decimal / Date objects before crossing any RSC boundary
      recentTransactions: JSON.parse(JSON.stringify(transactions.slice(0, 5))),
    };

  } catch (error) {
    console.error("❌ Analytics Query Failure:", error);
    return { success: false, error: error.message };
  }
}