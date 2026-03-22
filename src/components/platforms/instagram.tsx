import { ArrowLeft, Phone, Video, Mic, Image, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, isSameDay, formatDateSeparator, getWallpaperStyle } from "./shared";

export function InstagramChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = appearance.darkMode ? 'text-[#a8a8a8]' : 'text-[#8e8e8e]';
  const otherBubble = appearance.darkMode ? 'bg-[#262626]' : 'bg-[#efefef]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-3 py-2 flex items-center", bgColor)}>
        <button className="p-1"><ArrowLeft className={cn("w-6 h-6", textColor)} /></button>
        <div className="ml-2 flex items-center gap-3 flex-1">
          {displayPerson?.avatar ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
              <img src={displayPerson.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
              <div className={cn("w-full h-full rounded-full flex items-center justify-center text-sm font-semibold", bgColor, textColor)}>
                {chatType === 'group' ? <Users className="w-4 h-4" /> : displayPerson?.name?.charAt(0)}
              </div>
            </div>
          )}
          <div>
            <p className={cn("font-semibold text-[15px]", textColor)}>
              {chatType === 'group' ? people.filter(p => p.id !== 'user').map(p => p.name).join(', ') : (
                <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
              )}
            </p>
            {appearance.showStatus && <p className={cn("text-xs", subtextColor)}>{displayPerson?.isOnline ? 'Active now' : 'Active 2h ago'}</p>}
          </div>
        </div>
        <div className="flex gap-5"><Phone className={cn("w-6 h-6", textColor)} /><Video className={cn("w-6 h-6", textColor)} /></div>
      </div>
      <div className={cn("flex-1 overflow-y-auto px-4 py-2 space-y-1", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const msgDate = new Date(message.timestamp);
          const prevMsgDate = i > 0 ? new Date(messages[i - 1].timestamp) : null;
          const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
          return (
            <div key={message.id} className="flex flex-col mb-2">
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className={cn("text-[11px] font-medium opacity-60 uppercase tracking-tighter", textColor)}>{formatDateSeparator(msgDate)}</span>
                </div>
              )}
              <div className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
                <div className={cn("max-w-[75%] px-4 py-2.5 rounded-[22px]", message.isOwn ? "bg-[#3797f0] text-white" : cn(otherBubble, textColor))} style={{ wordBreak: 'break-word' }}>
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                  <p className="text-[15px] leading-[20px]">
                    <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                  </p>
                </div>
                {appearance.showTimestamps && <span className={cn("text-[11px] mt-1 px-1", subtextColor)}>{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("p-3", bgColor)}>
        <div className={cn("flex items-center gap-3 rounded-full border px-4 py-2.5", appearance.darkMode ? "border-[#363636]" : "border-[#dbdbdb]")}>
          <input type="text" placeholder="Message..." className={cn("flex-1 bg-transparent text-[15px] outline-none", textColor, "placeholder:text-[#a8a8a8]")} readOnly />
          <div className="flex gap-4">
            <Mic className={cn("w-6 h-6", textColor)} />
            <Image className={cn("w-6 h-6", textColor)} />
            <Heart className={cn("w-6 h-6", textColor)} />
          </div>
        </div>
      </div>
    </div>
  );
}
