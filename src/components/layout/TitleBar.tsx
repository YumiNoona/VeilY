import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const TitleBar = () => {
    const handleMinimize = async () => {
        const appWindow = getCurrentWindow();
        await appWindow.minimize();
    };

    const handleMaximize = async () => {
        const appWindow = getCurrentWindow();
        if (await appWindow.isMaximized()) {
            await appWindow.unmaximize();
        } else {
            await appWindow.maximize();
        }
    };

    const handleClose = async () => {
        const appWindow = getCurrentWindow();
        await appWindow.close();
    };

    // Return null if not in Electron/Tauri environment
    if (!(window as any).electronAPI && !(window as any).__TAURI_INTERNALS__) return null;

    return (
        <div data-tauri-drag-region className="h-10 w-full bg-[#0f0f0f] flex items-center justify-between select-none border-b border-white/5 relative z-[9999]">
            <div data-tauri-drag-region className="flex items-center px-3 gap-2 pointer-events-none">
                <span className="text-sm leading-none">🌕</span>
                <span className="text-[11px] font-medium text-white/40 tracking-wider uppercase">Veily Desktop</span>
            </div>

            <div className="flex items-center h-full">
                <button 
                    onClick={handleMinimize}
                    className="h-full px-4 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <Minus className="w-3.5 h-3.5 text-white/40 group-hover:text-white pointer-events-none" />
                </button>
                <button 
                    onClick={handleMaximize}
                    className="h-full px-4 flex items-center justify-center hover:bg-white/5 transition-colors group"
                >
                    <Square className="w-3 h-3 text-white/40 group-hover:text-white pointer-events-none" />
                </button>
                <button 
                    onClick={handleClose}
                    className="h-full px-4 flex items-center justify-center hover:bg-red-500/80 transition-colors group cursor-pointer"
                >
                    <X className="w-3.5 h-3.5 text-white/40 group-hover:text-white pointer-events-none" />
                </button>
            </div>
        </div>
    );
};
