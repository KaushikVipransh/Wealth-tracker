import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client using your environment API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Clean, local dictionaries for our fast-pass system
const QUICK_CATEGORIES = {
  FOOD: ['pizza', 'zomato', 'swiggy', 'food', 'cafe', 'restaurant'],
  SHOPPING: ['amazon', 'flipkart', 'shopping', 'myntra'],
  BILLS: ['bill', 'recharge', 'rent', 'electricity'],
};

/**
 * ⚡ LEVEL 1: Fast-Pass Local Token / Regex Engine
 */
function tryLocalParsing(cleanText) {
  const amountRegex = /^(?:rs\.?|₹|spent)?\s*(\d+(?:\.\d{1,2})?)$/i;
  const match = cleanText.match(amountRegex);

  // If the user ONLY sent a number (e.g., "250"), quickly default the log
  if (match) {
    return {
      amount: parseFloat(match[1]),
      type: "EXPENSE",
      category: "OTHERS",
      accountHint: "default",
      confidence: "high"
    };
  }
  return null; // Hand over to the LLM pipeline
}

/**
 * 🧠 LEVEL 2: Gemini Structured Output Engine
 */
async function callGeminiParser(text) {
  try {
    const systemPrompt = `You are an elite financial data extraction engine. Analyze the user's input text regarding a transaction and extract the relevant financial parameters.
    
    Allowed categories:
    - FOOD (dining, groceries, food delivery apps, cafes)
    - SHOPPING (clothing, e-commerce, electronics, general retail)
    - ENTERTAINMENT (movies, streaming services, events, gaming, bars)
    - UTILITIES (utilities, rent, mobile recharge, electricity, subscriptions)
    - INVESTMENT (stocks, mutual funds, gold, crypto, SIPs)
    - SALARY (salary, wages, freelance income, bonus, cashback)
    - OTHERS (miscellaneous or unidentifiable items)

    Allowed types:
    - EXPENSE (money spent, paid, debited)
    - INCOME (money received, salary, bonus, cashback, credited)
    
    Extract the closest structural bank account name matching terms like "hdfc", "sbi", "axis", "pnb", "paytm", "cred". If no bank or account is mentioned, return null.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: text,
      config: {
        systemInstruction: systemPrompt,
        // 🚀 FORCE GEMINI TO RESPOND ONLY IN STRICT JSON MATCHING THIS SCHEMA
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "The precise numerical cash value. Null if not specified." },
            type: { type: Type.STRING, enum: ["EXPENSE", "INCOME"] },
            category: { type: Type.STRING, enum: ["FOOD", "SHOPPING", "ENTERTAINMENT", "UTILITIES", "INVESTMENT", "SALARY", "OTHERS"] },
            accountHint: { type: Type.STRING, description: "Lowercase short name of the bank or null if missing." },
          },
          required: ["amount", "type", "category", "accountHint"],
        },
      }
    });

    // The response text is guaranteed to be a valid JSON string matching our schema
    return JSON.parse(response.text);

  } catch (error) {
    console.error("❌ Gemini Parsing Exception:", error);
    return null;
  }
}

/**
 * 🚀 MAIN EXPORT: The Hybrid Pipeline Router
 */
export async function parseWhatsAppMessage(text) {
  const cleanText = text.toLowerCase().trim();

  // 1. Run local fast check first (Instant, 0ms latency, 0 tokens cost)
  const localResult = tryLocalParsing(cleanText);
  if (localResult) {
    console.log("⚡ Parsed instantly using Local Engine");
    return localResult;
  }

  // 2. Fall back to Gemini for conversational sentences (~400ms latency)
  console.log("🧠 Routing messy text to Gemini AI Processing Engine...");
  const aiResult = await callGeminiParser(text);
  
  if (aiResult && aiResult.amount) {
    return {
      ...aiResult,
      accountHint: aiResult.accountHint || "default"
    };
  }

  // Final emergency failure block
  return { amount: null };
}