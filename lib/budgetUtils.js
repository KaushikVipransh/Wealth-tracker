import { DB } from "@/lib/prisma";

/**
 * Sums the current calendar month's EXPENSE transactions for a user.
 * Shared by the dashboard budget action and the Inngest alert cron.
 * @param {string} userId - internal DB user id
 * @returns {Promise<number>} total expenses as a plain number
 */
export async function getMonthExpenses(userId) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const result = await DB.transaction.aggregate({
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: monthStart, lte: monthEnd },
    },
    _sum: { amount: true },
  });

  return result._sum.amount ? parseFloat(result._sum.amount) : 0;
}
