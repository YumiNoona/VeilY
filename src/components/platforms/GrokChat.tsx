import { Message, Person, AppearanceSettings } from "@/types/chat";
import { cn } from "@/lib/utils";
import { AlignJustify, Pencil, RotateCw, Copy, ThumbsUp, ThumbsDown, HelpCircle, Paperclip, Mic, Lightbulb, ArrowUp } from "lucide-react";

interface ChatProps {
    messages: Message[];
    people: Person[];
    activePerson: Person | null;
    appearance: AppearanceSettings;
    aiModel?: string;
}

export function GrokChat({ messages, people, appearance, aiModel }: ChatProps) {
    const getPerson = (id: string) => people.find(p => p.id === id);

    // Format model name for display
    const getModelDisplayName = () => {
        if (!aiModel) return 'Grok 4';
        const modelMap: Record<string, string> = {
            'grok-4': 'Grok 4',
            'grok-3': 'Grok 3',
            'grok-2': 'Grok 2',
        };
        return modelMap[aiModel] || 'Grok';
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
        <div className={cn("flex flex-col h-full bg-[#F5F5F5] font-sans text-[#0D0D0D]")}>
            {/* Header */}
            <header className="px-4 py-2 flex items-center justify-between sticky top-0 bg-[#F5F5F5] z-10">
                <div className="w-8 flex items-center justify-center">
                    <AlignJustify className="w-6 h-6 text-[#0D0D0D] stroke-[1.5]" />
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B35]"></div>
                    <span className="font-semibold text-[16px] text-[#0D0D0D]">{getModelDisplayName()}</span>
                    <span className="text-gray-400 text-[10px] transform translate-y-[1px]">▼</span>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-[#0D0D0D] hover:bg-gray-200 rounded-full transition-colors">
                    <Pencil className="w-5 h-5" />
                </button>
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
                                    <div className="space-y-1">
                                        <div className="text-[16px] leading-[1.6] text-[#0D0D0D]">
                                            {formatMessageText(message.text)}
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                                        <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                            <RotateCw className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                            <Copy className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                            <ThumbsUp className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                            <ThumbsDown className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                                            <HelpCircle className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* User Layout */}
                            {isUser && (
                                <div className="max-w-[85%] bg-white border border-[#E5E5E5] text-[#2D2D2D] px-4 py-3 rounded-[16px] text-[16px] leading-[1.5]">
                                    {message.text}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="px-4 pb-6 pt-2">
                <div className="bg-white border border-gray-200 rounded-[24px] px-4 py-3 shadow-sm">
                    {/* Input Field */}
                    <div className="mb-3">
                        <span className="text-[#9CA3AF] text-[15px]">Ask Anything</span>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                <Paperclip className="w-5 h-5 text-[#6B7280]" />
                            </button>
                            <button className="px-3 py-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5 border border-gray-200">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                <span className="text-sm font-medium text-[#374151]">DeepSearch</span>
                            </button>
                            <button className="px-3 py-1.5 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5 border border-gray-200">
                                <Lightbulb className="w-4 h-4" />
                                <span className="text-sm font-medium text-[#374151]">Think</span>
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                <Mic className="w-5 h-5 text-[#6B7280]" />
                            </button>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                            <ArrowUp className="w-5 h-5 text-white stroke-[2.5]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
