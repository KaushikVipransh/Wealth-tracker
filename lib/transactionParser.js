export async function parseWhatsAppMessage(messageText) {
  // --- BACKUP REGEX PARSER SYSTEM ---
  // If the AI gateway fails, this ensures the app still works perfectly
  const fallbackParse = (text) => {
    const cleanText = text.toLowerCase();
    
    // 1. Extract the first numerical value found in the string
    const amountMatch = text.match(/\d+(?:\.\d{1,2})?/);
    const amount = amountMatch ? parseFloat(amountMatch[0]) : null;

    // 2. Extract account indicator keywords (e.g., "from pnb", "via sbi", "in cash")
    let accountHint = "default";
    const accountMatch = cleanText.match(/(?:from|via|in|using)\s+([a-z0-9]+)/);
    if (accountMatch && accountMatch[1]) {
      accountHint = accountMatch[1].trim();
    }

    // 3. Determine flow type
    let type = "EXPENSE";
    if (cleanText.includes("received") || cleanText.includes("added") || cleanText.includes("income") || cleanText.includes("credited")) {
      type = "INCOME";
    }

    // 4. Clean description generation (Strips out the account tracking segments)
    let description = text.replace(/(?:from|via|in|using)\s+[a-zA-Z0-9]+/i, "").trim();
    description = description.replace(/\d+(?:\.\d{1,2})?/, "").trim();
    description = description.charAt(0).toUpperCase() + description.slice(1);

    // Deducing simple default categories based on strings
    let category = "OTHERS";
    if (cleanText.includes("burger") || cleanText.includes("food") || cleanText.includes("chai") || cleanText.includes("lunch") || cleanText.includes("dinner")) {
      category = "FOOD";
    } else if (cleanText.includes("shop") || cleanText.includes("amazon") || cleanText.includes("clothes")) {
      category = "SHOPPING";
    } else if (cleanText.includes("movie") || cleanText.includes("netflix") || cleanText.includes("game")) {
      category = "ENTERTAINMENT";
    } else if (cleanText.includes("bill") || cleanText.includes("recharge") || cleanText.includes("rent")) {
      category = "UTILITIES";
    }

    return {
      amount,
      description: description || "WhatsApp Transaction",
      category,
      type,
      accountHint
    };
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Internal Alert: GEMINI_API_KEY is missing. Utilizing static regex fallbacks.");
      return fallbackParse(messageText);
    }

    // Target the verified Gemini 2.5 channel directly over HTTP
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      Extract transaction metrics from this raw text string: "${messageText}".
      Identify the target payment account mentioned (like pnb, HDFC, cash, sbi, etc.) and map it as the accountHint.
      
      Return ONLY a clean JSON object containing these exactly matched keys with no markdown formatting tags or ticks:
      {
        "amount": number,
        "description": "string naming what was bought",
        "category": "FOOD" | "SHOPPING" | "ENTERTAINMENT" | "UTILITIES" | "INVESTMENT" | "SALARY" | "OTHERS",
        "type": "EXPENSE" | "INCOME",
        "accountHint": "extracted account name string in lowercase (e.g., pnb)"
      }
    `;

    const aiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generation_config: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!aiResponse.ok) {
      console.warn(`⚠️ Gemini returned status ${aiResponse.status}. Dropping back to local regex extraction matrix...`);
      return fallbackParse(messageText);
    }

    const aiData = await aiResponse.json();
    let rawJsonText = aiData.candidates[0].content.parts[0].text;
    
    // Safety cleaner to strip any residual markdown code block ticks if appended
    rawJsonText = rawJsonText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    
    const parsedJson = JSON.parse(rawJsonText);
    
    // Ensure that if Gemini successfully returned json but missed an amount, we use regex definitions instead
    if (!parsedJson.amount) {
      return fallbackParse(messageText);
    }

    return parsedJson;

  } catch (error) {
    console.error("💥 AI Extraction Engine Error, initiating hard fallback payload:", error);
    return fallbackParse(messageText);
  }
}