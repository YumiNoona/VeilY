import React from 'react';
import { SocialPostState, ThreadItem } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface RedditPostProps {
    state: SocialPostState;
}

export const RedditPost: React.FC<RedditPostProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';
    const subreddit = state.author.handle.replace(/^r\//, '').replace(/^u\//, '').replace(/^@/, '');
    const username = state.author.name.replace(/^u\//, '').replace(/^@/, '').replace(/\s+/g, '');

    // Helper to build the comment tree from the flat threadItems array using parentId
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
            "w-full max-w-[650px] border rounded-md overflow-hidden font-sans",
            isDark ? "bg-[#1A1A1B] border-zinc-800 text-[#D7DADC]" : "bg-white border-gray-200 text-black"
        )}>
            {/* Post Section */}
            <div className="flex">
                {/* Left upvote bar */}
                <div className="flex-1 p-2 pt-2 pb-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-1.5 text-xs mb-1.5">
                        <Avatar className="w-5 h-5 rounded-full">
                            <AvatarImage src={state.author.avatar} className="object-cover" />
                            <AvatarFallback>{state.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className={cn("font-bold hover:underline cursor-pointer", isDark ? "text-zinc-100" : "text-black")}>
                            r/{subreddit}
                        </span>
                        <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>•</span>
                        <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>
                            Posted by u/{username} {formatDistanceToNow(state.content.date)} ago
                        </span>
                    </div>

                    {/* Title & Content */}
                    <h2 className={cn("text-[15px] font-normal mb-1.5 leading-tight", isDark ? "text-zinc-100" : "text-black")}>
                        {state.content.text.split('\n')[0]}
                    </h2>
                    <div className={cn("text-[15px] mb-2 whitespace-pre-wrap", isDark ? "text-[#D7DADC]" : "text-gray-800")}>
                        {state.content.text.split('\n').slice(1).join('\n')}
                    </div>

                    {/* Image */}
                    {state.content.image && (
                        <div className={cn("mt-2 mb-2 flex max-h-[500px] justify-center overflow-hidden rounded border bg-black/5", isDark ? "border-zinc-800" : "border-gray-100")}>
                            <img src={state.content.image} alt="Content" className="object-contain max-h-[500px]" />
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mt-3">
                        <div className={cn("flex h-9 items-center overflow-hidden rounded-full", isDark ? "bg-[#272d30] text-[#d7dadc]" : "bg-[#e5ebee] text-[#1a1a1b]")}>
                            <button aria-label="Upvote" className="flex h-full items-center gap-1 px-2.5 hover:bg-orange-500/15 hover:text-[#ff4500]"><ArrowBigUp className="h-5 w-5" /><span>{state.metrics.likes}</span></button>
                            <span className={cn("h-5 w-px", isDark ? "bg-white/10" : "bg-black/10")} />
                            <button aria-label="Downvote" className="flex h-full items-center px-2 hover:bg-indigo-500/15 hover:text-indigo-500"><ArrowBigDown className="h-5 w-5" /></button>
                        </div>
                        <ActionPill icon={MessageSquare} label={`${state.metrics.comments}`} isDark={isDark} />
                        <ActionPill icon={RotateCcw} label="" isDark={isDark} ariaLabel="Repost" />
                        <ActionPill icon={Share2} label="Share" isDark={isDark} />
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            {tree.length > 0 && (
                <div className={cn("px-4 pb-4 pt-2 border-t", isDark ? "border-zinc-800 bg-[#1A1A1B]" : "border-gray-200 bg-white")}>
                    <div className="mb-4 mt-2">
                        <span className={cn("text-[15px] font-medium", isDark ? "text-zinc-100" : "text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500")}>
                            Top Comments
                        </span>
                        <hr className={cn("mt-2", isDark ? "border-zinc-800" : "border-gray-200")} />
                    </div>
                    {tree.map(comment => <RedditComment key={comment.id} item={comment} isDark={isDark} depth={0} items={state.threadItems} />)}
                </div>
            )}
        </div>
    );
};

const ActionPill = ({ icon: Icon, label, isDark, ariaLabel }: { icon: React.ElementType, label: string, isDark: boolean, ariaLabel?: string }) => (
    <button className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-3 transition-colors",
        isDark ? "bg-[#272d30] text-[#d7dadc] hover:bg-[#333a3e]" : "bg-[#e5ebee] text-[#1a1a1b] hover:bg-[#d8e0e4]"
    )} aria-label={ariaLabel}>
        <Icon className="w-[18px] h-[18px]" />
        {label && <span>{label}</span>}
    </button>
);

const RedditComment = React.memo(({ item, isDark, depth, items }: { item: ThreadItem & { children?: ThreadItem[] }, isDark: boolean, depth: number, items: ThreadItem[] }) => {
    return (
        <div className={cn("flex flex-col mb-1 pt-2 relative", depth > 0 ? "ml-4" : "")} style={{ paddingLeft: depth === 0 ? 0 : '12px' }}>
            
            {/* Thread Line connecting children to parent */}
            {depth > 0 && (
                <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-[2px] -translate-x-full hover:bg-blue-500 cursor-pointer transition-colors",
                    isDark ? "bg-zinc-800 hover:bg-zinc-600" : "bg-gray-200 hover:bg-gray-400"
                )} />
            )}

            <div className="flex items-center gap-2 text-xs mb-1">
                <Avatar className="w-6 h-6 rounded-full">
                    <AvatarImage src={item.author.avatar} className="object-cover" />
                    <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className={cn("font-bold hover:underline cursor-pointer", isDark ? "text-zinc-100" : "text-black")}>
                    u/{item.author.handle.replace(/^u\//, '').replace(/^@/, '')}
                </span>
                <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>•</span>
                <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>
                    {formatDistanceToNow(item.content.date)} ago
                </span>
            </div>
            
            <div className={cn("pl-8 text-[15px] whitespace-pre-wrap leading-relaxed", isDark ? "text-[#D7DADC]" : "text-black")}>
                {item.content.text}
            </div>
            
            <div className="pl-8 flex items-center gap-1 text-xs font-bold mt-1 mb-2">
                <button className={cn("rounded p-1", isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-400 hover:bg-gray-100")}><ArrowBigUp className="w-4 h-4" /></button>
                <span className={cn(isDark ? "text-zinc-400" : "text-gray-800")}>{item.metrics.likes}</span>
                <button className={cn("rounded p-1", isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-400 hover:bg-gray-100")}><ArrowBigDown className="w-4 h-4" /></button>
                <button className={cn("ml-2 flex items-center gap-1 rounded p-1.5 transition-colors", isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-500 hover:bg-gray-100")}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply
                </button>
            </div>

            {/* Render children recursively */}
            {(item.children || []).map(child => (
                <RedditComment key={child.id} item={child} isDark={isDark} depth={depth + 1} items={items} />
            ))}
        </div>
    );
});
