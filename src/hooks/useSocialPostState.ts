import React, { useState } from 'react';
import { toast } from 'sonner';

export type SocialPlatform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'reddit';

export interface ThreadItem {
  id: string;
  parentId: string | null;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    text: string;
    image: string | null;
    date: Date;
  };
  metrics: {
    likes: string;
    comments?: string;
    reposts?: string;
    views?: string;
  };
  depth?: number;
  isThreadContinuation?: boolean;
}

export interface SocialPostState {
  platform: SocialPlatform;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    text: string;
    image: string | null;
    date: Date;
  };
  metrics: {
    likes: string;
    comments: string;
    reposts: string;
    views: string;
  };
  config: {
    theme: 'light' | 'dark';
    transparentBackground: boolean;
  };
  threadItems: ThreadItem[];
}

const defaultState: SocialPostState = {
  platform: 'twitter',
  author: {
    name: 'Jane Doe',
    handle: 'janedoe',
    avatar: '', // TODO: Add default avatar
    verified: true,
  },
  content: {
    text: 'Just launched my new portfolio! 🚀\n\nCheck it out and let me know what you think. #webdev #design',
    image: null,
    date: new Date(),
  },
  metrics: {
    likes: '1.2K',
    comments: '48',
    reposts: '125',
    views: '15K',
  },
  config: {
    theme: 'light',
    transparentBackground: false,
  },
  threadItems: [],
};

const hydrateState = (): SocialPostState => {
  const saved = localStorage.getItem('veily_social_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Revive dates safely
      if (parsed.content?.date) {
          parsed.content.date = new Date(parsed.content.date);
      }
      // Revive thread dates safely
      if (Array.isArray(parsed.threadItems)) {
        parsed.threadItems = parsed.threadItems.map((item: any) => ({
          ...item,
          content: { 
              ...item.content, 
              date: item.content?.date ? new Date(item.content.date) : new Date() 
          }
        }));
      }
      return { ...defaultState, ...parsed };
    } catch (e) {
      console.error("Failed to parse saved social state", e);
    }
  }
  return defaultState;
};

export const useSocialPostState = () => {
  const [state, setState] = useState<SocialPostState>(hydrateState);

  // Auto-save
  React.useEffect(() => {
    localStorage.setItem('veily_social_state', JSON.stringify(state));
  }, [state]);

  const handleResetState = () => {
    setState(defaultState);
  };

  const setPlatform = (platform: SocialPlatform) => 
    setState(prev => ({ ...prev, platform }));

  const setAuthor = (author: Partial<SocialPostState['author']>) => 
    setState(prev => ({ ...prev, author: { ...prev.author, ...author } }));

  const setContent = (content: Partial<SocialPostState['content']>) => 
    setState(prev => ({ ...prev, content: { ...prev.content, ...content } }));

  const setMetrics = (metrics: Partial<SocialPostState['metrics']>) => 
    setState(prev => ({ ...prev, metrics: { ...prev.metrics, ...metrics } }));

  const setConfig = (config: Partial<SocialPostState['config']>) => 
    setState(prev => ({ ...prev, config: { ...prev.config, ...config } }));

  const setThreadItems = (threadItems: ThreadItem[] | ((prev: ThreadItem[]) => ThreadItem[])) => {
    setState(prev => ({
      ...prev,
      threadItems: typeof threadItems === 'function' ? threadItems(prev.threadItems) : threadItems
    }));
  };

  const loadTemplate = (templateState: SocialPostState) => {
    setState(templateState);
  };

  const randomizeState = () => {
    const indianNames = ["Arjun Mehta", "Priya Sharma", "Rohan Gupta", "Kavya Iyer", "Ananya Singh"];
    const westernNames = ["Alex Rivera", "Sarah Jenkins", "Tyler Smith", "Emma Wilson", "Marcus Chen"];
    
    const scenarios = [
      {
        platform: 'twitter',
        name: "Tech Take (Western)",
        author: { name: "Alex Rivera", handle: "arivera_dev" },
        text: "unpopular opinion: clean code is overrated if you don't ship anything. speed > perfectionism. fight me. 🧵",
        metrics: { likes: "12.4K", comments: "1.2K", reposts: "3.4K", views: "1.1M" }
      },
      {
        platform: 'twitter',
        name: "Indian Cricket",
        author: { name: "Rohan Gupta", handle: "rohan_cricket" },
        text: "Bhai kya catch pakda hai! 😱 Kohli is literally a beast. King for a reason. #INDvsAUS #KingKohli",
        metrics: { likes: "45.7K", comments: "2.1K", reposts: "12.5K", views: "2.8M" }
      },
      {
        platform: 'instagram',
        name: "Travel Aesthetic",
        author: { name: "Emma Wilson", handle: "emma_travels" },
        text: "mornings in bali... 🌴✨ honestly never want to leave. #travel #minimalist",
        metrics: { likes: "8.2K", comments: "142", reposts: "0", views: "0" }
      },
      {
        platform: 'instagram',
        name: "Indian Foodie",
        author: { name: "Kavya Iyer", handle: "kavya_cooks" },
        text: "This butter chicken was actually insane. Best dinner in Delhi ngl. 🍛🔥 #foodie #delhigram",
        metrics: { likes: "15.3K", comments: "312", reposts: "0", views: "0" }
      },
      {
        platform: 'linkedin',
        name: "Corporate Update",
        author: { name: "Sarah Jenkins", handle: "sjenkins-hr" },
        text: "I'm thrilled to share that I've been promoted to Senior Director of People Ops! 🚀 It's been an incredible 5 years at Veily. #career #promotion",
        metrics: { likes: "1,245", comments: "312", reposts: "12", views: "45K" }
      },
      {
        platform: 'reddit',
        name: "Drama/AITA",
        author: { name: "u/throwaway_123", handle: "u/throwaway_123" },
        text: "AITA for telling my brother his wedding was boring? He spent $50k on a venue with no music or dancing.",
        metrics: { likes: "15.7K", comments: "3.2K", reposts: "0", views: "0" }
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    setState(prev => ({
      ...prev,
      platform: scenario.platform as SocialPlatform,
      author: {
        ...prev.author,
        name: scenario.author.name,
        handle: scenario.author.handle,
        avatar: `https://i.pravatar.cc/150?u=${scenario.author.handle}`
      },
      content: {
        ...prev.content,
        text: scenario.text,
        date: new Date()
      },
      metrics: {
        ...prev.metrics,
        ...scenario.metrics
      },
      config: {
        ...prev.config,
        theme: Math.random() > 0.5 ? 'dark' : 'light'
      }
    }));
    
    toast.success(`Randomized: ${scenario.name}`);
  };

  return {
    state,
    setPlatform,
    setAuthor,
    setContent,
    setMetrics,
    setConfig,
    setThreadItems,
    loadTemplate,
    randomizeState,
    handleResetState,
  };
};
