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
      text: "we crossed $1M ARR in 8 months with 0 employees\n\neverything you know about 'scaling' is wrong. here's our playbook 🧵",
      image: null,
      date: new Date()
    },
    metrics: { likes: '41.7K', comments: '1,847', reposts: '8,219', views: '3.8M' },
    config: { theme: 'light', transparentBackground: false },
    threadItems: [
      {
        id: 't1',
        parentId: null,
        author: { name: 'Elena Vance', handle: 'evance_growth', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', verified: true },
        content: { text: "1/ we didn't hire. we automated.\n\ninstead of a CS team we used a custom GPT trained on our docs. cost: $20/mo. value: infinite.", image: null, date: new Date() },
        metrics: { likes: '4,312' },
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
      text: "Breaking: AI startup Veily raises $50M at $1B valuation. The 'Mockup as a Service' category is heating up 🔥",
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&fit=crop',
      date: new Date()
    },
    metrics: { likes: '87.3K', comments: '11.4K', reposts: '33.8K', views: '1.1M' },
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
      text: "sunday mornings in the city ☕️📖✨\n\n#wellness #minimalist #morningroutine",
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1200&fit=crop',
      date: new Date()
    },
    metrics: { likes: '243,817', comments: '1,047', reposts: '0', views: '0' },
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
      text: "The Horizon Collection just dropped. timeless design for the modern explorer ⏱️🌊\n\nlink in bio.",
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1000&h=1000&fit=crop',
      date: new Date()
    },
    metrics: { likes: '12.1K', comments: '287', reposts: '0', views: '0' },
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
      text: "I'm happy to share that I'm starting a new position as Senior Software Engineer at Stripe! 🚀\n\nHonestly still doesn't feel real. Huge thanks to everyone who helped me get here. #newjob #career #softwareengineering",
      image: null,
      date: new Date()
    },
    metrics: { likes: '15,847', comments: '914', reposts: '38', views: '227K' },
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
      text: "Stop prioritizing 'features' over 'user experience'.\n\nA product with 10 features that work 'okay' will always lose to one with 1 feature that works perfectly.\n\nSimplicity is the ultimate sophistication. 🌳",
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=627&fit=crop',
      date: new Date()
    },
    metrics: { likes: '12.8K', comments: '397', reposts: '1.1K', views: '984K' },
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
      text: "AITA for refusing to pay for my friend's dinner after they ordered the most expensive thing on the menu?\n\nSo we agreed to split the bill beforehand. Then this mf orders a $90 wagyu steak and a bottle of wine. When the bill came I said I'm only paying for what I ate and now they won't talk to me",
      image: null,
      date: new Date()
    },
    metrics: { likes: '15.7K', comments: '3,241', reposts: '0', views: '0' },
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
      text: "Vintage 1970s chair $150 OBO. some wear but tons of character. pickup only, springfield area. serious buyers only pls",
      image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=800&fit=crop',
      date: new Date()
    },
    metrics: { likes: '3', comments: '14', reposts: '0', views: '487' },
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
      text: "[Deep Dive] the villain's identity was hidden in the first 5 minutes of the finale. frame by frame evidence below... 🧐",
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&h=600&fit=crop',
      date: new Date()
    },
    metrics: { likes: '24.3K', comments: '1,847', reposts: '0', views: '0' },
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
      text: "we're LIVE rn 🎙️✨ talking to the founders of Veily about the future of designer tools\n\njoin: x.com/i/spaces/123",
      image: null,
      date: new Date()
    },
    metrics: { likes: '1.3K', comments: '47', reposts: '218', views: '43.2K' },
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
      { id: 'm1', text: "did u guys see what they posted", senderId: 'p1', timestamp: new Date(Date.now() - 300000), isOwn: false },
      { id: 'm2', text: "wait what", senderId: 'me', timestamp: new Date(Date.now() - 260000), isOwn: true },
      { id: 'm3', text: "was it about us??", senderId: 'me', timestamp: new Date(Date.now() - 240000), isOwn: true },
      { id: 'm4', text: "it was about the trip im literally shaking rn", senderId: 'p2', timestamp: new Date(Date.now() - 180000), isOwn: false }
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
      { id: 'm1', text: "coffee later? my treat ☕️", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "omg yes pls", senderId: 'me', timestamp: new Date(Date.now() - 550000), isOwn: true },
      { id: 'm3', text: "that meeting was 2 hours long 💀", senderId: 'me', timestamp: new Date(Date.now() - 500000), isOwn: true }
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
      { id: 'm1', text: "yo found a villa for bali check this", senderId: 'p1', timestamp: new Date(Date.now() - 1000000), isOwn: false },
      { id: 'm2', text: "bro it has an infinity pool", senderId: 'me', timestamp: new Date(Date.now() - 960000), isOwn: true },
      { id: 'm3', text: "im sold", senderId: 'me', timestamp: new Date(Date.now() - 950000), isOwn: true },
      { id: 'm4', text: "wait isn't that way over budget tho 😅", senderId: 'p2', timestamp: new Date(Date.now() - 900000), isOwn: false }
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
      { id: 'm1', text: "hi my order #12345 hasn't arrived yet can u check?", senderId: 'p1', timestamp: new Date(Date.now() - 1800000), isOwn: false },
      { id: 'm2', text: "hey David! let me look that up real quick", senderId: 'me', timestamp: new Date(Date.now() - 1750000), isOwn: true },
      { id: 'm3', text: "one sec", senderId: 'me', timestamp: new Date(Date.now() - 1700000), isOwn: true }
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
      { id: 'm1', text: "hi do u have the blue dress in size M?", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "yes! just restocked actually ✨", senderId: 'me', timestamp: new Date(Date.now() - 550000), isOwn: true },
      { id: 'm3', text: "want me to set one aside for u?", senderId: 'me', timestamp: new Date(Date.now() - 500000), isOwn: true }
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
       { id: 'm2', text: "bro chill with the moon emojis", senderId: 'me', timestamp: new Date(Date.now() - 50000), isOwn: true }
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
       { id: 'm1', text: "midnight. same spot.", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
       { id: 'm2', text: "copy", senderId: 'me', timestamp: new Date(Date.now() - 500000), isOwn: true }
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
       { id: 'm1', text: "$10 for the iPhone 15? i can come rn", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
       { id: 'm2', text: "lol no", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true }
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
      { id: 'm1', text: "who's ready for tonight 🍸", senderId: 'me', timestamp: new Date(Date.now() - 3600000), isOwn: true },
      { id: 'm2', text: "meee just gotta finish this report first 😭", senderId: 'p2', timestamp: new Date(Date.now() - 3500000), isOwn: false },
      { id: 'm3', text: "ill be there by 8 save me a seat", senderId: 'p1', timestamp: new Date(Date.now() - 3400000), isOwn: false }
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
      { id: 'm1', text: "anyone for a raid? need 2 more", senderId: 'p1', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "im in lets go", senderId: 'me', timestamp: new Date(Date.now() - 540000), isOwn: true }
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
      { id: 'm1', text: "everyone on? boss fight in 5 ⚔️", senderId: 'me', timestamp: new Date(Date.now() - 300000), isOwn: true },
      { id: 'm2', text: "mana full lets go", senderId: 'p1', timestamp: new Date(Date.now() - 240000), isOwn: false },
      { id: 'm3', text: "WAIT im logging in 😅", senderId: 'p2', timestamp: new Date(Date.now() - 180000), isOwn: false }
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
      { id: 'm1', text: "prod is stable 🚀", senderId: 'me', timestamp: new Date(Date.now() - 1000000), isOwn: true },
      { id: 'm2', text: "nice. lets wrap the sprint then", senderId: 'p1', timestamp: new Date(Date.now() - 900000), isOwn: false }
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
        { id: 'm1', text: "free pizza in the kitchen at 12 🍕", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
        { id: 'm2', text: "best news all week omw 🙌", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true }
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
      { id: 'm1', text: "are u guys open on holidays?", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
      { id: 'm2', text: "yep! 10am-6pm. we have coupons too check it out 🎫", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true }
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
      { id: 'm1', text: "logs cleared?", senderId: 'p1', timestamp: new Date(Date.now() - 60000), isOwn: false },
      { id: 'm2', text: "encrypted and wiped. we're clean", senderId: 'me', timestamp: new Date(Date.now() - 30000), isOwn: true }
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
      { id: 'm1', text: "lets sync on Q4 roadmap tmrw at 10", senderId: 'p1', timestamp: new Date(Date.now() - 300000), isOwn: false },
      { id: 'm2', text: "@Dave can u present the tech debt stuff?", senderId: 'me', timestamp: new Date(Date.now() - 240000), isOwn: true }
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
      { id: 'm1', text: "look at this view 🌅", senderId: 'p1', timestamp: new Date(Date.now() - 120000), isOwn: false },
      { id: 'm2', text: "omg wait where r u", senderId: 'me', timestamp: new Date(Date.now() - 60000), isOwn: true }
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
      { id: 'm1', text: "ok but do u actually like hiking or is that just for the app 😂", senderId: 'me', timestamp: new Date(Date.now() - 600000), isOwn: true },
      { id: 'm2', text: "lmaooo u caught me", senderId: 'p1', timestamp: new Date(Date.now() - 350000), isOwn: false },
      { id: 'm3', text: "only if there's pizza at the end of the trail 🍕", senderId: 'p1', timestamp: new Date(Date.now() - 300000), isOwn: false }
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
      { id: 'm1', text: "you eat yet?? sent some red envelopes 🧧", senderId: 'p1', timestamp: new Date(Date.now() - 1000000), isOwn: false },
      { id: 'm2', text: "thanks mom!! happy new year 🎉", senderId: 'me', timestamp: new Date(Date.now() - 900000), isOwn: true }
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
      { id: 'm1', userId: 'p1', text: "THE VIBE omg 🔥🔥🔥 this is actually insane", likes: '1,347', timeAgo: '2h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'p2', text: "overrated tbh", likes: '14', timeAgo: '4h', replies: [] }
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
      { id: 'm1', userId: 'p1', text: "the way my jaw DROPPED 😭😭 this is the standard", likes: '44.7K', timeAgo: '3h', replies: [], isLikedByAuthor: true },
      { id: 'm2', userId: 'c', text: "storytime coming soon 👀", likes: '127K', timeAgo: '1h', replies: [] }
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
      { id: 'm1', userId: 'p1', text: "ratio + you're wrong + here are the actual stats 📉", likes: '91.4K', timeAgo: '12m', replies: [] }
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
      { id: 'm1', userId: 'p1', text: "i've literally been wondering about this for 10 years and this is the first time someone actually explained it right. thank u", likes: '4,712', timeAgo: '5h', replies: [], pinned: true },
      { id: 'm2', userId: 'c', text: "glad it helped! got another vid on this if u want to go deeper", likes: '1,183', timeAgo: '2h', replies: [] }
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
        { id: 'm1', userId: 'p1', text: "wait this looks so good im making this tonight", likes: '14.8K', timeAgo: '4h', replies: [] },
        { id: 'm2', userId: 'c', text: "pro tip toast the pine nuts first it makes a huge difference 🤌", likes: '8,347', timeAgo: '3h', replies: [] }
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

  natureEscape: {
    platform: 'instagram',
    username: 'nature_seeker',
    verified: true,
    timeAgo: '1h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  urbanVibe: {
    platform: 'instagram',
    username: 'city_scout',
    verified: false,
    timeAgo: '3h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  petLove: {
    platform: 'instagram',
    username: 'paws_n_claws',
    verified: false,
    timeAgo: '15m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  foodieHeaven: {
    platform: 'instagram',
    username: 'chef_secrets',
    verified: true,
    timeAgo: '4h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  techSetup: {
    platform: 'instagram',
    username: 'code_lab',
    verified: true,
    timeAgo: '6h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  minimalFashion: {
    platform: 'instagram',
    username: 'style_edit',
    verified: false,
    timeAgo: '2h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  modernArch: {
    platform: 'instagram',
    username: 'lines_n_space',
    verified: false,
    timeAgo: '8h',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1449156001437-3a1411dfca19?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  beachDay: {
    platform: 'snapchat',
    username: 'island_hopper',
    verified: false,
    timeAgo: 'Just now',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(false)
  } as StoriesState,

  cityNight: {
    platform: 'snapchat',
    username: 'neon_vibes',
    verified: false,
    timeAgo: '10m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1514525253344-f2526019485b?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,

  luxuryDrive: {
    platform: 'snapchat',
    username: 'auto_elite',
    verified: true,
    timeAgo: '5m',
    slides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80' }
    ],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: createChatAppearance(true)
  } as StoriesState,
};

// --- EMAIL TEMPLATES ---
export const EMAIL_TEMPLATES = {
  businessMeeting: {
    subject: 'Re: Thursday standup notes + Q3 deck',
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
        body: 'Hey Sarah,\n\nAttached the revised Q3 deck — made the changes we talked about in standup. Can you take a look before the board meeting tomorrow? Specifically the CAC numbers on slide 9.\n\nThanks,\nDavid'
      },
      {
        id: 'e2',
        fromParticipantId: 'p1',
        dateTime: 'Oct 12, 2023 at 10:30 AM',
        body: 'Got it, pulling it up now. Will ping you on Slack if anything looks off.'
      }
    ]
  } as EmailState,
  
  newsletterBoost: {
    subject: '4K exports are live (+ your early supporter discount)',
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
        body: 'Hey James,\n\nThe 4K export engine just shipped. You were one of our first 200 users so we\'re locking in 50% off for life — no action needed, it\'s already on your account.\n\nWould love to hear what you think of the new dashboard.\n\n— The Veily team'
      }
    ]
  } as EmailState,

  jobOffer: {
    subject: 'Your offer — Senior Product Designer at Veily',
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
        body: 'Hi Jordan,\n\nReally enjoyed our conversations — the team loved your portfolio, especially the fintech case study.\n\nAttached is your offer letter and benefits summary for the Senior Product Designer role. Take your time reviewing it and feel free to reach out with any questions.\n\nExcited to hopefully have you on board.\n\nAlex'
      }
    ]
  } as EmailState,

  securityAlert: {
    subject: 'New sign-in from Chrome on Windows (San Jose, CA)',
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
        body: 'We noticed a sign-in to your account from a new device.\n\nDevice: Chrome on Windows\nLocation: San Jose, CA\nTime: Jan 15, 2024 at 11:42 PM PST\n\nIf this wasn\'t you, reset your password now and enable 2FA.'
      }
    ]
  } as EmailState,
  
  partnershipInquiry: {
    subject: 'Quick question re: Veily integration for CreativeCloud',
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
        body: 'Hi Sarah,\n\nBeen following what you\'re building at Veily — our users keep asking for a native mockup tool and your engine is exactly what we\'d want to integrate.\n\nAttached a short deck on what we\'re thinking. Are you free for a 20 min call next Tuesday?\n\nMark'
      }
    ]
  } as EmailState,

  weeklyReview: {
    subject: 'Re: Week 12 — beta is ready for internal testing',
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
        body: 'Team,\n\nGood news — we hit all the W12 milestones. Beta is ready for internal testing whenever you are.\n\nQuick highlights:\n- Responsive UI is done across all breakpoints\n- Backend integration wrapped up yesterday\n- 4K export is running ~3x faster than the prototype\n\nFull report attached. Let me know if anything looks off.\n\nLeo'
      }
    ]
  } as EmailState,

  customerSupport: {
    subject: 'Re: Refund for Premium plan (Case #49201)',
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
        body: 'Hey there,\n\nYour refund for the Premium annual plan has been processed — should show up in your account within 5-7 business days.\n\nTotally understand if it wasn\'t the right fit. If you have a sec, we\'d love to know what we could do better.\n\nThanks,\nVeily Support'
      }
    ]
  } as EmailState,

  networkingInvite: {
    subject: 'Saw your SaaS mockups post — coffee next week?',
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
        body: 'Hey,\n\nRead your LinkedIn post on the future of SaaS mockups — really resonated with some stuff we\'re working on.\n\nI\'m in town next Tues-Wed, would love to grab a quick coffee if you have 20 mins. No agenda, just curious to hear more about your approach.\n\nDavid'
      }
    ]
  } as EmailState,

  projectKickoff: {
    subject: 'Website redesign — timeline + first steps',
    attachment: 'Project_Timeline.xlsx',
    participants: [
      { id: 'p1', name: 'Emma Watson', email: 'emma@design-agency.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'John Doe', email: 'john@client-group.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Monday at 10:00 AM',
        body: 'Hi John,\n\nExcited to get this started. Attached the timeline we discussed — I padded the QA phase by a week based on your feedback.\n\nCan we do a quick kickoff call Thursday afternoon? I\'ll send a calendar invite.\n\nEmma'
      }
    ]
  } as EmailState,

  supportWelcome: {
    subject: 'You\'re in — here\'s how to get started with Veily',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Veily Support', email: 'support@veily.app', redactName: false, redactEmail: false },
      { id: 'p2', name: 'New User', email: 'new@user.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Just now',
        body: 'Welcome to Veily!\n\nYou can start creating mockups right away — no setup needed. Pick a template or start from scratch.\n\nIf anything feels confusing, just reply to this email. We actually read these.'
      }
    ]
  } as EmailState,

  invoiceReminder: {
    subject: 'Reminder: Invoice #INV-2024-001 due in 3 days',
    attachment: 'Invoice_INV-2024-001.pdf',
    participants: [
      { id: 'p1', name: 'Billing Team', email: 'billing@services.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Account Holder', email: 'account@company.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: '2 days ago',
        body: 'Hi there,\n\nJust a heads up — invoice #INV-2024-001 is due on the 18th (3 days from now). PDF attached if you need it.\n\nLet us know if there are any issues with payment.\n\nThanks,\nBilling'
      }
    ]
  } as EmailState,

  formalGreeting: {
    subject: 'Quick intro — Sarah from Global Tech',
    attachment: '',
    participants: [
      { id: 'p1', name: 'Sarah Miller', email: 'sarah.miller@globaltech.com', redactName: false, redactEmail: false },
      { id: 'p2', name: 'Business Owner', email: 'owner@localbiz.com', redactName: false, redactEmail: false }
    ],
    emails: [
      {
        id: 'e1',
        fromParticipantId: 'p1',
        dateTime: 'Yesterday',
        body: 'Hi,\n\nI\'m Sarah from Global Tech — we work with small businesses on automation and ops tooling. Found your company through a mutual connection (James Park).\n\nWould love to chat if you\'re open to it. No pressure either way.\n\nBest,\nSarah'
      }
    ]
  } as EmailState,
};
