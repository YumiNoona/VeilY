import React, { useState, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PreviewControls } from "@/components/PreviewControls";
import { useGroupCallState } from "@/hooks/useGroupCallState";
import { GroupCallPreview } from "@/components/GroupCallPreview";
import { DeviceView, AppearanceSettings, ChatState, Person, Platform } from "@/types/chat";
import { useScreenshot } from "@/hooks/useScreenshot";
import { DownloadModal } from "@/components/modals/DownloadModal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const defaultCallAppearance: AppearanceSettings = {
    darkMode: true,
    showDeviceStatusBar: true,
    showDeviceFrame: true,
    statusBarTime: '9:41',
    showTimestamps: true,
    showStatus: true,
    use24HourFormat: false,
    batteryLevel: 100,
    transparentBackground: false,
    isTyping: false,
};

export default function GroupCall() {
    const { 
        callState, 
        updatePlatform, 
        updateDuration, 
        addParticipant, 
        updateParticipant, 
        updateSettings,
        removeParticipant,
        resetCall,
        toggleSignal,
        toggleRecording
    } = useGroupCallState();

    const [deviceView, setDeviceView] = useState<DeviceView>(() => window.innerWidth < 768 ? 'mobile' : 'desktop');
    const [zoom, setZoom] = useState(100);
    const { setDownloadModalOpen } = useAuth();
    const previewRef = useRef<HTMLDivElement>(null);
    const { copyScreenshot } = useScreenshot(previewRef);

    const [appearance, setAppearance] = useState<AppearanceSettings>(defaultCallAppearance);

    const mockChatState: ChatState = {
        platform: callState.platform as Platform,
        chatType: 'direct',
        people: [],
        messages: [],
        appearance,
    };

    return (
        <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden">
            <Sidebar 
                chatState={mockChatState}
                mode="call"
                onPlatformChange={(p) => updatePlatform(p as any)}
                onAppearanceChange={setAppearance}
                callState={callState}
                onCallUpdateDuration={updateDuration}
                onCallAddParticipant={addParticipant}
                onCallUpdateParticipant={updateParticipant}
                onCallUpdateSettings={updateSettings}
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
                onReset={() => {
                    resetCall();
                    setAppearance(defaultCallAppearance);
                    setDeviceView(window.innerWidth < 768 ? 'mobile' : 'desktop');
                    setZoom(100);
                }}
            />

            <main className="relative flex min-w-0 flex-1 flex-col items-center justify-start overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top,hsl(var(--background)),hsl(var(--muted)/0.55))] px-3 py-8 md:justify-center md:px-8 lg:pr-24">
                <div className="min-h-full flex items-start justify-start md:items-center md:justify-center w-full max-w-6xl py-12 md:py-2">
                    <div className="group relative max-w-full shrink-0" style={{ zoom: zoom / 100 }}>
                        <div className="absolute -inset-1 rounded-[48px] bg-primary/15 blur-md opacity-70 transition group-hover:opacity-100"></div>
                        <div 
                            ref={previewRef}
                            data-export-root
                            className={cn(
                                "overflow-hidden shadow-2xl transition-all duration-300",
                                deviceView === 'mobile' && appearance.showDeviceFrame ? "rounded-[40px] border-[8px] border-black bg-black" : "rounded-xl",
                                deviceView === 'desktop'
                                    ? 'w-[min(880px,calc(100vw-1.5rem))] md:w-[min(880px,calc(100vw-420px))] max-w-full h-[min(560px,calc(100vh-10rem))] min-h-[380px]'
                                    : 'w-[375px] max-w-[calc(100vw-1.5rem)] h-[min(760px,calc(100vh-7rem))] min-h-[620px]'
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
                    zoom={zoom}
                    onZoomChange={setZoom}
                />

            </main>

            <DownloadModal previewRef={previewRef} />
        </div>
    );
}
