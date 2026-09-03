import React from "react";
import { cn } from "@/lib/utils";
import { AppearanceSettings, CallParticipant, CallPlatform, CallState, DeviceView } from "@/types/chat";
import {
    ArrowLeft, Captions, Disc, Info, Lock, Maximize2, MessageCircle, Mic, MicOff,
    MonitorUp, MoreVertical, Phone, Settings, ShieldCheck, SignalHigh, SignalLow,
    Smile, UserPlus, Users, Video, VideoOff, Volume2, Hand, LayoutDashboard,
} from "lucide-react";
import { Watermark } from "@/components/Watermark";
import { PlatformIcon } from "@/components/icons/PlatformIcons";

interface GroupCallPreviewProps {
    state: CallState;
    deviceView: DeviceView;
    appearance: AppearanceSettings;
}

const platformMeta: Record<CallPlatform, {
    label: string;
    status: string;
    accent: string;
    background: string;
}> = {
    whatsapp: { label: "WhatsApp", status: "End-to-end encrypted", accent: "#00a884", background: "#0b141a" },
    discord: { label: "Discord", status: "Voice connected", accent: "#5865f2", background: "#1e1f22" },
    facetime: { label: "FaceTime", status: "FaceTime video", accent: "#34c759", background: "#151515" },
    zoom: { label: "Zoom", status: "Meeting in progress", accent: "#2d8cff", background: "#16181d" },
    meet: { label: "Google Meet", status: "You are in the meeting", accent: "#1a73e8", background: "#202124" },
};

function ParticipantTile({
    participant,
    state,
    platform,
    className,
}: {
    participant: CallParticipant;
    state: CallState;
    platform: CallPlatform;
    className?: string;
}) {
    const meta = platformMeta[platform];

    return (
        <div
            className={cn(
                "relative min-h-0 min-w-0 overflow-hidden bg-zinc-900",
                platform === 'facetime' && "rounded-3xl shadow-2xl",
                platform === 'discord' && "rounded-lg border border-white/5 bg-[#2b2d31]",
                platform === 'meet' && "rounded-xl border border-white/10",
                platform === 'zoom' && "border border-white/5",
                className,
            )}
            style={participant.isSpeaking ? { boxShadow: `inset 0 0 0 2px ${meta.accent}` } : undefined}
        >
            {participant.isCameraOff || !participant.avatar ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
                    {participant.avatar ? (
                        <img src={participant.avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-white/10 shadow-xl" />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">
                            {participant.name.charAt(0) || '?'}
                        </div>
                    )}
                </div>
            ) : (
                <img
                    src={participant.avatar}
                    alt=""
                    className={cn(
                        "absolute inset-0 h-full w-full object-cover transition duration-300",
                        state.backgroundBlur && "scale-105 blur-[1.5px]",
                        state.quality === 'low' && "saturate-75",
                    )}
                />
            )}

            {participant.isSpeaking && (
                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: meta.accent }}>
                    <Mic className="h-3.5 w-3.5" />
                </div>
            )}

            {state.showNames && (
                <div className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-white backdrop-blur-md">
                    <span className="truncate text-[11px] font-semibold">{participant.name}</span>
                    {participant.isMuted && <MicOff className="h-3 w-3 shrink-0 text-red-400" />}
                </div>
            )}
        </div>
    );
}

function ScreenShare({ state, isMobile }: { state: CallState; isMobile: boolean }) {
    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#f7f8fb] text-zinc-900 shadow-2xl">
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[10px] font-medium text-zinc-500">Q3 launch plan</span>
                <Maximize2 className="ml-auto h-3.5 w-3.5 text-zinc-400" />
            </div>
            {state.sharedMedia ? (
                <div className="relative min-h-0 flex-1 bg-zinc-950 p-2">
                    <img src={state.sharedMedia} alt="Shared content" className="h-full w-full rounded-lg object-contain" />
                </div>
            ) : <div className={cn(
                "grid min-h-0 flex-1 gap-5",
                isMobile ? "grid-rows-[auto_1fr] p-3" : "grid-cols-[30%_1fr] p-6",
            )}>
                <div className={cn(isMobile ? "grid grid-cols-3 gap-2" : "space-y-3")}>
                    {!isMobile && <><div className="h-4 w-3/4 rounded bg-zinc-900" /><div className="h-2 w-full rounded bg-zinc-200" /><div className="h-2 w-5/6 rounded bg-zinc-200" /></>}
                    <div className={cn(isMobile ? "contents" : "mt-5 space-y-2")}>
                        <div className="h-12 rounded-lg bg-indigo-100" />
                        <div className="h-12 rounded-lg bg-emerald-100" />
                        <div className="h-12 rounded-lg bg-amber-100" />
                    </div>
                </div>
                <div className={cn("flex min-h-0 flex-col rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white", isMobile ? "p-4" : "p-6")}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Launch timeline</span>
                    <span className={cn("mt-2 font-bold", isMobile ? "text-xl" : "text-2xl")}>Ready for review</span>
                    <div className={cn("mt-auto grid grid-cols-3", isMobile ? "gap-1.5" : "gap-3")}>
                        {['Design', 'Build', 'Launch'].map((label, index) => (
                            <div key={label} className={cn("rounded-lg bg-white/15 backdrop-blur", isMobile ? "p-2" : "p-3")}>
                                <div className={cn("font-bold", isMobile ? "text-sm" : "text-xl")}>{index === 0 ? '100%' : index === 1 ? '82%' : 'Sep 12'}</div>
                                <div className="mt-1 text-[10px] text-white/70">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
        </div>
    );
}

function ControlButton({ icon: Icon, label, platform, isMobile, danger = false, active = false }: {
    icon: React.ElementType;
    label: string;
    platform: CallPlatform;
    isMobile: boolean;
    danger?: boolean;
    active?: boolean;
}) {
    return (
        <div className={cn("flex flex-col items-center", isMobile ? "min-w-0 flex-1 gap-0" : "min-w-12 gap-1.5")}>
            <div className={cn(
                "flex items-center justify-center text-white shadow-sm",
                isMobile ? "h-9 w-9" : "h-10 w-10",
                platform === 'zoom' || platform === 'discord' ? "rounded-xl" : "rounded-full",
                danger ? "bg-red-500" : active ? "bg-white text-zinc-900" : "bg-white/15 backdrop-blur-md",
            )}>
                <Icon className="h-[18px] w-[18px]" />
            </div>
            {!isMobile && <span className="text-xs font-medium text-white/70">{label}</span>}
        </div>
    );
}

export function GroupCallPreview({ state, deviceView, appearance }: GroupCallPreviewProps) {
    const { platform, participants } = state;
    const meta = platformMeta[platform];
    const isMobile = deviceView === 'mobile';
    const speakingParticipant = participants.find(participant => participant.isSpeaking) ?? participants[0];
    const otherParticipants = participants.filter(participant => participant.id !== speakingParticipant?.id);
    const hasOpenPanel = state.showChatPanel || state.showParticipantPanel;
    const hasSidePanel = !isMobile && hasOpenPanel;
    const desktopChromeInset = !isMobile && platform === 'discord' ? 'pl-[76px]' : '';
    const panelInset = hasSidePanel ? 'pr-[208px]' : '';
    const maxGridParticipants = isMobile ? 4 : 6;
    const visibleGridParticipants = participants.slice(0, maxGridParticipants);
    const hiddenGridParticipants = Math.max(0, participants.length - visibleGridParticipants.length);

    const gridClasses = visibleGridParticipants.length <= 1
        ? "grid-cols-1"
        : visibleGridParticipants.length === 2
            ? (isMobile ? "grid-cols-1 grid-rows-2" : "grid-cols-2")
            : visibleGridParticipants.length === 3
                ? (isMobile ? "grid-cols-2 grid-rows-2" : "grid-cols-3")
                : visibleGridParticipants.length === 4
                    ? "grid-cols-2 grid-rows-2"
                    : (isMobile ? "grid-cols-2 grid-rows-3" : "grid-cols-3 grid-rows-2");

    const controlSets: Record<CallPlatform, Array<{ icon: React.ElementType; label: string; danger?: boolean; active?: boolean }>> = {
        whatsapp: [
            { icon: MicOff, label: 'Mute' }, { icon: VideoOff, label: 'Camera' },
            { icon: Volume2, label: 'Speaker' }, { icon: UserPlus, label: 'Add' },
            { icon: Phone, label: 'Leave', danger: true },
        ],
        discord: [
            { icon: MicOff, label: 'Mute' }, { icon: Volume2, label: 'Deafen' },
            { icon: Video, label: 'Video' }, { icon: MonitorUp, label: 'Share', active: state.isScreenSharing },
            { icon: Phone, label: 'Disconnect', danger: true },
        ],
        facetime: [
            { icon: Smile, label: 'Effects' }, { icon: MicOff, label: 'Mute' },
            { icon: VideoOff, label: 'Camera' }, { icon: MonitorUp, label: 'Share', active: state.isScreenSharing },
            { icon: Phone, label: 'End', danger: true },
        ],
        zoom: [
            { icon: MicOff, label: 'Mute' }, { icon: VideoOff, label: 'Stop video' },
            { icon: Users, label: `People ${participants.length}` }, { icon: MessageCircle, label: 'Chat' },
            { icon: MonitorUp, label: 'Share', active: state.isScreenSharing },
            { icon: Phone, label: 'End', danger: true },
        ],
        meet: [
            { icon: MicOff, label: 'Microphone' }, { icon: VideoOff, label: 'Camera' },
            { icon: Captions, label: 'Captions', active: state.showCaptions }, { icon: Hand, label: 'Raise hand' },
            { icon: MonitorUp, label: 'Present', active: state.isScreenSharing },
            { icon: Phone, label: 'Leave', danger: true },
        ],
    };

    const content = state.isScreenSharing ? (
        <div className={cn("flex min-h-0 flex-1 gap-2 p-2 pt-16 pb-24", desktopChromeInset, panelInset)}>
            <div className="min-w-0 flex-1"><ScreenShare state={state} isMobile={isMobile} /></div>
            {!isMobile && (
                <div className="grid w-32 shrink-0 gap-2" style={{ gridTemplateRows: `repeat(${Math.min(participants.length, 4)}, minmax(0, 1fr))` }}>
                    {participants.slice(0, 4).map(participant => <ParticipantTile key={participant.id} participant={participant} state={state} platform={platform} />)}
                </div>
            )}
        </div>
    ) : state.layout === 'speaker' && speakingParticipant ? (
        <div className={cn("flex min-h-0 flex-1 gap-2 p-2 pt-16 pb-24", isMobile ? "flex-col" : "flex-row", desktopChromeInset, panelInset)}>
            <ParticipantTile participant={speakingParticipant} state={state} platform={platform} className="flex-1" />
            {otherParticipants.length > 0 && (
                <div className={cn("grid gap-2", isMobile ? "h-28 grid-cols-2" : "w-36 grid-cols-1")}>
                    {otherParticipants.slice(0, isMobile ? 2 : 4).map(participant => <ParticipantTile key={participant.id} participant={participant} state={state} platform={platform} />)}
                </div>
            )}
        </div>
    ) : state.layout === 'sidebar' && speakingParticipant ? (
        <div className={cn("flex min-h-0 flex-1 gap-2 p-2 pt-16 pb-24", isMobile ? "flex-col" : "flex-row", desktopChromeInset, panelInset)}>
            <ParticipantTile participant={speakingParticipant} state={state} platform={platform} className="flex-1" />
            <div className={cn("grid gap-2", isMobile ? "h-28 grid-cols-2" : "w-40 grid-cols-1")}>
                {otherParticipants.slice(0, isMobile ? 2 : 4).map(participant => <ParticipantTile key={participant.id} participant={participant} state={state} platform={platform} />)}
            </div>
        </div>
    ) : (
        <div className={cn(
            "relative grid min-h-0 flex-1 gap-1.5 p-1.5 pb-[84px] pt-16",
            gridClasses,
            platform === 'facetime' && "gap-3 p-3 pb-[84px] pt-16",
            platform === 'discord' && "gap-2 bg-[#313338] p-2 pb-[84px] pt-16",
            platform === 'meet' && "gap-2 p-2 pb-[84px] pt-16",
            desktopChromeInset,
            panelInset,
        )}>
            {visibleGridParticipants.map((participant, index) => (
                <ParticipantTile
                    key={participant.id}
                    participant={participant}
                    state={state}
                    platform={platform}
                    className={cn(isMobile && visibleGridParticipants.length === 3 && index === 2 && "col-span-2")}
                />
            ))}
            {hiddenGridParticipants > 0 && (
                <div className={cn(
                    "absolute right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/75 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md",
                    state.showCaptions ? "bottom-[136px]" : "bottom-[96px]",
                )}>
                    <Users className="h-3.5 w-3.5" /> +{hiddenGridParticipants} more
                </div>
            )}
        </div>
    );

    const panelContent = state.showChatPanel ? (
        <div className="space-y-4 p-3 text-sm">
            <div><span className="font-semibold">Priya</span><p className="mt-1 text-xs leading-5 opacity-70">The updated numbers are in slide 6.</p></div>
            <div><span className="font-semibold">Aarav</span><p className="mt-1 text-xs leading-5 opacity-70">Got it, opening that now.</p></div>
            <div className={cn("absolute inset-x-2 bottom-2 rounded-lg border px-3 py-2.5 text-xs opacity-70", platform === 'meet' ? "border-zinc-200" : "border-white/10")}>Send a message</div>
        </div>
    ) : (
        <div className="space-y-1 p-2">
            {participants.map(participant => (
                <div key={participant.id} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs">
                    {participant.avatar ? <img src={participant.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-semibold">{participant.name.charAt(0) || '?'}</span>}
                    <span className="truncate">{participant.name}</span>
                    {participant.isMuted && <MicOff className="ml-auto h-3.5 w-3.5 text-red-400" />}
                </div>
            ))}
        </div>
    );

    return (
        <div
            className={cn(
                "relative flex h-full w-full flex-col overflow-hidden font-sans text-white",
                appearance.transparentBackground && "bg-transparent",
                platform === 'facetime' && !appearance.transparentBackground && "bg-[radial-gradient(circle_at_top_left,#4b5563,#111827_48%,#050505)]",
                platform === 'discord' && !appearance.transparentBackground && "bg-[#313338]",
            )}
            style={!appearance.transparentBackground && platform !== 'facetime' ? { backgroundColor: meta.background } : undefined}
        >
            {platform === 'discord' && !isMobile && (
                <aside className="absolute inset-y-0 left-0 z-20 flex w-[68px] flex-col items-center gap-2 border-r border-black/20 bg-[#1e1f22] pb-24 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5865f2] font-bold">V</div>
                    {['D', 'G', 'W'].map((label, index) => <div key={label} className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-[#313338] text-xs text-[#dbdee1]", index === 1 && "rounded-xl bg-[#23a55a] text-white")}>{label}</div>)}
                    <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#313338] text-[#23a55a]"><Volume2 className="h-4 w-4" /></div>
                </aside>
            )}

            {platform === 'facetime' && <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />}

            <div className={cn(
                "absolute inset-x-0 top-0 z-30 flex h-16 items-center gap-3 px-4",
                platform === 'whatsapp' && "bg-gradient-to-b from-black/80 to-transparent",
                platform === 'discord' && "border-b border-black/20 bg-[#2b2d31]",
                platform === 'discord' && !isMobile && "left-[68px]",
                platform === 'zoom' && "border-b border-white/10 bg-[#111214]",
                platform === 'meet' && "border-b border-white/10 bg-[#202124]",
                platform === 'facetime' && "bg-gradient-to-b from-black/45 to-transparent",
            )}>
                {isMobile && <ArrowLeft className="h-5 w-5 shrink-0" />}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    {platform === 'whatsapp' || platform === 'discord'
                        ? <PlatformIcon platform={platform} className="h-[18px] w-[18px]" />
                        : platform === 'meet'
                            ? <span className="grid h-[18px] w-[18px] grid-cols-2 overflow-hidden rounded"><span className="bg-[#4285f4]" /><span className="bg-[#34a853]" /><span className="bg-[#fbbc04]" /><span className="bg-[#ea4335]" /></span>
                            : <Video className={cn("h-[18px] w-[18px]", platform === 'zoom' ? "text-[#2d8cff]" : "text-[#34c759]")} />}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{state.title || meta.label}</span>
                        {state.quality === 'hd' && <span className="rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-bold tracking-wide">HD</span>}
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-white/65">
                        {platform === 'whatsapp' ? <Lock className="h-2.5 w-2.5" /> : platform === 'zoom' ? <ShieldCheck className="h-2.5 w-2.5" /> : platform === 'meet' ? <Info className="h-2.5 w-2.5" /> : null}
                        <span className="truncate">{platform === 'meet' && state.meetingCode ? `${meta.status} · ${state.meetingCode}` : meta.status}</span>
                        {state.showTimer && <><span>•</span><span>{state.duration}</span></>}
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {state.isSignalLow ? <SignalLow className="h-4 w-4 text-red-400" /> : <SignalHigh className="h-4 w-4 text-emerald-400" />}
                    {state.isRecording && (
                        <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-xs font-bold text-red-300">
                            <Disc className="h-2.5 w-2.5 fill-current" /> REC
                        </div>
                    )}
                    <MoreVertical className="h-5 w-5 text-white/80" />
                </div>
            </div>

            {content}

            {hasSidePanel && (
                <aside className={cn(
                    "absolute bottom-24 right-2 top-[68px] z-30 w-[196px] overflow-hidden rounded-xl border border-white/10 shadow-2xl",
                    platform === 'meet' ? "bg-white text-zinc-900" : "bg-[#242528]/95 text-white backdrop-blur-xl",
                )}>
                    <div className={cn("flex h-11 items-center border-b px-3 text-sm font-semibold", platform === 'meet' ? "border-zinc-200" : "border-white/10")}>
                        {state.showChatPanel ? <><MessageCircle className="mr-2 h-3.5 w-3.5" /> In-call messages</> : <><Users className="mr-2 h-3.5 w-3.5" /> People ({participants.length})</>}
                    </div>
                    {panelContent}
                </aside>
            )}

            {isMobile && hasOpenPanel && (
                <aside className={cn(
                    "absolute inset-x-3 bottom-[86px] top-[72px] z-40 overflow-hidden rounded-2xl border border-white/10 shadow-2xl",
                    platform === 'meet' ? "bg-white text-zinc-900" : "bg-[#242528]/95 text-white backdrop-blur-xl",
                )}>
                    <div className={cn("flex h-12 items-center border-b px-4 text-sm font-semibold", platform === 'meet' ? "border-zinc-200" : "border-white/10")}>
                        {state.showChatPanel ? <><MessageCircle className="mr-2 h-4 w-4" /> In-call messages</> : <><Users className="mr-2 h-4 w-4" /> People ({participants.length})</>}
                    </div>
                    {panelContent}
                </aside>
            )}

            {state.showCaptions && (
                <div className={cn(
                    "absolute left-1/2 z-40 max-w-[82%] -translate-x-1/2 rounded-md bg-black/75 px-3 py-2 text-center text-xs leading-5 text-white backdrop-blur",
                    isMobile && hasOpenPanel ? "bottom-[136px]" : "bottom-24",
                )}>
                    <span className="mr-1 font-semibold text-emerald-300">Aarav:</span> Let us review the final slide before we wrap up.
                </div>
            )}

            <div className={cn(
                "absolute inset-x-0 bottom-0 z-30 flex h-[84px] items-center justify-center gap-2 px-2 pt-2",
                platform !== 'facetime' && "bg-gradient-to-t from-black/90 via-black/65 to-transparent",
                platform === 'zoom' && !isMobile && "justify-between bg-[#111214] px-5",
                platform === 'discord' && "bg-[#232428]",
                platform === 'discord' && !isMobile && "left-[68px]",
                platform === 'facetime' && "bottom-4 left-1/2 right-auto h-[64px] w-fit -translate-x-1/2 bg-transparent px-0 pt-0",
                platform === 'meet' && "justify-between border-t border-white/10 bg-[#202124] px-5 pt-0",
            )}>
                {platform === 'zoom' && !isMobile && (
                    <div className="hidden items-center gap-2 text-[10px] text-white/60 md:flex">
                        <Lock className="h-3 w-3 text-emerald-400" /> Meeting secured
                    </div>
                )}
                {platform === 'meet' && !isMobile && <div className="hidden min-w-32 text-xs text-white/80 md:block"><div className="font-semibold">{state.title}</div><div className="mt-0.5 font-mono text-white/45">{state.meetingCode || 'abc-defg-hij'}</div></div>}
                <div className={cn("flex w-full items-center justify-center", isMobile ? "gap-1" : "gap-3")}>
                    {controlSets[platform].map(control => <ControlButton key={control.label} platform={platform} isMobile={isMobile} {...control} />)}
                </div>
                {platform === 'zoom' && !isMobile && <Settings className="hidden h-4 w-4 text-white/60 md:block" />}
                {platform === 'meet' && !isMobile && <div className="hidden items-center gap-3 text-white/70 md:flex"><Info className="h-4 w-4" /><Users className="h-4 w-4" /><MessageCircle className="h-4 w-4" /><LayoutDashboard className="h-4 w-4" /></div>}
            </div>

            <Watermark isDark />
        </div>
    );
}
