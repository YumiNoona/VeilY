import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

interface WatermarkProps {
    isDark?: boolean;
}

export const Watermark = ({ isDark }: WatermarkProps) => {
    const { plan, user, setUpgradeModalOpen } = useAuth();

    // If premium, hide watermark. If no user, treat as free.
    if (user && plan !== 'free') return null;

    const opacityClass = isDark ? 'opacity-[0.16]' : 'opacity-[0.09]';
    const colorHex = isDark ? '%23ffffff' : '%2371717a'; // #ffffff (white) and #71717a (zinc-500)

    return (
        <>
            {/* Tiled diagonal watermark layer */}
            <div className={cn("absolute inset-0 z-40 pointer-events-none overflow-hidden mix-blend-normal", opacityClass)}>
                <div 
                    className="absolute inset-[-100%] w-[300%] h-[300%] flex flex-wrap content-start -rotate-[35deg]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Outfit, sans-serif' font-size='24' font-weight='900' fill='${colorHex}' text-anchor='middle' text-transform='uppercase' dominant-baseline='middle'%3Eveily.venusapp.in%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '400px 200px',
                    }}
                />
            </div>

            {/* Bottom-right promotional badge */}
            <div data-html2canvas-ignore="true" className="absolute bottom-6 right-6 z-50 flex flex-col items-center bg-black/95 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 shadow-2xl pointer-events-auto animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-1.5 mb-1.5 text-white">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Made with</span>
                    <span className="text-base font-bold tracking-tight">Veily</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUpgradeModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-400/40"
                >
                    Get clean exports
                </button>
            </div>
        </>
    );
};
