import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Crown, Sparkles, Check, Heart, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$20',
    description: 'Perfect for getting started with clean exports.',
    buttonText: 'Get Pro Access',
    icon: Sparkles,
    features: [
      'Clean, watermark-free exports',
      'Access to all social platforms',
      'High-quality PNG/JPG downloads',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$40',
    description: 'The ultimate toolkit for power creators.',
    buttonText: 'Get Premium Access',
    icon: Crown,
    highlight: true,
    features: [
      'Everything in Pro plan',
      'Unlock all premium templates',
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
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, plan: planId })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to initiate checkout.');
            }
            
            const { url } = await response.json();
            window.location.href = url;
            
        } catch (err: any) {
            toast.error(err.message || 'Failed to initiate checkout.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <Dialog open={isUpgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-background border-border/40 shadow-2xl rounded-3xl">
                <div className="flex flex-col h-full bg-white dark:bg-zinc-950 p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">
                            Get clean, watermark-free exports
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Your mockup is ready. Pick a plan to export it clean, without the watermark.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                        {PLANS.map((p) => {
                            const Icon = p.icon;
                            
                            return (
                                <div 
                                    key={p.id}
                                    className={cn(
                                        "relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                                        p.highlight 
                                            ? "border-primary bg-primary/5 hover:border-primary/80" 
                                            : "border-border hover:border-foreground/20 hover:bg-muted/30"
                                    )}
                                    onClick={() => handleUpgrade(p.id)}
                                >
                                    {p.highlight && (
                                        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                                            <Star className="absolute -top-2 -right-2 w-16 h-16 text-primary rotate-12" />
                                            <Heart className="absolute top-12 right-12 w-8 h-8 text-primary -rotate-12" />
                                            <Zap className="absolute bottom-10 -left-4 w-12 h-12 text-primary rotate-45" />
                                            <Sparkles className="absolute top-20 left-10 w-6 h-6 text-primary" />
                                        </div>
                                    )}

                                    {p.highlight && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                    )}

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {Icon && <Icon className={cn("w-5 h-5", p.highlight ? "text-primary" : "text-muted-foreground")} />}
                                                <h3 className="font-bold text-lg">{p.name}</h3>
                                            </div>
                                            <span className="text-xl font-black">{p.price}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {p.description}
                                        </p>

                                        <div className="space-y-2 mb-6">
                                            {p.features?.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-medium text-foreground/80">{f}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            disabled={!!loading}
                                            className={cn(
                                                "w-full h-12 rounded-xl text-sm font-bold transition-all duration-300",
                                                p.highlight
                                                    ? "bg-primary text-primary-foreground hover:shadow-xl hover:-translate-y-0.5"
                                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                            )}
                                        >
                                            {loading === p.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : p.buttonText}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!user && (
                        <div className="text-center mt-2 pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setUpgradeModalOpen(false);
                                        setAuthModalOpen(true);
                                    }}
                                    className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
