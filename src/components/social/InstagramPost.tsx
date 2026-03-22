import React from 'react';
import { SocialPostState, ThreadItem } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { formatDistanceToNow } from 'date-fns';

interface InstagramPostProps {
    state: SocialPostState;
}

export const InstagramPost: React.FC<InstagramPostProps> = ({ state }) => {
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
                {tree.length > 0 && (
                    <div className="mt-4 mb-2 -ml-1 space-y-3">
                        {tree.map(comment => <InstagramComment key={comment.id} item={comment} isDark={isDark} depth={0} />)}
                    </div>
                )}
                
                {state.threadItems.length === 0 && (
                    <div className="text-xs text-gray-500 mb-2 mt-2 cursor-pointer">
                        View all {state.metrics.comments} comments
                    </div>
                )}

                {/* Date */}
                <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-2">
                    {formatDistanceToNow(state.content.date)} ago
                </div>
            </div>
        </div>
    );
};

const InstagramComment = ({ item, isDark, depth }: { item: ThreadItem & { children?: ThreadItem[] }, isDark: boolean, depth: number }) => {
    return (
        <div className={cn("flex flex-col", depth > 0 ? "ml-9 mt-3" : "mt-2")}>
            <div className="flex gap-3">
                <Avatar className="w-7 h-7 rounded-full shrink-0">
                    <AvatarImage src={item.author.avatar} className="object-cover" />
                    <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                    <div className="text-sm">
                        <span className={cn("font-semibold mr-2 inline-flex items-center", isDark ? "text-white" : "text-black")}>
                            {item.author.handle}
                            {item.author.verified && <VerifiedBadge platform="instagram" className="w-[10px] h-[10px] ml-1" />}
                        </span>
                        <span className={cn("whitespace-pre-wrap", isDark ? "text-white" : "text-black")}>{item.content.text}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                        <span>{formatDistanceToNow(item.content.date).replace('about ', '')}</span>
                        {parseInt(item.metrics.likes) > 0 && <span>{item.metrics.likes} likes</span>}
                        <span>Reply</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-start pt-1 shrink-0 px-2 cursor-pointer">
                    <Heart className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
                </div>
            </div>

            {/* Recursively render replies */}
            {(item.children || []).length > 0 && (
                <div className="mt-1">
                    <div className="flex items-center gap-3 ml-10 mb-2 mt-2">
                        <div className="w-6 h-[1px] bg-gray-300 dark:bg-zinc-700" />
                        <span className="text-xs text-gray-500 font-semibold cursor-pointer">
                            View replies ({(item.children || []).length})
                        </span>
                    </div>
                    {(item.children || []).map(child => (
                        <InstagramComment key={child.id} item={child} isDark={isDark} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};
