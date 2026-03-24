import { ArrowLeft, MoreVertical, Video, Phone, Plus, Mic, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, isSameDay, getWallpaperStyle } from "./shared";

export function SignalChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1b1c1f]' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#1b1c1f]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const bubbleOwn = "bg-[#2C6BED]";
  const bubbleOther = appearance.darkMode ? 'bg-[#2b2d31]' : 'bg-[#e8e8e8]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-2 flex items-center shadow-sm z-10", headerBg)}>
        <button className="mr-3 text-[#2C6BED]"><ArrowLeft className="w-6 h-6" /></button>
        <div className="w-10 h-10 rounded-full bg-[#2C6BED] flex items-center justify-center text-white font-bold text-lg mr-3">
          {displayPerson?.name?.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className={cn("font-bold text-[17px]", textColor)}>{displayPerson?.name}</h3>
          <p className="text-[13px] text-gray-500">Signal</p>
        </div>
        <div className="flex gap-5 text-[#2C6BED]">
          <Video className="w-6 h-6" />
          <Phone className="w-6 h-6" />
          <MoreVertical className="w-6 h-6 text-black" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5" style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const isOwn = message.isOwn;
          const msgDate = new Date(message.timestamp);
          const prevMsgDate = i > 0 ? new Date(messages[i - 1].timestamp) : null;
          const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
          return (
            <div key={message.id} className="flex flex-col">
              {showDateSeparator && (
                <div className="flex justify-center mb-4 mt-2">
                  <span className="text-[11px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {format(msgDate, 'EEE, MMM d')}
                  </span>
                </div>
              )}
              <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
                <div className={cn(
                  "px-4 py-2.5 max-w-[75%] relative text-[15px]",
                  isOwn ? cn(bubbleOwn, "text-white rounded-[22px] rounded-br-[6px]") : cn(bubbleOther, textColor, "rounded-[22px] rounded-bl-[6px]")
                )} style={{ wordBreak: 'break-word' }}>
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                  <p>{message.text}</p>
                  <div className={cn("flex items-center justify-end gap-1 mt-0.5", isOwn ? "text-white/80" : "text-gray-500")}>
                    <span className="text-[10px]">{formatTime(msgDate, appearance.use24HourFormat ?? false)}</span>
                    {isOwn && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("p-2 flex items-center gap-2", bgColor)}>
        <button className={cn("p-2 rounded-full hover:bg-gray-100", appearance.darkMode ? "text-gray-300" : "text-gray-600")}>
          <Plus className="w-7 h-7" />
        </button>
        <div className={cn("flex-1 rounded-full px-4 py-2 border flex items-center", appearance.darkMode ? "bg-[#2b2d31] border-none" : "bg-[#f2f2f5] border-transparent")}>
          <input type="text" placeholder="Signal message" className={cn("w-full bg-transparent outline-none text-[16px]", textColor)} readOnly />
        </div>
        <button className="p-2 rounded-full bg-[#2C6BED] text-white">
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
