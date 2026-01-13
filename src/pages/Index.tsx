import { useState, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatPreview } from "@/components/ChatPreview";
import { PreviewControls } from "@/components/PreviewControls";
import { useChatState } from "@/hooks/useChatState";
import { useScreenshot } from "@/hooks/useScreenshot";
import { DeviceView } from "@/types/chat";

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
  } = useChatState();

  const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
  const chatPreviewRef = useRef<HTMLDivElement>(null);
  const { downloadScreenshot, copyScreenshot } = useScreenshot(chatPreviewRef);

  const activePerson = chatState.people.find(p => p.id === 'user') || null;

  return (
    <div className="flex h-full bg-background animate-in fade-in duration-300 overflow-hidden">
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
      />

      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-32 pb-20">
          <ChatPreview
            ref={chatPreviewRef}
            platform={chatState.platform}
            messages={chatState.messages}
            people={chatState.people}
            activePerson={activePerson}
            chatType={chatState.chatType}
            deviceView={deviceView}
            appearance={chatState.appearance}
          />
        </div>

        <PreviewControls
          activeView={deviceView}
          onViewChange={setDeviceView}
          onDownload={() => downloadScreenshot(`mockly-${chatState.platform}`)}
          onCopy={copyScreenshot}
        />
      </main>
    </div>
  );
};

export default Index;

