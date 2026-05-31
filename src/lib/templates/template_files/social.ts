import { SocialPostState } from "@/hooks/useSocialPostState";

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
