"use server";

import { DB } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calculateNextRecurringDate, isValidRecurringInterval } from "@/lib/recurring";

const VALID_CATEGORIES = ["FOOD", "SHOPPING", "ENTERTAINMENT", "UTILITIES", "INVESTMENT", "SALARY", "OTHERS"];

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

    // 📅 Optional explicit date (receipt scans carry past dates) — falls back to now
    const dateInput = formData.get("date");
    const date = dateInput && !isNaN(Date.parse(dateInput)) ? new Date(dateInput) : new Date();

    // 🔁 Recurring schedule parameters
    const isRecurring = formData.get("isRecurring") === "on";
    const recurringInterval = isRecurring ? formData.get("recurringInterval") : null;
    if (isRecurring && !isValidRecurringInterval(recurringInterval)) {
      throw new Error("Invalid recurring interval selection.");
    }

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
          date,
          isRecurring,
          recurringInterval,
          nextRecurringDate: isRecurring ? calculateNextRecurringDate(date, recurringInterval) : null,
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
      isRecurring: tx.isRecurring,
      recurringInterval: tx.recurringInterval,
    }));
  } catch (error) {
    console.error("❌ Failed to query transactions:", error);
    return [];
  }
}

/* ────────────────────────────────────────────────────────────
   📸 AI RECEIPT SCANNER — Gemini 2.5 Flash Vision
──────────────────────────────────────────────────────────── */

const ALLOWED_RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_RECEIPT_BYTES = 4 * 1024 * 1024; // inline_data practical ceiling

export async function scanReceipt(formData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized Access");

    const user = await DB.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User mapping container not found.");

    const file = formData.get("receipt");
    if (!file || typeof file === "string") throw new Error("No receipt image received.");
    if (!ALLOWED_RECEIPT_TYPES.includes(file.type)) {
      throw new Error("Unsupported image format. Use JPEG, PNG, WEBP or HEIC.");
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      throw new Error("Receipt image exceeds the 4MB limit.");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI gateway is not configured (missing GEMINI_API_KEY).");

    // Never log this payload — it can be large and contains user data
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the transaction details.

      Return ONLY a clean JSON object with these exact keys and no markdown formatting tags or ticks:
      {
        "amount": number (the final total paid),
        "date": "YYYY-MM-DD" or null if not visible,
        "description": "short summary of the purchased items",
        "merchant": "store or business name",
        "category": "FOOD" | "SHOPPING" | "ENTERTAINMENT" | "UTILITIES" | "INVESTMENT" | "SALARY" | "OTHERS",
        "type": "EXPENSE"
      }

      If the image is NOT a receipt, invoice or bill, return exactly: {"notReceipt": true}
    `;

    // Same raw REST channel as lib/transactionParser.js — vision via inline_data part
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const aiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: file.type, data: base64 } },
          ],
        }],
        generation_config: { response_mime_type: "application/json" },
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI vision gateway returned status ${aiResponse.status}.`);
    }

    const aiData = await aiResponse.json();
    let rawJsonText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    rawJsonText = rawJsonText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    const parsed = JSON.parse(rawJsonText);

    // Sanitize — no regex fallback for images: fail cleanly
    const amount = parseFloat(parsed.amount);
    if (parsed.notReceipt || isNaN(amount) || amount <= 0) {
      throw new Error("Could not read a valid receipt from this image.");
    }

    // FUTURE: upload the image to storage (UploadThing/S3/Supabase Storage) and set receiptUrl
    // TODO: add Arcjet rate-limiting on this action before public deployment
    return {
      success: true,
      data: {
        amount,
        date: parsed.date && !isNaN(Date.parse(parsed.date)) ? parsed.date : null,
        description: typeof parsed.description === "string" ? parsed.description.slice(0, 120) : "",
        merchant: typeof parsed.merchant === "string" ? parsed.merchant.slice(0, 60) : "",
        category: VALID_CATEGORIES.includes(parsed.category) ? parsed.category : "OTHERS",
        type: "EXPENSE",
      },
    };
  } catch (error) {
    console.error("❌ Receipt scan failure:", error.message);
    return { success: false, error: error.message };
  }
}