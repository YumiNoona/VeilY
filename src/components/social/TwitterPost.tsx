import React from 'react';
import { SocialPostState, ThreadItem } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Heart, MessageCircle, Repeat2, BarChart2, Share, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { format } from 'date-fns';

interface TwitterPostProps {
    state: SocialPostState;
}

export const TwitterPost: React.FC<TwitterPostProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

    const renderActionIcons = () => (
        <div className="flex items-center justify-between mt-3 max-w-[420px]">
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className={cn("p-2 rounded-full group-hover:bg-blue-500/10", isDark ? "text-zinc-500 group-hover:text-blue-400" : "text-gray-500 group-hover:text-blue-500")}>
                    <MessageCircle className="w-[18px] h-[18px]" />
                </div>
                <span className={cn("text-sm", isDark ? "text-zinc-500 group-hover:text-blue-400" : "text-gray-500 group-hover:text-blue-500")}>{state.metrics.comments}</span>
            </div>

            <div className="flex items-center gap-2 group cursor-pointer">
                <div className={cn("p-2 rounded-full group-hover:bg-green-500/10", isDark ? "text-zinc-500 group-hover:text-green-400" : "text-gray-500 group-hover:text-green-500")}>
                    <Repeat2 className="w-[18px] h-[18px]" />
                </div>
                <span className={cn("text-sm", isDark ? "text-zinc-500 group-hover:text-green-400" : "text-gray-500 group-hover:text-green-500")}>{state.metrics.reposts}</span>
            </div>

            <div className="flex items-center gap-2 group cursor-pointer">
                <div className={cn("p-2 rounded-full group-hover:bg-pink-500/10", isDark ? "text-zinc-500 group-hover:text-pink-400" : "text-gray-500 group-hover:text-pink-500")}>
                    <Heart className="w-[18px] h-[18px]" />
                </div>
                <span className={cn("text-sm", isDark ? "text-zinc-500 group-hover:text-pink-400" : "text-gray-500 group-hover:text-pink-500")}>{state.metrics.likes}</span>
            </div>

            <div className="flex items-center gap-2 group cursor-pointer">
                <div className={cn("p-2 rounded-full group-hover:bg-blue-500/10", isDark ? "text-zinc-500 group-hover:text-blue-400" : "text-gray-500 group-hover:text-blue-500")}>
                    <BarChart2 className="w-[18px] h-[18px]" />
                </div>
                <span className={cn("text-sm", isDark ? "text-zinc-500 group-hover:text-blue-400" : "text-gray-500 group-hover:text-blue-500")}>{state.metrics.views}</span>
            </div>

            <div className="flex items-center gap-2 group cursor-pointer">
                <div className={cn("p-2 rounded-full group-hover:bg-blue-500/10", isDark ? "text-zinc-500 group-hover:text-blue-400" : "text-gray-500 group-hover:text-blue-500")}>
                    <Share className="w-[18px] h-[18px]" />
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn(
            "w-full max-w-[600px] border rounded-xl overflow-hidden shadow-sm",
            isDark ? "bg-black border-zinc-800 text-white" : "bg-white border-gray-100 text-black"
        )}>
            <div className="p-4">
                {/* Header */}
                <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={state.author.avatar} className="object-cover" />
                        <AvatarFallback>{state.author.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 overflow-hidden">
                                <span className="font-bold truncate">{state.author.name}</span>
                                {state.author.verified && (
                                    <VerifiedBadge platform="twitter" className="w-[18px] h-[18px]" />
                                )}
                                <span className={cn("truncate", isDark ? "text-zinc-500" : "text-gray-500")}>@{state.author.handle}</span>
                                <span className={cn("text-xs mx-1", isDark ? "text-zinc-500" : "text-gray-500")}>·</span>
                                <span className={cn("text-sm", isDark ? "text-zinc-500" : "text-gray-500")}>
                                    {format(state.content.date, 'MMM d')}
                                </span>
                            </div>
                            <button className={cn("p-1 rounded-full hover:bg-opacity-10", isDark ? "hover:bg-blue-900 text-zinc-500" : "hover:bg-blue-50 text-gray-400")}>
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-1 whitespace-pre-wrap text-[15px] leading-normal">
                            {state.content.text}
                        </div>

                        {/* Image */}
                        {state.content.image && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-opacity-10 border-gray-500">
                                <img src={state.content.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                            </div>
                        )}

                        {/* Footer Metrics */}
                        {renderActionIcons()}
                    </div>
                </div>
            </div>

            {/* Render Thread Items */}
            {state.threadItems.length > 0 && (
                <div className={cn("border-t flex flex-col", isDark ? "border-zinc-800" : "border-gray-100")}>
                    {state.threadItems.map((item, idx) => (
                        <TwitterThreadNode 
                            key={item.id} 
                            item={item} 
                            isDark={isDark} 
                            isLast={idx === state.threadItems.length - 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const TwitterThreadNode = React.memo(({ item, isDark, isLast }: { item: ThreadItem, isDark: boolean, isLast: boolean }) => {
    return (
        <div className={cn("p-4 flex gap-3 relative", !isLast && isDark ? "border-b border-zinc-800" : (!isLast ? "border-b border-gray-100" : ""))}>
            <div className="flex flex-col items-center">
                <Avatar className="w-10 h-10 z-10 bg-background">
                    <AvatarImage src={item.author.avatar} className="object-cover" />
                    <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                </Avatar>
                
                {item.isThreadContinuation && !isLast && (
                    <div className={cn("w-0.5 extend-to-bottom absolute top-14 bottom-0 z-0", isDark ? "bg-zinc-800" : "bg-gray-200")} />
                )}
            </div>
            
            {item.isThreadContinuation && (
                <div className={cn("w-0.5 absolute top-0 bottom-[calc(100%-1rem)] left-9 -translate-x-1/2 z-0", isDark ? "bg-zinc-800" : "bg-gray-200")} />
            )}

            <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 overflow-hidden">
                        <span className="font-bold truncate">{item.author.name}</span>
                        {item.author.verified && (
                            <VerifiedBadge platform="twitter" className="w-[18px] h-[18px]" />
                        )}
                        <span className={cn("truncate", isDark ? "text-zinc-500" : "text-gray-500")}>@{item.author.handle}</span>
                        <span className={cn("text-xs mx-1", isDark ? "text-zinc-500" : "text-gray-500")}>·</span>
                        <span className={cn("text-sm", isDark ? "text-zinc-500" : "text-gray-500")}>
                            {format(item.content.date, 'MMM d')}
                        </span>
                    </div>
                </div>

                <div className="mt-1 whitespace-pre-wrap text-[15px] leading-normal">
                    {item.content.text}
                </div>
                
                {item.content.image && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-opacity-10 border-gray-500">
                        <img src={item.content.image} alt="Thread image" className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                )}

                <div className="flex items-center justify-between mt-3 max-w-[420px]">
                    <div className="flex items-center gap-2 group"><MessageCircle className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-600" : "text-gray-400")} /></div>
                    <div className="flex items-center gap-2 group"><Repeat2 className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-600" : "text-gray-400")} /></div>
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <Heart className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-600" : "text-gray-400")} />
                        {parseInt(item.metrics.likes) > 0 && <span className={cn("text-sm", isDark ? "text-zinc-600" : "text-gray-400")}>{item.metrics.likes}</span>}
                    </div>
                    <div className="flex items-center gap-2 group"><BarChart2 className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-600" : "text-gray-400")} /></div>
                    <div className="flex items-center gap-2 group"><Share className={cn("w-[18px] h-[18px]", isDark ? "text-zinc-600" : "text-gray-400")} /></div>
                </div>
            </div>
        </div>
    );
});
 
