import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";

export async function POST(request) {
  try {
    // 1. Parse parameters out of the incoming Twilio payload safely
    const rawText = await request.text();
    const params = new URLSearchParams(rawText);
    const rawFrom = params.get("From"); 
    const body = params.get("Body");    

    if (!rawFrom || !body) {
      return new NextResponse("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
    }

    // Isolate pure digits for phone matching
    const cleanPhone = rawFrom.replace("whatsapp:", "").replace(/\D/g, "");

    // 2. Locate the linked account profile in your database
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

    // 3. Upgraded Native Fetch to the Active Production Gemini 2.5 Gateway
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      Extract transaction metrics from this text statement string: "${body}".
      Return a clean JSON object containing these exactly matched keys:
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
        // Enforces strict JSON return types directly via Google's 2.5 platform parameters
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

    // 4. Record entry directly into your database mapping the proper Prisma relation links
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

    // 5. Send successful execution receipt back to your phone chat UI
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