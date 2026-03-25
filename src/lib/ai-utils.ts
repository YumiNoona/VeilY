import { GoogleGenerativeAI } from "@google/generative-ai";
import { ParsedChat } from "./parsers";
import { Message, Person } from "@/types/chat";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GEMINI_MODEL = "gemini-1.5-flash";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generates a full chat conversation based on a user-provided scenario.
 * Tries Gemini first, falls back to Groq on 429/5xx errors.
 */
export async function generateSmartFill(prompt: string, platform: string): Promise<ParsedChat> {
  if (!GEMINI_API_KEY && !GROQ_API_KEY) {
    throw new Error("AI API Keys are missing. Please check your .env file.");
  }

  const systemPrompt = `
    You are an expert at creating realistic social media and chat mockups.
    Generate a full conversation JSON based on this scenario: "${prompt}"
    The platform style is: ${platform}.
    
    Output MUST be a JSON object with exactly two keys: "messages" and "participants".
    
    "participants": An array of Person objects: { id, name, isOnline }
    "messages": An array of Message objects: { id, text, senderId, timestamp, isOwn }
    
    Rules:
    1. Use 'user' as the ID for the "Friend" (left side) and 'friend' as the ID for "Me" (right side).
    2. 'friend' should have isOwn: true.
    3. Generate 5-10 realistic messages.
    4. Format timestamps as ISO strings.
    5. No extra text, ONLY the JSON object.
  `;

  try {
    // 1. Try Gemini (Primary)
    return await tryGemini(systemPrompt);
  } catch (error: any) {
    console.warn("Gemini failed, checking for fallback...", error);
    
    // The Gemini SDK throws an opaque error object where the status code is embedded in the message string
    const message = error?.message || "";
    const isRateLimit = message.includes("429");
    const isServerError = message.includes("500") || message.includes("503");

    // 2. Fallback to Groq if appropriate
    if (GROQ_API_KEY && (isRateLimit || isServerError)) {
      console.info("Fallback triggered: Switching to Groq...");
      return await tryGroq(systemPrompt);
    }

    // 3. Otherwise throw the original error
    throw new Error(error.message || "Failed to generate AI content");
  }
}

async function tryGemini(prompt: string): Promise<ParsedChat> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    }
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return parseAIResponse(response.text());
}

async function tryGroq(prompt: string): Promise<ParsedChat> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Groq fallback failed");
  }

  const data = await response.json();
  return parseAIResponse(data.choices[0].message.content);
}

function parseAIResponse(rawText: string): ParsedChat {
  // Strip markdown code fences
  const cleaned = rawText.replace(/```json\n?|```/g, "").trim();
  const parsedData = JSON.parse(cleaned);

  const messages: Message[] = (parsedData.messages || []).map((msg: any) => ({
    ...msg,
    id: msg.id || crypto.randomUUID(),
    timestamp: new Date(msg.timestamp || new Date()),
  }));

  const participants: Person[] = (parsedData.participants || []).map((p: any) => ({
    ...p,
    id: p.id || crypto.randomUUID(),
    isOnline: p.isOnline ?? true,
  }));

  return { messages, participants };
}
