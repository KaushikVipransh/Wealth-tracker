"use client";

import React, { useState } from "react";

export default function WhatsAppSettings() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLinked, setIsLinked] = useState(false);

  // Replace this with your exact sandbox join code from your Twilio Console
  const TWILIO_SANDBOX_CODE = "join none-screen"; 
  const TWILIO_PHONE_NUMBER = "+14155238886";

  const handleLinkDevice = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/user/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link device.");
      }

      setStatus({ type: "success", message: "Database entry verified! Follow the handshake steps below." });
      setIsLinked(true);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-lg border border-white/[0.06] bg-[#0A0A0A] p-6 font-mono text-xs text-[#A3A3A3]">
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <h3 className="text-sm font-medium text-white tracking-tight">INTELLIGENCE_CORE_ROUTING</h3>
        <span className={`h-2 w-2 rounded-full ${isLinked ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-700"}`}></span>
      </div>

      <p className="mb-6 leading-relaxed">
        Connect your mobile device to direct-inject ledger transactions directly into your PostgreSQL tables via WhatsApp text syntax.
      </p>

      {/* Input Form */}
      <form onSubmit={handleLinkDevice} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold tracking-wider">Device Phone Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 919876543210 (with country code)"
              value={phoneNumber}
              disabled={isLinked}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded border border-white/[0.08] bg-black px-3 py-2 text-white outline-none transition focus:border-white/20 disabled:opacity-50 font-mono"
            />
            <button
              type="submit"
              disabled={loading || isLinked}
              className="rounded bg-white px-4 py-2 font-medium text-black transition hover:bg-zinc-200 disabled:opacity-40 whitespace-nowrap"
            >
              {loading ? "SAVING..." : isLinked ? "LINKED" : "SAVE_ROUTE"}
            </button>
          </div>
        </div>
      </form>

      {/* Dynamic Status Notifications */}
      {status.message && (
        <div className={`mt-4 rounded p-3 border ${status.type === "success" ? "border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-400" : "border-rose-500/20 bg-rose-500/[0.02] text-rose-400"}`}>
          {status.message}
        </div>
      )}

      {/* Step 2 Activation Guide (Revealed on database success) */}
      {isLinked && (
        <div className="mt-6 border-t border-white/[0.06] pt-6 animate-fade-in">
          <h4 className="text-[10px] uppercase text-white font-bold tracking-wider mb-3">Final Handshake Authentication Required</h4>
          <ol className="space-y-3 pl-4 list-decimal text-zinc-400 leading-relaxed">
            <li>
              Open WhatsApp on your device and message the official carrier number:{" "}
              <code className="text-white bg-white/[0.04] px-1.5 py-0.5 rounded font-bold">{TWILIO_PHONE_NUMBER}</code>
            </li>
            <li>
              Send this exact synchronization string token to initiate the webhook layer:{" "}
              <code className="text-emerald-400 bg-emerald-500/[0.04] px-1.5 py-0.5 rounded font-bold">{TWILIO_SANDBOX_CODE}</code>
            </li>
            <li>
              Once confirmed, drop your conversational updates (e.g., <span className="italic text-zinc-500">"Spent 350 on fuel from sbi"</span>) directly into the chat to manage your assets.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}