import * as React from "react";
import { ChatState, ChatType, Person, AppearanceSettings } from "@/types/chat";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSection } from "./sidebar/sections/AppSection";
import { TypeSection } from "./sidebar/sections/TypeSection";
import { PeopleSection } from "./sidebar/sections/PeopleSection";
import { MessagesSection } from "./sidebar/sections/MessagesSection";
import { AppearanceSection } from "./sidebar/sections/AppearanceSection";
import { AIModelSection } from "./sidebar/sections/AIModelSection";
import { CHAT_TEMPLATES, AI_CHAT_TEMPLATES } from "@/lib/templates";
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
  mode?: 'default' | 'ai'; // Add mode prop
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
}

export function Sidebar({
  chatState,
  mode = 'default', // Default to normal sidebar
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
}: SidebarProps) {

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
              <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
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
                      <SelectItem value="messengerMarket">Messenger Deal</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Privacy</SelectLabel>
                      <SelectItem value="telegramCrypto">Telegram Whale</SelectItem>
                      <SelectItem value="telegramSecret">Telegram Secret</SelectItem>
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {onReset && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium h-8 text-muted-foreground gap-1.5"
              onClick={onReset}
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin">
          <Accordion type="multiple" defaultValue={mode === 'ai' ? ["app-model", "messages", "appearance"] : ["app", "type", "people", "messages", "appearance"]} className="space-y-2">

            {mode === 'default' && (
              <>
                <AppSection
                  platform={chatState.platform}
                  onPlatformChange={onPlatformChange}
                />

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

            <MessagesSection
              messages={chatState.messages}
              people={chatState.people}
              mode={mode}
              onAddMessage={onAddMessage}
              onRemoveMessage={onRemoveMessage}
              onUpdateMessage={onUpdateMessage}
              onReorderMessages={onReorderMessages}
            />

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
