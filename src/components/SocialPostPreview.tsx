import React, { useRef } from 'react';
import { SocialPostState, SocialPlatform } from '@/hooks/useSocialPostState';
import { TwitterPost } from './social/TwitterPost';
import { InstagramPost } from './social/InstagramPost';
import { LinkedInPost } from './social/LinkedInPost';
import { FacebookPost } from './social/FacebookPost';
import { RedditPost } from './social/RedditPost';
import { Download, Copy, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface SocialPostPreviewProps {
    state: SocialPostState;
}

export interface SocialPostPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
}

export const SocialPostPreview = React.forwardRef<SocialPostPreviewRef, SocialPostPreviewProps>(({ state }, ref) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const { user, plan, downloadsUsed, setAuthModalOpen, setUpgradeModalOpen } = useAuth();

    React.useImperativeHandle(ref, () => ({
        handleDownload,
        handleCopy
    }));

    const getPlatformComponent = (platform: SocialPlatform) => {
        switch (platform) {
            case 'twitter': return TwitterPost;
            case 'instagram': return InstagramPost;
            case 'linkedin': return LinkedInPost;
            case 'facebook': return FacebookPost;
            case 'reddit': return RedditPost;
            default: return TwitterPost;
        }
    };

    const PostComponent = getPlatformComponent(state.platform);

    const handleDownload = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        
        // Tiered download limits
        if (plan === 'free' && downloadsUsed >= 5) {
            toast.error("You've reached your free download limit (5/month). Please upgrade to continue.");
            setUpgradeModalOpen(true);
            return;
        }

        if (!previewRef.current) return;
        try {
            const canvas = await html2canvas(previewRef.current, {
                backgroundColor: state.config.transparentBackground ? null : (state.config.theme === 'dark' ? '#000000' : '#ffffff'),
                scale: 2,
            });
            const link = document.createElement('a');
            link.download = `veily-${state.platform}-post.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Securely track usage on backend
            const { data: { session } } = await supabase.auth.getSession();
            await fetch('/api/track-usage', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ type: 'download' })
            });
            
            toast.success(plan === 'free' ? `Downloaded (Usage: ${downloadsUsed + 1}/5)` : "Image downloaded successfully!");
        } catch (err) {
            toast.error("Failed to download image");
            console.error(err);
        }
    };

    const handleCopy = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (!previewRef.current) return;
        try {
            const canvas = await html2canvas(previewRef.current, {
                backgroundColor: state.config.transparentBackground ? null : (state.config.theme === 'dark' ? '#000000' : '#ffffff'),
                scale: 2,
            });
            canvas.toBlob(async (blob) => {
                if (blob) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    toast.success("Image copied to clipboard!");
                }
            });
        } catch (err) {
            toast.error("Failed to copy image");
        }
    };

    return (
        <main className="flex-1 flex flex-col h-full bg-muted/30 relative overflow-hidden">
            {/* Viewport */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div
                    ref={previewRef}
                    className="transition-all duration-300 ease-in-out p-8 rounded-xl relative"
                    style={{
                        backgroundColor: state.config.transparentBackground
                            ? 'transparent'
                            : (state.config.theme === 'dark' ? '#09090b' : '#ffffff') // Zinc-950 or White backdrop
                    }}
                >
                    <PostComponent state={state} />

                    {plan === 'free' && (
                        <div className="absolute bottom-3 right-4 opacity-60 pointer-events-none">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mix-blend-difference drop-shadow-md">Veily.app</span>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
});
