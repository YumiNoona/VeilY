import { ArrowLeft, MoreVertical, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, getWallpaperStyle } from "./shared";

export function TikTokChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = appearance.darkMode ? 'text-[#8a8b8f]' : 'text-[#8a8b8f]';
  const borderColor = appearance.darkMode ? 'border-[#2f2f2f]' : 'border-[#e8e8e8]';
  const inputBg = appearance.darkMode ? 'bg-[#2f2f2f]' : 'bg-[#f1f1f2]';
  const otherBubble = appearance.darkMode ? 'bg-[#2f2f2f]' : 'bg-[#f1f1f2]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b", borderColor)}>
        <button><ArrowLeft className={cn("w-6 h-6", textColor)} /></button>
        <div className="flex-1 text-center">
          <p className={cn("font-semibold", textColor)}>{chatType === 'group' ? 'Group Chat' : (
            <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
          )}</p>
          {appearance.showStatus && <p className={cn("text-xs", subtextColor)}>{displayPerson?.isOnline ? 'Active now' : 'Tap to view profile'}</p>}
        </div>
        <MoreVertical className={cn("w-6 h-6", textColor)} />
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-3", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <div className={cn("max-w-[70%] px-4 py-2 rounded-2xl", message.isOwn ? "bg-[#fe2c55] text-white" : cn(otherBubble, textColor))} style={{ wordBreak: 'break-word' }}>
              {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
              <p className="text-[15px]">
                <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
              </p>
            </div>
            {appearance.showTimestamps && <span className={cn("text-[10px] mt-1", subtextColor)}>{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
          </div>
        ))}
      </div>
      <div className={cn("p-3 border-t", borderColor)}>
        <div className={cn("flex items-center gap-3 rounded-full px-4 py-2.5", inputBg)}>
          <input type="text" placeholder="Send a message..." className={cn("flex-1 bg-transparent text-sm outline-none", textColor, "placeholder:text-[#8a8b8f]")} readOnly />
          <Smile className={cn("w-6 h-6", subtextColor)} />
        </div>
      </div>
    </div>
  );
}
