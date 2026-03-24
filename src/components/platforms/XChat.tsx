import { ArrowLeft, Send } from "lucide-react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformChatProps, formatTime, getWallpaperStyle } from "./shared";

export function XChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = appearance.darkMode ? 'text-[#71767b]' : 'text-[#536471]';
  const borderColor = appearance.darkMode ? 'border-[#2f3336]' : 'border-[#eff3f4]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b", borderColor)}>
        <button><ArrowLeft className={cn("w-5 h-5", textColor)} /></button>
        {displayPerson?.avatar ? (
          <img src={displayPerson.avatar} alt="" className="w-10 h-10 rounded-full ml-4 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1d9bf0] ml-4 flex items-center justify-center text-white font-bold">
            {displayPerson?.name?.charAt(0)}
          </div>
        )}
        <div className="ml-3 flex-1">
          <h3 className={cn("font-bold", textColor)}>{displayPerson?.name}</h3>
          <p className={cn("text-sm", subtextColor)}>@{displayPerson?.name?.toLowerCase().replace(' ', '')}</p>
        </div>
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-3", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <div className={cn("max-w-[75%] px-4 py-3 rounded-2xl", message.isOwn ? "bg-[#1d9bf0] text-white rounded-br-sm" : appearance.darkMode ? "bg-[#2f3336] text-white rounded-bl-sm" : "bg-[#eff3f4] text-black rounded-bl-sm")} style={{ wordBreak: 'break-word' }}>
              {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
              <p className="text-[15px]">{message.text}</p>
            </div>
            {appearance.showTimestamps && <span className={cn("text-[11px] mt-1", subtextColor)}>{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
          </div>
        ))}
      </div>
      <div className={cn("p-4 border-t", borderColor)}>
        <div className={cn("flex items-center gap-3 rounded-2xl border px-4 py-2", borderColor)}>
          <Image className={cn("w-5 h-5", subtextColor)} />
          <input type="text" placeholder="Start a new message" className={cn("flex-1 bg-transparent outline-none text-[15px]", textColor, "placeholder:text-[#71767b]")} readOnly />
          <Send className="w-5 h-5 text-[#1d9bf0]" />
        </div>
      </div>
    </div>
  );
}
