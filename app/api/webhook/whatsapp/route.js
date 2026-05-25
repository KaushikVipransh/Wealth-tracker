import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";

export async function POST(request) {
  try {
    // 1. Safely parse parameters from Twilio form-urlencoded data payload
    const rawText = await request.text();
    const params = new URLSearchParams(rawText);
    const rawFrom = params.get("From"); 
    const body = params.get("Body");    

    if (!rawFrom || !body) {
      return new NextResponse("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
    }

    // Isolate clean phone digits (e.g., "919310240287")
    const cleanPhone = rawFrom.replace("whatsapp:", "").replace(/\D/g, "");

    // 2. Query target user account row using your unique Prisma constraint field
    const user = await DB.user.findUnique({
      where: { whatsappPhone: cleanPhone },
    });

    if (!user) {
      const unlinkedTwiml = `
        <Response>
          <Message>❌ Integration Error: Phone number (${cleanPhone}) is not linked to an active user account.</Message>
        </Response>
      `;
      return new NextResponse(unlinkedTwiml, { headers: { "Content-Type": "text/xml" } });
    }

    // 3. Upgraded Native Fetch to Gemini 2.5 Gateway extracting the target account name
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      Extract transaction metrics from this text statement string: "${body}".
      Identify the payment account mentioned (like pnb, HDFC, cash, etc.) and extract it.
      Return a clean JSON object containing these exactly matched keys:
      {
        "amount": number,
        "description": "string naming what was bought",
        "category": "FOOD" | "SHOPPING" | "ENTERTAINMENT" | "UTILITIES" | "INVESTMENT" | "OTHERS",
        "type": "EXPENSE" | "INCOME",
        "accountName": "extracted account name string in lowercase (e.g., pnb)"
      }
    `;

    const aiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generation_config: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Gemini Gateway responded with status ${aiResponse.status}: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const rawJsonText = aiData.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(rawJsonText.trim());

    // 4. Look up the specific account belonging to this user matching the keyword name (e.g., "pnb")
    // This utilizes a case-insensitive match on your account name field index
    let targetAccount = await DB.account.findFirst({
      where: {
        userId: user.id,
        name: {
          contains: parsedData.accountName,
          mode: "insensitive"
        }
      }
    });

    // Fallback: If user hasn't created a "pnb" account row yet, fetch their absolute first wallet account row instead
    if (!targetAccount) {
      targetAccount = await DB.account.findFirst({
        where: { userId: user.id },
      });
    }

    if (!targetAccount) {
      const noAccountTwiml = `
        <Response>
          <Message>❌ Sync Failure: Could not locate a matching or default account dashboard layout to link this transaction to.</Message>
        </Response>
      `;
      return new NextResponse(noAccountTwiml, { headers: { "Content-Type": "text/xml" } });
    }

    // 5. Write the complete, multi-relational Prisma entry row data
    const savedTx = await DB.transaction.create({
      data: {
        amount: parseFloat(parsedData.amount),
        description: parsedData.description,
        category: parsedData.category,
        type: parsedData.type,
        date: new Date(),
        user: {
          connect: { id: user.id }
        },
        account: {
          connect: { id: targetAccount.id }
        }
      },
    });

    // 6. Respond with a successful synchronization card statement
    const successTwiml = `
      <Response>
        <Message>✅ Core Ledger Sync Completed!\n\n🔹 Item: ${parsedData.description}\n🔹 Value: ₹${parsedData.amount}\n🔹 Account: ${targetAccount.name.toUpperCase()}\n\nYour production account balance ledgers have updated dynamically.</Message>
      </Response>
    `;
    return new NextResponse(successTwiml, { headers: { "Content-Type": "text/xml" } });

  } catch (err) {
    console.error("💥 Live Webhook Engine Crash Trace:", err);
    
    const failureTwiml = `
      <Response>
        <Message>⚠️ Matrix Execution Fault:\n${err.message || "Unknown schema or library exception"}</Message>
      </Response>
    `;
    return new NextResponse(failureTwiml, { headers: { "Content-Type": "text/xml" } });
  }
}