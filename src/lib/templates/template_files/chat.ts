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

  instagramChat: {
    platform: 'instagram',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Marcus', isOnline: true },
      { id: 'p1', name: 'Zoe', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "that brunch spot i was telling u about has a 2hr wait 💀", senderId: 'p1', timestamp: new Date(Date.now() - 900000), isOwn: false },
      { id: 'm2', text: "no way... should we try that new rooftop place instead?", senderId: 'me', timestamp: new Date(Date.now() - 840000), isOwn: true },
      { id: 'm3', text: "ooh they do bottomless mimosas", senderId: 'me', timestamp: new Date(Date.now() - 830000), isOwn: true },
      { id: 'm4', text: "say less. i'll book for 11:30 ✨", senderId: 'p1', timestamp: new Date(Date.now() - 780000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  tiktokChat: {
    platform: 'tiktok',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Jenna', isOnline: true },
      { id: 'p1', name: 'Aria', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "have u seen that dance trend everyone's doing??", senderId: 'p1', timestamp: new Date(Date.now() - 1800000), isOwn: false },
      { id: 'm2', text: "the one to the remix?? obsessed 😭", senderId: 'me', timestamp: new Date(Date.now() - 1740000), isOwn: true },
      { id: 'm3', text: "we should film one at the park tmrw", senderId: 'me', timestamp: new Date(Date.now() - 1720000), isOwn: true },
      { id: 'm4', text: "yes!! i already learned the choreo lmao", senderId: 'p1', timestamp: new Date(Date.now() - 1680000), isOwn: false },
      { id: 'm5', text: "ofc u did 💀 meet at 2?", senderId: 'me', timestamp: new Date(Date.now() - 1600000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  redditChat: {
    platform: 'reddit',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'u/mod_nexus', isOnline: true },
      { id: 'p1', name: 'u/automod_bot', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "hey the spam filter went crazy again, nuked like 40 legit posts", senderId: 'me', timestamp: new Date(Date.now() - 7200000), isOwn: true },
      { id: 'm2', text: "i pushed a config fix. lowered the threshold to 0.65", senderId: 'p1', timestamp: new Date(Date.now() - 7140000), isOwn: false },
      { id: 'm3', text: "also the r/all mods are asking about the crossover event", senderId: 'me', timestamp: new Date(Date.now() - 7100000), isOwn: true },
      { id: 'm4', text: "tell them we're in. i'll draft the pinned post tonight", senderId: 'p1', timestamp: new Date(Date.now() - 7000000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  xChat: {
    platform: 'x',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'DevRel Dan', isOnline: true },
      { id: 'p1', name: 'Techie Tara', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "did u see the Veily launch thread?? 14K likes already", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
      { id: 'm2', text: "just read through it. the 4K export feature is wild", senderId: 'me', timestamp: new Date(Date.now() - 3540000), isOwn: true },
      { id: 'm3', text: "thinking of writing a comparison thread. want to collab?", senderId: 'me', timestamp: new Date(Date.now() - 3500000), isOwn: true },
      { id: 'm4', text: "100% down. i'll DM u my outline by tonight", senderId: 'p1', timestamp: new Date(Date.now() - 3400000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  whatsappFamily: {
    platform: 'whatsapp',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Alex', isOnline: true },
      { id: 'p1', name: 'Mom', avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Uncle Rob', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', isOnline: false },
      { id: 'p3', name: 'Cousin Mia', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "dad's 60th is on the 18th! who's coming to the dinner?", senderId: 'p1', timestamp: new Date(Date.now() - 86400000), isOwn: false },
      { id: 'm2', text: "i'll be there! should we book Giovanni's?", senderId: 'me', timestamp: new Date(Date.now() - 82800000), isOwn: true },
      { id: 'm3', text: "i can bring the cake 🎂 chocolate mousse ok with everyone?", senderId: 'p3', timestamp: new Date(Date.now() - 80000000), isOwn: false },
      { id: 'm4', text: "sounds great. i'll handle the RSVPs", senderId: 'p2', timestamp: new Date(Date.now() - 79000000), isOwn: false }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  messengerBusiness: {
    platform: 'messenger',
    chatType: 'direct',
    people: [
      { id: 'me', name: 'Studio Admin', isOnline: true },
      { id: 'p1', name: 'Amanda Keller', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "hi! i'm interested in the branding package. do u work with startups?", senderId: 'p1', timestamp: new Date(Date.now() - 14400000), isOwn: false },
      { id: 'm2', text: "hey Amanda! we specialize in early-stage startups actually", senderId: 'me', timestamp: new Date(Date.now() - 14340000), isOwn: true },
      { id: 'm3', text: "our starter kit includes logo, color palette, and social templates for $1,200", senderId: 'me', timestamp: new Date(Date.now() - 14320000), isOwn: true },
      { id: 'm4', text: "that's within budget! can we hop on a call this week?", senderId: 'p1', timestamp: new Date(Date.now() - 14200000), isOwn: false },
      { id: 'm5', text: "absolutely. how's Thursday at 2pm?", senderId: 'me', timestamp: new Date(Date.now() - 14100000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  telegramChannel: {
    platform: 'telegram',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Editor-in-Chief', isOnline: true },
      { id: 'p1', name: 'ContentBot 3000', isOnline: true },
      { id: 'p2', name: 'GraphicsGuru', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "AI market cap just crossed $2T. drafting the newsletter now", senderId: 'me', timestamp: new Date(Date.now() - 1800000), isOwn: true },
      { id: 'm2', text: "headline options: 'The $2T Milestone' or 'AI's Trillion Dollar Moment'", senderId: 'me', timestamp: new Date(Date.now() - 1740000), isOwn: true },
      { id: 'm3', text: "second one hits harder. i've got an infographic ready 📊", senderId: 'p2', timestamp: new Date(Date.now() - 1680000), isOwn: false },
      { id: 'm4', text: "scheduled? drop it Friday 9am EST for max opens", senderId: 'p1', timestamp: new Date(Date.now() - 1600000), isOwn: false },
      { id: 'm5', text: "locked in. graphics team send me final PNGs by EOD", senderId: 'me', timestamp: new Date(Date.now() - 1500000), isOwn: true }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  discordMod: {
    platform: 'discord',
    chatType: 'group',
    people: [
      { id: 'me', name: 'HeadMod', isOnline: true },
      { id: 'p1', name: 'AutoMod', isOnline: true },
      { id: 'p2', name: 'Sentinel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "@everyone user DarkPhantom69 has been spamming in #general. 14 reports in 10 min", senderId: 'p2', timestamp: new Date(Date.now() - 600000), isOwn: false },
      { id: 'm2', text: "already flagged. IP matches a previously banned account", senderId: 'p1', timestamp: new Date(Date.now() - 540000), isOwn: false },
      { id: 'm3', text: "perma ban + report to Trust & Safety. i'll handle the appeal thread", senderId: 'me', timestamp: new Date(Date.now() - 480000), isOwn: true },
      { id: 'm4', text: "also enabling slow mode in #general for the next 3 hours", senderId: 'me', timestamp: new Date(Date.now() - 470000), isOwn: true },
      { id: 'm5', text: "roger that. logging everything to mod-actions channel", senderId: 'p1', timestamp: new Date(Date.now() - 420000), isOwn: false }
    ],
    appearance: createChatAppearance(true),
  } as ChatState,

  teamsStandup: {
    platform: 'teams',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Scrum Master', isOnline: true },
      { id: 'p1', name: 'Priya (FE)', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Carlos (BE)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p3', name: 'Jess (QA)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "daily standup — go ahead and drop your updates here", senderId: 'me', timestamp: new Date(Date.now() - 1800000), isOwn: true },
      { id: 'm2', text: "yesterday: finished the checkout flow. today: integrating Stripe webhooks. blocked: waiting on API keys from ops", senderId: 'p1', timestamp: new Date(Date.now() - 1740000), isOwn: false },
      { id: 'm3', text: "deployed the auth service v2. all tests green. today: optimizing DB queries for the user search endpoint", senderId: 'p2', timestamp: new Date(Date.now() - 1680000), isOwn: false },
      { id: 'm4', text: "banged out 34 test cases for the checkout flow. found a bug in the promo code logic — created ticket #847", senderId: 'p3', timestamp: new Date(Date.now() - 1620000), isOwn: false },
      { id: 'm5', text: "great progress everyone. @Priya ping me when you get those API keys. let's unblock that today", senderId: 'me', timestamp: new Date(Date.now() - 1560000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  slackDesign: {
    platform: 'slack',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Design Lead', isOnline: true },
      { id: 'p1', name: 'Nina (UX)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Troy (Brand)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isOnline: false }
    ],
    messages: [
      { id: 'm1', text: "uploaded the new dashboard mockups to Figma — link in thread", senderId: 'p1', timestamp: new Date(Date.now() - 7200000), isOwn: false },
      { id: 'm2', text: "the data viz cards on page 3 are sick. what chart lib is that?", senderId: 'me', timestamp: new Date(Date.now() - 7140000), isOwn: true },
      { id: 'm3', text: "it's a custom D3 wrapper. i can drop the snippet in #eng", senderId: 'p1', timestamp: new Date(Date.now() - 7100000), isOwn: false },
      { id: 'm4', text: "the color contrast on the CTA buttons needs a bump though — failing AA", senderId: 'p2', timestamp: new Date(Date.now() - 7000000), isOwn: false },
      { id: 'm5', text: "good catch. @Nina can u tweak to #1A56DB? that passes AAA", senderId: 'me', timestamp: new Date(Date.now() - 6900000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,

  lineGroup: {
    platform: 'line',
    chatType: 'group',
    people: [
      { id: 'me', name: 'Hana', isOnline: true },
      { id: 'p1', name: 'Rina', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', isOnline: true },
      { id: 'p2', name: 'Yuto', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', isOnline: true }
    ],
    messages: [
      { id: 'm1', text: "group order for boba? im craving brown sugar milk tea rn 🧋", senderId: 'p1', timestamp: new Date(Date.now() - 3600000), isOwn: false },
      { id: 'm2', text: "omg count me in!! get me a taro with extra pearls", senderId: 'me', timestamp: new Date(Date.now() - 3540000), isOwn: true },
      { id: 'm3', text: "i'll do matcha latte. 50% sugar pls", senderId: 'p2', timestamp: new Date(Date.now() - 3480000), isOwn: false },
      { id: 'm4', text: "placing the order now! delivery eta 25 min 🛵", senderId: 'p1', timestamp: new Date(Date.now() - 3400000), isOwn: false },
      { id: 'm5', text: "yall are the best fr 🤍", senderId: 'me', timestamp: new Date(Date.now() - 3300000), isOwn: true }
    ],
    appearance: createChatAppearance(false),
  } as ChatState,
};
