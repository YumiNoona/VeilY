import { Message, Person, AppearanceSettings } from "@/types/chat";
import { cn } from "@/lib/utils";
import { AlignJustify, Sparkles, ThumbsUp, ThumbsDown, Share2, Copy, MoreVertical, Mic, Camera, ArrowUp } from "lucide-react";

interface ChatProps {
    messages: Message[];
    people: Person[];
    activePerson: Person | null;
    appearance: AppearanceSettings;
    aiModel?: string;
}

export function GeminiChat({ messages, people, appearance, aiModel }: ChatProps) {
    const getPerson = (id: string) => people.find(p => p.id === id);

    // Format model name for display
    const getModelDisplayName = () => {
        if (!aiModel) return 'Gemini 3 Flash';
        const modelMap: Record<string, string> = {
            'gemini-2-flash': 'Gemini 2 Flash',
            'gemini-1-5-pro': 'Gemini 1.5 Pro',
            'gemini-1-5-flash': 'Gemini 1.5 Flash',
        };
        return modelMap[aiModel] || 'Gemini';
    };

    // Helper to format text with bold and bullets (reuse from ChatGPT)
    const formatMessageText = (text: string) => {
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
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
        <div className={cn("flex flex-col h-full bg-white font-sans text-[#2D2D2D]")}>
            {/* Header */}
            <header className="px-4 py-2 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="w-8 flex items-center justify-center">
                    <AlignJustify className="w-6 h-6 text-[#2D2D2D] stroke-[1.5]" />
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                    <span className="font-semibold text-[16px] text-[#2D2D2D]">{getModelDisplayName()}</span>
                    <span className="text-gray-400 text-[10px] transform translate-y-[1px]">▼</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#8E5CF7] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 scrollbar-none">
                {messages.map((message) => {
                    const isUser = message.isOwn;

                    return (
                        <div key={message.id} className={cn("flex w-full flex-col", isUser ? "items-end" : "items-start")}>
                            {/* AI Layout */}
                            {!isUser && (
                                <div className="max-w-[100%] pr-2">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
                                            <Sparkles className="w-5 h-5 text-[#2D2D2D]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[16px] leading-[1.6] text-[#2D2D2D]">
                                                {formatMessageText(message.text)}
                                            </div>

                                            {/* Action Buttons Row */}
                                            <div className="flex items-center gap-2 mt-2 text-gray-600">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                                    <ThumbsUp className="w-[18px] h-[18px] stroke-[1.5]" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                                    <ThumbsDown className="w-[18px] h-[18px] stroke-[1.5]" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" />
                                                    </svg>
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                                    <Share2 className="w-[18px] h-[18px] stroke-[1.5]" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                                    <Copy className="w-[18px] h-[18px] stroke-[1.5]" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                                    <MoreVertical className="w-[18px] h-[18px] stroke-[1.5]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* User Layout */}
                            {isUser && (
                                <div className="max-w-[85%] bg-[#F1F3F4] text-[#2D2D2D] px-4 py-3 rounded-[20px] text-[16px] leading-[1.5]">
                                    {message.text}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="px-4 pb-6 pt-2">
                <div className="bg-white border border-gray-200 rounded-[28px] flex items-center px-4 py-3 gap-3 shadow-sm">
                    <div className="flex-1">
                        <span className="text-[#5F6368] text-[16px]">Ask Gemini</span>
                    </div>

                    <div className="flex gap-2 shrink-0 items-center">
                        <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <Mic className="w-5 h-5 text-[#5F6368]" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <Camera className="w-5 h-5 text-[#5F6368]" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-[#4285F4] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                            <ArrowUp className="w-5 h-5 text-white stroke-[2.5]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
