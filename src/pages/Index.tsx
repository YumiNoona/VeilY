import { useState, useRef, useEffect } from "react"; // Re-saved to clear runtime error
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatPreview } from "@/components/ChatPreview";
import { PreviewControls } from "@/components/PreviewControls";
import { useChatState } from "@/hooks/useChatState";
import { useScreenshot } from "@/hooks/useScreenshot";
import { DeviceView, Platform } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { DownloadModal } from "@/components/modals/DownloadModal";
import { SupportBanner } from "@/components/SupportBanner";
import { supportsDesktopChatPreview } from "@/lib/platform-capabilities";

const CHAT_PLATFORMS: Platform[] = [
  'whatsapp', 'discord', 'imessage', 'instagram', 'telegram', 'messenger',
  'tiktok', 'slack', 'reddit', 'snapchat', 'line', 'teams', 'signal',
  'tinder', 'wechat', 'x',
];

const isChatPlatform = (value: string): value is Platform =>
  CHAT_PLATFORMS.includes(value as Platform);

const Index = () => {
  const {
    chatState,
    handlePlatformChange,
    handleChatTypeChange,
    handleAddMessage,
    handleRemoveMessage,
    handleUpdatePerson,
    handleAddPerson,
    handleRemovePerson,
    handleUpdateMessage,
    handleAppearanceChange,
    handleReorderMessages,
    handleResetState,
    handleLoadTemplate,
    handleBulkDataImport,
    handleSmartFill,
    randomizeState,
  } = useChatState('chatState');

  // Ensure standard chat defaults to WhatsApp if an AI platform was previously stored
  useEffect(() => {
    const aiPlatforms = ['chatgpt', 'claude', 'gemini', 'grok'];
    if (aiPlatforms.includes(chatState.platform)) {
      handlePlatformChange('whatsapp');
    }
  }, [chatState.platform, handlePlatformChange]);

  // Set platform from URL param on first load
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const platformParam = searchParams.get('platform');
    if (platformParam) {
      if (isChatPlatform(platformParam)) {
        handlePlatformChange(platformParam);
      }
    }
  }, [handlePlatformChange, searchParams]);

   const { setDownloadModalOpen } = useAuth();
   const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
   const [isAnimating, setIsAnimating] = useState(false);
   const chatPreviewRef = useRef<HTMLDivElement>(null);
   const { copyScreenshot } = useScreenshot(chatPreviewRef);

   const activePerson = chatState.people.find(p => p.id === 'user') || null;

  const desktopPreviewAvailable = supportsDesktopChatPreview(chatState.platform);

  useEffect(() => {
    if (!desktopPreviewAvailable && deviceView === 'desktop') {
      setDeviceView('mobile');
    }
  }, [desktopPreviewAvailable, deviceView]);

  return (
    <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden">
      <Sidebar
        chatState={chatState}
        onPlatformChange={handlePlatformChange}
        onChatTypeChange={handleChatTypeChange}
        onAddMessage={handleAddMessage}
        onRemoveMessage={handleRemoveMessage}
        onUpdatePerson={handleUpdatePerson}
        onUpdateMessage={handleUpdateMessage}
        onAddPerson={handleAddPerson}
        onRemovePerson={handleRemovePerson}
        onAppearanceChange={handleAppearanceChange}
        onReorderMessages={handleReorderMessages}
        onReset={handleResetState}
        onTemplateLoad={handleLoadTemplate}
        onRandomize={randomizeState}
        onBulkImport={handleBulkDataImport}
        onSmartFill={handleSmartFill}
      />

      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/30">
        <div className="min-h-full flex flex-col items-center justify-center gap-8 p-4 lg:p-8 xl:pr-24">
          <ChatPreview
            ref={chatPreviewRef}
            platform={chatState.platform}
            messages={chatState.messages}
            people={chatState.people}
            activePerson={activePerson}
            chatType={chatState.chatType}
            deviceView={deviceView}
            appearance={chatState.appearance}
            onUpdateMessage={handleUpdateMessage}
            onRemoveMessage={handleRemoveMessage}
            onUpdatePerson={handleUpdatePerson}
            onUpdateAppearance={handleAppearanceChange}
            isAnimating={isAnimating}
            onAnimationComplete={() => setIsAnimating(false)}
          />
          <SupportBanner />
        </div>

        <PreviewControls
          activeView={deviceView}
          onViewChange={setDeviceView}
          onDownload={() => setDownloadModalOpen(true)}
          onCopy={copyScreenshot}
          isAnimating={isAnimating}
          onToggleAnimation={() => setIsAnimating(!isAnimating)}
          availableViews={desktopPreviewAvailable ? ['desktop', 'mobile'] : ['mobile']}
        />

      </main>
      <DownloadModal previewRef={chatPreviewRef} />
    </div>
  );
};

export default Index;
