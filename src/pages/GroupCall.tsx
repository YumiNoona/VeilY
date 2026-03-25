import React, { useState, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PreviewControls } from "@/components/PreviewControls";
import { useGroupCallState } from "@/hooks/useGroupCallState";
import { GroupCallPreview } from "@/components/GroupCallPreview";
import { DeviceView, AppearanceSettings, ChatState, Person, Platform } from "@/types/chat";
import { useScreenshot } from "@/hooks/useScreenshot";
import { DownloadModal } from "@/components/modals/DownloadModal";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function GroupCall() {
    const { plan, setUpgradeModalOpen } = useAuth();
    const { 
        callState, 
        updatePlatform, 
        updateDuration, 
        addParticipant, 
        updateParticipant, 
        removeParticipant,
        toggleSignal,
        toggleRecording
    } = useGroupCallState();

    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const { copyScreenshot } = useScreenshot(previewRef);

    const [appearance, setAppearance] = useState<AppearanceSettings>({
        darkMode: true,
        showDeviceStatusBar: true,
        showDeviceFrame: true,
        statusBarTime: '9:41',
        showTimestamps: true,
        showStatus: true,
        use24HourFormat: false,
        batteryLevel: 100,
        transparentBackground: false,
    });

    const mockChatState: ChatState = {
        platform: callState.platform as Platform,
        chatType: 'direct',
        people: [],
        messages: [],
        appearance,
    };

    if (plan === 'free') {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-6 bg-zinc-950 text-white rounded-3xl m-4 border border-zinc-800 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                        <span className="text-4xl">📞</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Group Call Studio</h1>
                    <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">
                        Create high-fidelity video call mockups for WhatsApp, FaceTime, and Discord. 
                        This feature is exclusive to <span className="text-indigo-400 font-bold">Pro</span> and <span className="text-purple-400 font-bold">Premium</span> users.
                    </p>
                    <button 
                        onClick={() => setUpgradeModalOpen(true)}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl shadow-indigo-500/20"
                    >
                        Upgrade to Pro
                    </button>
                </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
            <Sidebar 
                chatState={mockChatState}
                mode="call"
                onPlatformChange={(p) => updatePlatform(p as any)}
                onAppearanceChange={setAppearance}
                callState={callState}
                onCallUpdateDuration={updateDuration}
                onCallAddParticipant={addParticipant}
                onCallUpdateParticipant={updateParticipant}
                onCallRemoveParticipant={removeParticipant}
                onCallToggleSignal={toggleSignal}
                onCallToggleRecording={toggleRecording}
                // Chat props (no-ops)
                onChatTypeChange={() => {}}
                onAddMessage={() => {}}
                onRemoveMessage={() => {}}
                onUpdatePerson={() => {}}
                onUpdateMessage={() => {}}
                onAddPerson={() => {}}
                onRemovePerson={() => {}}
                onReset={() => {}}
            />

            <main className="flex-1 flex flex-col items-center justify-center p-4 relative bg-[#0a0a0a]">
                <div className="flex-1 flex items-center justify-center w-full max-w-5xl">
                    <div className="relative group transition-all duration-500 ease-out">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[48px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div 
                            ref={previewRef}
                            className={cn(
                                "overflow-hidden shadow-2xl transition-all duration-300",
                                appearance.showDeviceFrame ? "rounded-[40px] border-[8px] border-black bg-black" : "rounded-xl",
                                deviceView === 'desktop' ? 'w-[667px] h-[375px]' : 'w-[375px] h-[812px]'
                            )}
                        >
                            <GroupCallPreview 
                                state={callState}
                                deviceView={deviceView}
                                appearance={appearance}
                            />
                        </div>
                    </div>
                </div>

                <PreviewControls 
                    activeView={deviceView}
                    onViewChange={setDeviceView}
                    onDownload={() => setDownloadModalOpen(true)}
                    onCopy={copyScreenshot}
                />
            </main>

            <DownloadModal previewRef={previewRef} />
        </div>
    );
}
