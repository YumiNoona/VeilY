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
    platform: string;
}

export function SmartFillModal({ isOpen, onClose, onSuccess, platform }: SmartFillModalProps) {
    const { plan, aiFillsUsed, refetchUserStatus } = useAuth();
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const AI_LIMITS = {
        free: 0,
        pro: 20,
        premium: 100
    };

    const currentLimit = AI_LIMITS[plan] || 0;
    const isLimitReached = aiFillsUsed >= currentLimit;

    const getPlaceholder = () => {
        if (platform === 'social_post') return "e.g., A viral tech news post about a new AI discovery, with high engagement metrics.";
        if (platform === 'comment_thread') return "e.g., A supportive thread of comments for a marathon runner, with diverse profile names.";
        if (platform === 'email_thread') return "e.g., A professional project kickoff email with a polite and inviting tone.";
        return "e.g., A funny argument between roommates about whose turn it is to do the dishes, with lots of emojis.";
    };

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
        setError(null);
        try {
            // Enhanced prompt context based on platform
            let enhancedPrompt = prompt;
            if (platform === 'social_post') {
                enhancedPrompt = `[MODE: SOCIAL_POST] Generate a professional social media post with content, author, and metrics. Scenario: ${prompt}`;
            } else if (platform === 'comment_thread') {
                enhancedPrompt = `[MODE: COMMENT_THREAD] Generate a realistic thread of comments with names and profiles. Scenario: ${prompt}`;
            } else if (platform === 'email_thread') {
                enhancedPrompt = `[MODE: EMAIL_THREAD] Generate a professional email thread with subject and participants. Scenario: ${prompt}`;
            }

            const data = await generateSmartFill(enhancedPrompt, platform);
            await refetchUserStatus(); // Sync total usage
            onSuccess(data);
            onClose();
            setPrompt("");
            toast.success("AI Generation successful!");
        } catch (err: any) {
            const msg = err.message || "Failed to generate AI content.";
            setError(msg);
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
                        {platform === 'email_thread' ? "Describe your email's goal and let AI write the thread for you." :
                         platform === 'social_post' ? "Describe your post topic and let AI craft the perfect caption." :
                         platform === 'comment_thread' ? "Describe the vibe and let AI generate realistic feedback." :
                         "Describe a scenario and let AI generate the entire conversation for you instantly."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {platform === 'email_thread' ? "Email Scenario" :
                                 platform === 'social_post' ? "Post Scenario" :
                                 platform === 'comment_thread' ? "Comment Vibe" :
                                 "Conversation Scenario"}
                            </label>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                isLimitReached ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
                            )}>
                                {aiFillsUsed} / {currentLimit} Daily Uses
                            </span>
                        </div>
                        <Textarea
                            placeholder={getPlaceholder()}
                            className={cn(
                                "min-h-[120px] resize-none",
                                error && "border-red-500 focus-visible:ring-red-500"
                            )}
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                if (error) setError(null);
                            }}
                            disabled={isLoading || isLimitReached}
                        />
                        {error && (
                            <p className="text-[11px] text-red-500 mt-1.5 font-medium flex items-center gap-1">
                                ⚠️ {error}
                            </p>
                        )}
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
                        {isLoading ? "Generating..." : error ? "Try Again" : isLimitReached ? "Daily Limit Reached" : "Generate Magic"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
