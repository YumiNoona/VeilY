import { Message, Person, Platform, ChatType, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import { PLATFORM_CHAT_MAP } from "./platforms/index";
import { forwardRef, useMemo, useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
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
    const previewRootRef = useRef<HTMLDivElement | null>(null);

    const setPreviewRef = useCallback((node: HTMLDivElement | null) => {
      previewRootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }, [ref]);

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
    }, [isAnimating, messages.length, runAnimation]);

    const visibleMessages = useMemo(() => messages.slice(0, visibleCount), [messages, visibleCount]);

    useEffect(() => {
      const frame = requestAnimationFrame(() => {
        const scroller = previewRootRef.current?.querySelector<HTMLElement>('[data-chat-scroll]')
          ?? previewRootRef.current?.querySelector<HTMLElement>('.overflow-y-auto');
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
      });
      return () => cancelAnimationFrame(frame);
    }, [platform, visibleMessages.length, isTyping]);

    const showFrame = deviceView === 'mobile' && (appearance.showDeviceFrame ?? true);
    const showStatusBar = deviceView === 'mobile' && (appearance.showDeviceStatusBar ?? true);

    const deviceStyles = deviceView === 'desktop'
      ? 'w-full max-w-[1040px] h-[min(620px,calc(100vh-15rem))] min-h-[420px]'
      : 'w-full max-w-[375px] h-[600px] sm:h-[min(756px,calc(100vh-8rem))]';

    const PlatformChat = useMemo(() => {
      return PLATFORM_CHAT_MAP[platform] ?? PLATFORM_CHAT_MAP['whatsapp'];
    }, [platform]);

    const chatProps = useMemo(() => ({
      messages: visibleMessages,
      people,
      activePerson,
      chatType,
      deviceView,
      appearance: isTyping ? { ...appearance, isTyping: true } : appearance,
      aiModel,
      isTyping,
      onUpdateMessage,
      onRemoveMessage,
      onUpdatePerson,
    }), [visibleMessages, people, activePerson, chatType, deviceView, appearance, aiModel, isTyping, onUpdateMessage, onRemoveMessage, onUpdatePerson]);

    const fontSizeMap = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem' };
    const fontFamilyMap = { sans: 'ui-sans-serif, system-ui, sans-serif', serif: 'Georgia, serif', mono: 'ui-monospace, monospace' };
    const fontSize = fontSizeMap[appearance.fontSize ?? 'sm'];
    const fontFamily = fontFamilyMap[appearance.fontFamily ?? 'sans'];
    const chatStyle = {
      '--chat-message-font-size': fontSize,
      '--chat-message-font-family': fontFamily,
    } as CSSProperties;

    return (
      <div
        ref={setPreviewRef}
        style={chatStyle}
        className={cn(
          "chat-preview-shell overflow-hidden shadow-2xl transition-all duration-300 mx-auto mt-16 md:mt-0",
          showFrame && !appearance.transparentBackground ? "rounded-[40px] border-[8px] border-black bg-black" : "rounded-xl",
          !showFrame && !appearance.transparentBackground && "ring-1 ring-black/5",
          appearance.transparentBackground && "bg-transparent border-transparent",
          deviceStyles
        )}
      >
        <div className={cn(
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
    );
  }
);
ChatPreview.displayName = 'ChatPreview';
