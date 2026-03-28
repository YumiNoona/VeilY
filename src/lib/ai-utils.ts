import { ParsedChat } from "./parsers";
import { Message, Person } from "@/types/chat";
import { supabase } from "@/lib/supabase";

/**
 * Sends a scenario prompt to the secure Vercel backend (/api/generate)
 * to prevent exposing Gemini/Groq API keys in the client bundle.
 */
export async function generateSmartFill(prompt: string, platform: string): Promise<ParsedChat> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("You must be logged in to use AI features.");
  }

  // 30-second timeout via AbortController — prevents infinite hang if the
  // Vercel serverless function times out or Gemini is overloaded.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  let response: Response;
  try {
    response = await fetch("https://veily.venusapp.in/api/generate", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ prompt, platform }),
      signal: controller.signal,
    });
  } catch (err: any) {
    // AbortError = timeout hit
    if (err.name === "AbortError") {
      throw new Error("AI generation timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate AI content from server.");
  }

  console.log(`[AI Smart Fill] Success. Provider used: ${data.provider}`);

  // Restore client-side objects (UUIDs, Dates)
  const messages: Message[] = (data.messages || []).map((msg: any) => ({
    ...msg,
    id: msg.id || crypto.randomUUID(),
    timestamp: new Date(msg.timestamp || new Date()),
  }));

  const participants: Person[] = (data.participants || []).map((p: any) => ({
    ...p,
    id: p.id || crypto.randomUUID(),
    isOnline: p.isOnline ?? true,
  }));

  return { messages, participants };
}
