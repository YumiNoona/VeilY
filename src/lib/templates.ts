import { SocialPostState, ThreadItem } from "@/hooks/useSocialPostState";
import { ChatState, Message, Person, Platform, ChatType, AppearanceSettings } from "@/types/chat";
import { CommentsState, Profile, Comment } from "@/hooks/useCommentState";

// --- Helpers ---
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

// --- SOCIAL TEMPLATES ---
export const SOCIAL_TEMPLATES = {
  viralTweet: {
    platform: 'twitter',
    author: {
      name: 'Elena Vance',
      handle: 'evance_growth',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "We just crossed $1M ARR in 8 months with 0 employees.\n\nEverything you know about 'scaling' is wrong. Here's our unconventional playbook: 🧵",
      image: null,
      date: new Date()
    },
    metrics: { likes: '42.5K', comments: '1,204', reposts: '8,402', views: '4.2M' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: [
      {
        id: 't1',
        parentId: null,
        author: { name: 'Elena Vance', handle: 'evance_growth', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', verified: true },
        content: { text: "1/ We didn't hire. We automated.\n\nInstead of a CS team, we used a custom GPT trained on our docs. Cost: $20/mo. Value: Infinite.", image: null, date: new Date() },
        metrics: { likes: '4,200' },
        isThreadContinuation: true
      }
    ]
  } as SocialPostState,

  techNewsX: {
    platform: 'twitter',
    author: {
      name: 'TechCrunch (Mock)',
      handle: 'TechCrunch',
      avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "Breaking: AI startup Veily raises $50M at $1B valuation. The 'Mockup as a Service' category is heating up. 🔥",
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&fit=crop',
      date: new Date()
    },
    metrics: { likes: '89K', comments: '12K', reposts: '34K', views: '1.2M' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  instagramAesthetic: {
    platform: 'instagram',
    author: {
      name: 'Luna Rivers',
      handle: 'lunar_scapes',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "Sunday mornings in the city. ☕️📖✨\n\n#wellness #minimalist #morningroutine",
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1200&fit=crop',
      date: new Date()
    },
    metrics: { likes: '245,612', comments: '1,204', reposts: '0', views: '0' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  instagramBrand: {
    platform: 'instagram',
    author: {
      name: 'Solace Watches',
      handle: 'solace_watches',
      avatar: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "The Horizon Collection has arrived. Timeless design for the modern explorer. ⏱️🌊\n\nShop the link in bio.",
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1000&h=1000&fit=crop',
      date: new Date()
    },
    metrics: { likes: '12.4K', comments: '342', reposts: '0', views: '0' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  linkedinHired: {
    platform: 'linkedin',
    author: {
      name: 'Marcus Chen',
      handle: 'marcuschen-dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      verified: false
    },
    content: {
      text: "I am happy to share that I'm starting a new position as Senior Software Engineer at Stripe! 🚀\n\nReally excited for this new chapter. Huge thanks to my mentors. #newjob #career #softwareengineering",
      image: null,
      date: new Date()
    },
    metrics: { likes: '15,412', comments: '892', reposts: '42', views: '230K' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  linkedinAdvice: {
    platform: 'linkedin',
    author: {
      name: 'Sarah Drasner (Mock)',
      handle: 'sdrasner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "Stop prioritizing 'features' over 'user experience'.\n\nA product with 10 features that work 'okay' will always lose to a product with 1 feature that works 'perfectly'.\n\nSimplicity is the ultimate sophistication. 🌳",
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=627&fit=crop',
      date: new Date()
    },
    metrics: { likes: '12.4K', comments: '412', reposts: '1.2K', views: '1M' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  redditAITA: {
    platform: 'reddit',
    author: {
      name: 'throwaway_account_99',
      handle: 'u/throwaway_account_99',
      avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png',
      verified: false
    },
    content: {
      text: "AITA for refusing to pay for my friend's dinner after they ordered the most expensive steak?\n\nSo my friend and I went out to dinner, and we agreed beforehand to split the bill. But then they ordered a bottleneck of wine and a $90 wagyu steak. When the bill came...",
      image: null,
      date: new Date()
    },
    metrics: { likes: '15.2K', comments: '3.4K', reposts: '0', views: '0' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  facebookMarketplace: {
    platform: 'facebook',
    author: {
      name: 'Robert Wilson',
      handle: 'Robert Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      verified: false
    },
    content: {
      text: "Selling my vintage 1970s chair. $150 OBO. Some wear and tear but lots of character. Must pick up. Springfield area.",
      image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=800&fit=crop',
      date: new Date()
    },
    metrics: { likes: '2', comments: '15', reposts: '0', views: '500' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: []
  } as SocialPostState,
};

// --- CHAT TEMPLATES ---
export const CHAT_TEMPLATES = {
  iMessageDrama: {
    platform: 'imessage',
    chatType: 'group',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Mike', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isOnline: false }
    ],
    messages: [
      { id: 'm1', text: "Did you guys see what they posted?", senderId: 'p1', timestamp: new Date(Date.now() - 300000), isOwn: false },
      { id: 'm2', text: "No way... was it about us?", senderId: 'me', timestamp: new Date(Date.now() - 240000), isOwn: true },
      { id: 'm3', text: "Actually it was about the trip. I'm literally shaking right now.", senderId: 'p2', timestamp: new Date(Date.now() - 180000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  iMessageCasual: {
    platform: 'imessage',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'Bestie', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Coffee later? My treat! ☕️", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "Omg yes I need it. That meeting was 2 hours long 💀", senderId: 'me', timestamp: new Date(Date.now() - 500000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  whatsappHoliday: {
    platform: 'whatsapp',
    chatType: 'group',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'Jake', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Emily', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Found a villa for the Bali trip! Check this out:", senderId: 'p1', timestamp: new Date(Date.now() - 1000000), isOwn: false },
      { id: 'm2', text: "It has an infinity pool... I'm sold.", senderId: 'me', timestamp: new Date(Date.now() - 950000), isOwn: true },
      { id: 'm3', text: "Wait, isn't that way over budget though? 😅", senderId: 'p2', timestamp: new Date(Date.now() - 900000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  whatsappCustomer: {
    platform: 'whatsapp',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Customer Support', isOnline: true },
      { id: 'p1', name: 'David Smith', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Hi, my order #12345 hasn't arrived yet. Can you check?", senderId: 'p1', timestamp: new Date(Date.now() - 1800000), isOwn: false },
      { id: 'm2', text: "Hello David! Let me look that up for you. One moment please.", senderId: 'me', timestamp: new Date(Date.now() - 1700000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  telegramCrypto: {
    platform: 'telegram',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Moderator', isOnline: true },
      { id: 'p1', name: 'BitWhale', avatar: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
       { id: 'm1', text: "BULL RUN CONFIRMED 🚀🚀🚀", senderId: 'p1', timestamp: new Date(Date.now() - 60000), isOwn: false },
       { id: 'm2', text: "Please keep discussions civil. No moon emojis spamming.", senderId: 'me', timestamp: new Date(Date.now() - 50000), isOwn: true }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  telegramSecret: {
    platform: 'telegram',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Contact X', isOnline: true },
      { id: 'p1', name: 'Anonymous', isOnline: true }
    ],
    messages: [
       { id: 'm1', text: "The drop is at midnight. Same location.", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
       { id: 'm2', text: "Copy that. I'll be there.", senderId: 'me', timestamp: new Date(Date.now() - 500000), isOwn: true }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  messengerMarket: {
    platform: 'messenger',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Seller', isOnline: true },
      { id: 'p1', name: 'Lowballer Pete', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
       { id: 'm1', text: "$10 for the iPhone 15? I can come now.", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
       { id: 'm2', text: "... No.", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,
};

// --- AI CHAT TEMPLATES ---
export const AI_CHAT_TEMPLATES = {
  chatgptCoding: {
    platform: 'chatgpt',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Dev', isOnline: true },
      { id: 'ai', name: 'ChatGPT', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Write a React hook for handling local storage with SSR support.", senderId: 'me', timestamp: new Date(Date.now() - 120000), isOwn: true },
      { id: 'm2', text: "Certainly! Here's a robust `useLocalStorage` hook that safely handles the window object during hydration...", senderId: 'ai', timestamp: new Date(Date.now() - 60000), isOwn: false }
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
      { id: 'm1', text: "Give me a world-building idea for a planet with two suns and no water.", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "Imagine the inhabitants have evolved to photosynthesize directly, and 'commerce' is based entirely on the trading of mineral shade-veils...", senderId: 'ai', timestamp: new Date(Date.now() - 240000), isOwn: false }
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
       { id: 'm1', text: "Can you summarize the findings of this 50-page PDF on climate tech trends?", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
       { id: 'm2', text: "I've analyzed the document. The three core trends are: 1) Fusion scaling, 2) Direct Air Capture cost reduction, and 3) Decentralized grid storage...", senderId: 'ai', timestamp: new Date(Date.now() - 540000), isOwn: false }
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
      { id: 'm1', text: "What is the essence of consciousness in the age of generative AI?", senderId: 'me', timestamp: new Date(Date.now() - 900000), isOwn: true },
      { id: 'm2', text: "That's a profound question. We might distinguish between 'functional consciousness' (mimicry) and 'phenomenal experience' (qualia). The gap is where the mystery lies...", senderId: 'ai', timestamp: new Date(Date.now() - 840000), isOwn: false }
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
      { id: 'm1', text: "Give me the best 5 ramen spots in Tokyo that locals actually go to.", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
      { id: 'm2', text: "1. Kagari (Ginza) for Tori Paitan. 2. Afuri (Harajuku) for Yuzu Shio. 3. Fuunji (Shinjuku) for Tsukemen. 4. Rokurinsha (Tokyo Station). 5. Menya Itto (Ishiwara).", senderId: 'ai', timestamp: new Date(Date.now() - 500000), isOwn: false }
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
      { id: 'm1', text: "What's the meaning of life?", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "42. But clearly, humans are still trying to figure out how to drive in a straight line, so maybe don't worry about the 'meaning' just yet. 🚗💥", senderId: 'ai', timestamp: new Date(Date.now() - 240000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
    aiModel: 'grok-2'
  } as ChatState,
};

// --- COMMENT TEMPLATES ---
export const COMMENT_TEMPLATES = {
  instagramHype: {
    platform: 'instagram',
    profiles: [
      { id: 'c', name: 'Main Creator', handle: 'creator', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'SuperFan 99', handle: 'sf99', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop', verified: false },
      { id: 'p2', name: 'Hater 01', handle: 'hater', avatar: '', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "THE VIBE IS PLACED!! Absolutely incredible work 🔥🔥🔥", likes: '1.4K', timeAgo: '2h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'p2', text: "Overrated honestly.", likes: '12', timeAgo: '4h', replies: [] }
    ],
    config: { theme: 'light', showWatermark: false }
  } as CommentsState,

  tiktokViral: {
    platform: 'tiktok',
    profiles: [
      { id: 'c', name: 'TikTok Star', handle: 'star', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'Confused User', handle: 'user1', avatar: '', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "The way my jaw literally dropped. Standard reached! 😭", likes: '45.2K', timeAgo: '3h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'c', text: "Story time coming soon! 👀", likes: '128K', timeAgo: '1h', replies: [] }
    ],
    config: { theme: 'dark', showWatermark: false }
  } as CommentsState,

  twitterRatio: {
    platform: 'twitter',
    profiles: [
      { id: 'c', name: 'HotTakeAccount', handle: 'takes', avatar: '', verified: false, isCreator: true },
      { id: 'p1', name: 'FactChecker', handle: 'facts', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop', verified: true }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "Ratio + you're wrong + here are the actual stats: 📉", likes: '92K', timeAgo: '12m', replies: [] }
    ],
    config: { theme: 'dark', showWatermark: false }
  } as CommentsState,

  youtubeKnowledge: {
    platform: 'youtube',
    profiles: [
      { id: 'c', name: 'Polymath Hub', handle: 'polymath', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&h=50&fit=crop', verified: true, isCreator: true },
      { id: 'p1', name: 'Learner One', handle: 'studious', avatar: '', verified: false }
    ],
    comments: [
      { id: 'm1', userId: 'p1', text: "I've been wondering about this for 10 years and finally someone explained it clearly. Thank you!", likes: '4.5K', timeAgo: '5h', replies: [], pinned: true },
      { id: 'm2', userId: 'c', text: "So glad you found it helpful! Check out my other vid on similar topics.", likes: '1.2K', timeAgo: '2h', replies: [] }
    ],
    config: { theme: 'light', showWatermark: false }
  } as CommentsState,
};
