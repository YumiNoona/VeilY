import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { X, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AuthModal = () => {
    const { isAuthModalOpen, setAuthModalOpen } = useAuth();

    return (
        <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl">
                <div className="relative p-8 text-center space-y-5">
                    <button
                        onClick={() => setAuthModalOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCheck className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">You're all set</h2>
                        <p className="text-sm text-zinc-500">
                            Running in local mode — all features are unlocked. No account needed.
                        </p>
                    </div>

                    <Button
                        onClick={() => setAuthModalOpen(false)}
                        className={cn(
                            "w-full h-11 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800",
                            "font-bold shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]"
                        )}
                    >
                        Get Started
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
