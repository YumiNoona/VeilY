import { ParsedChat } from "./parsers";
import { Message, Person } from "@/types/chat";

function getApiKey(): string | null {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
}

function buildPrompt(prompt: string, platform: string): string {
  return `You are a mock chat generator for a social media mockup tool. Generate a realistic conversation for the "${platform}" platform.
Scenario: ${prompt}

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "messages": [
    {
      "text": "message text here",
      "isOwn": false,
      "image": null
    }
  ],
  "participants": [
    {
      "name": "Person Name",
      "avatar": null
    }
  ]
}

Rules:
- 4-8 messages total
- First message in array should have isOwn=false (received from the other person)
- Alternate isOwn between false and true
- Participant names should feel natural for the scenario
- No markdown formatting in message text
- Keep messages short and natural (1-2 sentences max)
- Do not include any text outside the JSON object`;
}

async function callGeminiDirectly(prompt: string, platform: string): Promise<ParsedChat> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY not set in .env");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(prompt, platform) }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 4096 },
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip markdown code fences if present
  const jsonStr = rawText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  const messages: Message[] = (parsed.messages || []).map((msg: any, i: number) => ({
    id: crypto.randomUUID(),
    text: msg.text || "",
    senderId: msg.isOwn ? "friend" : "user",
    timestamp: new Date(Date.now() - (parsed.messages.length - i) * 120000),
    isOwn: msg.isOwn ?? false,
    image: msg.image || undefined,
  }));

  const participants: Person[] = (parsed.participants || []).map((p: any) => ({
    id: p.name?.toLowerCase().replace(/\s/g, "") || crypto.randomUUID(),
    name: p.name || "User",
    isOnline: true,
    avatar: p.avatar || undefined,
  }));

  return { messages, participants };
}

function generateFallbackMock(platform: string): ParsedChat {
  const names = ["Priya", "Arjun", "Sarah", "Jake"];
  const msgs = [
    { text: "Hey! Are you free to chat?", isOwn: false },
    { text: "Yeah, what's up?", isOwn: true },
    { text: "Just wanted to test this mockup tool — looks amazing so far!", isOwn: false },
    { text: "Right? It's pretty cool. Want to try the AI fill?", isOwn: true },
    { text: "Let's do it! What platform should we mock?", isOwn: false },
    { text: "How about WhatsApp? Classic choice.", isOwn: true },
  ];

  return {
    messages: msgs.map((m, i) => ({
      id: crypto.randomUUID(),
      text: m.text,
      senderId: m.isOwn ? "friend" : "user",
      timestamp: new Date(Date.now() - (msgs.length - i) * 120000),
      isOwn: m.isOwn,
    })),
    participants: names.slice(0, 2).map((name, i) => ({
      id: i === 0 ? "user" : "friend",
      name,
      isOnline: true,
    })),
  };
}

export async function generateSmartFill(prompt: string, platform: string): Promise<ParsedChat> {
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      return await callGeminiDirectly(prompt, platform);
    } catch (err: any) {
      console.warn("[AI] Gemini direct call failed, using fallback:", err.message);
      return generateFallbackMock(platform);
    }
  }

  // Try remote server fallback
  try {
    const res = await fetch("https://veily.venusapp.in/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, platform, local: true }),
    });
    if (res.ok) {
      const data = await res.json();
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
  } catch { /* ignore */ }

  // Final fallback
  return generateFallbackMock(platform);
}
