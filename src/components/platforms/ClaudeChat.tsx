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

    // Format model name for display
    const getModelDisplayName = () => {
        if (!aiModel) return 'Sonnet 3.5';
        const modelMap: Record<string, string> = {
            'claude-3-5-sonnet': 'Sonnet 3.5',
            'claude-3-opus': 'Opus 3',
            'claude-3-haiku': 'Haiku 3',
        };
        return modelMap[aiModel] || 'Claude';
    };

    return (
        <div className="flex flex-col h-full bg-[#fbfbfa] text-stone-900 font-[Inter,sans-serif]">
            {/* Header */}
            <header className="px-5 py-3 flex items-center justify-between sticky top-0 bg-[#fbfbfa] z-10">
                <button className="p-1 -ml-2 hover:bg-stone-100 rounded-md transition-colors">
                    <div className="space-y-[3px] p-1">
                        <div className="w-4 h-0.5 bg-stone-900"></div>
                        <div className="w-4 h-0.5 bg-stone-900"></div>
                        <div className="w-4 h-0.5 bg-stone-900"></div>
                    </div>
                </button>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-[#f5f5f0] px-2 py-1 rounded-lg transition-colors">
                    <span className="font-semibold text-[15px] text-[#2D2D2D]">{getModelDisplayName()}</span>
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
                                    <div className="text-[17px] leading-relaxed text-[#2D2D2D] font-serif tracking-[0.01em]">
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
                                <div className="max-w-[85%] bg-[#F0F0EB] text-[#2D2D2D] px-5 py-3 rounded-[24px] text-[16px] leading-[1.6]">
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
                <div className="bg-white rounded-[28px] border border-[#E5E5E5] shadow-[0_2px_8px_rgba(0,0,0,0.02)] pl-3 pr-2 py-2 flex items-center gap-3">
                    <button className="w-9 h-9 flex items-center justify-center text-stone-400 shrink-0 hover:bg-stone-50 rounded-full transition-colors">
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
