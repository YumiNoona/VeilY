import React, { useRef, useState } from 'react';
import { useEmailState } from '@/hooks/useEmailState';
import { EmailSidebar } from '@/components/EmailSidebar';
import { EmailPreview, EmailPreviewRef } from '@/components/EmailPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { DownloadModal } from '@/components/modals/DownloadModal';
import { SupportModal } from '@/components/modals/SupportModal';
import { Heart } from 'lucide-react';

const Email = () => {
    const {
        state,
        setSubject,
        setAttachment,
        updateParticipant,
        setProvider,
        addParticipant,
        removeParticipant,
        updateEmail,
        addEmail,
        removeEmail,
        handleReset,
        loadTemplate,
        randomizeState,
        setAppearance
    } = useEmailState();

    const { setDownloadModalOpen } = useAuth();
    const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const previewRef = useRef<EmailPreviewRef>(null);

    return (
        <div className="flex h-full overflow-hidden bg-background relative">
            <EmailSidebar
                state={state}
                setSubject={setSubject}
                setAttachment={setAttachment}
                setProvider={setProvider}
                updateParticipant={updateParticipant}
                addParticipant={addParticipant}
                removeParticipant={removeParticipant}
                updateEmail={updateEmail}
                addEmail={addEmail}
                removeEmail={removeEmail}
                handleReset={handleReset}
                onTemplateLoad={loadTemplate}
                onRandomize={randomizeState}
                setAppearance={setAppearance}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/30">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8">
                    <EmailPreview ref={previewRef} state={state} />
                </div>
                <PreviewControls
                    activeView={deviceView}
                    onViewChange={setDeviceView}
                    onDownload={() => setDownloadModalOpen(true)}
                    onCopy={() => previewRef.current?.handleCopy()}
                    showDeviceToggle={false}
                />

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
                  <div className="flex items-center justify-between gap-6 px-6 py-3.5 bg-white/90 backdrop-blur border border-zinc-200/80 rounded-2xl shadow-lg shadow-zinc-200/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-800 truncate">Support Our Service</p>
                      <p className="text-xs text-zinc-500 truncate">If you like Veily, please consider donating to keep it forever free.</p>
                    </div>
                    <button onClick={() => setIsSupportModalOpen(true)} className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-md hover:from-rose-600 hover:to-pink-700 transition-all duration-300 hover:scale-105">
                      <Heart className="w-3.5 h-3.5 fill-white" />Donate
                    </button>
                  </div>
                </div>
            </div>
            <DownloadModal 
                previewRef={previewRef.current?.getRef() || { current: null }}
            />
            <SupportModal isOpen={isSupportModalOpen} onOpenChange={setIsSupportModalOpen} />
        </div>
    );
};

export default Email;
