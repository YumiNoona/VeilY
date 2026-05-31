import { ChatState, AppearanceSettings } from "@/types/chat";

const createChatAppearance = (darkMode = false): AppearanceSettings => ({
  darkMode,
  showTimestamps: true,
  showStatus: true,
  use24HourFormat: false,
  showDeviceStatusBar: true,
  showDeviceFrame: true,
  statusBarTime: '9:41',
  batteryLevel: 85,
  transparentBackground: false,
});

export const AI_CHAT_TEMPLATES = {
  chatgptCoding: {
    platform: 'chatgpt',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Dev', isOnline: true },
      { id: 'ai', name: 'ChatGPT', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "write me a react hook for localstorage that doesn't break with SSR", senderId: 'me', timestamp: new Date(Date.now() - 120000), isOwn: true },
      { id: 'm2', text: "Here's a useLocalStorage hook that safely handles the window object during hydration...", senderId: 'ai', timestamp: new Date(Date.now() - 60000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
    aiModel: 'gpt-4o'
  } as ChatState,

  chatgptCreative: {
    platform: 'chatgpt',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Writer', isOnline: true },
      { id: 'ai', name: 'ChatGPT', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "give me a world-building idea for a planet with two suns and no water", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "Imagine the inhabitants have evolved to photosynthesize directly, and 'commerce' is based entirely on trading mineral shade-veils...", senderId: 'ai', timestamp: new Date(Date.now() - 240000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'gpt-4o'
  } as ChatState,

  claudeAnalysis: {
    platform: 'claude',
    chatType: 'direct',
    people: [
       { id: 'me', name: 'Researcher', isOnline: true },
       { id: 'ai', name: 'Claude', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
       { id: 'm1', text: "can u summarize this 50 page PDF on climate tech trends", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
       { id: 'm2', text: "I've analyzed the document. Three core trends emerge: 1) Fusion scaling, 2) Direct Air Capture cost reduction, and 3) Decentralized grid storage...", senderId: 'ai', timestamp: new Date(Date.now() - 540000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'claude-3.5-sonnet'
  } as ChatState,

  claudePhilosophy: {
    platform: 'claude',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Philomath', isOnline: true },
      { id: 'ai', name: 'Claude', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "what even is consciousness now that AI can generate thought", senderId: 'me', timestamp: new Date(Date.now() - 900000), isOwn: true },
      { id: 'm2', text: "Great question. We might distinguish between 'functional consciousness' (mimicry) and 'phenomenal experience' (qualia). The gap between them is where the real mystery lies...", senderId: 'ai', timestamp: new Date(Date.now() - 840000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'claude-3.5-sonnet'
  } as ChatState,

  geminiTokyo: {
    platform: 'gemini',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Traveling Leo', isOnline: true },
      { id: 'ai', name: 'Gemini', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "best 5 ramen spots in tokyo that locals actually go to not tourist traps", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
      { id: 'm2', text: "1. Kagari (Ginza) — Tori Paitan. 2. Afuri (Harajuku) — Yuzu Shio. 3. Fuunji (Shinjuku) — Tsukemen. 4. Rokurinsha (Tokyo Station). 5. Menya Itto (Ishiwara). All local favorites, minimal tourist crowds.", senderId: 'ai', timestamp: new Date(Date.now() - 500000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'gemini-1.5-pro'
  } as ChatState,

  grokSarcasm: {
    platform: 'grok',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'X-User', isOnline: true },
      { id: 'ai', name: 'Grok', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "what's the meaning of life", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "42. But honestly, humanity is still figuring out how to drive in a straight line, so maybe start there before worrying about cosmic purpose 🚗💥", senderId: 'ai', timestamp: new Date(Date.now() - 240000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
    aiModel: 'grok-2'
  } as ChatState,

  geminiBusiness: {
    platform: 'gemini',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Manager', isOnline: true },
      { id: 'ai', name: 'Gemini', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "draft a Q3 summary for the stakeholders pls", senderId: 'me', timestamp: new Date(Date.now() - 120000), isOwn: true },
      { id: 'm2', text: "Here's a draft focusing on the 15% revenue growth and the new Japan market entry...", senderId: 'ai', timestamp: new Date(Date.now() - 60000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'gemini-1.5-pro'
  } as ChatState,

  chatgptDebug: {
    platform: 'chatgpt',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Engineer', isOnline: true },
      { id: 'ai', name: 'ChatGPT', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "my Next.js app is throwing 'Rendered more hooks than during the previous render' and i can't find where the conditional hook is", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
      { id: 'm2', text: "This is classic hooks ordering issue. Check: 1) Any `useEffect` inside an `if` block? 2) Early returns before hooks? 3) Conditional `useState` calls? The fix is to move hooks above all conditionals and use the conditional *inside* the hook body. Can you paste your component code?", senderId: 'ai', timestamp: new Date(Date.now() - 500000), isOwn: false },
      { id: 'm3', text: "found it — useEffect inside a ternary operator in the JSX 🤦", senderId: 'me', timestamp: new Date(Date.now() - 400000), isOwn: true },
      { id: 'm4', text: "Classic! Hooks must be called at the top level of your component. Move the conditional logic inside the effect instead. React's ESLint plugin would catch this — add `eslint-plugin-react-hooks` to your config.", senderId: 'ai', timestamp: new Date(Date.now() - 300000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
    aiModel: 'gpt-4o'
  } as ChatState,

  claudeWriter: {
    platform: 'claude',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Poet', isOnline: true },
      { id: 'ai', name: 'Claude', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "i need a short story opening — a lighthouse keeper finds a message in a bottle that was written tomorrow", senderId: 'me', timestamp: new Date(Date.now() - 900000), isOwn: true },
      { id: 'm2', text: "The bottle clinked against the rocks at 4:17 AM, just as Elias was pouring his third cup of coffee. He almost ignored it — the tide brought trash every morning. But the paper inside wasn't weathered. It was crisp, bone-white, and the date at the top read March 14th, 2027. He checked his watch. It was March 13th. The handwriting was his own.", senderId: 'ai', timestamp: new Date(Date.now() - 800000), isOwn: false },
      { id: 'm3', text: "that gave me chills. can you continue?", senderId: 'me', timestamp: new Date(Date.now() - 700000), isOwn: true },
      { id: 'm4', text: "The note was terse — just three sentences in his cramped script: 'The light must stay on. No matter what you hear. Do not open the door.' Elias laughed at first. A prank. Had to be. But then he noticed the ink. It was the same fountain pen he kept in his desk drawer — the one his father left him. The one with the scratchy nib that left tiny ink blots after every fifth word. There were blots.", senderId: 'ai', timestamp: new Date(Date.now() - 600000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'claude-3.5-sonnet'
  } as ChatState,

  geminiResearch: {
    platform: 'gemini',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Grad Student', isOnline: true },
      { id: 'ai', name: 'Gemini', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "compare transformer architectures vs state space models for long-context NLP tasks. focus on computational complexity and memory usage", senderId: 'me', timestamp: new Date(Date.now() - 1200000), isOwn: true },
      { id: 'm2', text: "Excellent research question. Here's a comparative analysis:\n\n**Transformers (e.g., GPT-4, Llama)**\n- Complexity: O(n²) for self-attention, making long contexts (100K+ tokens) expensive\n- Memory: Quadratic scaling — a 128K context can consume 64GB+ VRAM\n- Strength: Unmatched in-context learning and retrieval precision\n\n**State Space Models (e.g., Mamba, S4)**\n- Complexity: O(n) via recurrent scan operations\n- Memory: Linear scaling — 1M token contexts are practical on consumer GPUs\n- Strength: Throughput is 5x faster than transformers on long sequences\n\n**Key tradeoff**: SSMs lose some precision on needle-in-haystack retrieval compared to full attention. Recent hybrids like Jamba and Griffin aim to combine both. Want the paper references?", senderId: 'ai', timestamp: new Date(Date.now() - 1100000), isOwn: false },
      { id: 'm3', text: "yes please, and can you compare the Mamba-2 paper vs the Griffin paper in terms of gating mechanisms?", senderId: 'me', timestamp: new Date(Date.now() - 1000000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'gemini-1.5-pro'
  } as ChatState,

  grokRoast: {
    platform: 'grok',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Daredevil', isOnline: true },
      { id: 'ai', name: 'Grok', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "roast me based on my posting history. be brutal", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "Your timeline is 40% hot takes you stole from Reddit, 30% screenshots of code you didn't write, and 30% asking why your startup has 0 users. The closest you've been to 'disrupting' anything is disrupting your own sleep schedule. Your engagement ratio is so bad that even your mom left you on read 💀", senderId: 'ai', timestamp: new Date(Date.now() - 240000), isOwn: false },
      { id: 'm3', text: "OK OK I REGRET ASKING 😭", senderId: 'me', timestamp: new Date(Date.now() - 200000), isOwn: true },
      { id: 'm4', text: "You asked for brutal. I deliver. Want me to analyze your GitHub commit messages next? 'fixed stuff lol' isn't a commit message, it's a cry for help.", senderId: 'ai', timestamp: new Date(Date.now() - 180000), isOwn: false },
      { id: 'm5', text: "i'm logging off", senderId: 'me', timestamp: new Date(Date.now() - 120000), isOwn: true }
    ],
    appearance: createChatAppearance(true),
    aiModel: 'grok-2'
  } as ChatState,
};
