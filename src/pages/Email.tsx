import React, { useRef, useState } from 'react';
import { useEmailState } from '@/hooks/useEmailState';
import { EmailSidebar } from '@/components/EmailSidebar';
import { EmailPreview, EmailPreviewRef } from '@/components/EmailPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { DownloadModal } from '@/components/modals/DownloadModal';

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
    const [zoom, setZoom] = useState(100);
    const previewRef = useRef<EmailPreviewRef>(null);

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden bg-background relative">
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
                <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 lg:px-8">
                    <div className="shrink-0" style={{ zoom: zoom / 100 }}>
                        <EmailPreview ref={previewRef} state={state} />
                    </div>
                </div>
                <PreviewControls
                    activeView={deviceView}
                    onViewChange={setDeviceView}
                    onDownload={() => setDownloadModalOpen(true)}
                    onCopy={() => previewRef.current?.handleCopy()}
                    showDeviceToggle={false}
                    zoom={zoom}
                    onZoomChange={setZoom}
                />

            </div>
            <DownloadModal getPreviewElement={() => previewRef.current?.getRef().current ?? null} />
        </div>
    );
};

export default Email;
