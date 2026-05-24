import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 🔐 Protect core application paths from unauthenticated guests dynamically
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Force redirect unauthenticated sessions to our login flow page bounds
    await auth.protect();
  }
});

// 🚀 Cleaned config matcher layout to prevent Next.js 16/Turbopack regex compilation crashes
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