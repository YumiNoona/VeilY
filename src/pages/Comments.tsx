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
    const [zoom, setZoom] = useState(100);
    const previewRef = useRef<CommentsPreviewRef>(null);

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden bg-background relative">
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
                <div className="flex min-h-full max-w-full flex-col items-center justify-center px-4 py-8 lg:px-8 lg:pr-24">
                    <div className="max-w-full shrink-0" style={{ zoom: zoom / 100 }}>
                        <CommentsPreview ref={previewRef} state={state} />
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

export default Comments;
