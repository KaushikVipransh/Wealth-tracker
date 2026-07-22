import { NextResponse } from "next/server";

/* ────────────────────────────────────────────────────────────
   Twilio WhatsApp helpers — shared by the webhook route
──────────────────────────────────────────────────────────── */

/**
 * Builds a TwiML XML reply for Twilio. Pass no message for an empty ACK.
 * @param {string} [message]
 * @returns {NextResponse}
 */
export function twimlResponse(message) {
  const xml = message
    ? `<Response><Message>${message}</Message></Response>`
    : "<Response></Response>";
  return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
}

/**
 * Isolates clean phone digits from Twilio's From field.
 * e.g. "whatsapp:+919876543210" → "919876543210"
 * @param {string} rawFrom
 * @returns {string}
 */
export function normalizeWhatsAppPhone(rawFrom) {
  return rawFrom.replace("whatsapp:", "").replace(/\D/g, "");
}

// Canonical category enum + common aliases the AI/regex parsers emit
const CATEGORY_ALIAS_MAP = {
  BILLS: "UTILITIES",
  INVESTMENTS: "INVESTMENT",
};
const VALID_CATEGORIES = new Set([
  "FOOD", "SHOPPING", "ENTERTAINMENT", "UTILITIES",
  "INVESTMENT", "SALARY", "OTHERS",
]);

/**
 * Normalizes a parsed category string to the site-wide canonical enum set.
 * Unknown values fall back to OTHERS.
 * @param {string|undefined} rawCategory
 * @returns {string}
 */
export function normalizeCategory(rawCategory) {
  const upper = (rawCategory || "OTHERS").toUpperCase();
  return CATEGORY_ALIAS_MAP[upper] || (VALID_CATEGORIES.has(upper) ? upper : "OTHERS");
}
