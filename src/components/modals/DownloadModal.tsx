import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Download, 
    Image as ImageIcon, 
    Video, 
    Crown, 
    Check, 
    Lock,
    Zap,
    Monitor,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Layers,
    Type,
    Info,
    X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { exportAsImage } from '@/lib/export-utils';
import { toast } from 'sonner';
import { DoodleBackground } from '@/components/icons/DoodleBackground';

interface DownloadModalProps {
    previewRef: React.RefObject<HTMLElement>;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ previewRef }) => {
    const { 
        isDownloadModalOpen, 
        setDownloadModalOpen, 
        user,
        plan, 
        downloadsUsed,
        setUpgradeModalOpen,
        setAuthModalOpen,
        incrementDownloads
    } = useAuth();

    const [exportType, setExportType] = useState<'image' | 'video'>('image');
    const [quality, setQuality] = useState<'sd' | 'hd' | '4k'>('sd');
    const [filename, setFilename] = useState(`mockly-${Date.now()}`);
    const [isExporting, setIsExporting] = useState(false);

    const isFree = plan === 'free';
    const exportLimit = 3;
    const remainingExports = Math.max(0, exportLimit - downloadsUsed);

    const isLocked = (type: 'image' | 'video', q: 'sd' | 'hd' | '4k') => {
        if (!user) return true;
        if (isFree) {
            if (type === 'video') return true;
            if (q !== 'sd') return true;
        }
        return false;
    };

    const handleDownload = async () => {
        if (!user) {
            setDownloadModalOpen(false);
            setAuthModalOpen(true);
            return;
        }

        if (isFree && remainingExports <= 0) {
            setDownloadModalOpen(false);
            setUpgradeModalOpen(true);
            toast.error("You've reached your free export limit!");
            return;
        }

        if (isLocked(exportType, quality)) {
            setDownloadModalOpen(false);
            setUpgradeModalOpen(true);
            return;
        }

        if (!previewRef.current) return;

        setIsExporting(true);
        const scale = quality === '4k' ? 4 : quality === 'hd' ? 2 : 1.5;

        try {
            await exportAsImage(previewRef.current, {
                scale,
                filename: `${filename}.png`,
            });
            await incrementDownloads();
            toast.success("Mockup downloaded successfully!");
            setDownloadModalOpen(false);
        } catch (err) {
            toast.error("Failed to export mockup.");
        } finally {
            setIsExporting(false);
        }
    };

    const typeOptions = [
        { id: 'image', label: 'Image', icon: ImageIcon, locked: false },
        { id: 'video', label: 'Video', icon: Video, locked: isFree || !user }
    ];

    const qualityOptions = [
        { id: 'sd', label: 'Standard', desc: 'Quick previews', res: '468x832', icon: Zap, locked: false },
        { id: 'hd', label: 'HD', desc: 'Sharp exports', res: '936x1664', icon: Sparkles, locked: isFree || !user },
        { id: '4k', label: '4K', desc: 'Maximum detail', res: '1872x3328', icon: Monitor, locked: isFree || !user }
    ];

    return (
        <Dialog open={isDownloadModalOpen} onOpenChange={setDownloadModalOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl">
                <div className="relative flex flex-col h-full bg-white max-h-[90vh] overflow-y-auto scrollbar-hide">
                    
                    <div className="absolute inset-0 z-0 text-zinc-900 opacity-[0.08]">
                        <DoodleBackground />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/95" />
                    </div>

                    <div className="relative z-10 p-6 space-y-7">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Download mockup</h2>
                        </div>

                        {/* Export Type Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-zinc-900">Export type</label>
                            <div className="space-y-2">
                                {typeOptions.map((option) => {
                                    const Icon = option.icon;
                                    const active = exportType === option.id;
                                    const locked = option.locked;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                if (locked) setUpgradeModalOpen(true);
                                                else setExportType(option.id as any);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                                                active 
                                                    ? "border-zinc-900 bg-zinc-50/50" 
                                                    : "border-zinc-100 hover:border-zinc-200 bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                    active ? "border-zinc-900" : "border-zinc-200"
                                                )}>
                                                    {active && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-zinc-500" />
                                                    <span className="font-bold text-sm text-zinc-800">{option.label}</span>
                                                </div>
                                            </div>
                                            {locked && (
                                                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100/50 text-orange-700 text-[10px] font-bold">
                                                    <Sparkles className="w-3 h-3" /> Premium
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Export Quality Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-zinc-900">Export quality</label>
                            <div className="space-y-2">
                                {qualityOptions.map((option) => {
                                    const active = quality === option.id;
                                    const locked = option.locked;
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                if (locked) setUpgradeModalOpen(true);
                                                else setQuality(option.id as any);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                                                active 
                                                    ? "border-zinc-900 bg-zinc-50/50" 
                                                    : "border-zinc-100 hover:border-zinc-200 bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                    active ? "border-zinc-900" : "border-zinc-200"
                                                )}>
                                                    {active && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-zinc-500" />
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-zinc-800">{option.label}</span>
                                                        <span className="text-xs text-zinc-400 font-medium">{option.desc}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {locked && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-100/50 text-orange-700 text-[10px] font-bold">
                                                        <Sparkles className="w-3 h-3" /> Premium
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold text-zinc-500">{option.res}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-zinc-500 px-1 py-1">
                                Free exports stay on Standard. Premium unlocks HD and 4K watermark-free exports.
                            </p>
                        </div>

                        {/* File Name Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-900">File name</label>
                            <div className="relative group">
                                <Input 
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    className="h-11 transition-all border-zinc-200 focus:border-zinc-900 focus:ring-0 rounded-xl font-medium text-sm pr-12"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                                    .{exportType === 'image' ? 'png' : 'mp4'}
                                </div>
                            </div>
                        </div>

                        {/* Export Limit / Info Section */}
                        {isFree && user && (
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                                    <Info className="w-3 h-3 text-zinc-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-bold text-zinc-900">Export limit</h4>
                                    <p className="text-sm text-zinc-600">You have {remainingExports} exports remaining.</p>
                                </div>
                            </div>
                        )}

                        {/* Footer Action */}
                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={handleDownload}
                                disabled={isExporting}
                                className={cn(
                                    "h-11 px-8 rounded-xl font-bold transition-all duration-300",
                                    isExporting 
                                        ? "bg-zinc-100 text-zinc-400" 
                                        : "bg-zinc-950 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200 hover:scale-[1.02]"
                                )}
                            >
                                {isExporting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    `Download ${exportType}`
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
