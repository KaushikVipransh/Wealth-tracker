import { NextResponse } from "next/server";
import { DB } from "@/lib/prisma";

// 🔐 Choose a strong secret token. You will paste this exact same token into the Meta Developer Portal.
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "MY_SUPER_SECRET_TOKEN_123";

/**
 * 🛠️ 1. THE GET HANDSHAKE (For Meta Dashboard Verification)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Check if the mode and token sent by Meta match your local secret config
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook successfully verified by Meta!");
    // Must return the exact challenge code sent by Meta as plain text
    return new Response(challenge, { status: 200 });
  }

  return new Response("Verification Token Mismatch", { status: 403 });
}

/**
 * 🚀 2. THE POST STREAM (For receiving real-time user messages)
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Secure check: Make sure this is a valid WhatsApp message structure payload
    if (!body.object || !body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      return NextResponse.json({ status: "ignored_payload" }, { status: 200 });
    }

    const messageData = body.entry[0].changes[0].value.messages[0];
    const contactData = body.entry[0].changes[0].value.contacts[0];

    const rawText = messageData.text?.body?.trim(); // e.g., "Spent 500 on dinner"
    const rawSenderPhone = messageData.from;       // e.g., "919876543210"
    const senderName = contactData?.profile?.name || "User";

    console.log(`📱 Incoming WhatsApp from ${senderName} (${rawSenderPhone}): "${rawText}"`);

    if (!rawText) {
      return NextResponse.json({ status: "empty_text_ignored" }, { status: 200 });
    }

    // =========================================================================
    // TODO: Phase 2 - Add parsing mechanics (Regex/AI) & write to DB using Prisma
    // =========================================================================

    return NextResponse.json({ status: "success_received" }, { status: 200 });

  } catch (error) {
    console.error("❌ Critical Webhook Processing Crash:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}