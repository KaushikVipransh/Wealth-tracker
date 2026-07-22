import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 🔐 Protect core application paths from unauthenticated guests dynamically
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)"
]);

// 🌍 Explicit rule forcing Clerk to bypass webhook pathing checks completely
const isWebhookRoute = createRouteMatcher([
  "/api/webhook/whatsapp(.*)",
  "/api/inngest(.*)" // Inngest handshake/crons — secured by its own signing key in production
]);

export default clerkMiddleware(async (auth, req) => {
  if (isWebhookRoute(req)) {
    return; // 🚀 Stop execution right here and drop security checkpoints for Twilio
  }

  if (isProtectedRoute(req)) {
    // Force redirect unauthenticated sessions to our login flow page bounds
    await auth.protect();
  }
});

// 🛠️ Next 16 "proxy" file convention (successor to middleware.js) — same handler API
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always run for API and RPC server routes
    '/(api|trpc)(.*)',
  ],
};