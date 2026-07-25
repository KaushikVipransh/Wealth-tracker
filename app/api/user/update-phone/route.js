import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { DB } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/twilioUtils";

const WELCOME_MESSAGE =
  "👋 Welcome to WealthOS!\n\nYou're all set to log transactions right here. Just text what you spent — for example:\n\n\"Spent 350 on lunch from SBI\"\n\nand I'll file it to your ledger instantly. 💸";

export async function POST(request) {
  try {
    const authSession = await auth();
    const userId = authSession?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number string is required" },
        { status: 400 }
      );
    }

    const sanitizedPhone = phone.replace(/\D/g, "");

    if (sanitizedPhone.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number — must be at least 10 digits including country code" },
        { status: 400 }
      );
    }

    // Guard: ensure the user row actually exists before attempting update.
    // If the user has never visited /dashboard, syncUserToDatabase() may not have run yet.
    const existingUser = await DB.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User account not initialized yet. Please visit your dashboard first." },
        { status: 404 }
      );
    }

    // Prevent linking a number another account already owns (whatsappPhone is @unique)
    const phoneOwner = await DB.user.findUnique({
      where: { whatsappPhone: sanitizedPhone },
      select: { clerkUserId: true },
    });
    if (phoneOwner && phoneOwner.clerkUserId !== userId) {
      return NextResponse.json(
        { error: "This number is already linked to another account." },
        { status: 409 }
      );
    }

    await DB.user.update({
      where: { clerkUserId: userId },
      data: { whatsappPhone: sanitizedPhone },
    });

    // 📨 Try to send a welcome message. In the Twilio sandbox this only lands
    // if the number has already joined ("join none-screen"); otherwise we tell
    // the UI to show the join step.
    const welcome = await sendWhatsAppMessage(sanitizedPhone, WELCOME_MESSAGE);

    return NextResponse.json({
      success: true,
      message: "Number linked successfully!",
      welcomeSent: welcome.ok,
      welcomeReason: welcome.ok ? null : welcome.reason,
    });

  } catch (error) {
    console.error("❌ Phone integration write error:", error);
    return NextResponse.json(
      { error: "Database execution failure" },
      { status: 500 }
    );
  }
}