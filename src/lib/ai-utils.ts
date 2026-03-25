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

  const response = await fetch("https://veily.venusapp.in/api/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ prompt, platform })
  });

  const data = await response.json();
  console.log(`[AI Smart Fill] Success. Provider used: ${data.provider}`);

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate AI content from server.");
  }

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
