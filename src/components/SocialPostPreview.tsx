import React, { useRef } from 'react';
import { SocialPostState, SocialPlatform } from '@/hooks/useSocialPostState';
import { TwitterPost } from './social/TwitterPost';
import { InstagramPost } from './social/InstagramPost';
import { LinkedInPost } from './social/LinkedInPost';
import { FacebookPost } from './social/FacebookPost';
import { Download, Copy, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface SocialPostPreviewProps {
    state: SocialPostState;
}

export interface SocialPostPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
}

export const SocialPostPreview = React.forwardRef<SocialPostPreviewRef, SocialPostPreviewProps>(({ state }, ref) => {
    const previewRef = useRef<HTMLDivElement>(null);

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
            default: return TwitterPost;
        }
    };

    const PostComponent = getPlatformComponent(state.platform);

    const handleDownload = async () => {
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
            toast.success("Image downloaded successfully!");
        } catch (err) {
            toast.error("Failed to download image");
            console.error(err);
        }
    };

    const handleCopy = async () => {
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
                    className="transition-all duration-300 ease-in-out p-8 rounded-xl"
                    style={{
                        backgroundColor: state.config.transparentBackground
                            ? 'transparent'
                            : (state.config.theme === 'dark' ? '#09090b' : '#ffffff') // Zinc-950 or White backdrop
                    }}
                >
                    <PostComponent state={state} />

                    {state.config.showWatermark && (
                        <div className="mt-4 flex justify-center opacity-30 pointer-events-none">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Veily.app</span>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
});
