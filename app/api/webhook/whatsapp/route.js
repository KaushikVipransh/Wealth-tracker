import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";
import { parseWhatsAppMessage } from "@/lib/transactionParser";
import { Prisma } from "@prisma/client";

export async function POST(request) {
  try {
    // 1. Parse Twilio's form-urlencoded payload
    const rawText = await request.text();
    const params = new URLSearchParams(rawText);
    const rawFrom = params.get("From");
    const body = params.get("Body");

    if (!rawFrom || !body) {
      return new NextResponse("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Isolate clean phone digits (e.g. "whatsapp:+919876543210" → "919876543210")
    const cleanPhone = rawFrom.replace("whatsapp:", "").replace(/\D/g, "");

    // 2. Resolve the user from their linked phone number
    const user = await DB.user.findUnique({
      where: { whatsappPhone: cleanPhone },
    });

    if (!user) {
      return new NextResponse(
        `<Response><Message>❌ Integration Error: Phone number (${cleanPhone}) is not linked to any WealthOS account. Please link it from your dashboard first.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // 3. 🧠 Route through the hybrid parser (local fast-path → Gemini fallback)
    //    Uses the shared lib/transactionParser.js — consistent with the rest of the app
    const parsed = await parseWhatsAppMessage(body);

    if (!parsed || !parsed.amount) {
      return new NextResponse(
        `<Response><Message>⚠️ Parse Failure: Could not extract a valid transaction amount from your message. Try: "Spent 350 on lunch from sbi"</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // 4. Normalize category to the site-wide canonical enum set
    //    Handles legacy aliases from older parser prompt (BILLS→UTILITIES, INVESTMENTS→INVESTMENT)
    const CATEGORY_ALIAS_MAP = {
      BILLS: "UTILITIES",
      INVESTMENTS: "INVESTMENT",
    };
    const VALID_CATEGORIES = new Set([
      "FOOD", "SHOPPING", "ENTERTAINMENT", "UTILITIES",
      "INVESTMENT", "SALARY", "OTHERS",
    ]);
    const rawCategory = (parsed.category || "OTHERS").toUpperCase();
    const category = CATEGORY_ALIAS_MAP[rawCategory] ||
      (VALID_CATEGORIES.has(rawCategory) ? rawCategory : "OTHERS");

    const type = parsed.type === "INCOME" ? "INCOME" : "EXPENSE";
    const amount = new Prisma.Decimal(parsed.amount);

    // 5. Resolve target account — match on accountHint name, fall back to first account
    let targetAccount = null;

    if (parsed.accountHint && parsed.accountHint !== "default") {
      targetAccount = await DB.account.findFirst({
        where: {
          userId: user.id,
          name: { contains: parsed.accountHint, mode: "insensitive" },
        },
      });
    }

    // Fallback: use their first account
    if (!targetAccount) {
      targetAccount = await DB.account.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });
    }

    if (!targetAccount) {
      return new NextResponse(
        `<Response><Message>❌ No account found: Please create at least one account in your WealthOS dashboard before logging transactions via WhatsApp.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // 6. ⚛️ Atomic DB transaction — write ledger row + update account balance
    //    Mirrors createTransaction() in app/actions/transaction.js for full consistency
    await DB.$transaction(async (tx) => {
      // Write the transaction row
      await tx.transaction.create({
        data: {
          amount,
          description: parsed.description || body.slice(0, 100),
          category,
          type,
          date: new Date(),
          user: { connect: { id: user.id } },
          account: { connect: { id: targetAccount.id } },
        },
      });

      // Atomically adjust account balance
      const updatedBalance =
        type === "INCOME"
          ? targetAccount.balance.add(amount)
          : targetAccount.balance.sub(amount);

      await tx.account.update({
        where: { id: targetAccount.id },
        data: { balance: updatedBalance },
      });
    });

    // 7. Respond with a confirmation TwiML card
    const sign = type === "INCOME" ? "+" : "-";
    return new NextResponse(
      `<Response><Message>✅ WealthOS Ledger Updated!\n\n📋 ${parsed.description || "Transaction"}\n💰 ${sign}₹${parsed.amount}\n🏦 ${targetAccount.name.toUpperCase()}\n🏷️ ${category}\n\nAccount balance has been updated automatically.</Message></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );

  } catch (err) {
    console.error("💥 WhatsApp Webhook Error:", err);
    return new NextResponse(
      `<Response><Message>⚠️ System Error: ${err.message || "Unknown exception"}</Message></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
}