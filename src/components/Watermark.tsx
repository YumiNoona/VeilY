import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

export const Watermark = () => {
    const { plan, user, setUpgradeModalOpen } = useAuth();

    // If premium, hide watermark. If no user, treat as free.
    if (user && plan !== 'free') return null;

    return (
        <>
            {/* Tiled diagonal watermark layer */}
            <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden mix-blend-overlay opacity-20">
                <div 
                    className="absolute inset-[-100%] w-[300%] h-[300%] flex flex-wrap content-start -rotate-[30deg]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' font-weight='bold' fill='white' fill-opacity='0.3' text-anchor='middle' dominant-baseline='middle'%3Eveily.venusapp.in%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '350px 250px',
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
