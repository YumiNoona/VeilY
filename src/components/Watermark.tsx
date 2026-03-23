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
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' font-weight='bold' fill='white' fill-opacity='0.4' text-anchor='middle' dominant-baseline='middle'%3EVEILY%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '250px 200px',
                    }}
                />
            </div>

            {/* Bottom-right promotional badge */}
            <div data-html2canvas-ignore="true" className="absolute bottom-4 right-4 z-50 flex flex-col items-center bg-white shadow-lg rounded-none px-4 py-2 border border-gray-200 pointer-events-auto animate-in fade-in transition-all">
                <div className="flex items-center gap-1 mb-1 text-black">
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Made with</span>
                    <span className="text-sm font-bold tracking-tight">VEILY</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUpgradeModalOpen(true);
                    }}
                    className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-tight"
                >
                    Get clean exports
                </button>
            </div>
        </>
    );
};
