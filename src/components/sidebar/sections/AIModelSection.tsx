import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Sparkles, Lightbulb, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/chat";
import { Input } from "@/components/ui/input";
import { AI_PROVIDER_CONFIG, isAIPlatform } from "@/lib/ai-models";

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

    const provider = isAIPlatform(platform) ? AI_PROVIDER_CONFIG[platform] : AI_PROVIDER_CONFIG.chatgpt;
    const isKnownModel = provider.models.some(option => option.id === model);
    const selectValue = isKnownModel ? model : '__custom__';
    const customValue = isKnownModel || model === 'Custom model' ? '' : model;

    const handlePlatformChange = (p: Platform) => {
        onPlatformChange(p);
        if (isAIPlatform(p)) onModelChange(AI_PROVIDER_CONFIG[p].defaultModel);
    };

    return (
        <AccordionItem value="app-model" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-base font-semibold">App & Model</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-4">

                {/* Platform Toggles - Grid Layout */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handlePlatformChange('chatgpt')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 border",
                            isChatGPT
                                ? "bg-[#7447D6] text-white shadow-sm border-[#7447D6]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/50"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        ChatGPT
                    </button>
                    <button
                        onClick={() => handlePlatformChange('claude')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 border",
                            isClaude
                                ? "bg-[#D97757] text-white shadow-sm border-[#D97757]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/50"
                        )}
                    >
                        <Bot className="w-4 h-4" />
                        Claude
                    </button>
                    <button
                        onClick={() => handlePlatformChange('gemini')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 border",
                            isGemini
                                ? "bg-[#8E5CF7] text-white shadow-sm border-[#8E5CF7]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/50"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        Gemini
                    </button>
                    <button
                        onClick={() => handlePlatformChange('grok')}
                        className={cn(
                            "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 border",
                            isGrok
                                ? "bg-[#FF6B35] text-white shadow-sm border-[#FF6B35]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/50"
                        )}
                    >
                        <Lightbulb className="w-4 h-4" />
                        Grok
                    </button>
                </div>

                <div className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold">Model</p>
                            <p className="mt-0.5 text-xs leading-4 text-muted-foreground">Choose a current model or enter any future model name.</p>
                        </div>
                        <span title={model} className="max-w-36 truncate rounded bg-primary/10 px-2 py-1 font-mono text-xs text-primary">{model || 'Select'}</span>
                    </div>

                    <Select value={selectValue} onValueChange={(value) => onModelChange(value === '__custom__' ? 'Custom model' : value)}>
                        <SelectTrigger className="h-9 w-full text-sm">
                            <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                            {provider.models.map(option => (
                                <SelectItem key={option.id} value={option.id}>
                                    <span className="flex items-center gap-2">
                                        <span>{option.label}</span>
                                        <span className="text-xs leading-4 text-muted-foreground">{option.description}</span>
                                    </span>
                                </SelectItem>
                            ))}
                            <SelectItem value="__custom__">Custom model name</SelectItem>
                        </SelectContent>
                    </Select>

                    {!isKnownModel && (
                        <div className="relative">
                            <PencilLine className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                value={customValue}
                                onChange={(event) => onModelChange(event.target.value)}
                                className="h-9 pl-8 text-sm"
                                placeholder="Enter model display name or ID"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

            </AccordionContent>
        </AccordionItem>
    );
}
