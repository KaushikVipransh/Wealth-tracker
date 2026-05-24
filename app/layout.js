import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Wealth Tracker",
  description: "Manage your assets flawlessly",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50 min-h-screen flex flex-col text-gray-900">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WealthApp. All rights reserved.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}