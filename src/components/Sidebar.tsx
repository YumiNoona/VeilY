import * as React from "react";
import { ChatState, ChatType, Person, AppearanceSettings } from "@/types/chat";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Wand2, RotateCcw } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSection } from "./sidebar/sections/AppSection";
import { TypeSection } from "./sidebar/sections/TypeSection";
import { PeopleSection } from "./sidebar/sections/PeopleSection";
import { MessagesSection } from "./sidebar/sections/MessagesSection";
import { AppearanceSection } from "./sidebar/sections/AppearanceSection";
import { AIModelSection } from "./sidebar/sections/AIModelSection";
import { CallSection } from "./sidebar/sections/CallSection";
import { CHAT_TEMPLATES, AI_CHAT_TEMPLATES } from "@/lib/templates";
import { SmartFillModal } from "./modals/SmartFillModal";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarProps {
  chatState: ChatState;
  mode?: 'default' | 'ai' | 'call'; 
  callState?: any;
  onCallUpdateDuration?: (d: string) => void;
  onCallAddParticipant?: (p: any) => void;
  onCallUpdateParticipant?: (id: string, updates: any) => void;
  onCallRemoveParticipant?: (id: string) => void;
  onCallToggleSignal?: () => void;
  onCallToggleRecording?: () => void;
  onPlatformChange: (platform: ChatState['platform']) => void;
  onChatTypeChange: (type: ChatType) => void;
  onAddMessage: (text: string, isOwn: boolean, image?: string) => void;
  onRemoveMessage: (id: string) => void;
  onUpdatePerson: (person: Person) => void;
  onUpdateMessage: (id: string, newText: string, newTimestamp?: Date, newImage?: string, isOwn?: boolean) => void;
  onAddPerson: () => void;
  onRemovePerson: (id: string) => void;
  onAppearanceChange: (appearance: AppearanceSettings) => void;
  onAiModelChange?: (model: string) => void;
  onTemplateLoad?: (template: any) => void;
  onReorderMessages?: (newMessages: ChatState['messages']) => void;
  onReset?: () => void;
  onRandomize?: () => void;
  onBulkImport?: (data: any) => void;
  onSmartFill?: (data: any) => void; // New prop for AI Smart Fill
}

export function Sidebar({
  chatState,
  mode = 'default',
  onPlatformChange,
  onChatTypeChange,
  onAddMessage,
  onRemoveMessage,
  onUpdatePerson,
  onUpdateMessage,
  onAddPerson,
  onRemovePerson,
  onAppearanceChange,
  onAiModelChange,
  onTemplateLoad,
  onReorderMessages,
  onReset,
  onRandomize,
  onBulkImport,
  onSmartFill, 
  callState,
  onCallUpdateDuration,
  onCallAddParticipant,
  onCallUpdateParticipant,
  onCallRemoveParticipant,
  onCallToggleSignal,
  onCallToggleRecording,
}: SidebarProps) {
  const { plan, setUpgradeModalOpen } = useAuth();
  const [isSmartFillOpen, setIsSmartFillOpen] = React.useState(false);

  const handleSmartFillClick = () => {
    if (plan === 'free') {
      setUpgradeModalOpen(true);
      return;
    }
    setIsSmartFillOpen(true);
  };

  return (
    <TooltipProvider>
      <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-5 pb-2 border-b border-sidebar-border shrink-0 min-h-[64px]">
          <div className="flex items-center gap-1.5 flex-1">
            <Select onValueChange={(val) => {
              const templatesPool = mode === 'ai' ? AI_CHAT_TEMPLATES : CHAT_TEMPLATES;
              const template = templatesPool[val as keyof typeof templatesPool];
              if (onTemplateLoad && template) {
                onTemplateLoad(template as any);
              }
            }}>
              <SelectTrigger className="w-[110px] h-8 text-xs font-medium">
                <SelectValue placeholder="Templates" />
              </SelectTrigger>
              <SelectContent>
                {mode === 'ai' ? (
                  <>
                    <SelectGroup>
                      <SelectLabel>OpenAI</SelectLabel>
                      <SelectItem value="chatgptCoding">ChatGPT Coding</SelectItem>
                      <SelectItem value="chatgptCreative">ChatGPT Creative</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Anthropic</SelectLabel>
                      <SelectItem value="claudeAnalysis">Claude Analysis</SelectItem>
                      <SelectItem value="claudePhilosophy">Claude Philo</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Google</SelectLabel>
                      <SelectItem value="geminiTokyo">Gemini Travel</SelectItem>
                      <SelectItem value="geminiBusiness">Gemini Business</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>xAI</SelectLabel>
                      <SelectItem value="grokSarcasm">Grok Spicy</SelectItem>
                    </SelectGroup>
                  </>
                ) : (
                  <>
                    <SelectGroup>
                      <SelectLabel>Apple</SelectLabel>
                      <SelectItem value="iMessageDrama">iMessage Drama</SelectItem>
                      <SelectItem value="iMessageCasual">iMessage Bestie</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Meta</SelectLabel>
                      <SelectItem value="whatsappHoliday">WhatsApp Friends</SelectItem>
                      <SelectItem value="whatsappCustomer">WhatsApp Support</SelectItem>
                      <SelectItem value="whatsappShopping">WhatsApp Shop</SelectItem>
                      <SelectItem value="messengerMarket">Messenger Deal</SelectItem>
                      <SelectItem value="messengerNightOut">Messenger Plan</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Community</SelectLabel>
                      <SelectItem value="discordCommunity">Discord Raid</SelectItem>
                      <SelectItem value="discordGaming">Discord Gaming</SelectItem>
                      <SelectItem value="slackWorkspace">Slack Sync</SelectItem>
                      <SelectItem value="slackGeneral">Slack Pizza</SelectItem>
                      <SelectItem value="teamsMeeting">Teams Sync</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Social & Dating</SelectLabel>
                      <SelectItem value="snapchatDaily">Snapchat Daily</SelectItem>
                      <SelectItem value="tinderMatch">Tinder Match</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Regional</SelectLabel>
                      <SelectItem value="lineBusiness">LINE Business</SelectItem>
                      <SelectItem value="wechatFamily">WeChat Family</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Privacy</SelectLabel>
                      <SelectItem value="telegramCrypto">Telegram Whale</SelectItem>
                      <SelectItem value="telegramSecret">Telegram Secret</SelectItem>
                      <SelectItem value="signalSecure">Signal Secure</SelectItem>
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            {onReset && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={onReset}
                title="Reset All"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
            
            {onRandomize && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={onRandomize}
                title="Randomize Content"
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            )}

            {onSmartFill && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                onClick={handleSmartFillClick}
                title="AI Smart Fill (Premium)"
              >
                <Sparkles className="w-4 h-4 fill-amber-500/20" />
              </Button>
            )}
          </div>
        </div>

        <SmartFillModal 
          isOpen={isSmartFillOpen}
          onClose={() => setIsSmartFillOpen(false)}
          onSuccess={onSmartFill || (() => {})}
          platform={chatState.platform}
        />

        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin">
          <Accordion type="multiple" defaultValue={
            mode === 'ai' ? ["app-model", "messages", "appearance"] : 
            mode === 'call' ? ["call-participants", "app", "appearance"] :
            ["app", "type", "people", "messages", "appearance"]
          } className="space-y-2">

            {mode === 'call' && callState && (
              <CallSection
                state={callState}
                onUpdateDuration={onCallUpdateDuration || (() => {})}
                onAddParticipant={onCallAddParticipant || (() => {})}
                onUpdateParticipant={onCallUpdateParticipant || (() => {})}
                onRemoveParticipant={onCallRemoveParticipant || (() => {})}
                onToggleSignal={onCallToggleSignal || (() => {})}
                onToggleRecording={onCallToggleRecording || (() => {})}
              />
            )}

            {(mode === 'default' || mode === 'call') && (
              <AppSection
                platform={chatState.platform}
                onPlatformChange={onPlatformChange}
              />
            )}

            {mode === 'default' && (
              <>
                <TypeSection
                  chatType={chatState.chatType}
                  onChatTypeChange={onChatTypeChange}
                />

                <PeopleSection
                  people={chatState.people}
                  chatType={chatState.chatType}
                  onUpdatePerson={onUpdatePerson}
                  onAddPerson={onAddPerson}
                  onRemovePerson={onRemovePerson}
                />
              </>
            )}

            {mode === 'ai' && (
              <AIModelSection
                platform={chatState.platform}
                onPlatformChange={onPlatformChange}
                model={chatState.aiModel || 'gpt-4o'}
                onModelChange={onAiModelChange || (() => { })}
              />
            )}

            {mode !== 'call' && (
              <MessagesSection
                messages={chatState.messages}
                people={chatState.people}
                mode={mode}
                onAddMessage={onAddMessage}
                onRemoveMessage={onRemoveMessage}
                onUpdateMessage={onUpdateMessage}
                onReorderMessages={onReorderMessages}
                onBulkImport={onBulkImport}
              />
            )}

            <AppearanceSection
              appearance={chatState.appearance}
              onAppearanceChange={onAppearanceChange}
            />
          </Accordion>
        </div>
      </aside>
    </TooltipProvider >
  );
}
