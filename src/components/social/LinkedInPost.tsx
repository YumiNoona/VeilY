import React from 'react';
import { SocialPostState, ThreadItem } from '@/hooks/useSocialPostState';
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

    const buildCommentTree = (items: ThreadItem[], parentId: string | null = null): ThreadItem[] => {
        return items
            .filter(item => item.parentId === parentId)
            .map(item => ({
                ...item,
                children: buildCommentTree(items, item.id)
            }));
    };

    const tree = buildCommentTree(state.threadItems, null);

    return (
        <div className={cn(
            "w-full max-w-[550px] border rounded-lg overflow-hidden shadow-sm font-sans flex flex-col",
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
                            <div className="text-xs text-gray-500 truncate">{state.author.handle || "Professional"}</div>
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

            {/* Content Text */}
            <div className="px-4 pt-1 pb-3 whitespace-pre-wrap text-[14px] leading-snug">
                {state.content.text}
            </div>

            {/* Image */}
            {state.content.image && (
                <div className="w-full bg-gray-100 dark:bg-[#1b1f23]">
                    <img src={state.content.image} alt="Content" className="w-full h-auto object-contain max-h-[500px]" />
                </div>
            )}

            {/* Stats Line */}
            <div className="px-4 py-2 flex items-center justify-between text-[12px] text-gray-500 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white dark:border-zinc-800 z-10">
                            <ThumbsUp className="w-2.5 h-2.5 text-white fill-current mt-[-1px]" />
                        </div>
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-white dark:border-zinc-800">
                            <Heart className="w-2.5 h-2.5 text-white fill-current mt-[-1px]" />
                        </div>
                    </div>
                    <span className="ml-1">{state.metrics.likes}</span>
                </div>
                <div className="flex gap-2 hover:underline cursor-pointer">
                    <span>{state.metrics.comments} comments</span>
                    <span>•</span>
                    <span>{state.metrics.reposts} reposts</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-between mx-2">
                <ActionButton icon={ThumbsUp} label="Like" isDark={isDark} />
                <ActionButton icon={MessageSquare} label="Comment" isDark={isDark} />
                <ActionButton icon={Repeat} label="Repost" isDark={isDark} />
                <ActionButton icon={Send} label="Send" isDark={isDark} />
            </div>

            {/* Comments Section */}
            {tree.length > 0 && (
                <div className={cn("px-4 pb-4 pt-2 border-t", isDark ? "border-zinc-800 bg-[#1b1f23]" : "border-gray-100 bg-gray-50/50")}>
                    {tree.map(comment => <LinkedInComment key={comment.id} item={comment} isDark={isDark} depth={0} items={state.threadItems} />)}
                </div>
            )}
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, isDark }: { icon: any, label: string, isDark: boolean }) => (
    <button className={cn(
        "flex items-center gap-1.5 px-3 py-3 rounded-md font-semibold text-[14px] transition-colors flex-1 justify-center relative shadow-none border-0",
        isDark ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-100/80 text-gray-600"
    )}>
        <Icon className="w-[22px] h-[22px]" />
        <span>{label}</span>
    </button>
);

const LinkedInComment = ({ item, isDark, depth, items }: { item: ThreadItem & { children?: ThreadItem[] }, isDark: boolean, depth: number, items: ThreadItem[] }) => {
    return (
        <div className={cn("flex gap-2", depth > 0 ? "mt-2 ml-10" : "mt-3")}>
            <Avatar className="w-8 h-8 rounded-full shrink-0">
                <AvatarImage src={item.author.avatar} className="object-cover" />
                <AvatarFallback>{item.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className={cn("rounded-r-[8px] rounded-bl-[8px] p-2 px-3 text-[14px] flex flex-col", isDark ? "bg-zinc-800" : "bg-gray-100")}>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <span className={cn("font-semibold mr-1 hover:underline hover:text-blue-600 cursor-pointer", isDark ? "text-zinc-100" : "text-gray-900")}>
                                    {item.author.name}
                                </span>
                                {item.author.verified && <VerifiedBadge platform="linkedin" className="w-[12px] h-[12px] ml-0.5 inline-block" />}
                            </div>
                            <span className="text-[12px] text-gray-500 mt-[-2px]">{item.author.handle || "Member"}</span>
                        </div>
                        <span className="text-[12px] text-gray-500">{formatDistanceToNow(item.content.date).replace('about ', '')}</span>
                    </div>
                    <span className={cn("whitespace-pre-wrap leading-[1.4] mt-1.5 mb-0.5", isDark ? "text-zinc-200" : "text-gray-900")}>{item.content.text}</span>
                </div>

                <div className="flex items-center gap-4 mt-1 ml-2 text-[12px] font-semibold text-gray-500">
                    <span className={cn("hover:bg-gray-100 dark:hover:bg-zinc-800 px-1 py-0.5 rounded cursor-pointer transition-colors", isDark ? "hover:text-zinc-300" : "hover:text-gray-900")}>Like</span>
                    {parseInt(item.metrics.likes) > 0 && (
                        <span className="flex items-center gap-1 text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                            <span className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <ThumbsUp className="w-2 h-2 text-white fill-current" />
                            </span>
                            {item.metrics.likes}
                        </span>
                    )}
                    {(item.children || []).length === 0 && <span className={cn("hover:bg-gray-100 dark:hover:bg-zinc-800 px-1 py-0.5 rounded cursor-pointer transition-colors", isDark ? "hover:text-zinc-300" : "hover:text-gray-900")}>Reply</span>}
                </div>

                {(item.children || []).map(child => (
                    <LinkedInComment key={child.id} item={child} isDark={isDark} depth={depth + 1} items={items} />
                ))}
            </div>
        </div>
    );
};
