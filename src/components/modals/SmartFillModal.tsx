import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { generateSmartFill } from "@/lib/ai-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Platform } from "@/types/chat";
import { ParsedChat } from "@/lib/parsers";

interface SmartFillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: ParsedChat) => void;
    platform: Platform;
}

export function SmartFillModal({ isOpen, onClose, onSuccess, platform }: SmartFillModalProps) {
    const { plan, aiFillsUsed, refetchUserStatus } = useAuth();
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const AI_LIMITS = {
        free: 0,
        pro: 20,
        premium: 100
    };

    const currentLimit = AI_LIMITS[plan] || 0;
    const isLimitReached = aiFillsUsed >= currentLimit;

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a scenario prompt first!");
            return;
        }

        if (isLimitReached) {
            toast.error(`Daily limit reached (${currentLimit} generations). Please try again tomorrow or upgrade!`);
            return;
        }

        setIsLoading(true);
        try {
            const data = await generateSmartFill(prompt, platform);
            await refetchUserStatus(); // Sync the newly incremented usage from the backend
            onSuccess(data);
            onClose();
            setPrompt("");
            toast.success("AI Generation successful!");
        } catch (error: any) {
            toast.error(error.message || "Failed to generate AI conversation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        AI Smart Fill
                    </DialogTitle>
                    <DialogDescription>
                        Describe a scenario and let AI generate the entire conversation for you instantly.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Conversation Scenario
                            </label>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                isLimitReached ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
                            )}>
                                {aiFillsUsed} / {currentLimit} Daily Uses
                            </span>
                        </div>
                        <Textarea
                            placeholder="e.g., A funny argument between roommates about whose turn it is to do the dishes, with lots of emojis."
                            className="min-h-[120px] resize-none"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading || isLimitReached}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading || isLimitReached || !prompt.trim()}
                        className={cn(
                            "bg-purple-600 hover:bg-purple-700 text-white gap-2",
                            isLimitReached && "bg-zinc-400 hover:bg-zinc-400 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wand2 className="w-4 h-4" />
                        )}
                        {isLoading ? "Generating..." : isLimitReached ? "Daily Limit Reached" : "Generate Magic"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
