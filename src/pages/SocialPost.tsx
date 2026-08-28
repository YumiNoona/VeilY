import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SocialPostSidebar } from '@/components/SocialPostSidebar';
import { SocialPostPreview, SocialPostPreviewRef } from '@/components/SocialPostPreview';
import { PreviewControls } from '@/components/PreviewControls';
import { SocialPlatform, useSocialPostState } from '@/hooks/useSocialPostState';
import { DeviceView } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { DownloadModal } from '@/components/modals/DownloadModal';

const SocialPost = () => {
    const {
        state,
        setPlatform,
        setAuthor,
        setContent,
        setMetrics,
        setConfig,
        setThreadItems,
        loadTemplate,
        randomizeState,
        handleResetState
    } = useSocialPostState();

    const { setDownloadModalOpen } = useAuth();
    const [searchParams] = useSearchParams();
    const requestedPlatform = searchParams.get('platform');

    useEffect(() => {
        const supportedPlatforms: SocialPlatform[] = ['twitter', 'instagram', 'linkedin', 'facebook', 'reddit'];
        if (requestedPlatform && supportedPlatforms.includes(requestedPlatform as SocialPlatform)) {
            setPlatform(requestedPlatform as SocialPlatform);
        }
    }, [requestedPlatform, setPlatform]);
    const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
    const previewRef = useRef<SocialPostPreviewRef>(null);

    return (
        <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden relative">
            <SocialPostSidebar
                state={state}
                setPlatform={setPlatform}
                setAuthor={setAuthor}
                setContent={setContent}
                setMetrics={setMetrics}
                setConfig={setConfig}
                setThreadItems={setThreadItems}
                loadTemplate={loadTemplate}
                randomizeState={randomizeState}
                handleResetState={handleResetState}
            />
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/30">
                <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8">
                    <SocialPostPreview ref={previewRef} state={state} />
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

export default SocialPost;
