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

const INITIAL_PROFILES: Profile[] = [
    {
        id: 'creator',
        name: 'Meera Makes',
        handle: 'meeramakes',
        avatar: getAvatarUrl('Meera Makes'),
        verified: false,
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
        name: 'Arjun Menon',
        handle: 'arjunmenon',
        avatar: getAvatarUrl('Arjun Menon'),
        verified: false,
    },
];

const INITIAL_COMMENTS: Comment[] = [
    {
        id: 'c1',
        userId: 'user1',
        text: 'Tried this with the smaller tin and it still baked evenly. Saving the recipe.',
        likes: '84',
        timeAgo: '2h',
        isLikedByAuthor: true,
        replies: [
            {
                id: 'r1',
                userId: 'creator',
                text: 'Good to know. I was worried the centre would stay soft in that size.',
                likes: '18',
                timeAgo: '1h',
                replies: [],
            }
        ]
    },
    {
        id: 'c2',
        userId: 'user2',
        text: 'Would jaggery work here, or will it change the texture too much?',
        likes: '21',
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
            avatar: getAvatarUrl('New User'),
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
        if (state.profiles.length <= 1 || state.profiles.find(profile => profile.id === id)?.isCreator) return;
        const removeUserComments = (comments: Comment[]): Comment[] => comments
            .filter(comment => comment.userId !== id)
            .map(comment => ({ ...comment, replies: removeUserComments(comment.replies) }));
        setState(prev => ({
            ...prev,
            profiles: prev.profiles.filter(p => p.id !== id),
            comments: removeUserComments(prev.comments),
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
            { id: 'creator', ...scenario.creator, handle: scenario.creator.handle.replace(/^@/, ''), avatar: getAvatarUrl(scenario.creator.name), verified: false, isCreator: true },
            ...scenario.comments.map(c => ({
                id: c.userId,
                name: c.name,
                handle: c.name.toLowerCase().replace(/\s+/g, ''),
                avatar: getAvatarUrl(c.name),
                verified: false
            }))
        ];

        const newComments: Comment[] = scenario.comments.map(c => ({
            id: c.id,
            userId: c.userId,
            text: c.text,
            likes: c.likes,
            timeAgo: c.timeAgo,
            replies: [],
            isLikedByAuthor: c.isLikedByAuthor ?? false
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
