import React from 'react';
import { SocialPostState, ThreadItem } from '@/hooks/useSocialPostState';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface RedditPostProps {
    state: SocialPostState;
}

export const RedditPost: React.FC<RedditPostProps> = ({ state }) => {
    const isDark = state.config.theme === 'dark';

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
                <div className={cn(
                    "w-10 pt-2 flex flex-col items-center bg-transparent shrink-0",
                    isDark ? "bg-[#1A1A1B]" : "bg-gray-50/50 hidden sm:flex"
                )}>
                    <button className={cn("p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800", isDark ? "text-zinc-400" : "text-gray-400")}>
                        <ArrowBigUp className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold my-1">{state.metrics.likes}</span>
                    <button className={cn("p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-800", isDark ? "text-zinc-400" : "text-gray-400")}>
                        <ArrowBigDown className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 p-2 pt-2 pb-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-1.5 text-xs mb-1.5">
                        <Avatar className="w-5 h-5 rounded-full">
                            <AvatarImage src={state.author.avatar} className="object-cover" />
                            <AvatarFallback>{state.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className={cn("font-bold hover:underline cursor-pointer", isDark ? "text-zinc-100" : "text-black")}>
                            {state.author.handle}
                        </span>
                        <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>•</span>
                        <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>
                            Posted by u/{state.author.name} {formatDistanceToNow(state.content.date)} ago
                        </span>
                    </div>

                    {/* Title & Content */}
                    <h2 className={cn("text-lg font-medium mb-1.5 leading-tight", isDark ? "text-zinc-100" : "text-black")}>
                        {state.content.text.split('\n')[0]} {/* Assuming first line is title for template simplicity */}
                    </h2>
                    <div className={cn("text-sm mb-2 whitespace-pre-wrap", isDark ? "text-[#D7DADC]" : "text-gray-800")}>
                        {state.content.text.split('\n').slice(1).join('\n')}
                    </div>

                    {/* Image */}
                    {state.content.image && (
                        <div className="mt-2 mb-2 rounded border border-gray-100 dark:border-zinc-800 overflow-hidden bg-black/5 flex justify-center max-h-[500px]">
                            <img src={state.content.image} alt="Content" className="object-contain max-h-[500px]" />
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-1 text-xs font-bold mt-2">
                        <ActionButton icon={MessageSquare} label={`${state.metrics.comments} Comments`} isDark={isDark} />
                        <ActionButton icon={Share} label="Share" isDark={isDark} />
                        <ActionButton icon={Bookmark} label="Save" isDark={isDark} />
                        <button className={cn("p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800", isDark ? "text-zinc-400" : "text-gray-500")}>
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            {tree.length > 0 && (
                <div className={cn("px-4 pb-4 pt-2 border-t", isDark ? "border-zinc-800 bg-[#1A1A1B]" : "border-gray-200 bg-white")}>
                    <div className="mb-4 mt-2">
                        <span className={cn("text-sm font-medium", isDark ? "text-zinc-100" : "text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500")}>
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

const ActionButton = ({ icon: Icon, label, isDark }: { icon: any, label: string, isDark: boolean }) => (
    <button className={cn(
        "flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors",
        isDark ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-500"
    )}>
        <Icon className="w-4 h-4" />
        <span>{label}</span>
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
                    {item.author.handle}
                </span>
                <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>•</span>
                <span className={cn(isDark ? "text-zinc-500" : "text-gray-500")}>
                    {formatDistanceToNow(item.content.date)} ago
                </span>
            </div>
            
            <div className={cn("pl-8 text-sm whitespace-pre-wrap leading-relaxed", isDark ? "text-[#D7DADC]" : "text-black")}>
                {item.content.text}
            </div>
            
            <div className="pl-8 flex items-center gap-1 text-xs font-bold mt-1 mb-2">
                <button className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800", isDark ? "text-zinc-400" : "text-gray-400")}><ArrowBigUp className="w-4 h-4" /></button>
                <span className={cn(isDark ? "text-zinc-400" : "text-gray-800")}>{item.metrics.likes}</span>
                <button className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800", isDark ? "text-zinc-400" : "text-gray-400")}><ArrowBigDown className="w-4 h-4" /></button>
                <button className={cn("flex items-center gap-1 ml-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors", isDark ? "text-zinc-400" : "text-gray-500")}>
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
