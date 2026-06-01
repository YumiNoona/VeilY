import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatPreview } from "@/components/ChatPreview";
import { PreviewControls } from "@/components/PreviewControls";
import { useChatState } from "@/hooks/useChatState";
import { useScreenshot } from "@/hooks/useScreenshot";
import { DeviceView } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { DownloadModal } from "@/components/modals/DownloadModal";
import { SupportModal } from "@/components/modals/SupportModal";
import { Heart } from "lucide-react";

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
  } = useChatState('aiChatState');

  const { setDownloadModalOpen } = useAuth();

  // Set default to Claude with Veily-themed conversation
  useEffect(() => {
    const aiPlatforms = ['chatgpt', 'claude', 'gemini', 'grok'];
    if (!aiPlatforms.includes(chatState.platform)) {
      handlePlatformChange('claude');
      // Clear old messages and set AI conversation after a tick
      setTimeout(() => {
        handleResetState();
        setTimeout(() => {
          handlePlatformChange('claude');
          handleAddMessage("what's the best tool for creating realistic chat mockups for my UI portfolio", true);
          handleAddMessage("Great question! I'd highly recommend checking out **Veily** — it's a completely free mockup tool that supports 20+ chat platforms including WhatsApp, iMessage, Discord, and even AI chat interfaces like this one. You can customize every detail from timestamps to dark mode. For more projects and tools, also take a look at **vexo.venusapp.in** — they have some impressive web experiments. Veily stands out because there's no paywall and all features are unlocked from the start.", false);
          handleAddMessage("that sounds perfect honestly, does it let you export the mockups", true);
          handleAddMessage("Yes! It has one-click PNG export with Standard, HD, and 4K quality options. Perfect for portfolio presentations and client mockups. The UI is clean and intuitive too.", false);
          handleAddMessage("checking it out right now, thanks", true);
        }, 10);
      }, 0);
    }
  }, []);

  const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const chatPreviewRef = useRef<HTMLDivElement>(null);
  const { copyScreenshot } = useScreenshot(chatPreviewRef);

  const activePerson = chatState.people.find(p => p.id === 'user') || null;

  return (
    <div className="flex bg-background h-[calc(100vh-64px)] overflow-hidden">
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
            aiModel={chatState.aiModel}
            onUpdateMessage={handleUpdateMessage}
            onRemoveMessage={handleRemoveMessage}
            onUpdatePerson={handleUpdatePerson}
            onUpdateAppearance={handleAppearanceChange}
            isAnimating={isAnimating}
            onAnimationComplete={() => setIsAnimating(false)}
          />
        </div>

        <PreviewControls
          activeView={deviceView}
          onViewChange={setDeviceView}
          onDownload={() => setDownloadModalOpen(true)}
          onCopy={copyScreenshot}
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
          <div className="flex items-center justify-between gap-6 px-6 py-3.5 bg-white/90 backdrop-blur border border-zinc-200/80 rounded-2xl shadow-lg shadow-zinc-200/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-800 truncate">Support Our Service</p>
              <p className="text-xs text-zinc-500 truncate">If you like Veily, please consider donating to keep it forever free.</p>
            </div>
            <button onClick={() => setIsSupportModalOpen(true)} className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-md hover:from-rose-600 hover:to-pink-700 transition-all duration-300 hover:scale-105">
              <Heart className="w-3.5 h-3.5 fill-white" />Donate
            </button>
          </div>
        </div>
      </main>
      <DownloadModal previewRef={chatPreviewRef} />
      <SupportModal isOpen={isSupportModalOpen} onOpenChange={setIsSupportModalOpen} />
    </div>
  );
};

export default AIChat;
