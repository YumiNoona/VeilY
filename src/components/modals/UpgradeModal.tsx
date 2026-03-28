import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Crown, Sparkles, Check, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { DoodleBackground } from '@/components/icons/DoodleBackground';
import { getApiUrl } from '@/lib/electron-utils';
import { supabase } from '@/lib/supabase';

import { open as openExternal } from '@tauri-apps/plugin-shell';

const PLANS = [
    {
        id: 'pro',
        name: 'Pro',
        price: '$20',
        description: 'Perfect for creators who need clean, rapid social mockups.',
        buttonText: 'Get Pro Access',
        icon: Sparkles,
        features: [
            'Clean, watermark-free exports',
            'Access to 15+ social platforms',
            'Basic AI Chat (ChatGPT & Gemini)',
            '20 AI Smart Fills / day',
            'High-quality PNG/JPG downloads',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '$40',
        description: 'The ultimate engine for high-fidelity chat storytelling.',
        buttonText: 'Get Premium Access',
        icon: Crown,
        highlight: true,
        features: [
            'Everything in Pro plan',
            'Bulk Chat Import (WA/Telegram)',
            'Advanced AI (Claude & Grok)',
            '100 AI Smart Fills / day',
            'Priority feature updates',
            'Unlimited lifetime access',
        ],
    }
];

export const UpgradeModal = () => {
    const { isUpgradeModalOpen, setUpgradeModalOpen, user, setAuthModalOpen } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (planId: string) => {
        if (!user) {
            setUpgradeModalOpen(false);
            setAuthModalOpen(true);
            return;
        }
        setLoading(planId);

        try {
            const apiUrl = getApiUrl('/api/create-checkout-session');

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                toast.error('Session expired. Please sign in again.');
                setUpgradeModalOpen(false);
                setAuthModalOpen(true);
                return;
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ userId: user.id, plan: planId })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to initiate checkout.');
            }

            const { url } = await response.json();

            // FIX: In Tauri/Electron, window.location.href = url navigates the app window
            // to stripe.com, which crashes the app (file:// → https:// navigation is
            // blocked, or the Stripe page loads inside the frameless shell with no way back).
            // Use shell.open so Stripe opens in the user's default desktop browser.
            if ((window as any).__TAURI_INTERNALS__) {
                await openExternal(url);
            } else if ((window as any).electronAPI?.openExternal) {
                (window as any).electronAPI.openExternal(url);
            } else {
                // Web: open in new tab so user doesn't lose the app
                window.open(url, '_blank');
            }

        } catch (err: any) {
            toast.error(err.message || 'Failed to initiate checkout.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <Dialog open={isUpgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
            <DialogContent hideClose className="sm:max-w-[850px] p-0 overflow-hidden bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl">
                <div className="relative flex flex-col h-full bg-white max-h-[90vh] overflow-y-auto scrollbar-hide">

                    <div className="absolute inset-0 z-0 text-zinc-950 opacity-[0.08]">
                        <DoodleBackground />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white/95" />
                    </div>

                    <button
                        onClick={() => setUpgradeModalOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 shadow-sm hover:bg-zinc-100 transition-all active:scale-95 group"
                        title="Close"
                    >
                        <X className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900" />
                    </button>

                    <div className="relative z-10 p-8 space-y-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center rounded-2xl shadow-xl shadow-zinc-200 rotate-6">
                                <Sparkles className="w-9 h-9 text-white fill-white" />
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                                    Unlock the full potential
                                </h2>
                                <p className="text-sm text-zinc-500 font-medium max-w-[320px] mx-auto leading-relaxed">
                                    Pick a plan to export watermark-free and access ultra-high resolution.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {PLANS.map((p) => {
                                const Icon = p.icon;
                                return (
                                    <div
                                        key={p.id}
                                        className={cn(
                                            "relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group",
                                            p.highlight
                                                ? "border-zinc-900 bg-zinc-50/50 shadow-sm"
                                                : "border-zinc-100 bg-white hover:border-zinc-200"
                                        )}
                                        onClick={() => handleUpgrade(p.id)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                                    p.highlight ? "bg-zinc-900 text-white rotate-6 shadow-lg shadow-zinc-200" : "bg-zinc-50 text-zinc-400 group-hover:-rotate-6"
                                                )}>
                                                    {Icon && <Icon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-zinc-900 tracking-tight">{p.name}</h3>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{p.price} LIFETIME ACCESS</p>
                                                </div>
                                            </div>
                                            {p.highlight && (
                                                <div className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight">BEST VALUE</div>
                                            )}
                                        </div>

                                        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                                            {p.description}
                                        </p>

                                        <div className="space-y-3 mb-6">
                                            {p.features?.map((f, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full flex items-center justify-center",
                                                        p.highlight ? "bg-zinc-900/10 text-zinc-900" : "bg-zinc-50 text-zinc-400"
                                                    )}>
                                                        <Check className="w-3 h-3 stroke-[3]" />
                                                    </div>
                                                    <span className="text-xs font-semibold text-zinc-600">{f}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            disabled={!!loading}
                                            className={cn(
                                                "w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.98] group/btn",
                                                p.highlight
                                                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                                                    : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                                            )}
                                        >
                                            {loading === p.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    {p.buttonText}
                                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                );
            })}
                        </div>

                        {!user && (
                            <div className="text-center pt-2">
                                <p className="text-sm text-zinc-400">
                                    Already have an account?{" "}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setUpgradeModalOpen(false);
                                            setAuthModalOpen(true);
                                        }}
                                        className="font-bold text-zinc-900 hover:text-black transition-colors hover:underline"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
