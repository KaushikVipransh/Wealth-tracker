import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { DB } from "@/lib/prisma";

export async function POST(request) {
  try {
    const authSession = await auth();
    const userId = authSession?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number string is required" }, { status: 400 });
    }

    const sanitizedPhone = phone.replace(/\D/g, "");

    if (sanitizedPhone.length < 10) {
      return NextResponse.json({ error: "Invalid phone number length" }, { status: 400 });
    }

    await DB.user.update({
      where: { clerkUserId: userId },
      data: { whatsappPhone: sanitizedPhone }
    });

    return NextResponse.json({ success: true, message: "Device linked successfully!" });

  } catch (error) {
    console.error("❌ Phone integration write error:", error);
    return NextResponse.json({ error: "Database execution failure" }, { status: 500 });
  }
}