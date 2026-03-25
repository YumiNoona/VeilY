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
    const previewRef = useRef<EmailPreviewRef>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background relative">
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
            </div>
            <DownloadModal 
                previewRef={previewRef.current?.getRef() || { current: null }}
            />
        </div>
    );
};

export default Email;
