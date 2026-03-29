import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export type CommentPlatform = 'instagram' | 'tiktok' | 'twitter' | 'youtube';

export interface Profile {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    isCreator?: boolean; // To identify the main post author
}

export interface Comment {
    id: string;
    userId: string;
    text: string;
    likes: string;
    timeAgo: string;
    replies: Comment[];
    isLikedByAuthor?: boolean; // Specifically for Instagram/TikTok
    pinned?: boolean;
}

export interface CommentsState {
    platform: CommentPlatform;
    profiles: Profile[];
    comments: Comment[];
    config: {
        theme: 'light' | 'dark';
    };
}

const DEFAULT_AVATAR = "https://github.com/shadcn.png";

const INITIAL_PROFILES: Profile[] = [
    {
        id: 'creator',
        name: 'Content Creator',
        handle: 'contentcreator',
        avatar: DEFAULT_AVATAR,
        verified: true,
        isCreator: true,
    },
    {
        id: 'user1',
        name: 'Alex Thompson',
        handle: 'alexthompson',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        verified: false,
    },
    {
        id: 'user2',
        name: 'Sarah Chen',
        handle: 'sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        verified: false,
    },
];

const INITIAL_COMMENTS: Comment[] = [
    {
        id: 'c1',
        userId: 'user1',
        text: 'This is amazing! Thanks for sharing this content. Really helped me understand the topic better.',
        likes: '245',
        timeAgo: '3h',
        isLikedByAuthor: true,
        replies: [
            {
                id: 'r1',
                userId: 'creator',
                text: 'Thank you so much for the kind words! Glad it helped!',
                likes: '89',
                timeAgo: '2h',
                replies: [],
            }
        ]
    },
    {
        id: 'c2',
        userId: 'user2',
        text: 'Great explanation! Could you make a follow-up video on this topic?',
        likes: '129',
        timeAgo: '5h',
        replies: [],
    }
];

export const useCommentState = () => {
    const [state, setState] = useState<CommentsState>({
        platform: 'instagram',
        profiles: INITIAL_PROFILES,
        comments: INITIAL_COMMENTS,
        config: {
            theme: 'light',
        }
    });

    // Actions
    const setPlatform = (platform: CommentPlatform) =>
        setState(prev => ({ ...prev, platform }));

    const setConfig = (config: Partial<CommentsState['config']>) =>
        setState(prev => ({ ...prev, config: { ...prev.config, ...config } }));

    // Profile Management
    const addProfile = () => {
        const newProfile: Profile = {
            id: uuidv4(),
            name: 'New User',
            handle: 'newuser',
            avatar: DEFAULT_AVATAR,
            verified: false,
        };
        setState(prev => ({ ...prev, profiles: [...prev.profiles, newProfile] }));
    };

    const updateProfile = (id: string, updates: Partial<Profile>) => {
        setState(prev => ({
            ...prev,
            profiles: prev.profiles.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
    };

    const removeProfile = (id: string) => {
        if (state.profiles.length <= 1) return; // Prevent removing last profile
        setState(prev => ({
            ...prev,
            profiles: prev.profiles.filter(p => p.id !== id),
            // Also remove comments by this user? Or reassign? For now, let's keep them but they might break if not handled.
            // Better to filter comments or handle missing profile in UI.
        }));
    };

    // Comment Management
    // Helper to recursively update comments
    const updateCommentRecursive = (comments: Comment[], id: string, updates: Partial<Comment>): Comment[] => {
        return comments.map(comment => {
            if (comment.id === id) {
                return { ...comment, ...updates };
            }
            if (comment.replies.length > 0) {
                return { ...comment, replies: updateCommentRecursive(comment.replies, id, updates) };
            }
            return comment;
        });
    };

    const updateComment = (id: string, updates: Partial<Comment>) => {
        setState(prev => ({
            ...prev,
            comments: updateCommentRecursive(prev.comments, id, updates)
        }));
    };

    const addComment = (parentId?: string) => {
        const newComment: Comment = {
            id: uuidv4(),
            userId: state.profiles[1]?.id || state.profiles[0].id, // Default to second user or creator
            text: 'New comment...',
            likes: '0',
            timeAgo: '1m',
            replies: [],
        };

        if (!parentId) {
            // Add top level
            setState(prev => ({ ...prev, comments: [...prev.comments, newComment] }));
        } else {
            // Add reply
            const addReplyRecursive = (comments: Comment[]): Comment[] => {
                return comments.map(c => {
                    if (c.id === parentId) {
                        return { ...c, replies: [...c.replies, newComment] };
                    }
                    if (c.replies.length > 0) {
                        return { ...c, replies: addReplyRecursive(c.replies) };
                    }
                    return c;
                });
            };
            setState(prev => ({ ...prev, comments: addReplyRecursive(prev.comments) }));
        }
    };

    const deleteComment = (id: string) => {
        const deleteRecursive = (comments: Comment[]): Comment[] => {
            return comments.filter(c => c.id !== id).map(c => ({
                ...c,
                replies: deleteRecursive(c.replies)
            }));
        };

        setState(prev => ({
            ...prev,
            comments: deleteRecursive(prev.comments)
        }));
    };

    const reorderComments = (newComments: Comment[]) => {
        setState(prev => ({ ...prev, comments: newComments }));
    };

    const globalReplaceProfileName = (oldName: string, newName: string) => {
        setState(prev => ({
            ...prev,
            profiles: prev.profiles.map(p => p.name === oldName ? { ...p, name: newName } : p)
        }));
    };

    const handleResetState = () => {
        setState({
            platform: 'instagram',
            profiles: INITIAL_PROFILES,
            comments: INITIAL_COMMENTS,
            config: {
                theme: 'light',
            }
        });
    };

    const loadTemplate = (template: CommentsState) => {
        setState(template);
    };

    const randomizeState = () => {
        const scenarios = [
            {
                platform: 'youtube',
                name: "Tutorial Feedback",
                creator: { name: "Code with Arjun", handle: "@codearjun", avatar: "https://i.pravatar.cc/150?u=codearjun" },
                comments: [
                    { id: 'c1', userId: 'u1', name: "Rahul Singh", text: "bhai best explanation! finally understood how to use promises properly. 🚀", likes: "1.2K", timeAgo: "2h" },
                    { id: 'c2', userId: 'u2', name: "Sarah Miller", text: "Can you do a follow up on async/await? Great video as always!", likes: "450", timeAgo: "5h" }
                ]
            },
            {
                platform: 'instagram',
                name: "Social Hype",
                creator: { name: "Aesthetic Vibes", handle: "asthetic_vibes", avatar: "https://i.pravatar.cc/150?u=aesthetic" },
                comments: [
                    { id: 'c1', userId: 'u3', name: "Priya Sharma", text: "omg where is this dress from?? 😍", likes: "842", timeAgo: "1h", isLikedByAuthor: true },
                    { id: 'c2', userId: 'u4', name: "Jake Wilson", text: "vibes are actually immaculate", likes: "120", timeAgo: "3h" }
                ]
            },
            {
                platform: 'tiktok',
                name: "Viral Trend",
                creator: { name: "Trending Daily", handle: "trending_daily", avatar: "https://i.pravatar.cc/150?u=trending" },
                comments: [
                    { id: 'c1', userId: 'u5', name: "Kavya Iyer", text: "the way my jaw DROPPED 😭😭", likes: "45K", timeAgo: "4h", isLikedByAuthor: true },
                    { id: 'c2', userId: 'u6', name: "Marcus Chen", text: "standard lol", likes: "12K", timeAgo: "6h" }
                ]
            },
            {
                platform: 'twitter',
                name: "Tech Debate",
                creator: { name: "Tech Insider", handle: "techinsider", avatar: "https://i.pravatar.cc/150?u=tech" },
                comments: [
                    { id: 'c1', userId: 'u7', name: "Tyler Smith", text: "ratio + you're wrong + here are the actual stats 📉", likes: "2.4K", timeAgo: "12m" },
                    { id: 'c2', userId: 'u8', name: "Ananya Singh", text: "ngl i saw this coming miles away", likes: "450", timeAgo: "45m" }
                ]
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        const newProfiles: Profile[] = [
            { id: 'creator', ...scenario.creator, verified: true, isCreator: true },
            ...scenario.comments.map(c => ({
                id: c.userId,
                name: c.name,
                handle: c.name.toLowerCase().replace(/\s+/g, ''),
                avatar: `https://i.pravatar.cc/150?u=${c.userId}`,
                verified: Math.random() > 0.8
            }))
        ];

        const newComments: Comment[] = scenario.comments.map(c => ({
            id: c.id,
            userId: c.userId,
            text: c.text,
            likes: c.likes,
            timeAgo: c.timeAgo,
            replies: [],
            isLikedByAuthor: (c as any).isLikedByAuthor || false
        }));

        setState(prev => ({
            ...prev,
            platform: scenario.platform as CommentPlatform,
            profiles: newProfiles,
            comments: newComments,
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
        setConfig,
        addProfile,
        updateProfile,
        removeProfile,
        addComment,
        updateComment,
        deleteComment,
        reorderComments,
        globalReplaceProfileName,
        handleResetState,
        loadTemplate,
        randomizeState,
    };
};
