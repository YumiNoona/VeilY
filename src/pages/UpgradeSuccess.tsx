import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BadgeCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UpgradeSuccess = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyUpgrade = async () => {
            if (!user) {
                toast.error("No active session found.");
                navigate('/');
                return;
            }

            // Retry loop to ensure Stripe Webhook had time to hit Supabase
            let isVerified = false;
            for (let i = 0; i < 5; i++) {
                const { data } = await supabase
                    .from('users')
                    .select('is_premium')
                    .eq('id', user.id)
                    .single();

                if (data?.is_premium) {
                    isVerified = true;
                    setSuccess(true);
                    
                    // Force the AuthContext to instantly re-sync via Supabase event
                    supabase.auth.refreshSession();
                    break;
                }
                
                // Wait 1.5 seconds before retrying to give webhook time
                await new Promise(r => setTimeout(r, 1500));
            }

            if (!isVerified) {
                toast.error("Your payment is still processing or failed. Please contact support if you were charged.");
            }
            
            setVerifying(false);
        };

        verifyUpgrade();
    }, [user, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-border shadow-xl rounded-2xl p-8 text-center animate-in zoom-in-95 duration-500">
                {verifying ? (
                    <div className="flex flex-col items-center gap-6 py-6">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Verifying Payment...</h2>
                            <p className="text-sm text-muted-foreground">Please don't close this window. We're connecting with Stripe.</p>
                        </div>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center gap-6 py-6 fade-in duration-500">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                            <BadgeCheck className="w-10 h-10 text-green-600 dark:text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-foreground">Upgrade Successful!</h2>
                            <p className="text-sm text-muted-foreground">Your account is now Premium. All watermarks have been globally removed and PRO templates unlocked.</p>
                        </div>
                        <Button 
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                            onClick={() => navigate('/social')}
                        >
                            Start Creating
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 py-6 fade-in duration-500">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-foreground">Processing Delay</h2>
                            <p className="text-sm text-muted-foreground">We haven't received confirmation from Stripe yet. If your payment went through, your account will automatically upgrade shortly.</p>
                        </div>
                        <Button 
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => navigate('/social')}
                        >
                            Return to Editor
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpgradeSuccess;
