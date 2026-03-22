import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Loader2, Crown, Zap, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const PLAN_MODAL_DATA = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for casual users',
    features: [
      'Limited Chat Modules',
      'Max 5 Downloads / Month',
      'Watermark ON',
      'No Video Export'
    ],
    buttonText: 'Current Plan',
    disabled: true,
    highlight: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20',
    description: 'For content creators',
    features: [
      'ALL Chat Modules Unlocked',
      'No Watermarks',
      '10 Videos / Month',
      'Unlimited Image Downloads'
    ],
    buttonText: 'Upgrade to Pro',
    disabled: false,
    highlight: true,
    icon: Zap,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$40',
    description: 'Ultimate power & flexibility',
    features: [
      'Everything Unlocked',
      'Unlimited Images',
      'Unlimited Videos',
      'Priority Generation'
    ],
    buttonText: 'Get Premium',
    disabled: false,
    highlight: false,
    icon: Crown,
    color: 'from-amber-400 to-orange-500'
  }
];

export const UpgradeModal = () => {
    const { isUpgradeModalOpen, setUpgradeModalOpen, user, plan } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (planId: string) => {
        if (!user) return;
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
            <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-background border-border/40 shadow-2xl">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Main Content Area */}
                    <div className="flex-1 p-8">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-3xl font-black tracking-tight mb-2">
                                Choose Your Tier
                            </DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground">
                                Join thousands of creators getting the most out of Veily.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PLAN_MODAL_DATA.map((p) => {
                                const Icon = p.icon;
                                const isCurrent = plan === p.id;
                                
                                return (
                                    <div 
                                        key={p.id}
                                        className={cn(
                                            "relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group",
                                            p.highlight 
                                                ? "border-primary bg-primary/5 shadow-lg scale-[1.02] z-10" 
                                                : "border-border/50 hover:border-border hover:bg-muted/30"
                                        )}
                                    >
                                        {p.highlight && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-[10px] font-black uppercase text-primary-foreground rounded-full shadow-md">
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                {Icon && <Icon className={cn("w-5 h-5", p.id === 'premium' ? "text-amber-500" : "text-primary")} />}
                                                <h3 className="font-bold text-lg">{p.name}</h3>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black">{p.price}</span>
                                                <span className="text-muted-foreground text-xs">/month</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2 leading-tight">
                                                {p.description}
                                            </p>
                                        </div>

                                        <div className="flex-1 space-y-2.5 mb-6">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex items-start gap-2 text-[11px] leading-tight">
                                                    <Check className="w-3 h-3 mt-0.5 text-green-500 shrink-0" />
                                                    <span className="text-foreground/80">{f}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => handleUpgrade(p.id)}
                                            disabled={!!loading || p.disabled || isCurrent}
                                            className={cn(
                                                "w-full h-10 rounded-xl text-xs font-bold transition-all duration-300",
                                                p.highlight
                                                    ? "bg-primary text-primary-foreground hover:shadow-xl"
                                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                                                isCurrent && "bg-green-500/10 text-green-600 border border-green-500/20"
                                            )}
                                        >
                                            {loading === p.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                isCurrent ? "Active Plan" : p.buttonText
                                            )}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
