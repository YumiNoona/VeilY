import React from 'react';
import { SocialPostState } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatDistanceToNow } from 'date-fns';

interface InstagramPostProps {
    state: SocialPostState;
}

export const InstagramPost: React.FC<InstagramPostProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    return (
        <div className={cn(
            "w-full max-w-[400px] border rounded-xl overflow-hidden shadow-sm font-sans",
            isDark ? "bg-black border-zinc-800 text-white" : "bg-white border-gray-200 text-black"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] rounded-full">
                        <Avatar className={cn("w-8 h-8 ring-2", isDark ? "ring-black" : "ring-white")}>
                            <AvatarImage src={state.author.avatar} className="object-cover" />
                            <AvatarFallback>{state.author.name[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex flex-col -gap-1">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-sm">{state.author.handle}</span>
                            {state.author.verified && (
                                <VerifiedBadge platform="instagram" className="w-3 h-3" />
                            )}
                        </div>
                        {/* Instagram doesn't typically show subtext here but could perform location */}
                    </div>
                </div>
                <MoreHorizontal className="w-5 h-5" />
            </div>

            {/* Image */}
            <div className="bg-gray-100 dark:bg-zinc-900 aspect-square w-full flex items-center justify-center overflow-hidden">
                {state.content.image ? (
                    <img src={state.content.image} alt="Post content" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-muted-foreground text-sm">No image</span>
                )}
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <Heart className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors" />
                        <MessageCircle className="w-6 h-6 -rotate-90 hover:text-gray-500 cursor-pointer transition-colors" />
                        <Send className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors" />
                    </div>
                    <Bookmark className="w-6 h-6 hover:text-gray-500 cursor-pointer transition-colors" />
                </div>

                {/* Likes */}
                <div className="font-semibold text-sm mb-2">{state.metrics.likes} likes</div>

                {/* Caption */}
                <div className="text-sm mb-2">
                    <span className="font-semibold mr-2">{state.author.handle}</span>
                    <span className="whitespace-pre-wrap">{state.content.text}</span>
                </div>

                {/* Comments */}
                <div className="text-xs text-gray-500 mb-2 cursor-pointer">
                    View all {state.metrics.comments} comments
                </div>

                {/* Date */}
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                    {formatDistanceToNow(state.content.date)} ago
                </div>
            </div>
        </div>
    );
};
