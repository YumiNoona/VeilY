import { ChevronLeft, MoreVertical, Smile, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformChatProps, getSenderName, getSenderAvatar, formatTime, getWallpaperStyle } from "./shared";

export function WeChatChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1e1e1e]' : 'bg-[#f3f3f3]';
  const headerBg = appearance.darkMode ? 'bg-[#2e2e2e]' : 'bg-[#f3f3f3]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b-[0.5px]", headerBg, appearance.darkMode ? "border-[#3a3a3a]" : "border-[#e0e0e0]")}>
        <button><ChevronLeft className={cn("w-6 h-6", textColor)} /></button>
        <h3 className={cn("flex-1 text-center font-bold text-[17px]", textColor)}>{chatType === 'group' ? 'Group Chat' : displayPerson?.name || 'Friend'}</h3>
        <MoreVertical className={cn("w-6 h-6 rotate-90", textColor)} />
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-6", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const senderAvatar = getSenderAvatar(message.senderId, people);
          const prevTimestamp = i > 0 ? messages[i - 1].timestamp : null;
          const showTime = i === 0 || (
            prevTimestamp && (new Date(message.timestamp).getTime() - new Date(prevTimestamp).getTime() > 300000)
          );
          return (
            <div key={message.id} className="flex flex-col">
              {showTime && (
                <div className="flex justify-center mb-4">
                  <span className="text-[12px] text-[#b2b2b2]">{formatTime(message.timestamp, appearance.use24HourFormat ?? true)}</span>
                </div>
              )}
              <div className={cn("flex gap-3", message.isOwn ? "flex-row-reverse" : "flex-row")}>
                <div className="w-10 h-10 rounded-[4px] bg-[#62b900] flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden">
                  {senderAvatar ? (
                    <img src={senderAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{message.isOwn ? 'Y' : (getSenderName(message.senderId, people).charAt(0) || 'F')}</span>
                  )}
                </div>
                <div className="relative flex flex-col">
                  <div className={cn(
                    "max-w-[280px] px-3 py-2.5 rounded-[4px] relative shadow-sm min-h-[40px] flex items-center",
                    message.isOwn ? "bg-[#95ec69] text-black" : "bg-white text-black"
                  )} style={{ wordBreak: 'break-word' }}>
                    <div className={cn(
                      "absolute top-[14px] w-0 h-0 border-y-[6px] border-y-transparent",
                      message.isOwn ? "right-[-6px] border-l-[6px] border-l-[#95ec69]" : "left-[-6px] border-r-[6px] border-r-white"
                    )} />
                    {message.image && <img src={message.image} alt="" className="max-w-full rounded-sm mb-1" />}
                    <p className="text-[15px] leading-[1.4]">{message.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("px-2 py-2 flex items-center gap-3 border-t-[0.5px]", headerBg, appearance.darkMode ? "border-[#3a3a3a]" : "border-[#e0e0e0]")}>
        <div className="flex items-center justify-center p-1">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#7f7f7f]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M8 8v8M4 11v2M16 8v8M20 11v2" strokeLinecap="round" /></svg>
        </div>
        <div className="flex-1 bg-white border-[0.5px] border-[#d9d9d9] rounded-[4px] px-3 py-2">
          <input type="text" placeholder="" className="w-full bg-transparent outline-none text-[16px]" readOnly />
        </div>
        <Smile className="w-7 h-7 text-[#7f7f7f]" />
        <Plus className="w-7 h-7 text-[#7f7f7f]" />
      </div>
    </div>
  );
}
