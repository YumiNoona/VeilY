import { SocialPostState, ThreadItem } from "@/hooks/useSocialPostState";
import { ChatState, Message, Person, Platform, ChatType, AppearanceSettings } from "@/types/chat";
import { CommentsState, Profile, Comment } from "@/hooks/useCommentState";
import { StoriesState } from "@/hooks/useStoriesState";
import { EmailState } from "@/hooks/useEmailState";

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

  redditTheory: {
    platform: 'reddit',
    author: {
      name: 'TheoryCrafter',
      handle: 'u/TheoryCrafter',
      avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png',
      verified: false
    },
    content: {
      text: "[Deep Dive] The secret identity of the villain in the finale was hidden in the first 5 minutes. Let's look at the frame-by-frame evidence... 🧐",
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&h=600&fit=crop',
      date: new Date()
    },
    metrics: { likes: '24.8K', comments: '1.5K', reposts: '0', views: '0' },
    config: { theme: 'dark', transparentBackground: false },
    threadItems: []
  } as SocialPostState,

  xSpace: {
    platform: 'twitter',
    author: {
      name: 'Startup Weekly',
      handle: 'startup_weekly',
      avatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "We're LIVE! Join our Space with the founders of Veily. Talking about the future of designer tools. 🎙️✨\n\nJoin here: x.com/i/spaces/123",
      image: null,
      date: new Date()
    },
    metrics: { likes: '1.2K', comments: '45', reposts: '230', views: '45K' },
    config: { theme: 'dark', transparentBackground: false },
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

  whatsappShopping: {
    platform: 'whatsapp',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Boutique Store', isOnline: true },
      { id: 'p1', name: 'Customer', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Hi! Do you have the blue dress in size M?", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "Yes! We just got more in stock. Would you like me to set one aside for you? ✨", senderId: 'me', timestamp: new Date(Date.now() - 500000), isOwn: true }
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

  messengerNightOut: {
    platform: 'messenger',
    chatType: 'group',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'Tyler', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Chloe', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Who's ready for tonight? 🍸", senderId: 'me', timestamp: new Date(Date.now() - 3600000), isOwn: true },
      { id: 'm2', text: "Me! Just need to finish this report first. 😭", senderId: 'p2', timestamp: new Date(Date.now() - 3500000), isOwn: false },
      { id: 'm3', text: "I'll be there by 8. Save me a seat!", senderId: 'p1', timestamp: new Date(Date.now() - 3400000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  discordCommunity: {
    platform: 'discord',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Mod', isOnline: true },
      { id: 'p1', name: 'Gamer123', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'NoobMaster', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Anyone for a raid? Need 2 more.", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "I'm in! Let's go.", senderId: 'me', timestamp: new Date(Date.now() - 540000), isOwn: true }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  discordGaming: {
    platform: 'discord',
    chatType: 'group',
    people: [
      { id: 'me', name: 'SlayerX', isOnline: true },
      { id: 'p1', name: 'Healer99', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'TankPro', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Everyone on Discord? Boss fight in 5 mins! ⚔️", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "Mana is full. Let's do this.", senderId: 'p1', timestamp: new Date(Date.now() - 240000), isOwn: false },
      { id: 'm3', text: "Wait for me! Just logging in. 😅", senderId: 'p2', timestamp: new Date(Date.now() - 180000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  slackWorkspace: {
    platform: 'slack',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Lead Dev', isOnline: true },
      { id: 'p1', name: 'CTO', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "The production server is stable. 🚀", senderId: 'me', timestamp: new Date(Date.now() - 1000000), isOwn: true },
      { id: 'm2', text: "Great work team. Let's finish the sprint.", senderId: 'p1', timestamp: new Date(Date.now() - 900000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  slackGeneral: {
    platform: 'slack',
    chatType: 'group',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'HR Dept', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
        { id: 'm1', text: "Reminder: Free pizza in the kitchen at 12 PM! 🍕", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
        { id: 'm2', text: "Best news of the week! See you there. 🙌", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  lineBusiness: {
    platform: 'line',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Support', isOnline: true },
      { id: 'p1', name: 'Yuki Morita', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Is the store open on holidays?", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
      { id: 'm2', text: "Yes! We are open from 10 AM to 6 PM. Check our coupons! 🎫", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  signalSecure: {
    platform: 'signal',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Echo', isOnline: true },
      { id: 'p1', name: 'Ghost', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Did you clear the logs?", senderId: 'p1', timestamp: new Date(Date.now() - 60000), isOwn: false },
      { id: 'm2', text: "Encrypted and destroyed. We're clean.", senderId: 'me', timestamp: new Date(Date.now() - 30000), isOwn: true }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  teamsMeeting: {
    platform: 'teams',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Project Lead', isOnline: true },
      { id: 'p1', name: 'Sarah (PM)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Dave (Eng)', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', isOnline: false }
    ],
    messages: [
      { id: 'm1', text: "Let's sync on the Q4 roadmap tomorrow at 10 AM.", senderId: 'p1', timestamp: new Date(Date.now() - 300000), isOwn: false },
      { id: 'm2', text: "@Dave can you present the tech debt summary?", senderId: 'me', timestamp: new Date(Date.now() - 240000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  snapchatDaily: {
    platform: 'snapchat',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'Lily', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Look at this view! 🌅", senderId: 'p1', timestamp: new Date(Date.now() - 120000), isOwn: false },
      { id: 'm2', text: "Omg so jealous! Where are you?", senderId: 'me', timestamp: new Date(Date.now() - 60000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  tinderMatch: {
    platform: 'tinder',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'You', isOnline: true },
      { id: 'p1', name: 'Sophia', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Hey! Love your bio. Do you actually like hiking or is that just for the app? 😂", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
      { id: 'm2', text: "Hahaha okay okay, you caught me. Only if there's a pizza at the end of the trail! 🍕", senderId: 'p1', timestamp: new Date(Date.now() - 300000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  wechatFamily: {
    platform: 'wechat',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Kevin', isOnline: true },
      { id: 'p1', name: 'Mom', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Did you eat yet? I sent some red envelopes! 🧧", senderId: 'p1', timestamp: new Date(Date.now() - 1000000), isOwn: false },
      { id: 'm2', text: "Thanks Mom! Happy New Year! 🎉", senderId: 'me', timestamp: new Date(Date.now() - 900000), isOwn: true }
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

  geminiBusiness: {
    platform: 'gemini',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Manager', isOnline: true },
      { id: 'ai', name: 'Gemini', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94c495d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "Draft a Q3 summary for the stakeholders.", senderId: 'me', timestamp: new Date(Date.now() - 120000), isOwn: true },
      { id: 'm2', text: "Here's a draft focusing on the 15% revenue growth and new market entry in Japan...", senderId: 'ai', timestamp: new Date(Date.now() - 60000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
    aiModel: 'gemini-1.5-pro'
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

  tiktokRecipe: {
    platform: 'tiktok',
    profiles: [
        { id: 'c', name: 'Chef Mario', handle: 'chef_mario', avatar: 'https://images.unsplash.com/photo-1583394238712-92d139ca3211?w=50&h=50&fit=crop', verified: true, isCreator: true },
        { id: 'p1', name: 'Foodie Lover', handle: 'foodie', avatar: '', verified: false }
    ],
    comments: [
        { id: 'm1', userId: 'p1', text: "This pesto looks so fresh! Definitely trying this tonight.", likes: '15K', timeAgo: '4h', replies: [] },
        { id: 'm2', userId: 'c', text: "Make sure to toast the pine nuts first! It makes a huge difference.", likes: '8.2K', timeAgo: '3h', replies: [] }
    ],
    config: { theme: 'dark', showWatermark: false }
  } as CommentsState,
};

// --- STORIES TEMPLATES ---
export const STORIES_TEMPLATES = {
  influencerDay: {
    platform: 'instagram',
    username: 'travel_diaries',
    verified: true,
    timeAgo: '2h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,
  
  productLaunch: {
    platform: 'instagram',
    username: 'tech_gear_daily',
    verified: true,
    timeAgo: '45m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  snapchatVibe: {
    platform: 'snapchat',
    username: 'chill_vibes',
    verified: false,
    timeAgo: 'Just now',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1499566727020-88026dc6a0de?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1518833559746-12128bd35c5c?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  dayInLife: {
    platform: 'instagram',
    username: 'sara_vlogs',
    verified: false,
    timeAgo: '5h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1494390648447-380ff9822a10?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  morningCoffee: {
    platform: 'instagram',
    username: 'cozy_mornings',
    verified: false,
    timeAgo: '2h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  gymSession: {
    platform: 'instagram',
    username: 'fitness_junkie',
    verified: true,
    timeAgo: '45m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  travelJournal: {
    platform: 'snapchat',
    username: 'globetrotter',
    verified: false,
    timeAgo: '12h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,
};

// --- EMAIL TEMPLATES ---
export const EMAIL_TEMPLATES = {
  businessMeeting: {
    subject: 'Q3 Marketing Strategy Review',
    attachment: 'Q3_Strategy_V2.pdf',
    participants: [
      { id: 'p1', name: 'Sarah Jenkins', email: 's.jenkins@company.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'David Chen', email: 'd.chen@company.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p2',
        dateTime: 'Oct 12, 2023 at 9:15 AM',
        body: 'Hi Sarah,\n\nI have attached the revised Q3 marketing strategy for your review. Please let me know your thoughts before the board meeting tomorrow.\n\nBest,\nDavid'
      },
      {
        id: 'e2',
        fromParticipantId: 'p1',
        dateTime: 'Oct 12, 2023 at 10:30 AM',
        body: 'Thanks David. I will review this shortly and get back to you.'
      }
    ]
  } as EmailState,
  
  newsletterBoost: {
    subject: 'Breaking: Our Biggest Update Yet 🚀',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Alpha', email: 'hello@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'James Wilson', email: 'james@designco.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Today at 8:45 AM',
        body: 'Hi James,\n\nWe just launched the 4K export engine! As an early supporter, you get 50% off for life.\n\nCheck out the new dashboard and let us know what you think.\n\nCheers,\nThe Veily Team'
      }
    ]
  } as EmailState,

  jobOffer: {
    subject: 'Offer Letter: Senior Product Designer at Veily',
    attachment: 'Veily_Offer_Details.pdf',
    participants: [
      { id: 'p1', name: 'Alex Rivera', email: 'alex@veily.io', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Jordan Smith', email: 'jordan.smith@gmail.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Yesterday at 3:15 PM',
        body: 'Dear Jordan,\n\nFollowing our interviews, we are thrilled to offer you the position of Senior Product Designer. Your portfolio was exceptional.\n\nPlease find the attached offer letter and benefits summary.\n\nWelcome to the team!'
      }
    ]
  } as EmailState,

  securityAlert: {
    subject: 'Security Alert: New Sign-in Detected',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Security', email: 'security@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'You', email: 'user@example.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'January 15, 2024 at 11:42 PM',
        body: 'Security Alert\n\nWe detected a new sign-in from a Chrome browser on a Windows device in San Jose, CA.\n\nIf this was not you, please reset your password immediately.'
      }
    ]
  } as EmailState,
  
  partnershipInquiry: {
    subject: 'Partnership Opportunity: Veily x CreativeCloud',
    attachment: 'Veily_Partnership_Deck.pdf',
    participants: [
      { id: 'p1', name: 'Mark Thompson', email: 'mark@creativecloud.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Sarah Chen', email: 'sarah@veily.app', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Oct 14, 2023 at 2:00 PM',
        body: 'Hi Sarah,\n\nWe have been following Veily\'s growth and would love to discuss a potential partnership. Your mockup engine is exactly what our users have been asking for.\n\nAre you available for a brief call next Tuesday?'
      }
    ]
  } as EmailState,

  weeklyReview: {
    subject: 'Project Update: Week 12 Milestone Reached 🎯',
    attachment: 'Weekly_Report_W12.pdf',
    participants: [
      { id: 'p1', name: 'Leo Martinez', email: 'leo.m@agency.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Client Team', email: 'team@client.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Friday at 4:30 PM',
        body: 'Team,\n\nI am happy to report that we have hit all milestones for Week 12. The beta version is now ready for internal testing.\n\nHighlights:\n- Full responsive UI complete\n- Backend integration finalized\n- 4K export engine optimized'
      }
    ]
  } as EmailState,

  customerSupport: {
    subject: 'Case #49201 - Refund Request Resolution',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Support', email: 'support@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Customer', email: 'customer@gmail.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Dec 05, 2023 at 10:15 AM',
        body: 'Hello,\n\nThank you for reaching out. We have processed your refund request for the Premium annual plan. You should see the funds in your account within 5-7 business days.\n\nWe would love to know how we can improve. If you have a moment, please share your feedback.'
      }
    ]
  } as EmailState,

  networkingInvite: {
    subject: 'Grab a coffee? ☕️',
    attachment: '',
    participants: [
      { id: 'p1', name: 'David Lee', email: 'david.lee@startup.io', redactName: false, redactEmail: false },
      { id: 'p2', name: 'You', email: 'me@work.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: '9:30 AM',
        body: 'Hi,\n\nI saw your recent post on LinkedIn about the future of SaaS mockups. Really insightful stuff!\n\nI am in town next week and would love to grab a quick coffee and pick your brain. Do you have 20 mins?'
      }
    ]
  } as EmailState,
};
