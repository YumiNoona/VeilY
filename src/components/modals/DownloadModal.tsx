import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Check,
    Clock3,
    Download,
    Film,
    Image as ImageIcon,
    Monitor,
    Sparkles,
    X,
    Zap,
} from 'lucide-react';
import { exportAsImage, exportAsVideo } from '@/lib/export-utils';
import { toast } from 'sonner';

type ExportType = 'image' | 'video';
type ExportQuality = 'sd' | 'hd' | '4k';
type ImageCaptureMode = 'full' | 'viewport';

interface DownloadModalProps {
    previewRef?: React.RefObject<HTMLElement>;
    getPreviewElement?: () => HTMLElement | null;
    onPrepareVideo?: () => void;
}

const qualityOptions = [
    { id: 'sd' as const, label: 'Standard', detail: 'Original size', targetLongEdge: null, icon: Zap },
    { id: 'hd' as const, label: 'HD', detail: 'Up to 1920px', targetLongEdge: 1920, icon: Sparkles },
    { id: '4k' as const, label: '4K', detail: 'Up to 3840px', targetLongEdge: 3840, icon: Monitor },
];

const videoDurations = [
    { value: 3000, label: '3 sec' },
    { value: 6000, label: '6 sec' },
    { value: 10000, label: '10 sec' },
];

export const DownloadModal: React.FC<DownloadModalProps> = ({
    previewRef,
    getPreviewElement,
    onPrepareVideo,
}) => {
    const { isDownloadModalOpen, setDownloadModalOpen, setSupportModalOpen } = useAuth();
    const [exportType, setExportType] = useState<ExportType>('image');
    const [quality, setQuality] = useState<ExportQuality>('hd');
    const [imageCaptureMode, setImageCaptureMode] = useState<ImageCaptureMode>('full');
    const [autoScrollVideo, setAutoScrollVideo] = useState(true);
    const [filename, setFilename] = useState('veily-mockup');
    const [durationMs, setDurationMs] = useState(6000);
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const availableQualities = useMemo(() => qualityOptions, []);

    const handleTypeChange = (type: ExportType) => {
        setExportType(type);
        setProgress(0);
    };

    const resolvePreview = () => {
        const candidate = getPreviewElement?.() ?? previewRef?.current ?? null;
        if (!candidate) return null;
        if (candidate.matches('[data-export-root]')) return candidate;
        return candidate.querySelector<HTMLElement>('[data-export-root]') ?? candidate;
    };

    const getPresetScale = (element: HTMLElement, preset: typeof qualityOptions[number]) => {
        if (!preset.targetLongEdge) return 1;
        const longestEdge = Math.max(element.offsetWidth, element.offsetHeight, 1);
        return Math.min(8, Math.max(1, preset.targetLongEdge / longestEdge));
    };
    const hasConversation = isDownloadModalOpen && !!resolvePreview()?.querySelector('[data-chat-scroll], [data-chat-message]');
    const safeFilename = filename.trim().replace(/[<>:"/\\|?*]+/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-') || 'veily-mockup';

    const handleDownload = async () => {
        const element = resolvePreview();
        if (!element) {
            toast.error('Preview is still loading. Try again in a moment.');
            return;
        }

        const selectedQuality = qualityOptions.find((option) => option.id === quality) ?? qualityOptions[1];
        const exportScale = getPresetScale(element, selectedQuality);
        setIsExporting(true);
        setProgress(0);

        try {
            let saved: boolean;
            if (exportType === 'video') {
                if (!autoScrollVideo) {
                    onPrepareVideo?.();
                    await new Promise((resolve) => window.setTimeout(resolve, 120));
                }
                saved = await exportAsVideo(element, {
                    scale: exportScale,
                    filename: `${safeFilename}.webm`,
                    durationMs,
                    autoScroll: hasConversation && autoScrollVideo,
                    onProgress: setProgress,
                });
            } else {
                saved = await exportAsImage(element, {
                    scale: exportScale,
                    filename: `${safeFilename}.png`,
                    captureMode: hasConversation ? imageCaptureMode : 'viewport',
                });
                setProgress(1);
            }

            if (!saved) {
                setProgress(0);
                return;
            }

            toast.success(exportType === 'video' ? 'Video exported as WebM.' : 'Image exported successfully.');
            setDownloadModalOpen(false);
            window.setTimeout(() => setSupportModalOpen(true), 220);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error(error instanceof Error ? error.message : 'The export could not be completed.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={isDownloadModalOpen} onOpenChange={(open) => !isExporting && setDownloadModalOpen(open)}>
            <DialogContent hideClose className="max-h-[92vh] overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-0 shadow-2xl sm:max-w-[620px]">
                <div className="relative p-5 sm:p-7">
                    <button
                        type="button"
                        onClick={() => setDownloadModalOpen(false)}
                        disabled={isExporting}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40"
                        aria-label="Close export dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="pr-12">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-950">Export preview</DialogTitle>
                        <DialogDescription className="mt-1.5 text-sm leading-6 text-zinc-500">
                            Save a crisp image or record the live preview as a shareable video.
                        </DialogDescription>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Export format">
                        {([
                            { id: 'image' as const, label: 'Image', detail: 'PNG', icon: ImageIcon },
                            { id: 'video' as const, label: 'Video', detail: 'WebM', icon: Film },
                        ]).map((option) => {
                            const Icon = option.icon;
                            const active = exportType === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => handleTypeChange(option.id)}
                                    disabled={isExporting}
                                    className={cn(
                                        'flex min-h-20 items-center gap-3 rounded-2xl border p-4 text-left transition',
                                        active ? 'border-zinc-900 bg-zinc-950 text-white shadow-lg' : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400',
                                    )}
                                >
                                    <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', active ? 'bg-white/15' : 'bg-zinc-100')}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-bold">{option.label}</span>
                                        <span className={cn('mt-0.5 block text-xs', active ? 'text-white/60' : 'text-zinc-500')}>{option.detail}</span>
                                    </span>
                                    {active && <Check className="ml-auto h-4 w-4" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <label className="text-sm font-semibold text-zinc-900">Quality</label>
                            <span className="text-xs font-medium text-zinc-500">Longest-edge output size</span>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {availableQualities.map((option) => {
                                const Icon = option.icon;
                                const active = quality === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setQuality(option.id)}
                                        disabled={isExporting}
                                        className={cn(
                                            'rounded-2xl border p-3 text-left transition',
                                            active ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400',
                                        )}
                                    >
                                        <Icon className={cn('h-4 w-4', active ? 'text-zinc-900' : 'text-zinc-400')} />
                                        <span className="mt-2 block text-sm font-bold text-zinc-900">{option.label}</span>
                                        <span className="mt-0.5 block text-xs text-zinc-500">{option.detail}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {hasConversation && (
                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm font-semibold text-zinc-900">
                                    {exportType === 'image' ? 'Conversation capture' : 'Conversation motion'}
                                </label>
                                <span className="text-xs font-medium text-zinc-500">
                                    {exportType === 'image' ? 'Choose the output shape' : 'Keep the device ratio'}
                                </span>
                            </div>

                            {exportType === 'image' ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {([
                                        { id: 'full' as const, label: 'Full conversation', detail: 'One long image' },
                                        { id: 'viewport' as const, label: 'Current screen', detail: 'Device-sized image' },
                                    ]).map((option) => {
                                        const active = imageCaptureMode === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => setImageCaptureMode(option.id)}
                                                disabled={isExporting}
                                                className={cn(
                                                    'flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left transition',
                                                    active ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400',
                                                )}
                                            >
                                                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', active ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500')}>
                                                    {active ? <Check className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                                </span>
                                                <span>
                                                    <span className="block text-sm font-bold text-zinc-900">{option.label}</span>
                                                    <span className="mt-0.5 block text-xs text-zinc-500">{option.detail}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    aria-pressed={autoScrollVideo}
                                    onClick={() => setAutoScrollVideo((enabled) => !enabled)}
                                    disabled={isExporting}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition',
                                        autoScrollVideo ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400',
                                    )}
                                >
                                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', autoScrollVideo ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500')}>
                                        {autoScrollVideo ? <Check className="h-4 w-4" /> : <Film className="h-4 w-4" />}
                                    </span>
                                    <span>
                                        <span className="block text-sm font-bold text-zinc-900">Auto-scroll full conversation</span>
                                        <span className="mt-0.5 block text-xs text-zinc-500">Record from the first message to the latest message.</span>
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {exportType === 'video' && (
                        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                <Clock3 className="h-4 w-4" /> Clip length
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {videoDurations.map((duration) => (
                                    <button
                                        key={duration.value}
                                        type="button"
                                        onClick={() => setDurationMs(duration.value)}
                                        disabled={isExporting}
                                        className={cn(
                                            'h-10 rounded-xl border text-sm font-semibold transition',
                                            durationMs === duration.value ? 'border-zinc-900 bg-white text-zinc-950 shadow-sm' : 'border-transparent text-zinc-500 hover:bg-white',
                                        )}
                                    >
                                        {duration.label}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-3 text-xs leading-5 text-zinc-500">
                                {hasConversation && autoScrollVideo
                                    ? 'The video starts at the first message and smoothly scrolls to the latest one.'
                                    : 'For chats, recording restarts the typing animation so messages appear naturally in the clip.'}
                            </p>
                        </div>
                    )}

                    <div className="mt-6">
                        <label htmlFor="export-filename" className="text-sm font-semibold text-zinc-900">File name</label>
                        <div className="relative mt-2">
                            <Input
                                id="export-filename"
                                value={filename}
                                onChange={(event) => setFilename(event.target.value)}
                                disabled={isExporting}
                                className="h-12 rounded-xl border-zinc-200 pr-20 text-sm font-medium focus-visible:ring-zinc-900"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">.{exportType === 'image' ? 'png' : 'webm'}</span>
                        </div>
                    </div>

                    {isExporting && (
                        <div className="mt-6" aria-live="polite">
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-600">
                                <span>{exportType === 'video' ? 'Recording preview' : 'Rendering image'}</span>
                                <span>{Math.round(progress * 100)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                                <div className="h-full rounded-full bg-zinc-900 transition-[width] duration-200" style={{ width: `${Math.max(4, progress * 100)}%` }} />
                            </div>
                        </div>
                    )}

                    <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="ghost" onClick={() => setDownloadModalOpen(false)} disabled={isExporting} className="h-11 rounded-xl px-5">Cancel</Button>
                        <Button onClick={handleDownload} disabled={isExporting} className="h-11 rounded-xl bg-zinc-950 px-6 font-semibold text-white hover:bg-zinc-800">
                            {isExporting ? (
                                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Processing</>
                            ) : (
                                <><Download className="h-4 w-4" /> Export {exportType}</>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
