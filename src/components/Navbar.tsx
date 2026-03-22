import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { 
    MessageSquare, 
    Share2, 
    Bot, 
    MessageCircle, 
    Crown, 
    User as UserIcon, 
    LogOut, 
    Settings,
    UserCircle,
    Camera,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

export const Navbar = () => {
    const location = useLocation();
    const { user, plan, setAuthModalOpen, setUpgradeModalOpen, signOut, updateProfile, avatarUrl } = useAuth();
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tabs = [
        { id: "chat", label: "Chat", path: "/", icon: MessageSquare },
        { id: "ai-chat", label: "AI Chat", path: "/ai-chat", icon: Bot },
        { id: "social", label: "Social", path: "/social", icon: Share2 },
        { id: "comments", label: "Comments", path: "/comments", icon: MessageCircle },
    ];

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Ensure we have a fresh, valid user session
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !currentUser) {
            console.error("Auth verification failed before upload:", authError);
            toast.error("You must be signed in to upload an avatar.");
            return;
        }

        // Client-side size check (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File is too big! Max size is 2MB.");
            return;
        }

        setIsUploading(true);
        const uploadToast = toast.loading("Uploading avatar...");
        console.log("Avatar upload process started for User ID:", currentUser.id);

        try {
            // CRITICAL: Path MUST start with User ID and match the RLS policy: (storage.foldername(name))[1]
            const fileName = `${currentUser.id}/avatar.png`;
            
            // Create a promise that rejects after 15 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("UPLOAD_TIMEOUT")), 15000);
            });

            // The actual upload and sync logic
            const uploadLogic = (async () => {
                console.log("Uploading to Storage path:", fileName);
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, file, { 
                        upsert: true,
                        cacheControl: '0'
                    });

                if (uploadError) {
                    console.error("Supabase Storage Error:", uploadError);
                    throw new Error(uploadError.message);
                }

                console.log("Fetching Public URL...");
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
                console.log("Syncing to Database...");
                await updateProfile({ avatar_url: cacheBustedUrl });
                return true;
            })();

            // Race the upload against the timeout
            await Promise.race([uploadLogic, timeoutPromise]);
            
            console.log("Upload process completed successfully!");
            toast.success("Avatar updated!", { id: uploadToast });
        } catch (error: any) {
            console.error("Avatar upload failed:", error);
            if (error.message === "UPLOAD_TIMEOUT") {
                toast.error("Upload timed out. Please check your connection or bucket status.", { id: uploadToast });
            } else {
                toast.error(error.message || "Upload failed. Verify bucket 'avatars' exists.", { id: uploadToast });
            }
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            console.log("Process cleaned up.");
        }
    };

    const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <nav className="h-16 border-b border-border bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 shrink-0">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
            />

            {/* LEFT: Logo */}
            <div className="flex items-center w-[200px]">
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            
            {/* MIDDLE: Navigation Tabs */}
            <div className="hidden md:flex flex-1 justify-center">
                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.id}
                                to={tab.path}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: User Actions */}
            <div className="flex items-center justify-end gap-3 w-[200px]">
                {!user ? (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAuthModalOpen(true)}
                        className="text-[13px] font-semibold"
                    >
                        Sign In
                    </Button>
                ) : (
                    <div className="flex items-center gap-3">
                        {plan === 'free' && (
                            <Button 
                                size="sm" 
                                onClick={() => setUpgradeModalOpen(true)}
                                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 shadow-md gap-2 h-9 px-4 rounded-full text-[13px] font-bold"
                            >
                                <Crown className="w-3.5 h-3.5" />
                                Upgrade
                            </Button>
                        )}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    disabled={isUploading}
                                    className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all duration-200 disabled:cursor-not-allowed group"
                                >
                                    <Avatar className="w-9 h-9 border border-border shadow-sm group-hover:opacity-90 transition relative overflow-hidden">
                                        <AvatarImage src={avatarUrl || undefined} />
                                        <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                                            {userInitial}
                                        </AvatarFallback>
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                            </div>
                                        )}
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-1 p-1">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-xs font-medium leading-none text-muted-foreground">Signed in as</p>
                                        <p className="text-sm font-semibold leading-none truncate">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change Avatar
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => signOut()}
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </nav>
    );
};
