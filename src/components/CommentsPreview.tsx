import React, { useRef } from 'react';
import { useCommentState } from '@/hooks/useCommentState';
import { Button } from '@/components/ui/button';
import { exportAsImage, copyToClipboard } from '@/lib/export-utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import { InstagramComments } from './comments/InstagramComments';
import { TikTokComments } from './comments/TikTokComments';
import { TwitterComments } from './comments/TwitterComments';
import { YouTubeComments } from './comments/YouTubeComments';
import { Watermark } from '@/components/Watermark';

interface CommentsPreviewProps {
    state: ReturnType<typeof useCommentState>['state'];
}

export interface CommentsPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
    getRef: () => React.RefObject<HTMLDivElement>;
}

export const CommentsPreview = React.forwardRef<CommentsPreviewRef, CommentsPreviewProps>(({ state }, ref) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const { user, plan, downloadsUsed, setAuthModalOpen, setUpgradeModalOpen, incrementDownloads } = useAuth();

    React.useImperativeHandle(ref, () => ({
        handleDownload,
        handleCopy,
        getRef: () => previewRef
    }));

    const handleDownload = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (plan === 'free' && (3 - downloadsUsed) <= 0) {
            toast.error("You've reached your free export limit!");
            setUpgradeModalOpen(true);
            return;
        }

        if (!previewRef.current) return;

        try {
            await exportAsImage(previewRef.current, {
                scale: 2,
                filename: `veily-comments-${state.platform}-${Date.now()}.png`
            });
            await incrementDownloads();
            toast.success("Mockup downloaded!");
        } catch (err) {
            toast.error("Download failed");
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
            if (success) toast.success("Copied to clipboard!");
            else toast.error("Failed to copy image");
        } catch (err) {
            toast.error("Copy failed");
        }
    };

    const renderPlatformPreview = () => {
        switch (state.platform) {
            case 'instagram': return <InstagramComments state={state} />;
            case 'tiktok': return <TikTokComments state={state} />;
            case 'twitter': return <TwitterComments state={state} />;
            case 'youtube': return <YouTubeComments state={state} />;
            default: return <InstagramComments state={state} />;
        }
    };

    return (
        <main className="flex-1 h-full bg-gray-50/50 dark:bg-[#09090b] flex flex-col overflow-hidden relative">
            <div className="flex-1 overflow-auto flex items-center justify-center p-8">
                <div
                    ref={previewRef}
                    className="transition-all duration-300 ease-in-out"
                    // Add some spacing around the preview for export capture
                    style={{ padding: '2rem' }}
                >
                    <div className="relative">
                        {renderPlatformPreview()}
                        <Watermark isDark={state.config.theme === 'dark'} />
                    </div>
                </div>
            </div>
        </main>
    );
});
