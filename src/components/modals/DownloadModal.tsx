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
    ChevronRight,
    ArrowRight,
    Layers,
    Type
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { exportAsImage } from '@/lib/export-utils';
import { toast } from 'sonner';

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
    const [filename, setFilename] = useState(`veily-mockup-${Date.now()}`);
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

    const renderFooter = () => {
        if (!user) {
            return (
                <div className="bg-zinc-50 dark:bg-white/5 p-8 text-center border-t border-border/40">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold">Ready to export?</h3>
                            <p className="text-sm text-muted-foreground">Sign in to save your creations and unlock free exports.</p>
                        </div>
                        <Button 
                            onClick={() => {
                                setDownloadModalOpen(false);
                                setAuthModalOpen(true);
                            }}
                            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                        >
                            SIGN IN / SIGN UP
                        </Button>
                    </div>
                </div>
            );
        }

        if (isFree) {
            return (
                <div className="bg-gradient-to-b from-primary/5 to-primary/10 p-8 text-center border-t border-primary/20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Crown className="w-3 h-3" /> Recommended
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold italic">"Almost there! Get premium export for Veily..."</h3>
                            <p className="text-sm text-muted-foreground px-4">Remove watermarks and unlock 4K exports for professional use.</p>
                        </div>
                        <Button 
                            onClick={() => {
                                setDownloadModalOpen(false);
                                setUpgradeModalOpen(true);
                            }}
                            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all group"
                        >
                            <span className="flex items-center gap-2">
                                UPGRADE TO PREMIUM <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-zinc-50 dark:bg-white/5 p-6 text-center border-t border-border/40">
                <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    PREMIUM ACCESS ACTIVE
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isDownloadModalOpen} onOpenChange={setDownloadModalOpen}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-background border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] rounded-[32px]">
                <div className="flex flex-col bg-white dark:bg-zinc-950 max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Premium Header */}
                    <div className="relative p-8 overflow-hidden bg-zinc-950">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                        
                        {/* Background Doodles */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                            <Sparkles className="absolute top-4 right-12 w-12 h-12 text-white -rotate-12" />
                            <Crown className="absolute bottom-[-10px] left-1/4 w-20 h-20 text-white rotate-12" />
                            <Zap className="absolute top-1/2 right-4 w-8 h-8 text-white -rotate-[30deg]" />
                            <ImageIcon className="absolute top-[-10px] left-12 w-16 h-16 text-white -rotate-12" />
                        </div>
                        
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
                                    Export <span className="text-primary not-italic">Studio</span>
                                </h2>
                            </div>
                            <p className="text-xs text-zinc-400 font-medium tracking-wide">
                                PROFESSIONALLY RENDER YOUR VEILY MOCKUPS
                            </p>
                        </div>

                        {user && isFree && (
                            <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-[11px] font-black text-white">
                                {remainingExports} FREE EXPORTS LEFT
                            </div>
                        )}
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Filename & Format Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-4 bg-primary rounded-full" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Configuration</h3>
                            </div>

                            <div className={cn("space-y-4", !user && "opacity-50 pointer-events-none")}>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground ml-1">FILE NAME</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Type className="w-4 h-4" />
                                        </div>
                                        <Input 
                                            value={filename}
                                            onChange={(e) => setFilename(e.target.value)}
                                            className="h-14 pl-12 bg-zinc-50 dark:bg-white/5 border-border/40 rounded-2xl font-bold text-sm focus-visible:ring-primary/20 transition-all border-2 focus:border-primary/40"
                                            placeholder="Enter filename..."
                                            disabled={!user}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'image', label: 'Static Image', icon: ImageIcon, desc: 'PNG High Res' },
                                        { id: 'video', label: 'Animated Video', icon: Video, desc: 'MP4 60FPS', locked: isFree || !user }
                                    ].map((type) => {
                                        const Icon = type.icon;
                                        const locked = type.locked;
                                        const active = exportType === type.id;
                                        return (
                                            <button
                                                key={type.id}
                                                disabled={!user && type.id !== 'image'}
                                                onClick={() => {
                                                    if (!user) {
                                                        setDownloadModalOpen(false);
                                                        setAuthModalOpen(true);
                                                        return;
                                                    }
                                                    if (locked) setUpgradeModalOpen(true);
                                                    else setExportType(type.id as any);
                                                }}
                                                className={cn(
                                                    "relative group flex flex-col p-5 rounded-[24px] border-2 transition-all duration-300 text-left overflow-hidden",
                                                    active 
                                                        ? "border-primary bg-primary/[0.03] shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                                                        : "border-border/40 hover:border-border hover:bg-zinc-50 dark:hover:bg-white/5"
                                                )}
                                            >
                                                {active && (
                                                    <div className="absolute top-0 right-0 p-2">
                                                        <div className="bg-primary text-white rounded-full p-1 opacity-100 animate-in zoom-in duration-300">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm",
                                                    active ? "bg-primary text-white" : "bg-zinc-100 dark:bg-white/10 text-muted-foreground group-hover:scale-110"
                                                )}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-black text-sm flex items-center gap-1.5 uppercase tracking-tight">
                                                        {type.label}
                                                        {locked && <Lock className="w-3.5 h-3.5 text-primary opacity-80" />}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-bold font-mono tracking-tighter opacity-60">{type.desc}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Quality Selection Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Render Quality</h3>
                                </div>
                                {isFree && user && (
                                    <button 
                                        onClick={() => setUpgradeModalOpen(true)}
                                        className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg"
                                    >
                                        <Sparkles className="w-3 h-3" /> UNLOCK 4K
                                    </button>
                                )}
                            </div>

                            <div className={cn("grid grid-cols-3 gap-3", !user && "opacity-50 pointer-events-none")}>
                                {[
                                    { id: 'sd', label: 'SD', desc: '1.5X', icon: Monitor },
                                    { id: 'hd', label: 'HD', desc: '2.0X', icon: Layers, locked: isFree || !user },
                                    { id: '4k', label: '4K', desc: '4.0X', icon: Crown, locked: isFree || !user }
                                ].map((q) => {
                                    const Icon = q.icon;
                                    const locked = q.locked;
                                    const active = quality === q.id;
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => {
                                                if (!user) {
                                                    setDownloadModalOpen(false);
                                                    setAuthModalOpen(true);
                                                    return;
                                                }
                                                if (locked) setUpgradeModalOpen(true);
                                                else setQuality(q.id as any);
                                            }}
                                            className={cn(
                                                "relative flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all duration-300",
                                                active 
                                                    ? "border-primary bg-primary/[0.03] shadow-inner" 
                                                    : "border-border/40 hover:border-border hover:bg-zinc-50 dark:hover:bg-white/5"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                                active ? "bg-primary text-white rotate-12 scale-110" : "bg-zinc-100 dark:bg-white/10 text-muted-foreground"
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-center">
                                                <div className="font-black text-xs flex items-center justify-center gap-1 uppercase">
                                                    {q.label}
                                                    {locked && <Lock className="w-2.5 h-2.5 text-primary" />}
                                                </div>
                                                <div className="text-[9px] text-muted-foreground font-black font-mono opacity-50">{q.desc}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Export Button */}
                        <div className="space-y-4">
                            <Button
                                onClick={() => {
                                    if (!user) {
                                        setDownloadModalOpen(false);
                                        setAuthModalOpen(true);
                                        return;
                                    }
                                    handleDownload();
                                }}
                                disabled={isExporting}
                                className={cn(
                                    "w-full h-16 rounded-[24px] font-black text-base shadow-2xl transition-all duration-500 active:scale-[0.97]",
                                    isExporting 
                                        ? "bg-zinc-800 text-white cursor-wait" 
                                        : "bg-primary text-primary-foreground shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1"
                                )}
                            >
                                {isExporting ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                        GENERATING MOCKUP...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 tracking-widest uppercase">
                                        {!user ? 'SIGN IN TO EXPORT' : 'INITIATE RENDER'} <Download className="w-6 h-6 ml-1 group-hover:animate-bounce" />
                                    </div>
                                )}
                            </Button>
                            
                            {user && (
                                <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-tighter opacity-50">
                                    Final render will be optimized for {quality === '4k' ? 'Ultra HD' : quality === 'hd' ? '2K Display' : 'Standard Web'}
                                </p>
                            )}
                        </div>
                    </div>

                    {renderFooter()}
                </div>
            </DialogContent>
        </Dialog>
    );
};
