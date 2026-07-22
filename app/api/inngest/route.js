import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  processRecurringTransactions,
  checkBudgetAlerts,
} from "@/lib/inngest/functions";

// 🛰️ Inngest ingestion endpoint — dev server: npx inngest-cli dev -u http://localhost:3000/api/inngest
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processRecurringTransactions, checkBudgetAlerts],
});
