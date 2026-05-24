"use server"; // 🚀 Forces this function to run strictly on the secure server side

import { currentUser } from "@clerk/nextjs/server";
import { DB } from "@/lib/prisma";

export async function syncUserToDatabase() {
  try {
    // 1. Fetch the authenticated session user data straight from Clerk's secure servers
    const clerkUser = await currentUser();

    // If no user session is found, safely abort
    if (!clerkUser) return { success: false, error: "Unauthorized" };

    // 2. Query Supabase via Prisma to see if this clerk ID already has a row record
    let dbUser = await DB.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    // 3. If the user doesn't exist in Supabase yet, create their record row immediately!
    if (!dbUser) {
      // Safely extract primary email address string
      const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
      
      dbUser = await DB.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: primaryEmail,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Wealth User",
          imageUrl: clerkUser.imageUrl || "",
        },
      });
      console.log(`✨ Success: Sync-created new user record row inside Supabase: ${dbUser.email}`);
    }

    return { success: true, user: dbUser };
  } catch (error) {
    console.error("❌ Database Sync System Error:", error);
    return { success: false, error: error.message };
  }
}