import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const UpgradeModal = () => {
    const { isUpgradeModalOpen, setUpgradeModalOpen, user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) return;
        setLoading(true);
        
        try {
            // Initiate Stripe Checkout via Serverless edge function
            // Awaiting physical stripe keys from environment, stubbed redirect meanwhile:
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            
            if (!response.ok) {
               // Fallback mock representation for local routing demonstrations
               toast.info('Stripe Checkout stubbed! Firing metadata to webhook later.');
               toast.loading('Redirecting to checkout processor...', { duration: 1500 });
               setTimeout(() => {
                 setUpgradeModalOpen(false);
                 window.location.href = '/upgrade/success';
               }, 1500);
               return;
            }
            
            const { url } = await response.json();
            window.location.href = url;
            
        } catch (err: any) {
            toast.error(err.message || 'Failed to initiate checkout.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isUpgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                        Upgrade to Premium
                    </DialogTitle>
                    <DialogDescription>
                        Unlock the full potential of Veily by upgrading your account.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                    <ul className="space-y-3 w-full px-4 text-sm font-medium">
                        <li className="flex items-center gap-2.5"><BadgeCheck className="w-4 h-4 text-green-500"/> Remove watermarks globally</li>
                        <li className="flex items-center gap-2.5"><BadgeCheck className="w-4 h-4 text-green-500"/> Export high-res screenshots</li>
                        <li className="flex items-center gap-2.5"><BadgeCheck className="w-4 h-4 text-green-500"/> Unlock advanced AI Templates</li>
                    </ul>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setUpgradeModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpgrade} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upgrade Now - $19
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
