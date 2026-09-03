import React from 'react';
import { SocialPostState } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe } from 'lucide-react';
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
                            <div className={cn("flex items-center gap-1 text-[15px] leading-tight", isDark ? "text-gray-400" : "text-gray-500")}>
                                <span className="hover:underline cursor-pointer">{formatDistanceToNow(state.content.date)}</span>
                                <span>·</span>
                                <Globe className="w-3 h-3" />
                            </div>
                        </div>
                        <button className={cn("rounded-full p-2 transition-colors", isDark ? "hover:bg-zinc-700" : "hover:bg-gray-100")}>
                            <MoreHorizontal className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-gray-500")} />
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
            <div className={cn("flex items-center justify-between px-4 py-2.5 text-[15px]", isDark ? "text-gray-400" : "text-gray-500")}>
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
                <div className={cn("h-px w-full", isDark ? "bg-zinc-700" : "bg-gray-200")} />
            </div>

            {/* Action Buttons */}
            <div className="px-1 py-1 flex items-center justify-between">
                <ActionButton icon={ThumbsUp} label="Like" isDark={isDark} />
                <ActionButton icon={MessageSquare} label="Comment" isDark={isDark} />
                <ActionButton icon={Share2} label="Share" isDark={isDark} />
            </div>

        </div>
    );
};

const ActionButton = ({ icon: Icon, label, isDark }: { icon: React.ElementType, label: string, isDark: boolean }) => (
    <button className={cn("flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-[15px] font-semibold transition-colors", isDark ? "text-gray-300 hover:bg-zinc-700" : "text-gray-600 hover:bg-gray-100")}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);
