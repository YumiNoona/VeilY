import { ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformChatProps, formatTime, getWallpaperStyle } from "./shared";

export function TinderChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#111418]' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#111418]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#21262e]';
  const subtextColor = 'text-[#656e7b]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b", headerBg, appearance.darkMode ? "border-[#2d3139]" : "border-[#e4e4e4]")}>
        <button><ArrowLeft className={cn("w-6 h-6", textColor)} /></button>
        {displayPerson?.avatar ? (
          <img src={displayPerson.avatar} alt="" className="w-12 h-12 rounded-full ml-3 object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fd267a] to-[#ff6036] ml-3 flex items-center justify-center text-white text-xl font-bold">
            {displayPerson?.name?.charAt(0)}
          </div>
        )}
        <div className="ml-3 flex-1">
          <h3 className={cn("font-bold text-lg", textColor)}>{displayPerson?.name}</h3>
          {appearance.showStatus && <p className={cn("text-sm", subtextColor)}>You matched!</p>}
        </div>
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-3", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <div className={cn("max-w-[75%] px-4 py-3 rounded-2xl", message.isOwn ? "bg-gradient-to-r from-[#fd267a] to-[#ff6036] text-white" : appearance.darkMode ? "bg-[#2d3139] text-white" : "bg-[#f0f2f4] text-[#21262e]")} style={{ wordBreak: 'break-word' }}>
              {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
              <p className="text-[15px]">{message.text}</p>
            </div>
            {appearance.showTimestamps && <span className={cn("text-[10px] mt-1", subtextColor)}>{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
          </div>
        ))}
      </div>
      <div className={cn("p-4 border-t", headerBg, appearance.darkMode ? "border-[#2d3139]" : "border-[#e4e4e4]")}>
        <div className={cn("flex items-center gap-3 rounded-full px-4 py-3", appearance.darkMode ? "bg-[#2d3139]" : "bg-[#f0f2f4]")}>
          <input type="text" placeholder="Type a message..." className={cn("flex-1 bg-transparent outline-none text-[15px]", textColor, "placeholder:text-[#656e7b]")} readOnly />
          <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#fd267a] to-[#ff6036] flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
