import { Message, Person, AppearanceSettings, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Mic, Pencil, Plus, ArrowUp, Settings, PanelLeft, FolderKanban, Palette, Code2, SlidersHorizontal, Sparkles } from "lucide-react";
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

export function ClaudeChat({ messages, appearance, aiModel, deviceView = 'mobile', onUpdateMessage }: ChatProps) {
    const bgColor = appearance.darkMode ? 'bg-[#141414]' : 'bg-[#fbfbfa]';
    const headerBg = appearance.darkMode ? 'bg-[#141414]' : 'bg-[#fbfbfa]';
    const textColor = appearance.darkMode ? 'text-[#e0d6cc]' : 'text-stone-900';
    const userBubble = appearance.darkMode ? 'bg-[#3a322e]' : 'bg-[#F0F0EB]';
    const userText = appearance.darkMode ? 'text-[#e0d6cc]' : 'text-[#2D2D2D]';
    const inputBg = appearance.darkMode ? 'bg-[#2a2420] border-[#3a322e]' : 'bg-white border-[#E5E5E5]';
    const iconColor = appearance.darkMode ? 'text-[#a09890]' : 'text-stone-900';
    const isDesktop = deviceView === 'desktop';

    const formatMessageText = (text: string) => text.split('\n').map((line, lineIndex) => (
        <span key={lineIndex} className="block min-h-[1.5em]">
            {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => (
                part.startsWith('**') && part.endsWith('**')
                    ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
                    : part
            ))}
        </span>
    ));

    // Format model name for display
    const getModelDisplayName = () => {
        return getAIModelDisplayName('claude', aiModel);
    };

    return (
        <div className={cn("flex h-full font-[Inter,sans-serif]", appearance.transparentBackground ? 'bg-transparent' : bgColor, textColor)}>
            {isDesktop && (
                <aside className={cn("flex w-[232px] shrink-0 flex-col border-r p-2.5", appearance.darkMode ? "border-white/10 bg-[#0f0f0f]" : "border-[#e8e5df] bg-[#f5f3ee]")}>
                    <div className="mb-3 px-1.5 py-1 font-serif text-lg font-semibold">Claude</div>
                    <ClaudeNav icon={Plus} label="New" active dark={appearance.darkMode} />
                    <ClaudeNav icon={FolderKanban} label="Projects" dark={appearance.darkMode} />
                    <ClaudeNav icon={Sparkles} label="Artifacts" dark={appearance.darkMode} />
                    <ClaudeNav icon={Code2} label="Code" dark={appearance.darkMode} badge="Upgrade" />
                    <ClaudeNav icon={SlidersHorizontal} label="Customize" dark={appearance.darkMode} />
                    <p className="mt-4 px-2 text-[10px] text-muted-foreground">Usage ›</p>
                    <p className="mt-7 px-2 text-[11px] text-muted-foreground">Chats and tasks</p>
                    <div className="mt-auto border-t border-current/10 pt-2"><ClaudeNav icon={Palette} label="Design" dark={appearance.darkMode} /></div>
                    <div className="mt-auto flex items-center gap-2 px-2 py-2 text-xs"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d97757] font-semibold text-white">Y</div><span>You</span><Settings className="ml-auto h-4 w-4 text-muted-foreground" /></div>
                </aside>
            )}
            <section className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <header className={cn("px-5 py-3 flex h-13 items-center justify-between sticky top-0 z-10 border-b", headerBg, appearance.darkMode ? "border-[#3a322e]" : "border-[#ece9e3]")}>
                <button className={cn("p-1 -ml-2 hover:bg-stone-100 rounded-md transition-colors", iconColor)}>
                    {isDesktop ? <PanelLeft className="h-5 w-5" /> : <div className="space-y-[3px] p-1">
                        <div className={cn("w-4 h-0.5", appearance.darkMode ? 'bg-[#e0d6cc]' : 'bg-stone-900')}></div>
                        <div className={cn("w-4 h-0.5", appearance.darkMode ? 'bg-[#e0d6cc]' : 'bg-stone-900')}></div>
                        <div className={cn("w-4 h-0.5", appearance.darkMode ? 'bg-[#e0d6cc]' : 'bg-stone-900')}></div>
                    </div>}
                </button>
                {isDesktop ? <div className="rounded-lg bg-black/10 px-2.5 py-1 text-xs text-muted-foreground">Free plan · <span className="text-blue-500 underline">Upgrade</span></div> : <div className={cn("flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg transition-colors", appearance.darkMode ? 'hover:bg-[#2a2420]' : 'hover:bg-[#f5f5f0]')}><span className="font-semibold text-[15px]">{getModelDisplayName()}</span><span className="text-gray-400 text-[10px] translate-y-px">▼</span></div>}
                <div className="w-9 h-9 rounded-full bg-[#D97757]/10 flex items-center justify-center text-[#D97757] hover:bg-[#D97757]/20 transition-colors cursor-pointer">
                    <Pencil className="w-[18px] h-[18px]" />
                </div>
            </header>

            {/* Messages */}
            <div data-chat-scroll className="flex-1 overflow-y-auto scrollbar-none">
              <div className="mx-auto max-w-[760px] space-y-8 px-5 py-6">
                {messages.map((message) => {
                    const isUser = message.isOwn;

                    return (
                        <div key={message.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
                            {/* Assistant Layout */}
                            {!isUser && (
                                <div className="space-y-1.5 max-w-[95%]">
                                    <div data-chat-message className="text-[17px] leading-relaxed font-serif tracking-[0.01em]">
                                        <EditableText
                                            value={message.text}
                                            displayValue={formatMessageText(message.text)}
                                            onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                                            multiline
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* User Layout */}
                            {isUser && (
                                <div data-chat-message className={cn("max-w-[85%] px-5 py-3 rounded-[24px] text-[16px] leading-[1.6]", userBubble, userText)}>
                                    <EditableText
                                        value={message.text}
                                        displayValue={formatMessageText(message.text)}
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
            </div>

            {/* Input Area */}
            <div className="mx-auto w-full max-w-[800px] px-5 pb-6 pt-2">
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
            </section>
        </div>
    );
}

const ClaudeNav = ({ icon: Icon, label, active, dark, badge }: { icon: React.ElementType; label: string; active?: boolean; dark: boolean; badge?: string }) => <button className={cn("mb-0.5 flex h-8 w-full items-center gap-2 rounded-lg px-2 text-xs", active ? (dark ? "bg-[#343434]" : "bg-black/10") : (dark ? "hover:bg-white/5" : "hover:bg-black/5"))}><Icon className="h-4 w-4"/><span>{label}</span>{badge && <span className="ml-auto rounded-full border border-current/20 px-1.5 py-0.5 text-[9px] text-blue-500">{badge}</span>}</button>;
