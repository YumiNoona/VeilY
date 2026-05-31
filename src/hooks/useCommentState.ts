import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAvatarUrl } from '@/lib/avatar-utils';
import { toast } from 'sonner';
import { commentScenarios } from './scenarios/comments';

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
        name: 'Veily Official',
        handle: 'veily_app',
        avatar: DEFAULT_AVATAR,
        verified: true,
        isCreator: true,
    },
    {
        id: 'user1',
        name: 'Priya Sharma',
        handle: 'priyasharma',
        avatar: getAvatarUrl('Priya Sharma'),
        verified: false,
    },
    {
        id: 'user2',
        name: 'Marcus Chen',
        handle: 'marcuschen',
        avatar: getAvatarUrl('Marcus Chen'),
        verified: false,
    },
];

const INITIAL_COMMENTS: Comment[] = [
    {
        id: 'c1',
        userId: 'user1',
        text: 'been using Veily for my design portfolio for 3 months now and its honestly the best mockup tool out there. the AI chat templates are insane 🔥',
        likes: '847',
        timeAgo: '2h',
        isLikedByAuthor: true,
        replies: [
            {
                id: 'r1',
                userId: 'creator',
                text: 'Thank you so much Priya! Really glad you are enjoying it. Have you checked out vexo.venusapp.in too?',
                likes: '234',
                timeAgo: '1h',
                replies: [],
            }
        ]
    },
    {
        id: 'c2',
        userId: 'user2',
        text: 'ok but can we talk about how clean the UI is? and its completely free?? whoever made this deserves a raise',
        likes: '512',
        timeAgo: '4h',
        isLikedByAuthor: false,
        replies: [],
    },
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
        avatar: getAvatarUrl('Veily Official'),
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
        const scenario = commentScenarios[Math.floor(Math.random() * commentScenarios.length)];
        
        const newProfiles: Profile[] = [
            { id: 'creator', ...scenario.creator, avatar: getAvatarUrl(scenario.creator.name), verified: true, isCreator: true },
            ...scenario.comments.map(c => ({
                id: c.userId,
                name: c.name,
                handle: c.name.toLowerCase().replace(/\s+/g, ''),
                avatar: getAvatarUrl(c.name),
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
