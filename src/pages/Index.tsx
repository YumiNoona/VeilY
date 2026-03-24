import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatPreview } from "@/components/ChatPreview";
import { PreviewControls } from "@/components/PreviewControls";
import { useChatState } from "@/hooks/useChatState";
import { useScreenshot } from "@/hooks/useScreenshot";
import { DeviceView } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { DownloadModal } from "@/components/modals/DownloadModal";

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
    randomizeState,
  } = useChatState('chatState');

  // Ensure standard chat defaults to WhatsApp if an AI platform was previously stored
  useEffect(() => {
    const aiPlatforms = ['chatgpt', 'claude', 'gemini', 'grok'];
    if (aiPlatforms.includes(chatState.platform)) {
      handlePlatformChange('whatsapp');
    }
  }, [chatState.platform, handlePlatformChange]);

  const { setDownloadModalOpen } = useAuth();
  const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
  const chatPreviewRef = useRef<HTMLDivElement>(null);
  const { copyScreenshot } = useScreenshot(chatPreviewRef);

  const activePerson = chatState.people.find(p => p.id === 'user') || null;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background animate-in fade-in duration-300 overflow-hidden">
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
      />

      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-muted/30">
        <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8">
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
            onUpdatePerson={handleUpdatePerson}
            onUpdateAppearance={handleAppearanceChange}
          />
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

export default Index;
