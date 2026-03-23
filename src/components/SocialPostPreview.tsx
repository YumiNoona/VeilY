import React, { useRef } from 'react';
import { SocialPostState, SocialPlatform } from '@/hooks/useSocialPostState';
import { TwitterPost } from './social/TwitterPost';
import { InstagramPost } from './social/InstagramPost';
import { LinkedInPost } from './social/LinkedInPost';
import { FacebookPost } from './social/FacebookPost';
import { RedditPost } from './social/RedditPost';
import { Download, Copy, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Watermark } from '@/components/Watermark';
import { exportAsImage, copyToClipboard } from '@/lib/export-utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SocialPostPreviewProps {
    state: SocialPostState;
}

export interface SocialPostPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
    getRef: () => React.RefObject<HTMLDivElement>;
}

export const SocialPostPreview = React.forwardRef<SocialPostPreviewRef, SocialPostPreviewProps>(({ state }, ref) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const { user, plan, downloadsUsed, setAuthModalOpen, setUpgradeModalOpen, incrementDownloads } = useAuth();

    React.useImperativeHandle(ref, () => ({
        handleDownload,
        handleCopy,
        getRef: () => previewRef
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
        if (plan === 'free' && (3 - downloadsUsed) <= 0) {
            toast.error("You've reached your free export limit! Please upgrade to continue.");
            setUpgradeModalOpen(true);
            return;
        }

        if (!previewRef.current) return;
        try {
            await exportAsImage(previewRef.current, {
                scale: 2,
                filename: `veily-${state.platform}-post-${Date.now()}.png`
            });
            await incrementDownloads();
            toast.success("Mockup downloaded!");
        } catch (err) {
            toast.error("Failed to download image");
        }
    };

    const handleCopy = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (!previewRef.current) return;
        try {
            const success = await copyToClipboard(previewRef.current, 2);
            if (success) toast.success("Image copied to clipboard!");
            else toast.error("Failed to copy image");
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
                    <Watermark />
                </div>
            </div>
        </main>
    );
});
