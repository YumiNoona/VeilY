import { Message, Person, AppearanceSettings } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Mic, Pencil, Plus, ArrowUp } from "lucide-react";
import { EditableText } from "@/components/ui/EditableText";

interface ChatProps {
    messages: Message[];
    people: Person[];
    activePerson: Person | null;
    appearance: AppearanceSettings;
    aiModel?: string;
    onUpdateMessage?: (id: string, text: string) => void;
    onUpdatePerson?: (person: Person) => void;
}

export function ClaudeChat({ messages, people, appearance, aiModel, onUpdateMessage, onUpdatePerson }: ChatProps) {
    const getPerson = (id: string) => people.find(p => p.id === id);
    const bgColor = appearance.darkMode ? 'bg-[#1c1917]' : 'bg-[#fbfbfa]';
    const headerBg = appearance.darkMode ? 'bg-[#1c1917]' : 'bg-[#fbfbfa]';
    const textColor = appearance.darkMode ? 'text-[#e0d6cc]' : 'text-stone-900';
    const userBubble = appearance.darkMode ? 'bg-[#3a322e]' : 'bg-[#F0F0EB]';
    const userText = appearance.darkMode ? 'text-[#e0d6cc]' : 'text-[#2D2D2D]';
    const inputBg = appearance.darkMode ? 'bg-[#2a2420] border-[#3a322e]' : 'bg-white border-[#E5E5E5]';
    const iconColor = appearance.darkMode ? 'text-[#a09890]' : 'text-stone-900';

    // Format model name for display
    const getModelDisplayName = () => {
        if (!aiModel) return 'Sonnet 3.5';
        const modelMap: Record<string, string> = {
            'claude-4.8-opus': 'Claude 4.8 Opus',
            'claude-4.8-sonnet': 'Claude 4.8 Sonnet',
            'claude-4.6-sonnet': 'Claude 4.6 Sonnet',
            'claude-4-opus': 'Claude 4 Opus',
            'claude-4-haiku': 'Claude 4 Haiku',
            'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
        };
        return modelMap[aiModel] || 'Claude';
    };

    return (
        <div className={cn("flex flex-col h-full font-[Inter,sans-serif]", bgColor, textColor)}>
            {/* Header */}
            <header className={cn("px-5 py-3 flex items-center justify-between sticky top-0 z-10", headerBg)}>
                <button className={cn("p-1 -ml-2 hover:bg-stone-100 rounded-md transition-colors", iconColor)}>
                    <div className="space-y-[3px] p-1">
                        <div className={cn("w-4 h-0.5", appearance.darkMode ? 'bg-[#e0d6cc]' : 'bg-stone-900')}></div>
                        <div className={cn("w-4 h-0.5", appearance.darkMode ? 'bg-[#e0d6cc]' : 'bg-stone-900')}></div>
                        <div className={cn("w-4 h-0.5", appearance.darkMode ? 'bg-[#e0d6cc]' : 'bg-stone-900')}></div>
                    </div>
                </button>
                <div className={cn("flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg transition-colors", appearance.darkMode ? 'hover:bg-[#2a2420]' : 'hover:bg-[#f5f5f0]')}>
                    <span className="font-semibold text-[15px]">{getModelDisplayName()}</span>
                    <span className="text-gray-400 text-[10px] transform translate-y-[1px]">▼</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#D97757]/10 flex items-center justify-center text-[#D97757] hover:bg-[#D97757]/20 transition-colors cursor-pointer">
                    <Pencil className="w-[18px] h-[18px]" />
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-8 scrollbar-none">
                {messages.map((message) => {
                    const isUser = message.isOwn;

                    return (
                        <div key={message.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
                            {/* Assistant Layout */}
                            {!isUser && (
                                <div className="space-y-1.5 max-w-[95%]">
                                    <div className="text-[17px] leading-relaxed font-serif tracking-[0.01em]">
                                        <EditableText
                                            value={message.text}
                                            onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                                            multiline
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* User Layout */}
                            {isUser && (
                                <div className={cn("max-w-[85%] px-5 py-3 rounded-[24px] text-[16px] leading-[1.6]", userBubble, userText)}>
                                    <EditableText
                                        value={message.text}
                                        onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                                        multiline
                                        className="block w-full"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="px-5 pb-8 pt-2">
                <div className={cn("rounded-[28px] border shadow-[0_2px_8px_rgba(0,0,0,0.02)] pl-3 pr-2 py-2 flex items-center gap-3", inputBg)}>
                    <button className={cn("w-9 h-9 flex items-center justify-center shrink-0 hover:bg-stone-50 rounded-full transition-colors", appearance.darkMode ? 'text-stone-400' : 'text-stone-400')}>
                        <Plus className="w-6 h-6" />
                    </button>

                    <div className="flex-1">
                        <span className="text-[#9CA3AF] text-[16px] font-normal">Reply to Claude...</span>
                    </div>

                    <div className="flex gap-2 shrink-0 items-center">
                        <button className="w-9 h-9 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
                            <Mic className="w-[22px] h-[22px] text-stone-400" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-[#D97757] flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity">
                            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
