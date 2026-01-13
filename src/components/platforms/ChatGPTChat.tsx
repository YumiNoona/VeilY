import { Message, Person, AppearanceSettings } from "@/types/chat";
import { cn } from "@/lib/utils";
import { AlignJustify, Pencil, Plus, Copy, Volume2, ThumbsUp, ThumbsDown, RotateCw, Mic, AudioLines, SlidersHorizontal } from "lucide-react";

interface ChatProps {
    messages: Message[];
    people: Person[];
    activePerson: Person | null;
    appearance: AppearanceSettings;
    aiModel?: string;
}

export function ChatGPTChat({ messages, people, appearance, aiModel }: ChatProps) {
    const getPerson = (id: string) => people.find(p => p.id === id);

    // Format model name for display
    const getModelDisplayName = () => {
        if (!aiModel) return 'ChatGPT';
        const modelMap: Record<string, string> = {
            'gpt-4o': 'GPT-4o',
            'gpt-4-turbo': 'GPT-4 Turbo',
            'gpt-3.5': 'GPT-3.5',
        };
        return modelMap[aiModel] || 'ChatGPT';
    };

    // Helper to format text with bold, bullets, and code blocks
    const formatMessageText = (text: string) => {
        // Split by code blocks first
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            // Handle Code Blocks
            if (part.startsWith('```') && part.endsWith('```')) {
                const content = part.slice(3, -3).trim();
                return (
                    <div key={index} className="my-3 rounded-xl overflow-hidden bg-[#0d0d0d] text-white border border-gray-800">
                        <div className="bg-[#2f2f2f] px-4 py-2 flex items-center justify-between">
                            <span className="text-xs text-gray-400 font-medium">Code</span>
                            <div className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy code</span>
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto font-mono text-[14px] leading-relaxed">
                            {content.split('\n').map((line, i) => (
                                <div key={i}>{line || '\u00A0'}</div>
                            ))}
                        </div>
                    </div>
                );
            }

            // Handle Regular Text (Bold, Bullets, Newlines)
            const lines = part.split('\n');
            return (
                <div key={index}>
                    {lines.map((line, lineIndex) => {
                        if (line.trim().startsWith('- ')) {
                            const bulletContent = line.trim().substring(2);
                            return (
                                <div key={lineIndex} className="flex gap-2 ml-1 mb-1">
                                    <span className="text-gray-900 mt-1.5">•</span>
                                    <span>{parseBold(bulletContent)}</span>
                                </div>
                            );
                        }
                        // Only add margin if it's not the last line or if it matches certain conditions
                        return (
                            <div key={lineIndex} className={cn("min-h-[24px]", lineIndex < lines.length - 1 && "mb-1")}>
                                {parseBold(line)}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className={cn("flex flex-col h-full bg-white font-sans text-[#0D0D0D]")}>
            {/* Header */}
            <header className="px-4 py-2 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="w-8 flex items-center justify-center">
                    <AlignJustify className="w-6 h-6 text-[#0D0D0D] stroke-[1.5]" />
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                    <span className="font-semibold text-[16px] text-[#0D0D0D]">{getModelDisplayName()}</span>
                    <span className="text-gray-400 text-[10px] transform translate-y-[1px]">▼</span>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-[#0D0D0D] hover:bg-gray-50 rounded-full transition-colors">
                    <Pencil className="w-5 h-5" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 scrollbar-none">
                {messages.map((message) => {
                    const isUser = message.isOwn;

                    return (
                        <div key={message.id} className={cn("flex w-full flex-col", isUser ? "items-end" : "items-start")}>
                            {/* Assistant Layout */}
                            {!isUser && (
                                <div className="max-w-[100%] pr-2">
                                    <div className="space-y-1">
                                        <div className="text-[16px] leading-[1.6] text-[#0D0D0D]">
                                            {formatMessageText(message.text)}
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center gap-3 mt-1 text-gray-500">
                                        <button className="p-1 hover:text-gray-900 transition-colors">
                                            <Copy className="w-[18px] h-[18px] stroke-[2]" />
                                        </button>
                                        <button className="p-1 hover:text-gray-900 transition-colors">
                                            <Volume2 className="w-[19px] h-[19px] stroke-[2]" />
                                        </button>
                                        <button className="p-1 hover:text-gray-900 transition-colors">
                                            <ThumbsUp className="w-[18px] h-[18px] stroke-[2]" />
                                        </button>
                                        <button className="p-1 hover:text-gray-900 transition-colors">
                                            <ThumbsDown className="w-[18px] h-[18px] stroke-[2]" />
                                        </button>
                                        <div className="flex items-center gap-1 ml-1 cursor-pointer hover:text-gray-900 transition-colors">
                                            <RotateCw className="w-[16px] h-[16px] stroke-[2.5]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* User Layout */}
                            {isUser && (
                                <div className="max-w-[90%] bg-[#2F2F2F] text-white px-5 py-3 rounded-[26px] text-[16px] leading-[1.5] mb-2">
                                    {message.text}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="px-4 pb-6 pt-2">
                <div className="bg-[#F4F4F4] rounded-[28px] flex items-center px-3 py-3 gap-3">
                    <div className="flex gap-3 text-[#0D0D0D] shrink-0 items-center pl-1">
                        <Plus className="w-7 h-7 stroke-[1.5] text-[#0D0D0D] cursor-pointer" />
                        <SlidersHorizontal className="w-6 h-6 stroke-[1.5] text-[#0D0D0D] cursor-pointer" />
                    </div>

                    <div className="flex-1">
                        <span className="text-[#8E8E93] text-[16px] ml-1">Ask anything</span>
                    </div>

                    <div className="flex gap-4 shrink-0 items-center pl-1 pr-1">
                        <div className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-black/5 rounded-full transition-colors">
                            <Mic className="w-6 h-6 stroke-[1.5] text-[#0D0D0D]" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                            <AudioLines className="w-5 h-5 text-white stroke-[2]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
