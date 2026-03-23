import React, { useRef, useState } from 'react';
import { useStoriesState } from '@/hooks/useStoriesState';
import { StoriesSidebar } from '@/components/StoriesSidebar';
import { StoriesPreview, StoriesPreviewRef } from '@/components/StoriesPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { DownloadModal } from '@/components/modals/DownloadModal';

const Stories = () => {
    const {
        state,
        setPlatform,
        setUsername,
        setTimeAgo,
        setVerified,
        setPostedAt,
        updateSlideImage,
        addSlide,
        removeSlide,
        setActiveSlide,
        loadTemplate,
        randomizeState,
        handleReset,
        setAppearance
    } = useStoriesState();

    const { setDownloadModalOpen } = useAuth();
    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const previewRef = useRef<StoriesPreviewRef>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background relative animate-in fade-in duration-300">
            <StoriesSidebar
                state={state}
                setPlatform={setPlatform}
                setUsername={setUsername}
                setTimeAgo={setTimeAgo}
                setVerified={setVerified}
                setPostedAt={setPostedAt}
                setActiveSlide={setActiveSlide}
                updateSlideImage={updateSlideImage}
                addSlide={addSlide}
                removeSlide={removeSlide}
                onTemplateLoad={loadTemplate}
                onRandomize={randomizeState}
                handleReset={handleReset}
                setAppearance={setAppearance}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/30">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8">
                    <StoriesPreview
                        ref={previewRef}
                        state={state}
                        onSlideChange={setActiveSlide}
                    />
                </div>
                <PreviewControls
                    activeView={deviceView}
                    onViewChange={setDeviceView}
                    onDownload={() => setDownloadModalOpen(true)}
                    onCopy={() => previewRef.current?.handleCopy()}
                />
            </div>
            <DownloadModal 
                previewRef={previewRef.current?.getRef() || { current: null }}
            />
        </div>
    );
};

export default Stories;
