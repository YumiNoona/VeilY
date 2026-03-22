import { SocialPostState } from "@/hooks/useSocialPostState";

export const SOCIAL_TEMPLATES = {
  viralTweet: {
    platform: 'twitter',
    author: {
      name: 'Startup Founder',
      handle: 'founder_x',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "We just crossed $1M ARR in 8 months with 0 employees.\n\nHere are the 7 AI tools that replaced my entire team:\n\n🧵 (Bookmark this)",
      image: null,
      date: new Date()
    },
    metrics: {
      likes: '42.5K',
      comments: '1,204',
      reposts: '8,402',
      views: '4.2M'
    },
    config: {
      theme: 'light',
      transparentBackground: false,
      isPremium: true
    },
    threadItems: [
      {
        id: 't1',
        parentId: null,
        author: {
          name: 'Startup Founder',
          handle: 'founder_x',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
          verified: true
        },
        content: {
          text: "1. Veily.app for all our marketing assets.\nIt simulates social proof so well we never had to design actual ad creatives.",
          image: null,
          date: new Date()
        },
        metrics: { likes: '4,200' },
        isThreadContinuation: true
      }
    ]
  } as SocialPostState,

  linkedinFlex: {
    platform: 'linkedin',
    author: {
      name: 'Jonathan Enterprise',
      handle: 'jonathan',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
      verified: false
    },
    content: {
      text: "I'm thrilled to announce that I've accepted a position as VP of Synergy at GlobalCorp! 🚀\n\nA huge thank you to everyone who supported me on this incredible journey. The grind never stops, but today we celebrate. Here's to new beginnings and disrupting the paradigm! 🙌📈\n\n#humbled #blessed #leadership #grindset",
      image: null,
      date: new Date()
    },
    metrics: {
      likes: '8,942',
      comments: '412',
      reposts: '124',
      views: '120K'
    },
    config: {
      theme: 'light',
      transparentBackground: false,
      isPremium: true
    },
    threadItems: [
      {
        id: 'c1',
        parentId: null,
        author: {
          name: 'Sarah Professional',
          handle: 'sarah',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
          verified: false
        },
        content: {
          text: "Huge congratulations Jonathan! So well deserved! 🎉",
          image: null,
          date: new Date()
        },
        metrics: { likes: '124' }
      }
    ]
  } as SocialPostState,

  redditTifu: {
    platform: 'reddit',
    author: {
      name: 'Throwaway123445',
      handle: 'u/Throwaway123445',
      avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png',
      verified: false
    },
    content: {
      text: "TIFU by accidentally presenting my mockup tool to the board instead of the real app.\n\nSo this happened yesterday. I was supposed to demo our new mobile app to the board of directors. But I had my Veily tab open from when I was making fake social posts for Twitter. I screen shared the fake viral tweets instead of the actual metrics dashboard.",
      image: null,
      date: new Date()
    },
    metrics: {
      likes: '24.5K',
      comments: '1,842',
      reposts: '0',
      views: '0'
    },
    config: {
      theme: 'dark',
      transparentBackground: false,
      isPremium: true
    },
    threadItems: [
      {
        id: 'c1',
        parentId: null,
        author: {
          name: 'AverageRedditor55',
          handle: 'u/AverageRedditor55',
          avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png',
          verified: false
        },
        content: {
          text: "Did they notice? Or did they just think you were really popular on Twitter?",
          image: null,
          date: new Date(Date.now() - 3600000)
        },
        metrics: { likes: '8.2K' },
        depth: 0
      },
      {
        id: 'c1-1',
        parentId: 'c1',
        author: {
          name: 'Throwaway123445',
          handle: 'u/Throwaway123445',
          avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png',
          verified: false
        },
        content: {
          text: "Worse. The CEO asked why our competitor was verified in the screenshots and we weren't.",
          image: null,
          date: new Date(Date.now() - 1800000)
        },
        metrics: { likes: '12.4K' },
        depth: 1
      }
    ]
  } as SocialPostState,

  instagramViral: {
    platform: 'instagram',
    author: {
      name: 'Aesthetic Creator',
      handle: 'aesthetic.vibes',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
      verified: true
    },
    content: {
      text: "romanticize your life ☕️✨🕊️\n\n#aesthetics #thatgirl #morningroutine #lifestyle",
      image: 'https://images.unsplash.com/photo-1510251191361-9f9fcecc62ba?w=800&h=800&fit=crop',
      date: new Date()
    },
    metrics: {
      likes: '142,304',
      comments: '842',
      reposts: '0',
      views: '0'
    },
    config: {
      theme: 'light',
      transparentBackground: false,
      isPremium: true
    },
    threadItems: [
      {
        id: 'c1',
        parentId: null,
        author: {
          name: 'Fan Account',
          handle: 'fan.account',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop',
          verified: false
        },
        content: {
          text: "obsessed with this entire vibe 😍",
          image: null,
          date: new Date()
        },
        metrics: { likes: '452' }
      },
      {
        id: 'c2',
        parentId: null,
        author: {
          name: 'Brand Deal',
          handle: 'coffeeco',
          avatar: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=50&h=50&fit=crop',
          verified: true
        },
        content: {
          text: "The perfect setup ☕️✨",
          image: null,
          date: new Date()
        },
        metrics: { likes: '89' }
      }
    ]
  } as SocialPostState
};
