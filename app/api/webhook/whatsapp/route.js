import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    // 1. Read parameters as text first to handle form-urlencoded data safely
    const rawText = await request.text();
    const params = new URLSearchParams(rawText);
    const rawFrom = params.get("From"); 
    const body = params.get("Body");    

    if (!rawFrom || !body) {
      return new NextResponse("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
    }

    // Strips out "whatsapp:" prefix and any non-digits to isolate the clean country + number format
    const cleanPhone = rawFrom.replace("whatsapp:", "").replace(/\D/g, "");

    // 2. Query target user account row using the phone number unique field index
    const user = await DB.user.findUnique({
      where: { whatsappPhone: cleanPhone },
    });

    if (!user) {
      const unlinkedTwiml = `
        <Response>
          <Message>❌ Integration Error: This phone number (${cleanPhone}) is not linked to an active user account inside the dashboard.</Message>
        </Response>
      `;
      return new NextResponse(unlinkedTwiml, { headers: { "Content-Type": "text/xml" } });
    }

    // 3. Initialize Gemini Core Engine and parse statement structures
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = `
      Extract transaction metrics from this text statement string: "${body}".
      You must respond ONLY with a clean JSON object structure containing these exactly matched keys:
      {
        "amount": number,
        "description": "string naming what was bought",
        "category": "FOOD" | "SHOPPING" | "ENTERTAINMENT" | "UTILITIES" | "INVESTMENT" | "OTHERS",
        "type": "EXPENSE" | "INCOME"
      }
    `;

    const aiResult = await model.generateContent(prompt);
    const parsedData = JSON.parse(aiResult.response.text().trim());

    // 4. Atomic Database Insert connecting via relational object schema parameters
    const savedTx = await DB.transaction.create({
      data: {
        amount: parseFloat(parsedData.amount),
        description: parsedData.description,
        category: parsedData.category,
        type: parsedData.type,
        date: new Date(),
        user: {
          connect: { id: user.id } // 🚀 Fixed structural mismatch by linking the transaction object here
        }
      },
    });

    // 5. Render XML handshake configuration string right back to the WhatsApp thread
    const successTwiml = `
      <Response>
        <Message>✅ Core Ledger Sync Completed!\n\n🔹 Item: ${parsedData.description}\n🔹 Value: ₹${parsedData.amount}\n🔹 Category: ${parsedData.category}\n\nYour dashboard ledger charts have updated dynamically.</Message>
      </Response>
    `;
    return new NextResponse(successTwiml, { headers: { "Content-Type": "text/xml" } });

  } catch (err) {
    console.error("💥 Live Webhook Engine Crash Trace:", err);
    
    // Fallback message that relays the exact error to your phone screen if it breaks somewhere else
    const failureTwiml = `
      <Response>
        <Message>⚠️ Matrix Execution Fault:\n${err.message || "Unknown schema or library exception"}</Message>
      </Response>
    `;
    return new NextResponse(failureTwiml, { headers: { "Content-Type": "text/xml" } });
  }
}