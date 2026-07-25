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

/**
 * Sends an outbound WhatsApp message via Twilio's REST API (no SDK).
 *
 * NOTE: in the Twilio sandbox, delivery only succeeds if `toDigits` has already
 * joined the sandbox (sent "join none-screen"). Otherwise Twilio returns an
 * error (e.g. 63015) and we report it back so the caller can show join steps.
 *
 * @param {string} toDigits - recipient phone as bare digits, e.g. "919876543210"
 * @param {string} body - message text
 * @returns {Promise<{ ok: boolean, reason?: string, detail?: string }>}
 */
export async function sendWhatsAppMessage(toDigits, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

  if (!sid || !token) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: from,
          To: `whatsapp:+${toDigits}`,
          Body: body,
        }).toString(),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      // 63015/63016 → recipient hasn't joined the sandbox yet
      const notJoined = /630(15|16|07)/.test(detail);
      return { ok: false, reason: notJoined ? "not-joined" : "send-failed", detail };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: "send-failed", detail: error.message };
  }
}
