import { useState } from 'react';

export type SocialPlatform = 'twitter' | 'instagram' | 'linkedin' | 'facebook';

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
    reposts: string; // Twitter/LinkedIn specific
    views: string;   // Twitter specific
  };
  config: {
    theme: 'light' | 'dark';
    transparentBackground: boolean;
    showWatermark: boolean;
  };
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
    showWatermark: true,
  },
};

export const useSocialPostState = () => {
  const [state, setState] = useState<SocialPostState>(defaultState);

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

  return {
    state,
    setPlatform,
    setAuthor,
    setContent,
    setMetrics,
    setConfig,
  };
};
