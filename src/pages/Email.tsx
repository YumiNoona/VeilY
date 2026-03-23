import React, { useRef, useState } from 'react';
import { useEmailState } from '@/hooks/useEmailState';
import { EmailSidebar } from '@/components/EmailSidebar';
import { EmailPreview, EmailPreviewRef } from '@/components/EmailPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';

const Email = () => {
    const {
        state,
        setSubject,
        setAttachment,
        addParticipant,
        updateParticipant,
        removeParticipant,
        addEmail,
        updateEmail,
        removeEmail,
        handleReset,
        loadTemplate,
        randomizeState,
        setAppearance,
    } = useEmailState();

    const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
    const previewRef = useRef<EmailPreviewRef>(null);

    return (
        <div className="flex h-full bg-background animate-in fade-in duration-300 overflow-hidden relative">
            <EmailSidebar
                state={state}
                setSubject={setSubject}
                setAttachment={setAttachment}
                addParticipant={addParticipant}
                updateParticipant={updateParticipant}
                removeParticipant={removeParticipant}
                addEmail={addEmail}
                updateEmail={updateEmail}
                removeEmail={removeEmail}
                handleReset={handleReset}
                onTemplateLoad={loadTemplate}
                onRandomize={randomizeState}
                setAppearance={setAppearance}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-16 pb-20">
                    <EmailPreview ref={previewRef} state={state} />
                </div>
                <PreviewControls
                    activeView={deviceView}
                    onViewChange={setDeviceView}
                    onDownload={() => previewRef.current?.handleDownload()}
                    onCopy={() => previewRef.current?.handleCopy()}
                />
            </div>
        </div>
    );
};

export default Email;
