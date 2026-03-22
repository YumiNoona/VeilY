import React from 'react';
import { CommentsState, Comment } from '@/hooks/useCommentState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TwitterCommentsProps {
    state: CommentsState;
}

export const TwitterComments: React.FC<TwitterCommentsProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    const renderComment = (comment: Comment, depth = 0) => {
        const profile = state.profiles.find(p => p.id === comment.userId);
        if (!profile) return null;

        return (
            <div key={comment.id} className={cn("flex gap-3 px-4 py-3 border-b", isDark ? "border-zinc-800" : "border-gray-100")}>
                <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={profile.avatar} className="object-cover" />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[15px]">
                        <span className="font-bold text-foreground truncate">{profile.name}</span>
                        {profile.verified && <VerifiedBadge platform="twitter" className="w-[18px] h-[18px]" />}
                        <span className="text-muted-foreground truncate">@{profile.handle}</span>
                        <span className="text-muted-foreground mx-1">·</span>
                        <span className="text-muted-foreground">{comment.timeAgo}</span>
                    </div>

                    <div className="mt-0.5 text-[15px] whitespace-pre-wrap leading-normal text-foreground">
                        {comment.text}
                    </div>

                    <div className="flex items-center justify-between mt-3 max-w-[350px]">
                        <div className="flex items-center gap-2 group cursor-pointer text-muted-foreground hover:text-blue-500">
                            <MessageCircle className="w-[18px] h-[18px] group-hover:bg-blue-500/10 rounded-full p-[-2px]" />
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer text-muted-foreground hover:text-green-500">
                            <Repeat2 className="w-[18px] h-[18px]" />
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer text-muted-foreground hover:text-pink-500">
                            <Heart className="w-[18px] h-[18px]" />
                            {parseInt(comment.likes) > 0 && <span className="text-xs">{comment.likes}</span>}
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer text-muted-foreground hover:text-blue-500">
                            <Share className="w-[18px] h-[18px]" />
                        </div>
                    </div>

                    {/* Replies can be rendered below if needed, but Twitter usually links them. For nested view: */}
                    {comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map(reply => renderComment(reply, depth + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={cn(
            "w-full max-w-[600px] border rounded-xl overflow-hidden shadow-sm font-sans",
            isDark ? "bg-black border-zinc-800 text-white" : "bg-white border-gray-100 text-black"
        )}>
            {state.comments.map(c => renderComment(c))}
        </div>
    );
};
