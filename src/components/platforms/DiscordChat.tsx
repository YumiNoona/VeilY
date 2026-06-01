import { AtSign, Hash, Search, Inbox, Plus, Gift, Sticker, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getSenderAvatar, getWallpaperStyle } from "./shared";
import { VoiceNoteBubble } from "./VoiceNoteBubble";

export function DiscordChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#313338]' : 'bg-[#f2f3f5]';
  const headerBg = appearance.darkMode ? 'bg-[#313338]' : 'bg-[#f2f3f5]';
  const msgBg = appearance.darkMode ? 'hover:bg-[#2e3035]' : 'hover:bg-[#e3e5e8]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#313338]';
  const subtextColor = appearance.darkMode ? 'text-[#dbdee1]' : 'text-[#5c5e66]';
  const iconColor = appearance.darkMode ? 'text-[#b5bac1]' : 'text-[#4e5058]';
  const inputBg = appearance.darkMode ? 'bg-[#383a40]' : 'bg-[#ebedef]';
  const channelName = chatType === 'group' ? 'general' : (displayPerson?.name?.toLowerCase() || 'dm');
  const onlineCount = 3 + (people.length % 5);

  return (
    <div className={cn("flex flex-col h-full", appearance.transparentBackground ? 'bg-transparent' : bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b shadow-sm", headerBg, appearance.darkMode ? "border-[#1e1f22]" : "border-[#e1e2e4]")}>
        <div className="flex items-center gap-2">
          {chatType === 'group' ? <Hash className={cn("w-6 h-6", iconColor)} /> : <AtSign className={cn("w-6 h-6", iconColor)} />}
          <div>
            <h3 className={cn("font-semibold text-[15px] leading-tight", textColor)}>
              {chatType === 'group' ? channelName : (
                <EditableText
                  value={displayPerson?.name || 'Contact'}
                  onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
                />
              )}
            </h3>
            {chatType === 'group' && (
              <p className={cn("text-[11px] leading-tight", appearance.darkMode ? "text-[#949ba4]" : "text-[#5c5e66]")}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#23a55a] mr-1.5 align-middle" />
                {onlineCount} online
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4"><Search className={cn("w-5 h-5", iconColor)} /><Inbox className={cn("w-5 h-5", iconColor)} /></div>
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message) => {
          const sender = people.find(p => p.id === message.senderId);
          const senderAvatar = getSenderAvatar(message.senderId, people);
          return (
            <div key={message.id} className={cn("flex gap-3 px-1 py-0.5 rounded", msgBg)}>
              {senderAvatar ? (
                <img src={senderAvatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex-shrink-0 flex items-center justify-center text-white font-medium">
                  {(message.isOwn ? 'Y' : sender?.name.charAt(0)) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={cn("font-medium", message.isOwn ? "text-[#57f287]" : "text-[#f47b67]")}>{message.isOwn ? 'You' : sender?.name}</span>
                  {appearance.showTimestamps && <span className={cn("text-[11px]", appearance.darkMode ? "text-[#949ba4]" : "text-[#5c5e66]")}>{format(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp), appearance.use24HourFormat ? 'MM/dd/yyyy HH:mm' : 'MM/dd/yyyy h:mm a')}</span>}
                </div>
                {message.image && <img src={message.image} alt="" className="max-w-[200px] rounded-lg mt-1" />}
                {message.isVoiceNote ? (
                  <div className="mt-1">
                    <VoiceNoteBubble
                      duration={message.voiceDuration || "0:12"}
                      isOwn={message.isOwn}
                      platform="discord"
                      darkMode={appearance.darkMode}
                    />
                  </div>
                ) : (
                  <p className={cn("text-[15px] leading-[1.375rem] break-words", subtextColor)}>
                    <EditableText
                      value={message.text}
                      onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                      multiline
                    />
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {appearance.isTyping && (
          <div className="flex justify-start mb-2">
            <div className={cn("px-3 py-2 rounded-lg shadow-sm flex items-center gap-1", appearance.darkMode ? "bg-[#383a40]" : "bg-[#ebedef]")}>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>
      <div className={cn("p-4", bgColor)}>
        <div className={cn("rounded-lg flex items-center px-4 py-2.5", inputBg)}>
          <Plus className={cn("w-6 h-6 mr-3", iconColor)} />
          <input type="text" placeholder={`Message ${chatType === 'group' ? '#' + channelName : displayPerson?.name}`} className={cn("flex-1 bg-transparent outline-none", textColor, appearance.darkMode ? "placeholder:text-[#6d6f78]" : "placeholder:text-[#5c5e66]")} readOnly />
          <div className="flex items-center gap-3"><Gift className={cn("w-6 h-6", iconColor)} /><Sticker className={cn("w-6 h-6", iconColor)} /><Smile className={cn("w-6 h-6", iconColor)} /></div>
        </div>
      </div>
    </div>
  );
}
