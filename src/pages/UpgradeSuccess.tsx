import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpgradeSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
            <div className="w-full max-w-md bg-white border border-border shadow-xl rounded-2xl p-8 text-center animate-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center gap-6 py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-foreground">Premium Active</h2>
                        <p className="text-sm text-muted-foreground">All features are unlocked. No watermarks, no limits.</p>
                    </div>
                    <Button
                        className="w-full mt-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold"
                        onClick={() => navigate('/')}
                    >
                        Start Creating
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeSuccess;
