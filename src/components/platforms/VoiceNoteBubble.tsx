import React from "react";
import { cn } from "@/lib/utils";
import { Play, Volume2 } from "lucide-react";
import { Platform } from "@/types/chat";

interface VoiceNoteBubbleProps {
    duration: string;
    isOwn: boolean;
    platform: Platform;
    darkMode?: boolean;
    timestamp?: string;
    senderAvatar?: string;
}

// Waveform bar heights for a realistic varied pattern
const BAR_HEIGHTS = [20, 45, 70, 35, 85, 55, 25, 65, 40, 90, 50, 30, 75, 60, 20, 50, 80, 35, 60, 45, 70, 25, 55, 40, 85, 50, 30, 65, 45, 20];

export function VoiceNoteBubble({ duration, isOwn, platform, darkMode, timestamp, senderAvatar }: VoiceNoteBubbleProps) {
    const playedCount = Math.floor(BAR_HEIGHTS.length * 0.4);

    // ─── Discord ──────────────────────────────────────────────────────────────
    if (platform === 'discord') {
        return (
            <div className="flex items-center gap-2.5 bg-[#1e1f22] px-3 py-2.5 rounded-xl min-w-[260px] max-w-[320px]">
                {/* Purple play button */}
                <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>

                {/* Waveform */}
                <div className="flex items-center gap-[2px] flex-1 h-[28px]">
                    {BAR_HEIGHTS.map((h, i) => (
                        <div
                            key={i}
                            className={cn("w-[2px] rounded-full", i < playedCount ? "bg-[#5865f2]" : "bg-[#4e5058]")}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[12px] text-[#b5bac1] font-medium">{duration || "0:07"}</span>
                    <div className="bg-[#4e5058] rounded px-1.5 py-0.5 text-[11px] text-[#b5bac1] font-bold">1x</div>
                    <Volume2 className="w-4 h-4 text-[#b5bac1]" />
                </div>
            </div>
        );
    }

    // ─── WhatsApp ─────────────────────────────────────────────────────────────
    if (platform === 'whatsapp') {
        return (
            <div className={cn(
                "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl min-w-[230px] max-w-[300px]",
                isOwn ? "bg-[#d9fdd3] dark:bg-[#025144]" : "bg-white dark:bg-[#202c33]",
                isOwn ? "rounded-tr-sm" : "rounded-tl-sm"
            )}>
                {/* Avatar with mic badge */}
                <div className="relative shrink-0">
                    {senderAvatar ? (
                        <img src={senderAvatar} className="w-11 h-11 rounded-full object-cover" alt="" />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center overflow-hidden">
                            <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                                <circle cx="20" cy="20" r="20" fill="url(#grad)" />
                                <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f9a8d4"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
                                <circle cx="20" cy="16" r="7" fill="white" fillOpacity="0.8"/>
                                <ellipse cx="20" cy="34" rx="13" ry="9" fill="white" fillOpacity="0.8"/>
                            </svg>
                        </div>
                    )}
                    {/* Mic badge */}
                    <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center",
                        isOwn ? "bg-[#d9fdd3] dark:bg-[#025144]" : "bg-white dark:bg-[#202c33]"
                    )}>
                        <div className="w-4 h-4 rounded-full bg-[#00a884] flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Waveform + controls */}
                <div className="flex-1 flex flex-col gap-1.5 py-1">
                    {/* Play + waveform row */}
                    <div className="flex items-center gap-1.5">
                        <Play className="w-4 h-4 text-[#54656f] dark:text-[#aebac1] fill-current shrink-0" />
                        {/* Progress dot + bars */}
                        <div className="flex items-center gap-[2px] flex-1 h-6">
                            <div className="w-2 h-2 rounded-full bg-[#00a884] shrink-0" />
                            {BAR_HEIGHTS.map((h, i) => (
                                <div
                                    key={i}
                                    className={cn("w-[2px] rounded-full", i < playedCount ? "bg-[#00a884]" : "bg-[#8696a0]/40")}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Duration + time + ticks */}
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#667781] dark:text-[#8696a0] font-medium">{duration || "0:04"}</span>
                        <div className="flex items-center gap-1">
                            {timestamp && <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">{timestamp}</span>}
                            {isOwn && (
                                <svg viewBox="0 0 18 11" className="w-4 h-3 fill-[#53bdeb]">
                                    <path d="M17.394.886l-1.207-.703L8.31 9.63l-.002-.002-.001.002-3.36-3.452-.944.917 4.305 4.378L17.394.886z"/>
                                    <path d="M10.184.886L8.977.183 1.1 9.63l-.001-.002-.001.002L.09 8.45l-.943.917L.939 10.73l.04.049 9.205-9.893z"/>
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Telegram ─────────────────────────────────────────────────────────────
    if (platform === 'telegram') {
        return (
            <div className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-2xl min-w-[230px] max-w-[300px] relative overflow-hidden",
                isOwn
                    ? "bg-gradient-to-br from-[#7b5ea7] to-[#9b7ec8]"
                    : "bg-white dark:bg-[#212121]",
                isOwn ? "rounded-br-sm" : "rounded-bl-sm"
            )}>
                {/* Play button */}
                <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                    isOwn ? "bg-white/20" : "bg-[#7b5ea7]/10"
                )}>
                    <Play className={cn("w-4 h-4 fill-current ml-0.5", isOwn ? "text-white" : "text-[#7b5ea7]")} />
                </div>

                {/* Waveform + duration */}
                <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-[2px] h-6">
                        <div className={cn("w-2 h-2 rounded-full shrink-0 mr-0.5", isOwn ? "bg-white" : "bg-[#7b5ea7]")} />
                        {BAR_HEIGHTS.map((h, i) => (
                            <div
                                key={i}
                                className={cn("w-[2px] rounded-full",
                                    i < playedCount
                                        ? (isOwn ? "bg-white" : "bg-[#7b5ea7]")
                                        : (isOwn ? "bg-white/30" : "bg-[#7b5ea7]/25")
                                )}
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={cn("text-[11px] font-medium", isOwn ? "text-white/80" : "text-[#707579] dark:text-[#aaaaaa]")}>{duration || "0:06"}</span>
                        <div className="flex items-center gap-1">
                            {timestamp && <span className={cn("text-[11px]", isOwn ? "text-white/70" : "text-[#707579]")}>{timestamp}</span>}
                            {isOwn && (
                                <svg viewBox="0 0 18 11" className="w-4 h-3 fill-white/80">
                                    <path d="M17.394.886l-1.207-.703L8.31 9.63l-.002-.002-.001.002-3.36-3.452-.944.917 4.305 4.378L17.394.886z"/>
                                    <path d="M10.184.886L8.977.183 1.1 9.63l-.001-.002-.001.002L.09 8.45l-.943.917L.939 10.73l.04.049 9.205-9.893z"/>
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                {/* →A badge */}
                {isOwn && (
                    <div className="absolute top-2 right-2 bg-white/20 rounded-md px-1.5 py-0.5 text-[10px] text-white font-semibold">
                        →A
                    </div>
                )}
            </div>
        );
    }

    // ─── iMessage fallback ────────────────────────────────────────────────────
    return (
        <div className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-2xl min-w-[220px] max-w-[280px]",
            isOwn ? "bg-[#007aff]" : "bg-[#e9e9eb] dark:bg-[#3a3a3c]",
            isOwn ? "rounded-br-sm" : "rounded-bl-sm"
        )}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", isOwn ? "bg-white/20" : "bg-[#007aff]/15")}>
                <Play className={cn("w-3.5 h-3.5 fill-current ml-0.5", isOwn ? "text-white" : "text-[#007aff]")} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-[2px] h-5">
                    {BAR_HEIGHTS.map((h, i) => (
                        <div key={i} className={cn("w-[2px] rounded-full", i < playedCount ? (isOwn ? "bg-white" : "bg-[#007aff]") : (isOwn ? "bg-white/30" : "bg-black/15"))} style={{ height: `${h}%` }} />
                    ))}
                </div>
                <span className={cn("text-[11px] font-medium", isOwn ? "text-white/80" : "text-[#8e8e93]")}>{duration || "0:10"}</span>
            </div>
        </div>
    );
}
