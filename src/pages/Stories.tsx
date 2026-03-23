import React, { useRef, useState } from 'react';
import { useStoriesState } from '@/hooks/useStoriesState';
import { StoriesSidebar } from '@/components/StoriesSidebar';
import { StoriesPreview, StoriesPreviewRef } from '@/components/StoriesPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { DeviceView } from '@/types/chat';

const Stories = () => {
    const {
        state,
        setPlatform,
        setUsername,
        setVerified,
        setTimeAgo,
        setPostedAt,
        setActiveSlide,
        addSlide,
        updateSlideImage,
        removeSlide,
        setAppearance,
        handleReset,
        loadTemplate,
        randomizeState,
    } = useStoriesState();

    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const previewRef = useRef<StoriesPreviewRef>(null);

    return (
        <div className="flex h-full bg-background animate-in fade-in duration-300 overflow-hidden relative">
            <StoriesSidebar
                state={state}
                setPlatform={setPlatform}
                setUsername={setUsername}
                setVerified={setVerified}
                setTimeAgo={setTimeAgo}
                setPostedAt={setPostedAt}
                setActiveSlide={setActiveSlide}
                addSlide={addSlide}
                updateSlideImage={updateSlideImage}
                removeSlide={removeSlide}
                setAppearance={setAppearance}
                handleReset={handleReset}
                onTemplateLoad={loadTemplate}
                onRandomize={randomizeState}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-16 pb-20">
                    <StoriesPreview ref={previewRef} state={state} />
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

export default Stories;
