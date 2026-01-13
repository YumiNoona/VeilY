import React from 'react';
import { CommentsState, Comment } from '@/hooks/useCommentState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TikTokCommentsProps {
    state: CommentsState;
}

export const TikTokComments: React.FC<TikTokCommentsProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    const renderComment = (comment: Comment, depth = 0) => {
        const profile = state.profiles.find(p => p.id === comment.userId);
        if (!profile) return null;

        return (
            <div key={comment.id} className="flex gap-3 mb-5 font-sans">
                <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={profile.avatar} className="object-cover" />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[13px] text-gray-500 dark:text-gray-400 block mb-0.5">
                        {profile.name}
                        {profile.verified && <VerifiedBadge platform="instagram" className="w-3 h-3 inline ml-1 align-text-top text-[#20D5EC]" />}
                        {/* TikTok verified often cyan/blue check */}
                    </span>

                    <div className="text-[15px] leading-tight mb-1 text-foreground">
                        {comment.text}
                    </div>

                    <div className="flex items-center gap-4 text-[13px] text-gray-500">
                        <span>{comment.timeAgo}</span>
                        <span className="font-semibold cursor-pointer text-gray-400">Reply</span>
                    </div>

                    {/* Creator Liked Badge */}
                    {comment.isLikedByAuthor && (
                        <div className="flex items-center gap-1 mt-2 bg-gray-100 dark:bg-zinc-800/50 rounded-lg py-1 px-2 w-fit">
                            <Avatar className="w-4 h-4">
                                <AvatarImage src={state.profiles.find(p => p.isCreator)?.avatar || ""} className="object-cover" />
                                <AvatarFallback>C</AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] text-gray-500">Liked by creator</span>
                        </div>
                    )}

                    {comment.replies.length > 0 && (
                        <div className="mt-3 pl-0">
                            <div className="flex items-center gap-2 mb-3 cursor-pointer">
                                <div className="w-6 h-[1px] bg-gray-300 dark:bg-zinc-700"></div>
                                <span className="text-[13px] text-gray-500 font-semibold">View replies ({comment.replies.length})</span>
                            </div>
                            {comment.replies.map(reply => renderComment(reply, depth + 1))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-1 pt-2">
                    <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer" />
                    <span className="text-[12px] text-gray-400">{comment.likes}</span>
                </div>
            </div>
        );
    };

    return (
        <div className={cn(
            "w-full max-w-[400px] h-[600px] border rounded-xl overflow-hidden shadow-sm relative",
            isDark ? "bg-[#121212] border-zinc-800 text-white" : "bg-white border-gray-200 text-black"
        )}>
            {/* Header */}
            <div className="p-4 text-center border-b border-gray-100 dark:border-zinc-800 font-bold text-[15px]">
                Comments
                <span className="ml-2 text-sm font-normal text-gray-500">{state.comments.length}</span>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
                {state.comments.map(c => renderComment(c))}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 w-full p-3 border-t border-gray-100 dark:border-zinc-800 bg-background flex items-center gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={state.profiles[0].avatar} className="object-cover" />
                    <AvatarFallback>{state.profiles[0].name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full h-10 px-4 flex items-center text-sm text-gray-500">
                    Add comment...
                </div>
            </div>
        </div>
    );
};
