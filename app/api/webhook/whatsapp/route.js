import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    // 1. Read parameters as text first to avoid parsing crashes
    const rawText = await request.text();
    console.log("📥 Raw Payload Received from Twilio:", rawText);

    // 2. Safely parse URL-encoded parameters out of the incoming payload string
    const params = new URLSearchParams(rawText);
    const rawFrom = params.get("From"); // e.g., "whatsapp:+919310240287"
    const body = params.get("Body");    // e.g., "Monster drink 150 from pnb"

    if (!rawFrom || !body) {
      console.error("⚠️ Payload verification mismatch: missing sender/body arguments.");
      return new NextResponse("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
    }

    // 3. Extract pure phone digits (strips "whatsapp:" prefix and "+")
    const cleanPhone = rawFrom.replace("whatsapp:", "").replace(/\D/g, "");
    console.log(`🔍 Querying database target for phone key: "${cleanPhone}"`);

    // 4. Query target user account row using verified Prisma model schema
    const user = await DB.user.findUnique({
      where: { whatsappPhone: cleanPhone },
    });

    if (!user) {
      console.error(`❌ Device token lookup failed. No user found matching number: ${cleanPhone}`);
      const unlinkedTwiml = `
        <Response>
          <Message>❌ Integration Gating Error: This phone number is not linked to any active account profile inside the dashboard panel.</Message>
        </Response>
      `;
      return new NextResponse(unlinkedTwiml, { headers: { "Content-Type": "text/xml" } });
    }

    console.log(`🟩 Device match authorized for user entity: ${user.id}`);

    // 5. Fire up Gemini Intelligence parsing routines
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
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

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const parsedData = JSON.parse(aiResponse.text.trim());
    console.log("🤖 Structured telemetry response compiled by AI engine:", parsedData);

    // 6. Write transaction record straight to database rows
    const savedTx = await DB.transaction.create({
      data: {
        userId: user.id,
        amount: parseFloat(parsedData.amount),
        description: parsedData.description,
        category: parsedData.category,
        type: parsedData.type,
        date: new Date(),
      },
    });

    console.log(`🚀 Transaction saved successfully. Entry ID: ${savedTx.id}`);

    // 7. Render XML handshake configuration string right back to device thread
    const successTwiml = `
      <Response>
        <Message>✅ Core Ledger Sync Completed!\n\n🔹 Description: ${parsedData.description}\n🔹 Value: ₹${parsedData.amount}\n🔹 Pipeline Category: ${parsedData.category}\n\nYour financial control panel boards have been automatically refreshed.</Message>
      </Response>
    `;

    return new NextResponse(successTwiml, { headers: { "Content-Type": "text/xml" } });

  } catch (err) {
    console.error("💥 Global Webhook Core Failure Crash Exception:", err);
    const failureTwiml = `
      <Response>
        <Message>⚠️ Matrix Execution Fault: Handshake route failed to process transaction entry string variables.</Message>
      </Response>
    `;
    return new NextResponse(failureTwiml, { headers: { "Content-Type": "text/xml" } });
  }
}