import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { STORIES_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';

export type StoryPlatform = 'instagram' | 'snapchat';

export interface StorySlide {
    id: string;
    imageUrl: string | null; // null = no image
}

export interface StoriesState {
    platform: StoryPlatform;
    username: string;
    verified: boolean;
    timeAgo: string;
    slides: StorySlide[];
    activeSlideIndex: number;
    postedAt: string;
    appearance: AppearanceSettings;
}

const defaultSlide = (): StorySlide => ({ id: uuidv4(), imageUrl: null });

const INITIAL_STATE: StoriesState = {
    platform: 'instagram',
    username: 'username',
    verified: false,
    timeAgo: '3 months',
    slides: [defaultSlide()],
    activeSlideIndex: 0,
    postedAt: new Date().toISOString().slice(0, 16),
    appearance: {
        darkMode: false,
        showTimestamps: true,
        showStatus: true,
        use24HourFormat: false,
        showDeviceStatusBar: true,
        showDeviceFrame: true,
        statusBarTime: '9:41',
        batteryLevel: 100,
        transparentBackground: false,
    },
};

export const useStoriesState = () => {
    const [state, setState] = useState<StoriesState>(INITIAL_STATE);

    const setPlatform = (platform: StoryPlatform) =>
        setState(prev => ({ ...prev, platform }));

    const setUsername = (username: string) =>
        setState(prev => ({ ...prev, username }));

    const setVerified = (verified: boolean) =>
        setState(prev => ({ ...prev, verified }));

    const setTimeAgo = (timeAgo: string) =>
        setState(prev => ({ ...prev, timeAgo }));

    const setPostedAt = (postedAt: string) =>
        setState(prev => ({ ...prev, postedAt }));

    const setActiveSlide = (index: number) =>
        setState(prev => ({ ...prev, activeSlideIndex: index }));

    const addSlide = () => {
        setState(prev => ({
            ...prev,
            slides: [...prev.slides, defaultSlide()],
            activeSlideIndex: prev.slides.length,
        }));
    };

    const updateSlideImage = (index: number, imageUrl: string | null) => {
        setState(prev => ({
            ...prev,
            slides: prev.slides.map((s, i) => i === index ? { ...s, imageUrl } : s),
        }));
    };

    const removeSlide = (index: number) => {
        if (state.slides.length <= 1) return;
        setState(prev => {
            const slides = prev.slides.filter((_, i) => i !== index);
            return {
                ...prev,
                slides,
                activeSlideIndex: Math.min(prev.activeSlideIndex, slides.length - 1),
            };
        });
    };

    const setAppearance = (updates: Partial<StoriesState['appearance']>) =>
        setState(prev => ({ ...prev, appearance: { ...prev.appearance, ...updates } }));

    const handleReset = () => setState(INITIAL_STATE);

    const loadTemplate = (template: Partial<StoriesState>) => {
        setState(prev => ({
            ...prev,
            ...template,
            slides: template.slides?.map(s => ({ ...s, id: uuidv4() })) || prev.slides,
            appearance: { ...prev.appearance, ...(template.appearance || {}) }
        }));
    };

    const randomizeState = () => {
        const templates = Object.values(STORIES_TEMPLATES);
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        loadTemplate(randomTemplate);
    };

    return {
        state,
        setPlatform,
        setUsername,
        setVerified,
        setTimeAgo,
        setPostedAt,
        setActiveSlide,
        addSlide,
        updateSlideImage,
        removeSlide,
        setAppearance,
        handleReset,
        loadTemplate,
        randomizeState,
    };
};
