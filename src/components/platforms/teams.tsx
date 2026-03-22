import { Video, Phone, MoreVertical, Plus, Camera, Mic, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformChatProps, getSenderName, formatTime, getWallpaperStyle } from "./shared";

export function TeamsChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1f1f1f]' : 'bg-[#f0f0f0]';
  const headerBg = appearance.darkMode ? 'bg-[#292929]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#242424]';
  const subtextColor = appearance.darkMode ? 'text-[#c8c6c4]' : 'text-[#616161]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-2 flex items-center shadow-sm z-10", headerBg)}>
        <div className="flex items-center gap-3 flex-1">
          {displayPerson?.avatar ? (
            <img src={displayPerson.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#D1D1D1] flex items-center justify-center text-white text-sm font-bold">
              {displayPerson?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className={cn("font-semibold text-[14px]", textColor)}>{chatType === 'group' ? 'Group Chat' : displayPerson?.name}</h3>
            <p className="text-[11px] text-[#616161]">Chat</p>
          </div>
        </div>
        <div className="flex gap-4 text-[#616161]">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={getWallpaperStyle(appearance)}>
        <div className="flex justify-center">
          <span className="text-[11px] text-[#616161]">Tuesday 11:37 PM</span>
        </div>
        {messages.map((message) => {
          const isOwn = message.isOwn;
          return (
            <div key={message.id} className={cn("flex flex-col group", isOwn ? "items-end" : "items-start")}>
              <div className={cn(
                "p-3 rounded-md shadow-sm max-w-[85%] min-w-[120px]",
                isOwn ? "bg-[#5B5FC7] text-white" : "bg-white text-[#242424]"
              )} style={{ wordBreak: 'break-word' }}>
                <div className="flex justify-between items-baseline mb-1 gap-4">
                  <span className={cn("font-semibold text-[11px]", isOwn ? "text-white" : "text-[#242424]")}>
                    {isOwn ? 'You' : getSenderName(message.senderId, people)}
                  </span>
                  <span className={cn("text-[10px]", isOwn ? "text-white/80" : "text-[#616161]")}>
                    {formatTime(message.timestamp, true)}
                  </span>
                </div>
                {message.image && <img src={message.image} alt="" className="max-w-full rounded mb-2" />}
                <p className="text-[13px] leading-[1.4]">{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("p-4", headerBg)}>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-[#5B5FC7] flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 border rounded-sm px-3 py-2 bg-white">
            <input type="text" placeholder="Type a message" className="w-full text-[13px] outline-none placeholder:text-[#616161]" readOnly />
          </div>
          <div className="flex gap-2 text-[#616161]">
            <Smile className="w-5 h-5" />
            <Camera className="w-5 h-5" />
            <Mic className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
