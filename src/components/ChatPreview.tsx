import { Message, Person, Platform, ChatType, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import { PLATFORM_CHAT_MAP } from "./platforms/index";
import { forwardRef, useMemo, useState, useEffect } from "react";
import { Watermark } from "@/components/Watermark";
import { AppearanceSettings } from "@/types/chat";
import { Signal, Wifi } from "lucide-react";

interface ChatPreviewProps {
  platform: Platform;
  messages: Message[];
  people: Person[];
  activePerson: Person | null;
  chatType: ChatType;
  deviceView: DeviceView;
  appearance: AppearanceSettings;
  aiModel?: string;
  onUpdateMessage?: (id: string, text: string) => void;
  onRemoveMessage?: (id: string) => void;
  onUpdatePerson?: (person: Person) => void;
  onUpdateAppearance?: (appearance: AppearanceSettings) => void;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
}

const DeviceStatusBar = ({ appearance }: { appearance: AppearanceSettings }) => {
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("h-6 px-5 flex items-center justify-between text-[12px] font-medium", bgColor, textColor)}>
      <span>{appearance.statusBarTime || '9:41'}</span>
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <div className="flex items-center gap-0.5">
          <div className={cn("w-6 h-3 rounded-sm border relative", appearance.darkMode ? 'border-white' : 'border-black')}>
            <div
              className={cn("absolute left-0.5 top-0.5 bottom-0.5 rounded-[2px]", appearance.darkMode ? 'bg-white' : 'bg-black')}
              style={{ width: `${Math.max(0, Math.min(100, appearance.batteryLevel || 100)) * 0.8}%` }}
            />
          </div>
          <div className={cn("w-1 h-1.5 rounded-r-sm", appearance.darkMode ? 'bg-white' : 'bg-black')} />
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = ({ platform, appearance }: { platform: Platform, appearance: AppearanceSettings }) => {
  return (
    <div className={cn(
      "flex items-center gap-1 p-2 rounded-2xl w-fit animate-pulse",
      appearance.darkMode ? "bg-zinc-800" : "bg-zinc-100"
    )}>
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
    </div>
  );
};

export const ChatPreview = forwardRef<HTMLDivElement, ChatPreviewProps>(
  ({ platform, messages, people, activePerson, chatType, deviceView, appearance, aiModel, onUpdateMessage, onRemoveMessage, onUpdatePerson, isAnimating, onAnimationComplete }, ref) => {
    const [visibleCount, setVisibleCount] = useState(isAnimating ? 0 : messages.length);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      if (!isAnimating) {
        setVisibleCount(messages.length);
        setIsTyping(false);
        return;
      }

      setVisibleCount(0);
      let current = 0;

      const playNext = async () => {
        if (current >= messages.length) {
          onAnimationComplete?.();
          return;
        }

        const nextMsg = messages[current];
        
        // Show typing indicator if it's not our own message
        if (!nextMsg.isOwn) {
          setIsTyping(true);
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
          setIsTyping(false);
        } else {
          await new Promise(r => setTimeout(r, 500));
        }

        setVisibleCount(prev => prev + 1);
        current++;
        playNext();
      };

      playNext();
    }, [isAnimating, messages]);

    const visibleMessages = useMemo(() => messages.slice(0, visibleCount), [messages, visibleCount]);

    const showFrame = appearance.showDeviceFrame ?? true;
    const showStatusBar = appearance.showDeviceStatusBar ?? true;

    const deviceStyles = deviceView === 'desktop' ? 'w-[667px] h-[375px]' : 'w-[375px] h-[812px]';

    // Component map — O(1) lookup, replaces the switch statement
    const PlatformChat = useMemo(() => {
      return PLATFORM_CHAT_MAP[platform] ?? PLATFORM_CHAT_MAP['whatsapp'];
    }, [platform]);

    const chatProps = useMemo(() => ({
      messages: visibleMessages,
      people,
      activePerson,
      chatType,
      appearance,
      aiModel,
      isTyping,
      onUpdateMessage,
      onRemoveMessage,
      onUpdatePerson,
    }), [visibleMessages, people, activePerson, chatType, appearance, aiModel, isTyping, onUpdateMessage, onRemoveMessage, onUpdatePerson]);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden shadow-2xl transition-all duration-300",
          showFrame ? "rounded-[40px] border-[8px] border-black bg-black" : "rounded-xl",
          appearance.transparentBackground && "bg-transparent border-transparent",
          deviceStyles
        )}
      >
        <div className={cn("w-full h-full overflow-hidden flex flex-col relative", showFrame ? "rounded-[32px]" : "rounded-xl")}>
          {showStatusBar && <DeviceStatusBar appearance={appearance} />}
          <div className="flex-1 overflow-hidden relative">
            <PlatformChat {...chatProps} />
          </div>
          <Watermark isDark={appearance.darkMode} />
        </div>
      </div>
    );
  }
);

ChatPreview.displayName = 'ChatPreview';
