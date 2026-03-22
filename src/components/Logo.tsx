import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, textClassName }) => {
    return (
        <div className={cn("relative flex items-center gap-2 group cursor-default select-none", className)}>
            <div className="relative font-black tracking-tighter text-2xl filter drop-shadow-sm">
                {/* Red Offset */}
                <span className="absolute inset-0 text-[#FF0000] translate-x-[1px] translate-y-[0.5px] opacity-70 mix-blend-screen blur-[0.5px] transition-transform duration-300 group-hover:translate-x-[1.5px]">
                    VEILY
                </span>
                {/* Blue Offset */}
                <span className="absolute inset-0 text-[#00FFFF] -translate-x-[1px] -translate-y-[0.5px] opacity-70 mix-blend-screen blur-[0.5px] transition-transform duration-300 group-hover:-translate-x-[1.5px]">
                    VEILY
                </span>
                {/* Main White/Dark Text */}
                <span className={cn("relative text-foreground z-10", textClassName)}>
                    VEILY
                </span>
            </div>
        </div>
    );
};
