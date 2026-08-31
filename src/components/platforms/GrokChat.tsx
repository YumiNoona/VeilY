import { Message, Person, AppearanceSettings, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import { AlignJustify, Pencil, RotateCw, Copy, ThumbsUp, ThumbsDown, HelpCircle, Paperclip, Mic, Lightbulb, Search, Image, History, Settings } from "lucide-react";
import { getAIModelDisplayName } from "@/lib/ai-models";
import { EditableText } from "@/components/ui/EditableText";

interface ChatProps {
    messages: Message[];
    people: Person[];
    activePerson: Person | null;
    appearance: AppearanceSettings;
    deviceView?: DeviceView;
    aiModel?: string;
    onUpdateMessage?: (id: string, text: string) => void;
}

export function GrokChat({ messages, appearance, aiModel, deviceView = 'mobile', onUpdateMessage }: ChatProps) {
    const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
    const headerBg = appearance.darkMode ? 'bg-black' : 'bg-white';
    const textColor = appearance.darkMode ? 'text-[#e0e0e0]' : 'text-[#0D0D0D]';
    const userBubble = appearance.darkMode ? 'bg-[#3a3a5c] border-[#4a4a6c]' : 'bg-white border-[#E5E5E5]';
    const userText = appearance.darkMode ? 'text-[#e0e0e0]' : 'text-[#2D2D2D]';
    const inputBg = appearance.darkMode ? 'bg-[#2a2a4a] border-[#3a3a5c]' : 'bg-white border-gray-200';
    const iconColor = appearance.darkMode ? 'text-[#b0b0b0]' : 'text-[#0D0D0D]';
    const isDesktop = deviceView === 'desktop';

    // Format model name for display
    const getModelDisplayName = () => {
        return getAIModelDisplayName('grok', aiModel);
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
        <div className={cn("flex h-full font-sans", appearance.transparentBackground ? 'bg-transparent' : bgColor, textColor)}>
            {isDesktop && (
                <aside className={cn("flex w-[216px] shrink-0 flex-col border-r p-3", appearance.darkMode ? "border-white/10 bg-[#0a0a0a]" : "border-black/10 bg-[#f7f7f7]")}>
                    <div className="mb-4 flex items-center gap-2 px-2 py-1 text-lg font-bold"><span className="text-xl">𝕏</span> Grok</div>
                    <button className={cn("mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><Pencil className="h-4 w-4" /> New chat</button>
                    <button className={cn("mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><Search className="h-4 w-4" /> Search</button>
                    <button className={cn("mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><Image className="h-4 w-4" /> Imagine</button>
                    <button className={cn("mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><History className="h-4 w-4" /> History</button>
                    <div className="mt-auto flex items-center gap-2 px-2 py-2 text-xs"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 font-semibold text-white">Y</div><span>You</span><Settings className="ml-auto h-4 w-4 text-muted-foreground" /></div>
                </aside>
            )}
            <section className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <header className={cn("px-4 py-2 flex items-center justify-between sticky top-0 z-10", headerBg)}>
                <div className="w-8 flex items-center justify-center">
                    <AlignJustify className={cn("w-6 h-6 stroke-[1.5]", iconColor)} />
                </div>
                <div className={cn("flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg transition-colors", appearance.darkMode ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-200')}>
                    <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", appearance.darkMode ? "bg-white text-black" : "bg-black text-white")}>G</div>
                    <span className="font-semibold text-[16px]">{getModelDisplayName()}</span>
                    <span className="text-gray-400 text-[10px] transform translate-y-[1px]">▼</span>
                </div>
                <button className={cn("w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors", iconColor)}>
                    <Pencil className="w-5 h-5" />
                </button>
            </header>

            {/* Messages */}
            <div data-chat-scroll className="flex-1 overflow-y-auto scrollbar-none">
              <div className="mx-auto max-w-[760px] space-y-8 px-5 py-6">
                {messages.map((message) => {
                    const isUser = message.isOwn;

                    return (
                        <div key={message.id} className={cn("flex w-full flex-col", isUser ? "items-end" : "items-start")}>
                            {/* AI Layout */}
                            {!isUser && (
                                <div className="max-w-[100%] pr-2">
                                    <div className="space-y-1">
                                        <div data-chat-message className="text-[16px] leading-[1.6]">
                                            <EditableText value={message.text} displayValue={formatMessageText(message.text)} onSave={(text) => onUpdateMessage?.(message.id, text)} multiline className="block w-full" />
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                                        <button className={cn("p-1.5 rounded-full transition-colors", appearance.darkMode ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-200')}>
                                            <RotateCw className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className={cn("p-1.5 rounded-full transition-colors", appearance.darkMode ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-200')}>
                                            <Copy className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className={cn("p-1.5 rounded-full transition-colors", appearance.darkMode ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-200')}>
                                            <ThumbsUp className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className={cn("p-1.5 rounded-full transition-colors", appearance.darkMode ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-200')}>
                                            <ThumbsDown className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                        <button className={cn("p-1.5 rounded-full transition-colors", appearance.darkMode ? 'hover:bg-[#2a2a4a]' : 'hover:bg-gray-200')}>
                                            <HelpCircle className="w-[18px] h-[18px] stroke-[1.5]" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* User Layout */}
                            {isUser && (
                                <div data-chat-message className={cn("max-w-[85%] border px-4 py-3 rounded-[16px] text-[16px] leading-[1.5]", userBubble, userText)}>
                                    <EditableText value={message.text} onSave={(text) => onUpdateMessage?.(message.id, text)} multiline className="block" />
                                </div>
                            )}
                        </div>
                    );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="mx-auto w-full max-w-[800px] px-4 pb-5 pt-2">
                <div className={cn("border rounded-[24px] px-4 py-3 shadow-sm", inputBg)}>
                    {/* Input Field */}
                    <div className="mb-3">
                        <span className="text-[#9CA3AF] text-[15px]">Ask Anything</span>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex gap-2 items-center">
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                <Paperclip className="w-5 h-5 text-[#6B7280]" />
                            </button>
                            <button className={cn("px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 border", appearance.darkMode ? 'hover:bg-[#2a2a4a] border-[#3a3a5c]' : 'hover:bg-gray-100 border-gray-200')}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                <span className="text-sm font-medium text-[#374151]">DeepSearch</span>
                            </button>
                            <button className={cn("px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 border", appearance.darkMode ? 'hover:bg-[#2a2a4a] border-[#3a3a5c]' : 'hover:bg-gray-100 border-gray-200')}>
                                <Lightbulb className="w-4 h-4" />
                                <span className="text-sm font-medium text-[#374151]">Think</span>
                            </button>
                            <button className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-colors", appearance.darkMode ? 'bg-[#3a3a5c] hover:bg-[#4a4a6c]' : 'bg-gray-100 hover:bg-gray-200')}>
                                <Mic className="w-5 h-5 text-[#6B7280]" />
                            </button>
                    </div>
                </div>
            </div>
            </section>
        </div>
    );
}
