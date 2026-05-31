import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Crown, X, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export const UpgradeModal = () => {
    const { isUpgradeModalOpen, setUpgradeModalOpen } = useAuth();

    return (
        <Dialog open={isUpgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl">
                <div className="relative p-8 text-center space-y-6">
                    <button
                        onClick={() => setUpgradeModalOpen(false)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 shadow-sm hover:bg-zinc-100 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>

                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center rounded-2xl shadow-xl shadow-zinc-200 rotate-6">
                            <Crown className="w-9 h-9 text-white fill-white" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-zinc-900">
                            Premium Active
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium">
                            You're on the Premium plan — all features are unlocked!
                        </p>
                    </div>

                    <div className="space-y-2 text-left bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                        {[
                            'All 20+ platform mockups',
                            'Unlimited 4K exports (no watermark)',
                            'Unlimited AI Smart Fill generations',
                            'Bulk chat import (WhatsApp & Telegram)',
                            'All AI models (ChatGPT, Claude, Gemini, Grok)',
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900/10 flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-zinc-900 stroke-[3]" />
                                </div>
                                <span className="text-xs font-semibold text-zinc-600">{f}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={() => setUpgradeModalOpen(false)}
                        className={cn(
                            "w-full h-12 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800",
                            "font-bold shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]"
                        )}
                    >
                        Got it
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
