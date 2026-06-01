import { Message, Person, Platform, ChatType, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import { PLATFORM_CHAT_MAP } from "./platforms/index";
import { forwardRef, useMemo, useState, useEffect, useRef, useCallback, useId } from "react";
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
    <div className={cn("h-6 px-5 flex items-center justify-between text-[12px] font-medium shrink-0", bgColor, textColor)}>
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

export const ChatPreview = forwardRef<HTMLDivElement, ChatPreviewProps>(
  ({ platform, messages, people, activePerson, chatType, deviceView, appearance, aiModel, onUpdateMessage, onRemoveMessage, onUpdatePerson, isAnimating, onAnimationComplete }, ref) => {
    const [visibleCount, setVisibleCount] = useState(messages.length);
    const [isTyping, setIsTyping] = useState(false);
    const animRef = useRef(false);
    const cancelledRef = useRef(false);

    const runAnimation = useCallback(() => {
      cancelledRef.current = false;
      setVisibleCount(0);
      setIsTyping(false);

      let current = 0;
      const playNext = async () => {
        if (cancelledRef.current || current >= messages.length) {
          if (!cancelledRef.current) onAnimationComplete?.();
          return;
        }

        const nextMsg = messages[current];

        if (!nextMsg.isOwn) {
          setIsTyping(true);
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
          if (cancelledRef.current) return;
          setIsTyping(false);
        } else {
          await new Promise(r => setTimeout(r, 500));
          if (cancelledRef.current) return;
        }

        setVisibleCount(prev => prev + 1);
        current++;
        playNext();
      };

      playNext();
    }, [messages, onAnimationComplete]);

    useEffect(() => {
      if (!isAnimating) {
        cancelledRef.current = true;
        animRef.current = false;
        setVisibleCount(messages.length);
        setIsTyping(false);
        return;
      }
      animRef.current = true;
      runAnimation();
    }, [isAnimating, runAnimation]);

    const visibleMessages = useMemo(() => messages.slice(0, visibleCount), [messages, visibleCount]);

    const showFrame = appearance.showDeviceFrame ?? true;
    const showStatusBar = appearance.showDeviceStatusBar ?? true;

    const deviceStyles = deviceView === 'desktop'
      ? 'w-full max-w-[667px] h-[375px]'
      : 'w-full max-w-[375px] h-[600px] sm:h-[756px]';

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

    const fontSizeMap = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem' };
    const fontFamilyMap = { sans: 'ui-sans-serif, system-ui, sans-serif', serif: 'Georgia, serif', mono: 'ui-monospace, monospace' };
    const fontSize = fontSizeMap[appearance.fontSize ?? 'sm'];
    const fontFamily = fontFamilyMap[appearance.fontFamily ?? 'sans'];
    const chatId = useId().replace(/:/g, '');

    return (
      <>
        <style>{`
          #${chatId} * {
            font-size: ${fontSize} !important;
            font-family: ${fontFamily} !important;
          }
        `}</style>
      <div
        ref={ref}
        className={cn(
          "overflow-hidden shadow-2xl transition-all duration-300 mx-auto",
          showFrame && !appearance.transparentBackground ? "rounded-[40px] border-[8px] border-black bg-black" : "rounded-xl",
          appearance.transparentBackground && "bg-transparent border-transparent",
          deviceStyles
        )}
      >
        <div id={chatId} className={cn(
          "w-full h-full overflow-hidden flex flex-col relative",
          showFrame ? "rounded-[32px]" : "rounded-xl",
          !appearance.transparentBackground && (appearance.darkMode ? "bg-black" : "bg-white")
        )}>
          {showStatusBar && <DeviceStatusBar appearance={appearance} />}
          <div className="flex-1 overflow-hidden relative">
            <PlatformChat {...chatProps} />
          </div>
          <Watermark isDark={appearance.darkMode} />
        </div>
      </div>
      </>
    );
  }
);
ChatPreview.displayName = 'ChatPreview';
