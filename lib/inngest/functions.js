import { Resend } from "resend";
import { inngest } from "./client";
import { DB } from "@/lib/prisma";
import { calculateNextRecurringDate } from "@/lib/recurring";
import { getMonthExpenses } from "@/lib/budgetUtils";
import BudgetAlert from "@/emails/BudgetAlert";

/* ────────────────────────────────────────────────────────────
   🔁 RECURRING TRANSACTIONS ENGINE
   Daily 00:00 UTC — replays due recurring templates atomically
──────────────────────────────────────────────────────────── */

/**
 * Processes ONE due recurring template inside an atomic DB transaction.
 * Idempotency backstop: the row is re-fetched and re-checked inside the
 * transaction, so duplicate cron runs / step retries become no-ops.
 */
async function processOneRecurring(templateId) {
  return DB.$transaction(async (tx) => {
    const row = await tx.transaction.findUnique({
      where: { id: templateId },
      include: { account: true },
    });

    // Guard: template deleted, no longer recurring, or not actually due
    if (!row?.isRecurring || !row.nextRecurringDate || row.nextRecurringDate > new Date()) {
      return "skipped";
    }

    // 1. Create the child instance dated at the scheduled occurrence
    await tx.transaction.create({
      data: {
        userId: row.userId,
        accountId: row.accountId,
        type: row.type,
        amount: row.amount,
        category: row.category,
        description: `${row.description || "Recurring entry"} (Recurring)`,
        date: row.nextRecurringDate,
        isRecurring: false,
      },
    });

    // 2. Adjust the account balance pool (existing atomic pattern)
    const updatedBalance = row.type === "INCOME"
      ? row.account.balance.add(row.amount)
      : row.account.balance.sub(row.amount);
    await tx.account.update({
      where: { id: row.accountId },
      data: { balance: updatedBalance },
    });

    // 3. Advance the template. Catch-up policy: advance FROM the scheduled
    // date (not now) — missed periods are back-filled one per daily run.
    await tx.transaction.update({
      where: { id: row.id },
      data: {
        nextRecurringDate: calculateNextRecurringDate(row.nextRecurringDate, row.recurringInterval),
        lastProcessed: new Date(),
      },
    });

    return "created";
  });
}

export const processRecurringTransactions = inngest.createFunction(
  // Inngest v4 signature: triggers live inside the first (options) argument
  { id: "process-recurring-transactions", retries: 2, triggers: [{ cron: "0 0 * * *" }] }, // daily 00:00 UTC (05:30 IST)
  async ({ step }) => {
    // Step results must be JSON-serializable — return ids only, never Decimal/Date rows
    const dueIds = await step.run("fetch-due-ids", async () => {
      const rows = await DB.transaction.findMany({
        where: { isRecurring: true, nextRecurringDate: { lte: new Date() } },
        select: { id: true },
      });
      return rows.map((r) => r.id);
    });

    // Sequential steps = natural throttling; a failure retries only that step.
    // NOTE: for large user bases, switch to fan-out events + throttle config.
    const results = [];
    for (const id of dueIds) {
      const outcome = await step.run(`process-tx-${id}`, () => processOneRecurring(id));
      results.push(outcome);
    }

    return {
      due: dueIds.length,
      created: results.filter((r) => r === "created").length,
      skipped: results.filter((r) => r === "skipped").length,
    };
  }
);

/* ────────────────────────────────────────────────────────────
   💰 BUDGET ALERT SENTINEL
   Every 6h — emails users who crossed 80% of monthly budget
──────────────────────────────────────────────────────────── */

const ALERT_THRESHOLD_PCT = 80;

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);

async function checkOneBudget(budgetId) {
  const budget = await DB.budget.findUnique({
    where: { id: budgetId },
    include: { user: true },
  });
  if (!budget) return "missing";

  const budgetAmount = parseFloat(budget.amount);
  if (budgetAmount <= 0) return "invalid-budget";

  const spent = await getMonthExpenses(budget.userId);
  const percentUsed = (spent / budgetAmount) * 100;
  if (percentUsed < ALERT_THRESHOLD_PCT) return "below-threshold";

  // One alert per calendar month max
  const now = new Date();
  if (
    budget.lastAlertSent &&
    budget.lastAlertSent.getMonth() === now.getMonth() &&
    budget.lastAlertSent.getFullYear() === now.getFullYear()
  ) {
    return "already-alerted";
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY missing — budget alert email skipped.");
    return "resend-not-configured";
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.ALERT_EMAIL_FROM || "WealthOS <onboarding@resend.dev>",
    to: budget.user.email,
    subject: `⚠ Budget Alert: ${percentUsed.toFixed(1)}% of monthly budget used`,
    react: (
      <BudgetAlert
        userName={budget.user.name || "Operator"}
        percentUsed={percentUsed.toFixed(1)}
        budgetAmount={formatINR(budgetAmount)}
        spentAmount={formatINR(spent)}
        remainingAmount={formatINR(Math.max(budgetAmount - spent, 0))}
      />
    ),
  });
  if (error) throw new Error(`Resend delivery failure: ${error.message || JSON.stringify(error)}`);

  // Only mark AFTER a successful send — a failed send retries instead of going silent
  await DB.budget.update({
    where: { id: budget.id },
    data: { lastAlertSent: new Date() },
  });

  return "sent";
}

export const checkBudgetAlerts = inngest.createFunction(
  { id: "check-budget-alerts", retries: 2, triggers: [{ cron: "0 */6 * * *" }] },
  async ({ step }) => {
    const budgetIds = await step.run("fetch-budget-ids", async () => {
      const rows = await DB.budget.findMany({ select: { id: true } });
      return rows.map((r) => r.id);
    });

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const results = [];
    for (const id of budgetIds) {
      // Month-keyed step id = per-run idempotency on top of the DB lastAlertSent check
      const outcome = await step.run(`alert-${id}-${monthKey}`, () => checkOneBudget(id));
      results.push(outcome);
    }

    return {
      checked: budgetIds.length,
      sent: results.filter((r) => r === "sent").length,
    };
  }
);
