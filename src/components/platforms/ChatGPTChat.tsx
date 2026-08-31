import { Message, Person, AppearanceSettings, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import { AlignJustify, Pencil, Plus, Copy, Volume2, ThumbsUp, ThumbsDown, RotateCw, Mic, AudioLines, SlidersHorizontal, Search, Library, Boxes, SquarePen } from "lucide-react";
import { EditableText } from "@/components/ui/EditableText";
import { getAIModelDisplayName } from "@/lib/ai-models";

interface ChatProps {
    messages: Message[];
    people: Person[];
    activePerson: Person | null;
    appearance: AppearanceSettings;
    deviceView?: DeviceView;
    aiModel?: string;
    onUpdateMessage?: (id: string, text: string) => void;
    onUpdatePerson?: (person: Person) => void;
}

export function ChatGPTChat({ messages, appearance, aiModel, deviceView = 'mobile', onUpdateMessage }: ChatProps) {
    const bgColor = appearance.darkMode ? 'bg-[#212121]' : 'bg-white';
    const headerBg = appearance.darkMode ? 'bg-[#212121]' : 'bg-white';
    const textColor = appearance.darkMode ? 'text-[#ececec]' : 'text-[#0D0D0D]';
    const userBubble = appearance.darkMode ? 'bg-[#303030]' : 'bg-[#f4f4f4]';
    const userText = appearance.darkMode ? 'text-[#ececec]' : 'text-[#0D0D0D]';
    const inputBg = appearance.darkMode ? 'bg-[#303030]' : 'bg-white';
    const iconColor = appearance.darkMode ? 'text-[#b0b0b0]' : 'text-[#0D0D0D]';
    const isDesktop = deviceView === 'desktop';

    // Format model name for display
    const getModelDisplayName = () => {
        return getAIModelDisplayName('chatgpt', aiModel);
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
        <div className={cn("flex h-full font-sans", appearance.transparentBackground ? 'bg-transparent' : bgColor, textColor)}>
            {isDesktop && (
                <aside className={cn("flex w-[224px] shrink-0 flex-col border-r p-3", appearance.darkMode ? "border-white/10 bg-[#171717]" : "border-black/5 bg-[#f9f9f9]")}>
                    <div className="mb-3 flex items-center gap-2 px-2 py-1.5 text-sm font-semibold"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-white dark:text-black">◎</div> ChatGPT</div>
                    <button className={cn("mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><SquarePen className="h-4 w-4" /> New chat</button>
                    <button className={cn("mb-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><Search className="h-4 w-4" /> Search chats</button>
                    <button className={cn("mb-4 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><Library className="h-4 w-4" /> Library</button>
                    <p className="px-2 text-[10px] font-semibold text-muted-foreground">Projects</p>
                    <button className={cn("mt-1 flex h-9 items-center gap-2 rounded-lg px-2 text-xs", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-black/5")}><Boxes className="h-4 w-4" /> Product research</button>
                    <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2 text-xs"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">Y</div><div><div className="font-medium">You</div><div className="text-[9px] text-muted-foreground">Personal</div></div></div>
                </aside>
            )}
            <section className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <header className={cn("px-4 py-2 flex h-12 items-center justify-between sticky top-0 z-10", headerBg)}>
                <div className="w-8 flex items-center justify-center">
                    {!isDesktop && <AlignJustify className={cn("w-6 h-6 stroke-[1.5]", iconColor)} />}
                </div>
                <div className={cn("flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg transition-colors", appearance.darkMode ? "hover:bg-white/10" : "hover:bg-gray-100")}>
                    <span className="font-semibold text-[16px]">{getModelDisplayName()}</span>
                    <span className="text-gray-400 text-[10px] transform translate-y-[1px]">▼</span>
                </div>
                <button className={cn("w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors", iconColor)}>
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
                            {/* Assistant Layout */}
                            {!isUser && (
                                <div className="max-w-[100%] pr-2">
                                    <div className="space-y-1">
                                        <div data-chat-message className="text-[16px] leading-[1.6]">
                                            <EditableText
                                                value={message.text}
                                                displayValue={formatMessageText(message.text)}
                                                onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                                                multiline
                                                className="block w-full"
                                            />
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
                                <div data-chat-message className={cn("max-w-[90%] px-5 py-3 rounded-[26px] text-[16px] leading-[1.5] mb-2", userBubble, userText)}>
                                    <EditableText
                                        value={message.text}
                                        onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                                        multiline
                                        className={userText}
                                        inputClassName={userText}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="mx-auto w-full max-w-[800px] px-4 pb-5 pt-2">
                <div className={cn("rounded-[28px] flex items-center px-3 py-3 gap-3 border shadow-sm", inputBg, appearance.darkMode ? "border-white/10" : "border-black/10")}>
                    <div className={cn("flex gap-3 shrink-0 items-center pl-1", iconColor)}>
                        <Plus className="w-7 h-7 stroke-[1.5] cursor-pointer" />
                        <SlidersHorizontal className="w-6 h-6 stroke-[1.5] cursor-pointer" />
                    </div>

                    <div className="flex-1">
                        <span className="text-[#8E8E93] text-[16px] ml-1">Ask anything</span>
                    </div>

                    <div className="flex gap-4 shrink-0 items-center pl-1 pr-1">
                        <div className={cn("w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-black/5 rounded-full transition-colors", iconColor)}>
                            <Mic className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                            <AudioLines className="w-5 h-5 text-white stroke-[2]" />
                        </div>
                    </div>
                </div>
                <p className="mt-2 text-center text-[9px] text-muted-foreground">ChatGPT can make mistakes. Check important information.</p>
            </div>
            </section>
        </div>
    );
}
