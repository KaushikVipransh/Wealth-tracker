"use client"; // 🚀 Runs strictly on the client browser space

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  // 🔐 Read the live reactive user session parameters straight from Clerk
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-600 hover:opacity-90 transition">
          WealthApp
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/account" className="hover:text-blue-600 transition">Accounts</Link>
          <Link href="/transaction" className="hover:text-blue-600 transition">Transactions</Link>
        </nav>

        {/* Auth Actions Conditional Block */}
        <div className="flex items-center space-x-4">
          {/* Prevent layout shift while Clerk initializes */}
          {!isLoaded ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          ) : isSignedIn ? (
            // ✅ Displayed when user is logged in
            <UserButton afterSignOutUrl="/" userProfileUrl="/dashboard" />
          ) : (
            // ❌ Displayed when user is logged out
            <Link href="/sign-in" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-sm">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}