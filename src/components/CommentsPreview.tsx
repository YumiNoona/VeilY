import React, { useRef } from 'react';
import { useCommentState } from '@/hooks/useCommentState';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';

import { InstagramComments } from './comments/InstagramComments';
import { TikTokComments } from './comments/TikTokComments';
import { TwitterComments } from './comments/TwitterComments';
import { YouTubeComments } from './comments/YouTubeComments';

interface CommentsPreviewProps {
    state: ReturnType<typeof useCommentState>['state'];
}

export interface CommentsPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
}

export const CommentsPreview = React.forwardRef<CommentsPreviewRef, CommentsPreviewProps>(({ state }, ref) => {
    const previewRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
        handleDownload,
        handleCopy
    }));

    const handleDownload = async () => {
        if (!previewRef.current) return;

        try {
            const canvas = await html2canvas(previewRef.current, {
                backgroundColor: null,
                scale: 2, // Retain high quality
            });

            const link = document.createElement('a');
            link.download = `veily-comments-${state.platform}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png'); // Using toDataURL for browser download
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    const handleCopy = async () => {
        if (!previewRef.current) return;

        try {
            const canvas = await html2canvas(previewRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    // Could add toast notification here
                    alert("Copied to clipboard!");
                } catch (err) {
                    console.error("Copy failed:", err);
                    alert("Failed to copy.");
                }
            });
        } catch (err) {
            console.error("Copy generation failed:", err);
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
                    className="relative transition-all duration-300 ease-in-out"
                    // Add some spacing around the preview for export capture
                    style={{ padding: '2rem' }}
                >
                    {renderPlatformPreview()}

                    {state.config.showWatermark && (
                        <div className="absolute bottom-2 right-1/2 translate-x-1/2 opacity-30 text-xs font-bold pointer-events-none">
                            VEILY
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
});
