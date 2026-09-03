import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { socialScenarios } from './scenarios/social';
import { getAvatarUrl } from '@/lib/avatar-utils';

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
    name: 'Neha Kulkarni',
    handle: 'nehakulkarni',
    avatar: getAvatarUrl('Neha Kulkarni'),
    verified: false,
  },
  content: {
    text: "The first rain after a week of heat. Pune needed this.",
    image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1200&h=900&fit=crop',
    date: new Date(),
  },
  metrics: {
    likes: '184',
    comments: '12',
    reposts: '9',
    views: '6.8K',
  },
  config: {
    theme: 'light',
    transparentBackground: true,
  },
  threadItems: [],
};

const hydrateState = (): SocialPostState => {
  try {
    const saved = localStorage.getItem('veily_social_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.content?.text?.includes("designers if you haven't tried Veily")) {
        return defaultState;
      }
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
    }
  } catch (error) {
    console.warn('Unable to restore social post settings:', error);
  }
  return defaultState;
};

export const useSocialPostState = () => {
  const [state, setState] = useState<SocialPostState>(hydrateState);

  // Auto-save
  React.useEffect(() => {
    const persistableState: SocialPostState = {
      ...state,
      content: {
        ...state.content,
        image: state.content.image?.startsWith('data:') ? null : state.content.image,
      },
      threadItems: state.threadItems.map(item => ({
        ...item,
        content: {
          ...item.content,
          image: item.content.image?.startsWith('data:') ? null : item.content.image,
        },
      })),
    };

    try {
      localStorage.setItem('veily_social_state', JSON.stringify(persistableState));
    } catch (error) {
      console.warn('Unable to persist social post settings:', error);
    }
  }, [state]);

  const handleResetState = () => {
    setState(defaultState);
  };

  const setPlatform = useCallback((platform: SocialPlatform) =>
    setState(prev => prev.platform === platform ? prev : ({ ...prev, platform })), []);

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
    const scenario = socialScenarios[Math.floor(Math.random() * socialScenarios.length)];
    
    setState(prev => ({
      ...prev,
      platform: scenario.platform as SocialPlatform,
      author: {
        name: scenario.author.name,
        handle: scenario.author.handle,
        avatar: getAvatarUrl(scenario.author.name),
        verified: false,
      },
      content: {
        text: scenario.text,
        image: scenario.image ?? null,
        date: new Date()
      },
      metrics: {
        ...prev.metrics,
        ...scenario.metrics
      },
      config: {
        ...prev.config,
        theme: Math.random() > 0.5 ? 'dark' : 'light'
      },
      threadItems: [],
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
