import { Message, Person, Platform, ChatType, DeviceView } from "@/types/chat";
import { cn } from "@/lib/utils";
import {
  WhatsAppChat,
  IMessageChat,
  DiscordChat,
  InstagramChat,
  TelegramChat,
  MessengerChat,
  SlackChat,
  TikTokChat,
  SnapchatChat,
  RedditChat,
  LineChat,
  TeamsChat,
  SignalChat,
  TinderChat,
  WeChatChat,
  XChat,
  ChatGPTChat,
  ClaudeChat,
  GeminiChat,
  GrokChat
} from "./platforms/index";
import { forwardRef } from "react";
import { AppearanceSettings } from "@/types/chat";
import { Signal, Wifi } from "lucide-react";

interface ChatPreviewProps {
  platform: Platform;
  messages: Message[];
  people: Person[];
  activePerson: Person | null;
  chatType: ChatType;
  deviceView: 'desktop' | 'mobile';
  appearance: AppearanceSettings;
  aiModel?: string;
  onUpdateMessage?: (id: string, text: string) => void;
  onUpdatePerson?: (person: Person) => void;
  onUpdateAppearance?: (appearance: AppearanceSettings) => void;
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

export const ChatPreview = forwardRef<HTMLDivElement, ChatPreviewProps>(
  ({ platform, messages, people, activePerson, chatType, deviceView, appearance, aiModel, onUpdateMessage, onUpdatePerson, onUpdateAppearance }, ref) => {
    const showFrame = appearance.showDeviceFrame ?? true;
    const showStatusBar = appearance.showDeviceStatusBar ?? true;

    const getDeviceStyles = () => {
      switch (deviceView) {
        case 'desktop':
          return 'w-[667px] h-[375px]';
        case 'mobile':
        default:
          return 'w-[375px] h-[812px]';
      }
    };

    const renderPlatformChat = () => {
      const props = { messages, people, activePerson, chatType, appearance, aiModel, onUpdateMessage, onUpdatePerson };

      switch (platform) {
        case 'whatsapp': return <WhatsAppChat {...props} />;
        case 'imessage': return <IMessageChat {...props} />;
        case 'discord': return <DiscordChat {...props} />;
        case 'instagram': return <InstagramChat {...props} />;
        case 'telegram': return <TelegramChat {...props} />;
        case 'messenger': return <MessengerChat {...props} />;
        case 'slack': return <SlackChat {...props} />;
        case 'tiktok': return <TikTokChat {...props} />;
        case 'snapchat': return <SnapchatChat {...props} />;
        case 'reddit': return <RedditChat {...props} />;
        case 'line': return <LineChat {...props} />;
        case 'teams': return <TeamsChat {...props} />;
        case 'signal': return <SignalChat {...props} />;
        case 'tinder': return <TinderChat {...props} />;
        case 'wechat': return <WeChatChat {...props} />;
        case 'x': return <XChat {...props} />;
        case 'chatgpt': return <ChatGPTChat {...props} />;
        case 'claude': return <ClaudeChat {...props} />;
        case 'gemini': return <GeminiChat {...props} />;
        case 'grok': return <GrokChat {...props} />;
        default: return <WhatsAppChat {...props} />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden shadow-2xl transition-all duration-300",
          showFrame ? "rounded-[40px] border-[8px] border-black bg-black" : "rounded-xl",
          appearance.transparentBackground && "bg-transparent border-transparent",
          getDeviceStyles()
        )}
      >
        <div className={cn("w-full h-full overflow-hidden flex flex-col", showFrame ? "rounded-[32px]" : "rounded-xl")}>
          {showStatusBar && <DeviceStatusBar appearance={appearance} />}
          <div className="flex-1 overflow-hidden">
            {renderPlatformChat()}
          </div>
        </div>
      </div>
    );
  }
);

ChatPreview.displayName = 'ChatPreview';
