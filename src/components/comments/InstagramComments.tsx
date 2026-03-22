import React from 'react';
import { CommentsState, Comment } from '@/hooks/useCommentState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstagramCommentsProps {
    state: CommentsState;
}

export const InstagramComments: React.FC<InstagramCommentsProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    const renderComment = (comment: Comment, depth = 0) => {
        const profile = state.profiles.find(p => p.id === comment.userId);
        if (!profile) return null;

        return (
            <div key={comment.id} className="flex gap-3 mb-4 last:mb-0">
                <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={profile.avatar} className="object-cover" />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-start justify-between">
                        <div className="text-[14px] leading-[18px]">
                            <span className="font-semibold mr-2 inline-flex items-center gap-1">
                                {profile.handle}
                                {profile.verified && <VerifiedBadge platform="instagram" className="w-3 h-3" />}
                            </span>
                            <span className="">{comment.text}</span>
                        </div>
                        <div className="ml-4 flex flex-col items-center gap-1">
                            <Heart className="w-3 h-3 text-gray-400 hover:text-gray-500 cursor-pointer" />
                            {parseInt(comment.likes) > 0 && (
                                <span className="text-[10px] text-gray-500">{comment.likes}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-1">
                        <span>{comment.timeAgo}</span>
                        {parseInt(comment.likes) > 0 && <span className="font-semibold cursor-pointer">Like</span>}
                        <span className="font-semibold cursor-pointer">Reply</span>
                    </div>

                    {comment.isLikedByAuthor && (
                        <div className="flex items-center gap-2 mt-2">
                            <div className="relative">
                                <Avatar className="w-4 h-4">
                                    <AvatarImage src={state.profiles.find(p => p.isCreator)?.avatar} className="object-cover" />
                                    <AvatarFallback>C</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-[1px] border border-background">
                                    <Heart className="w-2 h-2 text-white fill-white" />
                                </div>
                            </div>
                            <span className="text-[11px] text-gray-500">Liked by author</span>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                        <div className="mt-4 pl-0">
                            <div className="flex items-center gap-2 mb-3 cursor-pointer">
                                <div className="w-8 h-[1px] bg-gray-300 dark:bg-zinc-700"></div>
                                <span className="text-[12px] text-gray-500 font-semibold">View replies ({comment.replies.length})</span>
                            </div>
                            {/* In real insta, replies are nested but aligned differently. For mockup, simply indenting slightly or just listing them works well */}
                            {comment.replies.map(reply => renderComment(reply, depth + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={cn(
            "w-full max-w-[400px] border rounded-xl overflow-hidden shadow-sm bg-white font-sans",
            isDark ? "bg-black border-none text-white" : "border-gray-200 text-black"
        )}>
            {/* Mock Header for Context */}
            <div className="p-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-center relative">
                <div className="w-10 h-1 bg-gray-300 rounded-full absolute top-2"></div>
                <span className="font-semibold text-sm mt-3">Comments</span>
            </div>

            <div className="p-4 min-h-[400px]">
                {state.comments.map(c => renderComment(c))}
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={state.profiles[0].avatar} className="object-cover" />
                    <AvatarFallback>{state.profiles[0].name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm text-gray-500">Add a comment...</div>
            </div>
        </div>
    );
};
