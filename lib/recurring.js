/**
 * Recurring schedule date math.
 *
 * Timezone policy: all recurring computations use pure UTC — Postgres stores
 * UTC timestamps and the Inngest cron fires at 00:00 UTC (05:30 IST). The
 * ±5.5h drift is acceptable for a personal finance ledger.
 */

const VALID_INTERVALS = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export function isValidRecurringInterval(interval) {
  return VALID_INTERVALS.includes(interval);
}

/**
 * Computes the next occurrence date for a recurring transaction.
 * Month-end aware: Jan 31 + MONTHLY → Feb 28/29 (clamped), not Mar 2/3.
 *
 * @param {Date|string} fromDate - the date to advance from
 * @param {"DAILY"|"WEEKLY"|"MONTHLY"|"YEARLY"} interval
 * @returns {Date}
 */
export function calculateNextRecurringDate(fromDate, interval) {
  const next = new Date(fromDate);
  const originalDay = next.getUTCDate();

  switch (interval) {
    case "DAILY":
      next.setUTCDate(next.getUTCDate() + 1);
      break;
    case "WEEKLY":
      next.setUTCDate(next.getUTCDate() + 7);
      break;
    case "MONTHLY":
      next.setUTCMonth(next.getUTCMonth() + 1);
      // Overflow clamp: if the target month is shorter, JS rolls into the
      // following month — snap back to the last day of the intended month.
      if (next.getUTCDate() !== originalDay) next.setUTCDate(0);
      break;
    case "YEARLY":
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      if (next.getUTCDate() !== originalDay) next.setUTCDate(0); // Feb 29 → Feb 28
      break;
    default:
      throw new Error(`Invalid recurring interval: ${interval}`);
  }

  return next;
}
