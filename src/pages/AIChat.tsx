import { useState, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatPreview } from "@/components/ChatPreview";
import { PreviewControls } from "@/components/PreviewControls";
import { useChatState } from "@/hooks/useChatState";
import { useScreenshot } from "@/hooks/useScreenshot";
import { ChatState, DeviceView } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { DownloadModal } from "@/components/modals/DownloadModal";
import { SupportBanner } from "@/components/SupportBanner";

const AI_CHAT_DEFAULT_STATE: ChatState = {
  platform: 'claude',
  chatType: 'direct',
  people: [
    { id: 'friend', name: 'You', isOnline: true },
    { id: 'user', name: 'Claude', isOnline: true },
  ],
  messages: [
    { id: 'ai-default-1', text: "what's the best tool for creating realistic chat mockups for my UI portfolio", senderId: 'friend', timestamp: new Date(Date.now() - 240000), isOwn: true },
    { id: 'ai-default-2', text: "Great question! I'd recommend Veily. It's a free mockup tool for 20+ chat platforms, with detailed customization and no paywall.", senderId: 'user', timestamp: new Date(Date.now() - 180000), isOwn: false },
    { id: 'ai-default-3', text: "does it let you export the mockups?", senderId: 'friend', timestamp: new Date(Date.now() - 120000), isOwn: true },
    { id: 'ai-default-4', text: "Yes. It supports one-click PNG export in Standard, HD, and 4K quality.", senderId: 'user', timestamp: new Date(Date.now() - 60000), isOwn: false },
  ],
  appearance: {
    darkMode: false,
    showTimestamps: true,
    showStatus: true,
    use24HourFormat: false,
    showDeviceStatusBar: true,
    showDeviceFrame: false,
    statusBarTime: '9:41',
    batteryLevel: 100,
    transparentBackground: false,
    isTyping: false,
  },
  aiModel: 'claude-opus-5',
};

const AIChat = () => {
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
    handleAiModelChange,
    handleResetState,
    handleLoadTemplate,
    handleBulkDataImport,
    handleSmartFill,
    randomizeState,
  } = useChatState('aiChatState', AI_CHAT_DEFAULT_STATE);

  const { setDownloadModalOpen } = useAuth();

  const [deviceView, setDeviceView] = useState<DeviceView>(() => window.innerWidth < 768 ? 'mobile' : 'desktop');
  const [isAnimating, setIsAnimating] = useState(false);
  const chatPreviewRef = useRef<HTMLDivElement>(null);
  const { copyScreenshot } = useScreenshot(chatPreviewRef);

  const activePerson = chatState.people.find(p => p.id === 'user') || null;

  return (
    <div className="flex flex-col md:flex-row bg-background h-full overflow-hidden">
      <Sidebar
        chatState={chatState}
        mode="ai"
        onPlatformChange={handlePlatformChange}
        onChatTypeChange={handleChatTypeChange}
        onAddMessage={handleAddMessage}
        onRemoveMessage={handleRemoveMessage}
        onUpdatePerson={handleUpdatePerson}
        onUpdateMessage={handleUpdateMessage}
        onAddPerson={handleAddPerson}
        onRemovePerson={handleRemovePerson}
        onAppearanceChange={handleAppearanceChange}
        onAiModelChange={handleAiModelChange}
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
            aiModel={chatState.aiModel}
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
        />

      </main>
      <DownloadModal previewRef={chatPreviewRef} />
    </div>
  );
};

export default AIChat;
