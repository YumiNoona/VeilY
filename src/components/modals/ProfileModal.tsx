import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, User, Heart } from 'lucide-react';
import { SupportModal } from '@/components/modals/SupportModal';

export const ProfileModal = () => {
    const {
        fullName,
        isProfileModalOpen,
        setProfileModalOpen,
        updateProfile,
    } = useAuth();

    const [name, setName] = useState(fullName || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    useEffect(() => {
        if (isProfileModalOpen) {
            setName(fullName || '');
        }
    }, [isProfileModalOpen, fullName]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({ full_name: name });
            toast.success("Profile updated!");
            setProfileModalOpen(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
        <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Display Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsSupportOpen(true)}
                            className="flex-1 text-pink-600 border-pink-200 hover:bg-pink-50 gap-2"
                        >
                            <Heart className="w-4 h-4 fill-pink-500" />
                            Donate
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        <SupportModal isOpen={isSupportOpen} onOpenChange={setIsSupportOpen} />
        </>
    );
};
