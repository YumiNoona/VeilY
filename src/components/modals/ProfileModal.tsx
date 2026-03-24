import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Camera, Loader2, X, User, Mail, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

export const ProfileModal = () => {
    const { 
        user, 
        fullName, 
        avatarUrl, 
        isProfileModalOpen, 
        setProfileModalOpen, 
        updateProfile,
        signOut 
    } = useAuth();
    
    const [name, setName] = useState(fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isProfileModalOpen) {
            setName(fullName || '');
            setEmail(user?.email || '');
        }
    }, [isProfileModalOpen, fullName, user?.email]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({ full_name: name });
            // Email update logic (requires confirmation usually)
            if (email !== user?.email) {
                const { error } = await supabase.auth.updateUser({ email });
                if (error) throw error;
                toast.success("Confirmation email sent to your new address!");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File is too big! Max size is 2MB.");
            return;
        }

        setIsUploading(true);
        const uploadToast = toast.loading("Uploading avatar...");

        try {
            const fileName = `${user?.id}/avatar.png`;
            
            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { 
                    upsert: true,
                    cacheControl: '0'
                });

            if (uploadError) throw uploadError;

            // Get the URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
            
            // Update the profile in DB and metadata
            await updateProfile({ avatar_url: cacheBustedUrl });
            
            toast.success("Avatar updated!", { id: uploadToast });
        } catch (error: any) {
            console.error("Avatar upload process failed:", error);
            toast.error(error.message || "Upload failed", { id: uploadToast });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveAvatar = async () => {
        try {
            await updateProfile({ avatar_url: "" });
            toast.success("Avatar removed");
        } catch (error: any) {
            toast.error(error.message || "Failed to remove avatar");
        }
    };

    const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-3xl">
                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <User className="w-6 h-6 text-primary" />
                            Profile Settings
                        </DialogTitle>
                    </DialogHeader>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4 pt-2">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-4 border-muted shadow-lg ring-offset-4 ring-2 ring-transparent transition-all duration-300">
                                <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                                <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-black">
                                    {userInitial}
                                </AvatarFallback>
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </Avatar>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleAvatarUpload} 
                            />
                            {avatarUrl && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleRemoveAvatar}
                                    className="h-8 rounded-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                >
                                    <X className="w-3.5 h-3.5 mr-1.5" />
                                    Remove Photo
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Display Name</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-9 h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none"
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9 h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground ml-1 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                Changing email requires new verification
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-xl transition-all active:scale-[0.98]"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => {
                                setProfileModalOpen(false);
                                signOut();
                            }}
                            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
