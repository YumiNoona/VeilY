import React from 'react';
import { CommentsState, Comment } from '@/hooks/useCommentState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubeCommentsProps {
    state: CommentsState;
}

export const YouTubeComments: React.FC<YouTubeCommentsProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    const renderComment = (comment: Comment, depth = 0) => {
        const profile = state.profiles.find(p => p.id === comment.userId);
        if (!profile) return null;

        return (
            <div key={comment.id} className="flex gap-4 mb-6 font-sans">
                <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={profile.avatar} className="object-cover" />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 group">
                    <div className="flex items-center gap-1 text-[13px] mb-1">
                        <span className={cn("font-semibold cursor-pointer", isDark ? "text-white" : "text-black", profile.isCreator && "bg-gray-500/20 px-2 rounded-full")}>
                            @{profile.handle}
                        </span>
                        {profile.verified && <VerifiedBadge platform="youtube" className="h-3 w-3" />}
                        <span className="text-gray-500 text-[12px] ml-1">{comment.timeAgo}</span>
                    </div>

                    <div className={cn("text-[14px] leading-relaxed mb-2 whitespace-pre-wrap", isDark ? "text-white" : "text-[#0f0f0f]")}>
                        {comment.text}
                    </div>

                    <div className={cn("flex items-center gap-4 text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="mt-0.5">{comment.likes}</span>
                        </div>
                        <div className="cursor-pointer">
                            <ThumbsDown className="w-4 h-4" />
                        </div>
                        {comment.isLikedByAuthor && (
                            <div className="flex items-center gap-1 ml-2 cursor-pointer relative group/heart">
                                <Avatar className="w-5 h-5 border border-transparent">
                                    <AvatarImage src={state.profiles.find(p => p.isCreator)?.avatar} className="object-cover" />
                                    <AvatarFallback>C</AvatarFallback>
                                </Avatar>
                                <div className={cn("absolute -bottom-1 -right-1 rounded-full border bg-red-500 p-px", isDark ? "border-[#0f0f0f]" : "border-white")}>
                                    <HeartIconFilled className="w-2 h-2 text-white fill-current" />
                                </div>
                            </div>
                        )}
                        <span className={cn("cursor-pointer rounded-full px-3 py-2 font-semibold", isDark ? "hover:bg-zinc-800" : "hover:bg-gray-100")}>Reply</span>
                    </div>

                    {comment.replies.length > 0 && (
                        <div className="mt-2">
                            <div className={cn("mb-2 flex w-fit cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold", isDark ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-600 hover:bg-blue-50")}>
                                <span className="rotate-180">▼</span>
                                {comment.replies.length} replies
                            </div>
                            {comment.replies.map(reply => (
                                <div className="pl-0 ml-0" key={reply.id}>
                                    {renderComment(reply, depth + 1)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <MoreVertical className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
            </div>
        );
    };

    return (
        <div className={cn(
            "w-full max-w-[800px] p-4 font-sans min-h-[500px]",
            isDark ? "bg-[#0f0f0f] text-white" : "bg-white text-[#0f0f0f]"
        )}>
            <div className="flex items-center gap-8 mb-6">
                <span className="text-xl font-bold">{state.comments.length} {state.comments.length === 1 ? 'Comment' : 'Comments'}</span>
                <div className="flex items-center gap-2 cursor-pointer">
                    <span className="font-semibold text-sm">Sort by</span>
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={state.profiles[0].avatar} className="object-cover" />
                    <AvatarFallback>{state.profiles[0].name[0]}</AvatarFallback>
                </Avatar>
                <div className={cn("flex-1 border-b pb-2 text-sm text-gray-500", isDark ? "border-zinc-700" : "border-gray-200")}>
                    Add a comment...
                </div>
            </div>

            {state.comments.map(c => renderComment(c))}
        </div>
    );
};

// Simple SVG for Heart Filled
const HeartIconFilled: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);
