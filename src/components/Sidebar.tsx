import * as React from "react";
import { ChatState, ChatType, Person, AppearanceSettings, CallState } from "@/types/chat";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Wand2, RotateCcw, Sparkles } from "lucide-react";
import { AppSection } from "./sidebar/sections/AppSection";
import { TypeSection } from "./sidebar/sections/TypeSection";
import { PeopleSection } from "./sidebar/sections/PeopleSection";
import { MessagesSection } from "./sidebar/sections/MessagesSection";
import { AppearanceSection } from "./sidebar/sections/AppearanceSection";
import { AIModelSection } from "./sidebar/sections/AIModelSection";
import { CallSection } from "./sidebar/sections/CallSection";
import { CallPlatformSection } from "./sidebar/sections/CallPlatformSection";
import { CHAT_TEMPLATES, AI_CHAT_TEMPLATES } from "@/lib/templates";
import { SmartFillModal } from "./modals/SmartFillModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CALL_PRESETS = {
  family: {
    label: 'Family call',
    platform: 'whatsapp' as const,
    settings: { title: 'Family Catch-up', layout: 'grid' as const, quality: 'hd' as const, isScreenSharing: false, showCaptions: false, showChatPanel: false, showParticipantPanel: false },
  },
  gaming: {
    label: 'Gaming lobby',
    platform: 'discord' as const,
    settings: { title: 'Gaming Night', layout: 'speaker' as const, quality: 'auto' as const, isScreenSharing: false, showCaptions: false, showChatPanel: false, showParticipantPanel: false },
  },
  facetime: {
    label: 'FaceTime group',
    platform: 'facetime' as const,
    settings: { title: 'Sunday Catch-up', layout: 'grid' as const, quality: 'hd' as const, isScreenSharing: false, showCaptions: false, showChatPanel: false, showParticipantPanel: false },
  },
  review: {
    label: 'Project review',
    platform: 'zoom' as const,
    settings: { title: 'Project Review', layout: 'sidebar' as const, quality: 'hd' as const, isScreenSharing: true, showCaptions: false, showChatPanel: false, showParticipantPanel: false },
  },
  standup: {
    label: 'Meet stand-up',
    platform: 'meet' as const,
    settings: { title: 'Daily Stand-up', layout: 'grid' as const, quality: 'hd' as const, isScreenSharing: false, showCaptions: true, showChatPanel: false, showParticipantPanel: false },
  },
};

interface SidebarProps {
  chatState: ChatState;
  mode?: 'default' | 'ai' | 'call'; 
  callState?: any;
  onCallUpdateDuration?: (d: string) => void;
  onCallAddParticipant?: (p: any) => void;
  onCallUpdateParticipant?: (id: string, updates: any) => void;
  onCallUpdateSettings?: (updates: Partial<CallState>) => void;
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
  onCallUpdateSettings,
  onCallRemoveParticipant,
  onCallToggleSignal,
  onCallToggleRecording,
}: SidebarProps) {
  const [isSmartFillOpen, setIsSmartFillOpen] = React.useState(false);

  return (
      <aside className="w-full md:w-[390px] xl:w-[430px] h-[48%] md:h-full shrink-0 bg-sidebar-bg border-b md:border-b-0 md:border-r border-sidebar-border flex flex-col">
        <div className="shrink-0 border-b border-sidebar-border p-3">
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <Select onValueChange={(val) => {
              if (mode === 'call') {
                const preset = CALL_PRESETS[val as keyof typeof CALL_PRESETS];
                if (preset) {
                  onPlatformChange(preset.platform as ChatState['platform']);
                  onCallUpdateSettings?.(preset.settings);
                }
                return;
              }

              const templatesPool = mode === 'ai' ? AI_CHAT_TEMPLATES : CHAT_TEMPLATES;
              const template = templatesPool[val as keyof typeof templatesPool];
              if (onTemplateLoad && template) {
                onTemplateLoad(template as any);
              }
            }}>
              <SelectTrigger className="h-10 w-full rounded-xl text-sm font-medium">
                <SelectValue placeholder={mode === 'call' ? "Presets" : "Templates"} />
              </SelectTrigger>
              <SelectContent>
                {mode === 'call' ? (
                  <SelectGroup>
                    <SelectLabel>Call presets</SelectLabel>
                    {Object.entries(CALL_PRESETS).map(([value, preset]) => (
                      <SelectItem key={value} value={value}>{preset.label}</SelectItem>
                    ))}
                  </SelectGroup>
                ) : mode === 'ai' ? (
                  <>
                    <SelectGroup>
                      <SelectLabel>OpenAI</SelectLabel>
                      <SelectItem value="chatgptCoding">ChatGPT Coding</SelectItem>
                      <SelectItem value="chatgptCreative">ChatGPT Creative</SelectItem>
                      <SelectItem value="chatgptDebug">ChatGPT Debugging</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Anthropic</SelectLabel>
                      <SelectItem value="claudeAnalysis">Claude Analysis</SelectItem>
                      <SelectItem value="claudePhilosophy">Claude Philo</SelectItem>
                      <SelectItem value="claudeWriter">Claude Writing</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Google</SelectLabel>
                      <SelectItem value="geminiTokyo">Gemini Travel</SelectItem>
                      <SelectItem value="geminiBusiness">Gemini Business</SelectItem>
                      <SelectItem value="geminiResearch">Gemini Research</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>xAI</SelectLabel>
                      <SelectItem value="grokSarcasm">Grok Spicy</SelectItem>
                      <SelectItem value="grokRoast">Grok Roast</SelectItem>
                    </SelectGroup>
                  </>
                ) : (
                  <>
                    <SelectGroup>
                      <SelectLabel>Apple</SelectLabel>
                      <SelectItem value="iMessageDrama">iMessage Trip</SelectItem>
                      <SelectItem value="iMessageCasual">iMessage Coffee</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Meta</SelectLabel>
                      <SelectItem value="whatsappHoliday">WhatsApp Friends</SelectItem>
                      <SelectItem value="whatsappCustomer">WhatsApp Support</SelectItem>
                      <SelectItem value="whatsappShopping">WhatsApp Shop</SelectItem>
                      <SelectItem value="messengerMarket">Messenger Deal</SelectItem>
                      <SelectItem value="messengerNightOut">Messenger Plan</SelectItem>
                      <SelectItem value="whatsappFamily">WhatsApp Family</SelectItem>
                      <SelectItem value="messengerBusiness">Messenger Studio</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Community</SelectLabel>
                      <SelectItem value="discordCommunity">Discord Game Night</SelectItem>
                      <SelectItem value="discordGaming">Discord Gaming</SelectItem>
                      <SelectItem value="slackWorkspace">Slack Sync</SelectItem>
                      <SelectItem value="slackGeneral">Slack Pizza</SelectItem>
                      <SelectItem value="teamsMeeting">Teams Sync</SelectItem>
                      <SelectItem value="telegramChannel">Telegram Editorial</SelectItem>
                      <SelectItem value="discordMod">Discord Moderation</SelectItem>
                      <SelectItem value="teamsStandup">Teams Standup</SelectItem>
                      <SelectItem value="slackDesign">Slack Design</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Social & Dating</SelectLabel>
                      <SelectItem value="snapchatDaily">Snapchat Daily</SelectItem>
                      <SelectItem value="tinderMatch">Tinder Match</SelectItem>
                      <SelectItem value="instagramChat">Instagram Plans</SelectItem>
                      <SelectItem value="tiktokChat">TikTok Plans</SelectItem>
                      <SelectItem value="redditChat">Reddit Moderation</SelectItem>
                      <SelectItem value="xChat">X Meetup</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Regional</SelectLabel>
                      <SelectItem value="lineBusiness">LINE Business</SelectItem>
                      <SelectItem value="wechatFamily">WeChat Family</SelectItem>
                      <SelectItem value="lineGroup">LINE Group Order</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Privacy</SelectLabel>
                      <SelectItem value="telegramCrypto">Telegram Investing</SelectItem>
                      <SelectItem value="telegramSecret">Telegram House Key</SelectItem>
                      <SelectItem value="signalSecure">Signal Plumber Visit</SelectItem>
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
                className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground"
                onClick={onReset}
                aria-label="Reset configuration"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {onRandomize && !onSmartFill && (
              <Select
                value={chatState.appearance.chatStyle ?? 'mixed'}
                onValueChange={(val) => onAppearanceChange?.({ ...chatState.appearance, chatStyle: val as any })}
              >
                <SelectTrigger className="h-10 w-auto gap-1 rounded-xl border-dashed border-zinc-300 px-2.5 text-sm font-medium">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {onRandomize && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/30"
                onClick={onRandomize}
                aria-label="Randomize content"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            )}

            {onSmartFill && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30"
                onClick={() => setIsSmartFillOpen(true)}
                aria-label="Open smart fill"
              >
                <Sparkles className="h-4 w-4 fill-amber-500/20" />
              </Button>
            )}
          </div>
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
                onUpdateSettings={onCallUpdateSettings || (() => {})}
                onRemoveParticipant={onCallRemoveParticipant || (() => {})}
                onToggleSignal={onCallToggleSignal || (() => {})}
                onToggleRecording={onCallToggleRecording || (() => {})}
              />
            )}

            {mode === 'default' && (
              <AppSection
                platform={chatState.platform}
                onPlatformChange={onPlatformChange}
              />
            )}

            {mode === 'call' && callState && (
              <CallPlatformSection
                platform={callState.platform}
                onPlatformChange={(platform) => onPlatformChange(platform as any)}
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
                model={chatState.aiModel || 'gpt-5.6-sol'}
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
              mode={mode}
            />
          </Accordion>
        </div>
      </aside>
  );
}
