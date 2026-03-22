import React, { useEffect, useRef, useState } from 'react';
import { useCommentState } from '@/hooks/useCommentState';
import { CommentsSidebar } from '@/components/CommentsSidebar';
import { CommentsPreview, CommentsPreviewRef } from '@/components/CommentsPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';

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
        deleteComment
    } = useCommentState();

    // Set document title
    useEffect(() => {
        document.title = 'Veily | Comments Generator';
    }, []);

    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const previewRef = useRef<CommentsPreviewRef>(null);

    return (
        <div className="flex h-full overflow-hidden bg-background relative animate-in fade-in duration-300">
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
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-32 pb-20">
                    <CommentsPreview ref={previewRef} state={state} />
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

export default Comments;
