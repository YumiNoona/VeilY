import React, { useRef, useState } from 'react';
import { SocialPostSidebar } from '@/components/SocialPostSidebar';
import { SocialPostPreview, SocialPostPreviewRef } from '@/components/SocialPostPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { useSocialPostState } from '@/hooks/useSocialPostState';
import { DeviceView } from '@/types/chat';

const SocialPost = () => {
    const {
        state,
        setPlatform,
        setAuthor,
        setContent,
        setMetrics,
        setConfig
    } = useSocialPostState();

    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const previewRef = useRef<SocialPostPreviewRef>(null);

    return (
        <div className="flex h-full bg-background animate-in fade-in duration-300 overflow-hidden relative">
            <SocialPostSidebar
                state={state}
                setPlatform={setPlatform}
                setAuthor={setAuthor}
                setContent={setContent}
                setMetrics={setMetrics}
                setConfig={setConfig}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-32 pb-20">
                    <SocialPostPreview ref={previewRef} state={state} />
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

export default SocialPost;
