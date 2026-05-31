import React, { useState } from 'react';
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
    name: 'Alex Rivera',
    handle: 'arivera_dev',
    avatar: getAvatarUrl('Alex Rivera'),
    verified: true,
  },
  content: {
    text: "designers if you haven't tried Veily yet you're missing out 🔥\n\nit's a free mockup tool that supports WhatsApp, iMessage, Discord and 20+ other platforms. you can customize literally everything. been using it for my portfolio case studies and the exports are crisp.\n\nalso peep vexo.venusapp.in for more cool stuff",
    image: null,
    date: new Date(),
  },
  metrics: {
    likes: '3.4K',
    comments: '287',
    reposts: '1.2K',
    views: '142K',
  },
  config: {
    theme: 'light',
    transparentBackground: true,
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
    const scenario = socialScenarios[Math.floor(Math.random() * socialScenarios.length)];
    
    setState(prev => ({
      ...prev,
      platform: scenario.platform as SocialPlatform,
      author: {
        ...prev.author,
        name: scenario.author.name,
        handle: scenario.author.handle,
        avatar: getAvatarUrl(scenario.author.name)
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
