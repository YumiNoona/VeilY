import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GEMINI_MODEL = "gemini-1.5-flash";

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const VITE_SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// NOTE: In-memory rate limiting does NOT work on Vercel serverless functions.
// Each invocation may spin up a fresh Node process, so this map is always empty.
// The real quota protection is the DB check in step 5. To fix properly, use
// Redis (e.g. Upstash free tier) or rely solely on the DB-level atomic check.
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

// CORS allow-list: Only these origins can call the API
const ALLOWED_ORIGINS = [
  'https://veily.venusapp.in',
  'tauri://localhost',          // Tauri desktop app
  'http://localhost:8080',      // Local Vite dev server
  'http://localhost:5173',      // Alt Vite port
  'http://localhost:3000',      // Alt dev port
];

/**
 * Sanitize user prompt to mitigate prompt injection attempts.
 * Strips backticks, [MODE: patterns, and instruction-override attempts.
 */
function sanitizePrompt(raw: string): string {
  let sanitized = raw;
  // Remove backtick blocks that could break out of the prompt
  sanitized = sanitized.replace(/`{1,3}/g, '');
  // Remove [MODE: ...] patterns that could override system instructions
  sanitized = sanitized.replace(/\[MODE:\s*[^\]]*\]/gi, '');
  // Remove common injection patterns
  sanitized = sanitized.replace(/ignore\s+(all\s+)?previous\s+instructions/gi, '');
  sanitized = sanitized.replace(/system\s*prompt/gi, '');
  sanitized = sanitized.replace(/you\s+are\s+now/gi, '');
  // Trim whitespace
  return sanitized.trim();
}

export default async function handler(req: any, res: any) {
  // CORS handling
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-client-info');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. IP Rate Limiting (Basic — see NOTE above about Vercel limitations)
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequestsPerMinute = 20;

  let rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
  if (now - rateData.timestamp > windowMs) {
    rateData = { count: 1, timestamp: now };
  } else {
    rateData.count++;
  }
  rateLimitMap.set(ip, rateData);

  if (rateData.count > maxRequestsPerMinute) {
    return res.status(429).json({ error: 'Too many requests from this IP. Please wait a minute.' });
  }

  // 2. Extract Auth Token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];

  // 3. Authenticate User via Supabase
  const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized: Invalid session" });
  }

  // 4. Input Validation
  const { prompt: rawPrompt, platform } = req.body;
  if (!rawPrompt || !rawPrompt.trim() || !platform) {
      return res.status(400).json({ error: "Prompt and platform are required and cannot be empty" });
  }

  if (!GEMINI_API_KEY && !GROQ_API_KEY) {
    return res.status(500).json({ error: "AI API Keys are missing on the server." });
  }

  // 5. Quota check BEFORE generation
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('plan, ai_fills_used, last_ai_fill_date')
    .eq('id', user.id)
    .single();

  if (dbError || !userData) {
    return res.status(500).json({ error: "Failed to verify user limits." });
  }

  const AI_LIMITS: Record<string, number> = {
    free: 0,
    pro: 20,
    premium: 100
  };

  const MSG_LIMITS: Record<string, { min: number, max: number }> = {
    free: { min: 0, max: 0 },
    pro: { min: 10, max: 15 },
    premium: { min: 15, max: 30 }
  };

  const currentUserPlan = userData.plan || 'free';

  const currentLimit = AI_LIMITS[currentUserPlan] || 0;
  const { min: minMsgs, max: maxMsgs } = MSG_LIMITS[currentUserPlan] || MSG_LIMITS.free;

  // Prompt Character Limit Protection (Pro: ~150 words / Premium: ~250 words)
  const PROMPT_LENGTH_LIMITS: Record<string, number> = {
    free: 0,
    pro: 800,
    premium: 1500
  };
  const maxPromptLength = PROMPT_LENGTH_LIMITS[currentUserPlan] || 0;

  if (rawPrompt.length > maxPromptLength) {
    return res.status(400).json({ error: `Prompt too long. Your plan allows a maximum of ${maxPromptLength} characters.` });
  }
  
  // Daily reset check logic matches DB
  const today = new Date().toISOString().split('T')[0];
  const fillsUsed = userData.last_ai_fill_date === today ? (userData.ai_fills_used || 0) : 0;

  if (fillsUsed >= currentLimit) {
    return res.status(403).json({ error: `Daily limit reached (${currentLimit} generations). Please upgrade or try again tomorrow.` });
  }

  // Sanitize prompt to mitigate injection attacks
  const prompt = sanitizePrompt(rawPrompt);

  const systemPrompt = `You are an expert at writing hyper-realistic chat conversations that feel genuinely human. Study how real people actually text — not how they're supposed to.

Generate a conversation JSON for this scenario: "${prompt}"
Platform: ${platform}

=== CORE REALISM RULES ===

1. CONVERSATIONS HAVE FLOW. Each message must logically follow the previous one. No random topic switches. If person A asks "you coming?" person B answers that question first before saying anything else. Messages must form a coherent story arc with a beginning, middle, natural end.

2. NO DUPLICATE OR NEAR-DUPLICATE MESSAGES. Never send the same or similar message twice from anyone. Every message must add something new.

3. SHORT MESSAGES. Real texts are 2-8 words. Long messages (15+ words) only happen when someone is explaining something important. Mix short reactions with slightly longer follow-ups.

4. CASUAL TYPING — pick the right register:
   - English casual: "u", "ur", "rn", "ngl", "lol", "lmao", "omg", "fr", "istg", "ik", "idk", "nvm", "btw", "ofc", "smh", lowercase everything, skip periods, use "..." to trail off
   - Hindi/Hinglish (use for Indian platform scenarios): "kaha hai bhai", "aa rha hu", "chal be", "kal school nhi aaya kya", "kya hua yaar", "bhai sun", "arey", "theek hai", "bas kar", "pagal hai kya", mix hindi words into english sentences naturally like "bro ye kya tha yaar"
   - Platform-specific slang below

5. REACTIONS COME FIRST. When something surprising happens: "wait what", "bro 💀", "nooo", "LMAOOO", "arey yaar" — then the question or response follows.

6. TYPING PATTERNS:
   - People send 2-3 short messages in a row instead of one long one
   - "wait", "ok so", "actually" start messages when changing thought
   - Trailing off: "idk man...", "like...", "bhai pata nhi"
   - Interrupting yourself: "wait nvm", "ok but actually"

7. PLATFORM-SPECIFIC TONE:
   - WhatsApp (Indian): Hinglish mix, voice note references ("just sent u a vm"), "bhai", "yaar", family group chaos, "seen at 2am 💀"
   - WhatsApp (General): casual but slightly more complete sentences than iMessage
   - iMessage: minimalist, very short, lots of lowercase one-word replies, blue bubble energy
   - Instagram DMs: story reaction openers ("THAT STORY THO"), meme references, "dropped in ur dms"
   - Discord: chaotic multi-person, server emotes like :skull: written as 💀, "based", "ratio", "@username" style callouts
   - Reddit DMs: more text-heavy, still casual, "lol your comment on that thread", topic-focused
   - Messenger: slightly older demographic feel, mix of casual and occasionally full sentences

8. CONVERSATION MUST MAKE SENSE AS A STORY:
   - Start with a natural opener (question, reaction to something, making plans, sending something)
   - Build naturally — questions get answered, plans get made or fall apart, drama unfolds
   - End naturally — plans confirmed, laughing at something, "ok gtg", "aight later", "chal bye"

9. REAL CONVERSATION TOPICS that feel authentic:
   - Making/canceling plans last minute
   - Reacting to something that just happened (at school, work, online)
   - Asking for something (notes, money, location)
   - Roasting each other
   - Sharing something funny (meme, video, gossip)
   - Venting about something
   - Indian specific: "bhai notes de", "canteen chal", "sir ne pakad liya", "proxy laga de", "exam ka kya scene hai"

10. NEVER DO THESE:
    - Never use "I'm so excited!" or any corporate-sounding enthusiasm
    - Never have two people ignore what the other just said
    - Never send the same message twice
    - Never use perfect grammar and punctuation throughout
    - Never start with "Hey! How are you?" — start in the middle of something real
    - Never make everyone agree with each other immediately
    - Never use placeholder names like "User1" or "Person A" — use real names like Rohan, Priya, Jake, Sarah, Arjun, Kavya, Tyler, Zoe

Generate BETWEEN ${minMsgs} and ${maxMsgs} messages.

IMPORTANT: The conversation must read like you screenshot it from a real phone. If someone reads it and thinks "this feels AI generated" you have failed.

Output ONLY valid JSON with keys "messages" and "participants". No markdown, no explanation.
`;

  let responseData: any = null;

  try {
    const data = await tryGemini(systemPrompt);
    responseData = { ...data, provider: 'gemini' };
  } catch (error: any) {
    console.warn("Gemini failed, checking for fallback...", error);
    
    const message = error?.message || "";
    const shouldFallback = 
      error?.status >= 400 ||
      message.includes("429") || 
      message.includes("500") || 
      message.includes("503") ||
      message.includes("404");

    if (GROQ_API_KEY && shouldFallback) {
      console.info("Fallback triggered: Switching to Groq...");
      try {
        const groqData = await tryGroq(systemPrompt);
        responseData = { ...groqData, provider: 'groq' };
      } catch (groqError: any) {
        return res.status(500).json({ error: groqError.message || "Groq fallback failed" });
      }
    } else {
        return res.status(500).json({ error: error.message || "Failed to generate AI content" });
    }
  }

  // 6. Validate JSON Shape guarantees that the LLM response matches expected bounds
  if (!responseData || !responseData.messages || !Array.isArray(responseData.messages) || !responseData.participants || !Array.isArray(responseData.participants)) {
      return res.status(500).json({ error: "Invalid AI response format" });
  }

  // 7. Enforce hard limits on the generated messages array
  if (responseData && responseData.messages) {
      if (responseData.messages.length > maxMsgs) {
          responseData.messages = responseData.messages.slice(0, maxMsgs);
      }
  }

  // 8. Success! Increment quota atomically via RPC and return response.
  if (responseData) {
      const { error: rpcError } = await supabase.rpc('increment_ai_fills', { target_user_id: user.id });
      if (rpcError) {
          console.error("Failed to increment user AI quota:", rpcError);
          // Don't fail the user request here, but log the error on Vercel
      }
      return res.status(200).json(responseData);
  }

  return res.status(500).json({ error: "Unknown generation failure" });
}

async function tryGemini(prompt: string) {
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

async function tryGroq(prompt: string) {
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

function parseAIResponse(rawText: string) {
  const cleaned = rawText.replace(/```json\n?|```/g, "").trim();
  return JSON.parse(cleaned);
}
