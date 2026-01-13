import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Sparkles, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/chat";

interface AIModelSectionProps {
    platform: Platform;
    onPlatformChange: (platform: Platform) => void;
    model: string;
    onModelChange: (model: string) => void;
}

export function AIModelSection({ platform, onPlatformChange, model, onModelChange }: AIModelSectionProps) {
    const isChatGPT = platform === 'chatgpt';
    const isClaude = platform === 'claude';
    const isGemini = platform === 'gemini';
    const isGrok = platform === 'grok';

    return (
        <AccordionItem value="app-model" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">App & Model</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-4">

                {/* Platform Toggles - Grid Layout */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onPlatformChange('chatgpt')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                            isChatGPT
                                ? "bg-[#7447D6] text-white shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        ChatGPT
                    </button>
                    <button
                        onClick={() => onPlatformChange('claude')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                            isClaude
                                ? "bg-[#D97757] text-white shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
                        )}
                    >
                        <Bot className="w-4 h-4" />
                        Claude
                    </button>
                    <button
                        onClick={() => onPlatformChange('gemini')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                            isGemini
                                ? "bg-[#8E5CF7] text-white shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        Gemini
                    </button>
                    <button
                        onClick={() => onPlatformChange('grok')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                            isGrok
                                ? "bg-[#FF6B35] text-white shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50"
                        )}
                    >
                        <Lightbulb className="w-4 h-4" />
                        Grok
                    </button>
                </div>

                {/* Model Selector */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">{model}</span>
                    </div>

                    <Select value={model} onValueChange={onModelChange}>
                        <SelectTrigger className="w-full text-sm">
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            {isChatGPT && (
                                <>
                                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                </>
                            )}
                            {isClaude && (
                                <>
                                    <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                                </>
                            )}
                            {isGemini && (
                                <>
                                    <SelectItem value="gemini-2-flash">Gemini 2 Flash</SelectItem>
                                    <SelectItem value="gemini-1-5-pro">Gemini 1.5 Pro</SelectItem>
                                    <SelectItem value="gemini-1-5-flash">Gemini 1.5 Flash</SelectItem>
                                </>
                            )}
                            {isGrok && (
                                <>
                                    <SelectItem value="grok-4">Grok 4</SelectItem>
                                    <SelectItem value="grok-3">Grok 3</SelectItem>
                                    <SelectItem value="grok-2">Grok 2</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>

            </AccordionContent>
        </AccordionItem>
    );
}
