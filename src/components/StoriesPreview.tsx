import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useStoriesState } from '@/hooks/useStoriesState';
import { Image as ImageIcon, X, MoreHorizontal, Signal, Wifi } from 'lucide-react';
import { Watermark } from '@/components/Watermark';

import { exportAsImage, copyToClipboard } from '@/lib/export-utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type StoriesState = ReturnType<typeof useStoriesState>['state'];

interface StoriesPreviewProps {
    state: StoriesState;
    onSlideChange?: (index: number) => void;
}

export interface StoriesPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
    getRef: () => React.RefObject<HTMLDivElement>;
}

/** Status bar mirrors ChatPreview's DeviceStatusBar */
const StatusBar = () => (
    <div className="h-6 px-5 flex items-center justify-between text-[12px] font-medium bg-black text-white absolute top-0 left-0 right-0 z-30">
        <span>9:41</span>
        <div className="flex items-center gap-1">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <div className="flex items-center gap-0.5">
                <div className="w-6 h-3 rounded-sm border border-white relative">
                    <div className="absolute left-0.5 top-0.5 bottom-0.5 rounded-[2px] bg-white" style={{ width: '80%' }} />
                </div>
                <div className="w-1 h-1.5 rounded-r-sm bg-white" />
            </div>
        </div>
    </div>
);

const StoryFrame: React.FC<{ state: StoriesState; onSlideChange?: (index: number) => void }> = ({ state, onSlideChange }) => {
    const slide = state.slides[state.activeSlideIndex];
    const isSnap = state.platform === 'snapchat';

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (state.activeSlideIndex < state.slides.length - 1) {
            onSlideChange?.(state.activeSlideIndex + 1);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (state.activeSlideIndex > 0) {
            onSlideChange?.(state.activeSlideIndex - 1);
        }
    };

    return (
        // Same dimensions + border as Chat: w-[375px] h-[812px] rounded-[40px] border-[8px] border-black
        <div className="w-[375px] h-[812px] overflow-hidden shadow-2xl rounded-[40px] border-[8px] border-black bg-black relative select-none group/frame">
            <div className="w-full h-full rounded-[32px] overflow-hidden relative">

                <StatusBar />

                {/* Story progress bars */}
                <div className="absolute top-7 left-0 right-0 z-50 flex gap-1 px-3">
                    {state.slides.map((_, i) => (
                        <button
                            key={i}
                            className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden relative cursor-pointer group-hover/frame:h-2 transition-all duration-200"
                            onClick={(e) => { e.stopPropagation(); onSlideChange?.(i); }}
                        >
                            <div
                                className="h-full bg-white rounded-full"
                                style={{
                                    width: i < state.activeSlideIndex ? '100%'
                                        : i === state.activeSlideIndex ? '100%' : '0%', // Simplified for manual nav
                                    opacity: i === state.activeSlideIndex ? '1' : '0.5'
                                }}
                            />
                        </button>
                    ))}
                </div>

                {/* Click Areas for Navigation */}
                <div 
                    data-html2canvas-ignore="true"
                    className="absolute inset-0 z-30 flex"
                >
                    <div className="flex-1 h-full cursor-pointer" onClick={handlePrev} />
                    <div className="flex-1 h-full cursor-pointer" onClick={handleNext} />
                </div>

                {/* Story header */}
                <div className="absolute top-11 left-0 right-0 z-40 flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                        {isSnap ? (
                            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-white">
                                <span className="text-black text-[13px] font-bold">{state.username[0]?.toUpperCase()}</span>
                            </div>
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
                                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                                    <span className="text-white text-[11px] font-bold">{state.username[0]?.toUpperCase()}</span>
                                </div>
                            </div>
                        )}
                        <span className="text-white text-[13px] font-semibold">{state.username}</span>
                        {state.verified && <span className="text-white text-[11px]">✓</span>}
                        <span className="text-white/60 text-[12px]">{state.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MoreHorizontal className="text-white w-5 h-5" />
                        <X className="text-white w-5 h-5" />
                    </div>
                </div>

                {/* Full-bleed story background */}
                <div className="absolute inset-0 bg-black">
                    {slide?.imageUrl ? (
                        <img src={slide.imageUrl} className="w-full h-full object-cover select-none" alt="Story" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/30">
                            <ImageIcon className="w-14 h-14" />
                            <span className="text-sm font-medium">No image</span>
                        </div>
                    )}
                </div>

                {/* Watermark/Badge */}
                <Watermark />

                {/* Bottom message bar */}
                <div className="absolute bottom-8 left-0 right-0 z-40 px-4 flex items-center gap-3">
                    <div className="flex-1 border border-white/40 rounded-full px-4 py-2.5">
                        <span className="text-white/50 text-[13px]">Send message...</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StoriesPreview = React.forwardRef<StoriesPreviewRef, StoriesPreviewProps>(({ state, onSlideChange }, ref) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const { user, plan, downloadsUsed, setAuthModalOpen, setUpgradeModalOpen, incrementDownloads } = useAuth();

    React.useImperativeHandle(ref, () => ({
        handleDownload: async () => {
            if (!user) {
                setAuthModalOpen(true);
                return;
            }

            if (plan === 'free' && (3 - downloadsUsed) <= 0) {
                toast.error("You've reached your free export limit!");
                setUpgradeModalOpen(true);
                return;
            }

            if (!captureRef.current) return;
            try {
                await exportAsImage(captureRef.current, {
                    scale: 2,
                    filename: `veily-story-${state.platform}-${Date.now()}.png`
                });
                await incrementDownloads();
                toast.success("Mockup downloaded!");
            } catch (err) {
                toast.error("Download failed");
            }
        },
        handleCopy: async () => {
            if (!user) {
                setAuthModalOpen(true);
                return;
            }

            if (!captureRef.current) return;
            try {
                const success = await copyToClipboard(captureRef.current, 2);
                if (success) toast.success("Copied to clipboard!");
                else toast.error("Failed to copy image");
            } catch (err) {
                toast.error("Copy failed");
            }
        },
        getRef: () => captureRef
    }));

    return (
        <div ref={captureRef} className="inline-block">
            <StoryFrame state={state} onSlideChange={onSlideChange} />
        </div>
    );
});
