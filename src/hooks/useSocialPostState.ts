import React, { useState } from 'react';

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
    setState(prev => {
        const newLikes = Math.floor(Math.random() * 50000) + 100;
        const newComments = Math.floor(newLikes * (Math.random() * 0.1));
        const newReposts = Math.floor(newLikes * (Math.random() * 0.2));
        const newViews = newLikes * Math.floor(Math.random() * 10 + 5);

        const names = ["Alex Rivera", "Jordan Lee", "Sam Taylor", "Casey Smith", "Taylor Swift", "Elon Musk", "Tech Insider", "Daily Memes", "Startup Guru", "Fitness Freak"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomHandle = randomName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 999);

        const randomizedThreads = prev.threadItems.map(item => {
            const threadLikes = Math.floor(Math.random() * Math.max(10, newLikes * 0.15));
            return {
                ...item,
                metrics: {
                    ...item.metrics,
                    likes: threadLikes >= 1000 ? (threadLikes / 1000).toFixed(1) + 'K' : String(threadLikes)
                }
            };
        });

        return {
            ...prev,
            author: { ...prev.author, name: randomName, handle: randomHandle },
            metrics: {
                ...prev.metrics,
                likes: newLikes >= 1000 ? (newLikes / 1000).toFixed(1) + 'K' : String(newLikes),
                comments: newComments >= 1000 ? (newComments / 1000).toFixed(1) + 'K' : String(newComments),
                reposts: newReposts >= 1000 ? (newReposts / 1000).toFixed(1) + 'K' : String(newReposts),
                views: newViews >= 1000000 ? (newViews / 1000000).toFixed(1) + 'M' : (newViews >= 1000 ? (newViews / 1000).toFixed(1) + 'K' : String(newViews))
            },
            threadItems: randomizedThreads
        };
    });
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
