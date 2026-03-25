import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TitleBar = () => {
    const handleMinimize = () => {
        window.electronAPI?.minimize();
    };

    const handleMaximize = () => {
        window.electronAPI?.maximize();
    };

    const handleClose = () => {
        window.electronAPI?.close();
    };

    // Return null if not in Electron environment
    if (!window.electronAPI) return null;

    return (
        <div className="h-8 w-full bg-[#0f0f0f] flex items-center justify-between select-none border-b border-white/5 relative z-[9999]" style={{ WebkitAppRegion: 'drag' } as any}>
            <div className="flex items-center px-3 gap-2 pointer-events-none">
                <img src="/favicon.ico" alt="Veily" className="w-4 h-4" />
                <span className="text-[11px] font-medium text-white/40 tracking-wider uppercase">Veily Desktop</span>
            </div>

            <div className="flex items-center h-full no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button 
                    onClick={handleMinimize}
                    className="h-full px-4 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <Minus className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                </button>
                <button 
                    onClick={handleMaximize}
                    className="h-full px-4 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <Square className="w-3 h-3 text-white/40 group-hover:text-white" />
                </button>
                <button 
                    onClick={handleClose}
                    className="h-full px-4 flex items-center justify-center hover:bg-red-500/80 transition-colors group"
                >
                    <X className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                </button>
            </div>
        </div>
    );
};
