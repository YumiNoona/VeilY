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
                    <span className={cn("mb-0.5 block text-[13px] font-semibold", isDark ? "text-gray-400" : "text-gray-500")}>
                        {profile.name}
                        {profile.verified && <VerifiedBadge platform="tiktok" className="ml-1 inline h-3 w-3 align-text-top" />}
                    </span>

                    <div className={cn("mb-1 text-[15px] leading-snug", isDark ? "text-white" : "text-[#161823]")}>
                        {comment.text}
                    </div>

                    <div className="flex items-center gap-4 text-[13px] text-gray-500">
                        <span>{comment.timeAgo}</span>
                        <span className="font-semibold cursor-pointer text-gray-400">Reply</span>
                    </div>

                    {/* Creator Liked Badge */}
                    {comment.isLikedByAuthor && (
                        <div className={cn("mt-2 flex w-fit items-center gap-1 rounded-lg px-2 py-1", isDark ? "bg-white/10" : "bg-gray-100")}>
                            <Avatar className="w-4 h-4">
                                <AvatarImage src={state.profiles.find(p => p.isCreator)?.avatar || ""} className="object-cover" />
                                <AvatarFallback>C</AvatarFallback>
                            </Avatar>
                            <span className={cn("text-xs", isDark ? "text-zinc-300" : "text-gray-500")}>Liked by creator</span>
                        </div>
                    )}

                    {comment.replies.length > 0 && (
                        <div className="mt-3 pl-0">
                            <div className="flex items-center gap-2 mb-3 cursor-pointer">
                                <div className={cn("h-px w-6", isDark ? "bg-zinc-700" : "bg-gray-300")}></div>
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
            <div className={cn("border-b p-4 text-center text-[15px] font-bold", isDark ? "border-zinc-800" : "border-gray-100")}>
                Comments
                <span className="ml-2 text-sm font-normal text-gray-500">{state.comments.length}</span>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
                {state.comments.map(c => renderComment(c))}
            </div>

            {/* Input Area */}
            <div className={cn("absolute bottom-0 flex w-full items-center gap-3 border-t p-3", isDark ? "border-zinc-800 bg-[#121212]" : "border-gray-100 bg-white")}>
                <Avatar className="w-8 h-8">
                    <AvatarImage src={state.profiles[0].avatar} className="object-cover" />
                    <AvatarFallback>{state.profiles[0].name[0]}</AvatarFallback>
                </Avatar>
                <div className={cn("flex h-10 flex-1 items-center rounded-full px-4 text-sm text-gray-500", isDark ? "bg-zinc-800" : "bg-gray-100")}>
                    Add comment...
                </div>
            </div>
        </div>
    );
};
