import React from 'react';
import { SocialPostState } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Repeat, Send, MoreHorizontal, Globe, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatDistanceToNow } from 'date-fns';

interface LinkedInPostProps {
    state: SocialPostState;
}

export const LinkedInPost: React.FC<LinkedInPostProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    return (
        <div className={cn(
            "w-full max-w-[550px] border rounded-lg overflow-hidden shadow-sm font-sans",
            isDark ? "bg-[#1b1f23] border-zinc-700 text-white" : "bg-white border-gray-200 text-black"
        )}>
            {/* Header */}
            <div className="p-3 pb-2 flex gap-3">
                <Avatar className="w-12 h-12 rounded-full">
                    <AvatarImage src={state.author.avatar} className="object-cover" />
                    <AvatarFallback>{state.author.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-sm hover:underline hover:text-blue-600 cursor-pointer">
                                    {state.author.name}
                                </span>
                                {state.author.verified && (
                                    <VerifiedBadge platform="linkedin" className="w-3.5 h-3.5 ml-1" />
                                )}
                            </div>
                            <div className="text-xs text-gray-500 truncate">Product Designer at Tech Co.</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>{formatDistanceToNow(state.content.date)}</span>
                                <span>•</span>
                                <Globe className="w-3 h-3" />
                            </div>
                        </div>
                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-3 pb-2 whitespace-pre-wrap text-sm">
                {state.content.text}
            </div>

            {/* Image */}
            {state.content.image && (
                <div className="w-full">
                    <img src={state.content.image} alt="Content" className="w-full h-auto object-cover" />
                </div>
            )}

            {/* Stats Line */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <ThumbsUp className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <Heart className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                    </div>
                    <span>{state.metrics.likes}</span>
                </div>
                <div className="flex gap-2">
                    <span>{state.metrics.comments} comments</span>
                    <span>•</span>
                    <span>{state.metrics.reposts} reposts</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-between">
                <ActionButton icon={ThumbsUp} label="Like" />
                <ActionButton icon={MessageSquare} label="Comment" />
                <ActionButton icon={Repeat} label="Repost" />
                <ActionButton icon={Send} label="Send" />
            </div>

        </div>
    );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button className="flex items-center gap-1.5 px-3 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 font-semibold text-sm transition-colors flex-1 justify-center">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);
