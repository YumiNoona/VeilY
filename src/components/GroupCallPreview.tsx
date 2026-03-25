import React from "react";
import { cn } from "@/lib/utils";
import { CallState, DeviceView, AppearanceSettings } from "@/types/chat";
import { MicOff, VideoOff, Phone, Volume2, User, SignalHigh, SignalLow, Disc } from "lucide-react";
import { Watermark } from "@/components/Watermark";

interface GroupCallPreviewProps {
    state: CallState;
    deviceView: DeviceView;
    appearance: AppearanceSettings;
}

export function GroupCallPreview({ state, deviceView, appearance }: GroupCallPreviewProps) {
    const { platform, participants, duration, isSignalLow, isRecording } = state;
    
    const getGridStyles = () => {
        const count = participants.length;
        if (count === 1) return "grid-cols-1";
        if (count <= 2) return "grid-cols-1 grid-rows-2";
        if (count <= 4) return "grid-cols-2 grid-rows-2";
        return "grid-cols-2 grid-rows-3";
    };

    const renderParticipant = (p: any, index: number) => {
        const isSpeaking = p.isSpeaking;
        const isMuted = p.isMuted;
        const isCameraOff = p.isCameraOff;

        return (
            <div 
                key={p.id} 
                className={cn(
                    "relative aspect-[9/16] bg-zinc-900 overflow-hidden transition-all duration-300",
                    isSpeaking && "ring-2 ring-emerald-500 ring-inset",
                    platform === 'facetime' && "rounded-2xl m-1"
                )}
            >
                {isCameraOff ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                        <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-2xl font-bold">
                            {p.avatar ? (
                                <img src={p.avatar} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                p.name.charAt(0)
                            )}
                        </div>
                    </div>
                ) : (
                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.name}`} className="w-full h-full object-cover opacity-80" />
                )}

                {/* Status Overlays */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-md">
                    <span className="text-[10px] text-white font-medium truncate max-w-[80px]">{p.name}</span>
                    {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
                </div>
            </div>
        );
    };

    return (
        <div className={cn(
            "relative w-full h-full overflow-hidden flex flex-col",
            appearance.darkMode ? "bg-black" : "bg-white"
        )}>
            {/* Call Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    {isSignalLow ? <SignalLow className="w-4 h-4 text-red-400" /> : <SignalHigh className="w-4 h-4 text-white" />}
                    <span className="text-[12px] text-white font-medium">{duration}</span>
                </div>
                {isRecording && (
                    <div className="flex items-center gap-1 text-red-500 animate-pulse">
                        <Disc className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold">REC</span>
                    </div>
                )}
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Participants Grid */}
            <div className={cn(
                "flex-1 grid gap-0.5 p-0.5",
                getGridStyles()
            )}>
                {participants.map((p, i) => renderParticipant(p, i))}
            </div>

            {/* Call Controls Mockup (Non-interactive) */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 z-20">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-md flex items-center justify-center text-white">
                    <MicOff className="w-5 h-5" />
                </div>
                <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                    <Phone className="w-6 h-6 rotate-[135deg] fill-current" />
                </div>
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur-md flex items-center justify-center text-white">
                    <VideoOff className="w-5 h-5" />
                </div>
            </div>

            <Watermark isDark={true} />
        </div>
    );
}
