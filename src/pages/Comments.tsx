import React, { useEffect, useRef, useState } from 'react';
import { useCommentState } from '@/hooks/useCommentState';
import { CommentsSidebar } from '@/components/CommentsSidebar';
import { CommentsPreview, CommentsPreviewRef } from '@/components/CommentsPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { DownloadModal } from '@/components/modals/DownloadModal';

const Comments = () => {
    const {
        state,
        setPlatform,
        setConfig,
        addProfile,
        updateProfile,
        removeProfile,
        addComment,
        updateComment,
        deleteComment,
        handleResetState,
        loadTemplate,
        randomizeState,
    } = useCommentState();

    const { setDownloadModalOpen } = useAuth();

    // Set document title
    useEffect(() => {
        document.title = 'Veily | Comments Generator';
    }, []);

    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const previewRef = useRef<CommentsPreviewRef>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background relative animate-in fade-in duration-300">
            <CommentsSidebar
                state={state}
                setPlatform={setPlatform}
                setConfig={setConfig}
                addProfile={addProfile}
                updateProfile={updateProfile}
                removeProfile={removeProfile}
                addComment={addComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                onReset={handleResetState}
                onTemplateLoad={loadTemplate}
                onRandomize={randomizeState}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/30">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8">
                    <CommentsPreview ref={previewRef} state={state} />
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

export default Comments;
