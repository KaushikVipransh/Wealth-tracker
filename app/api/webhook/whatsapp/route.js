import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";

export async function POST(request) {
  try {
    // 1. Safely parse parameters from Twilio form-urlencoded data
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

    // 3. Direct Native Fetch to Gemini Production API Gateway (v1 Engine)
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Explicitly formatting instructions right inside the prompt text string
    const prompt = `
      Extract transaction metrics from this text statement string: "${body}".
      You must respond ONLY with a clean JSON object structure containing these exactly matched keys. Do not include markdown formatting blocks like \`\`\`json:
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
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Gemini Gateway responded with status ${aiResponse.status}: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    let rawJsonText = aiData.candidates[0].content.parts[0].text;
    
    // Safety guard: Strips out markdown syntax wrappers if Gemini accidentally appends them
    rawJsonText = rawJsonText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    const parsedData = JSON.parse(rawJsonText);

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

    // 5. Respond to WhatsApp with a clean confirmation message block
    const successTwiml = `
      <Response>
        <Message>✅ Core Ledger Sync Completed!\n\n🔹 Item: ${parsedData.description}\n🔹 Value: ₹${parsedData.amount}\n🔹 Category: ${parsedData.category}\n\nYour dashboard charts have updated dynamically.</Message>
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