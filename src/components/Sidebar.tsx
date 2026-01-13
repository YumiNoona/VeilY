import * as React from "react";
import { ChatState, ChatType, Person, AppearanceSettings } from "@/types/chat";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSection } from "./sidebar/sections/AppSection";
import { TypeSection } from "./sidebar/sections/TypeSection";
import { PeopleSection } from "./sidebar/sections/PeopleSection";
import { MessagesSection } from "./sidebar/sections/MessagesSection";
import { AppearanceSection } from "./sidebar/sections/AppearanceSection";
import { AIModelSection } from "./sidebar/sections/AIModelSection";
import { Logo } from "./Logo";

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
}: SidebarProps) {

  return (
    <TooltipProvider>
      <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-5 pb-2 border-b border-sidebar-border shrink-0">
          <Logo />
          <Button variant="outline" size="sm" className="text-xs font-medium h-8">Sign In</Button>
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
