import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { STORIES_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';

export type StoryPlatform = 'instagram' | 'snapchat' | 'whatsapp' | 'messenger';

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
        isTyping: false,
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
        const scenarios = [
            {
                platform: 'instagram',
                username: 'fitness_junkie',
                name: "Gym Session",
                slides: [
                    { imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" }
                ]
            },
            {
                platform: 'instagram',
                username: 'cozy_mornings',
                name: "Morning Coffee",
                slides: [
                    { imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" }
                ]
            },
            {
                platform: 'snapchat',
                username: 'island_hopper',
                name: "Beach Day",
                slides: [
                    { imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80" }
                ]
            },
            {
                platform: 'instagram',
                username: 'city_scout',
                name: "Urban Vibe",
                slides: [
                    { imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" }
                ]
            },
            {
                platform: 'instagram',
                username: 'style_edit',
                name: "Minimal Fashion",
                slides: [
                    { imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80" },
                    { imageUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80" }
                ]
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        setState(prev => ({
            ...prev,
            platform: scenario.platform as StoryPlatform,
            username: scenario.username,
            slides: scenario.slides.map(s => ({ ...s, id: uuidv4() })),
            activeSlideIndex: 0,
            postedAt: new Date().toISOString().slice(0, 16),
            appearance: {
                ...prev.appearance,
                darkMode: Math.random() > 0.5
            }
        }));
        
        toast.success(`Randomized: ${scenario.name}`);
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
