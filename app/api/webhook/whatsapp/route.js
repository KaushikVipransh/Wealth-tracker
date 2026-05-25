import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";

export async function POST(request) {
  try {
    // 1. Safely read and parse parameters from Twilio form-urlencoded data
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

    // 3. Direct Native Fetch to Gemini Production API Gateway (Bypasses SDK 404 bugs)
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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

    const aiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Gemini Gateway responded with status ${aiResponse.status}: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const rawJsonText = aiData.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(rawJsonText.trim());

    // 4. Atomic Database Insert using verified Prisma relation object configuration
    const savedTx = await DB.transaction.create({
      data: {
        amount: parseFloat(parsedData.amount),
        description: parsedData.description,
        category: parsedData.category,
        type: parsedData.type,
        date: new Date(),
        user: {
          connect: { id: user.id }
        }
      },
    });

    // 5. Respond to WhatsApp with an XML confirmation statement card
    const successTwiml = `
      <Response>
        <Message>✅ Core Ledger Sync Completed!\n\n🔹 Item: ${parsedData.description}\n🔹 Value: ₹${parsedData.amount}\n🔹 Category: ${parsedData.category}\n\nYour dashboard ledger charts have updated dynamically.</Message>
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