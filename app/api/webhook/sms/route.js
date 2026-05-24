import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const API_SECRET_KEY = "VipranshWealthSecureSyncToken2026";

export async function POST(req) {
  try {
    // 🔐 1. Security Check: Authenticate incoming background hardware requests
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== API_SECRET_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized Gateway Entry" }, { status: 401 });
    }

    const { smsText, sender } = await req.json();
    if (!smsText) {
      return NextResponse.json({ success: false, error: "Empty SMS payload body" }, { status: 400 });
    }

    console.log(`📩 Webhook received message from ${sender}: ${smsText}`);

    // 🧠 2. AI Parsing Step (We will write this mock/Gemini function next!)
    const parsedData = await parseSMSTextWithAI(smsText);
    
    if (!parsedData.isValidTransaction) {
      return NextResponse.json({ success: true, message: "Ignored: Text is not a bank notification." });
    }

    // 👤 3. Fallback Identity Lookup: Fetch the main user profile record row
    // In a production app, you would match the phone number or an assigned token.
    const user = await DB.user.findFirst(); 
    if (!user) throw new Error("No primary user account found in DB to link transaction.");

    // 💳 4. Balance Syncing: Match or fallback to their main active checking account
    const account = await DB.account.findFirst({
      where: { userId: user.id },
    });
    if (!account) throw new Error("No active bank account container found to process balance updates.");

    // 5. Run the relational balance update transaction
    const amount = new Prisma.Decimal(parsedData.amount);
    
    await DB.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: account.id,
          description: parsedData.description,
          type: parsedData.type, // "INCOME" or "EXPENSE"
          amount: amount,
          category: parsedData.category,
          date: new Date(),
        },
      });

      let newBalance = parsedData.type === "INCOME" 
        ? account.balance.add(amount) 
        : account.balance.sub(amount);

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });
    });

    return NextResponse.json({ success: true, message: "Transaction processed seamlessly!" });

  } catch (error) {
    console.error("❌ Webhook Pipeline Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🧠 Temp Mock Helper: Simulates AI parsing logic until your Gemini Key is added
async function parseSMSTextWithAI(text) {
  // Let's test a sample HDFC / SBI layout match using basic check parameters
  const lower = text.toLowerCase();
  if (!lower.includes("debited") && !lower.includes("credited") && !lower.includes("spent")) {
    return { isValidTransaction: false };
  }

  // Extract a basic fallback number string value for testing
  const amountMatch = text.match(/(?:INR|Rs\.?)\s*([0-9,]+\.[0-9]{2})/i);
  const amount = amountMatch ? amountMatch[1].replace(/,/g, "") : "10.00";
  const type = lower.includes("credited") ? "INCOME" : "EXPENSE";

  return {
    isValidTransaction: true,
    description: "Automated Bank SMS Notification",
    amount: amount,
    type: type,
    category: "OTHERS"
  };
}