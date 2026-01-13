import React from 'react';
import { SocialPostState } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatDistanceToNow } from 'date-fns';

interface FacebookPostProps {
    state: SocialPostState;
}

export const FacebookPost: React.FC<FacebookPostProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    return (
        <div className={cn(
            "w-full max-w-[500px] rounded-lg overflow-hidden shadow-sm font-sans",
            isDark ? "bg-[#242526] text-white" : "bg-white text-[#050505] shadow-md border border-gray-200"
        )}>
            {/* Header */}
            <div className="p-3 pb-2 flex gap-2">
                <Avatar className="w-10 h-10 rounded-full">
                    <AvatarImage src={state.author.avatar} className="object-cover" />
                    <AvatarFallback>{state.author.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-[15px] hover:underline cursor-pointer leading-tight">
                                    {state.author.name}
                                </span>
                                {state.author.verified && (
                                    <VerifiedBadge platform="facebook" className="w-3.5 h-3.5 text-blue-500" />
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-[13px] text-gray-500 dark:text-gray-400 leading-tight">
                                <span className="hover:underline cursor-pointer">{formatDistanceToNow(state.content.date)}</span>
                                <span>·</span>
                                <Globe className="w-3 h-3" />
                            </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-3 pb-2 whitespace-pre-wrap text-[15px]">
                {state.content.text}
            </div>

            {/* Image */}
            {state.content.image && (
                <div className="w-full">
                    <img src={state.content.image} alt="Content" className="w-full h-auto object-cover" />
                </div>
            )}

            {/* Stats Line */}
            <div className="px-4 py-2.5 flex items-center justify-between text-[15px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                    <div className="p-1 bg-blue-500 rounded-full">
                        <ThumbsUp className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                    <span>{state.metrics.likes}</span>
                </div>
                <div className="flex gap-3 cursor-pointer">
                    <span className="hover:underline">{state.metrics.comments} comments</span>
                    <span className="hover:underline">{state.metrics.reposts} shares</span>
                </div>
            </div>

            <div className="px-3">
                <div className="h-px bg-gray-200 dark:bg-zinc-700 w-full" />
            </div>

            {/* Action Buttons */}
            <div className="px-1 py-1 flex items-center justify-between">
                <ActionButton icon={ThumbsUp} label="Like" />
                <ActionButton icon={MessageSquare} label="Comment" />
                <ActionButton icon={Share2} label="Share" />
            </div>

        </div>
    );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-400 font-semibold text-[15px] transition-colors flex-1 justify-center">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);
