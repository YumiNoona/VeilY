import { ArrowLeft, Search, Phone, MoreVertical, Mic, Image, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, isSameDay, formatDateSeparator, getWallpaperStyle } from "./shared";

export function LineChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1a1a1a]' : 'bg-[#8c9dbb]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const headerBg = appearance.darkMode ? 'bg-[#2a2a2a]' : 'bg-white';
  const headerText = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", appearance.transparentBackground ? 'bg-transparent' : bgColor)}>
      <div className={cn("px-4 py-3 flex items-center shadow-sm z-10", headerBg)}>
        <button className="mr-3"><ArrowLeft className={cn("w-6 h-6", headerText)} /></button>
        <div className="flex-1">
          <h3 className={cn("font-semibold text-lg leading-tight", headerText)}>{chatType === 'group' ? 'Group' : (
            <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
          )}</h3>
        </div>
        <div className="flex gap-4">
          <Search className={cn("w-6 h-6", headerText)} />
          <Phone className={cn("w-6 h-6", headerText)} />
          <MoreVertical className={cn("w-6 h-6", headerText)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const msgDate = new Date(message.timestamp);
          const prevMsgDate = i > 0 ? new Date(messages[i - 1].timestamp) : null;
          const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
          return (
            <div key={message.id} className="flex flex-col">
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className="bg-black/10 text-white text-[11px] px-3 py-1 rounded-full">{formatDateSeparator(msgDate)}</span>
                </div>
              )}
              <div className={cn("flex flex-col", message.isOwn ? "self-end items-end" : "self-start items-start")}>
                <div className={cn("flex items-end gap-1.5", message.isOwn ? "max-w-[85%]" : "max-w-[80%]")}>
                  {!message.isOwn && (
                    <div className="shrink-0 mr-0.5">
                      {displayPerson?.avatar ? (
                        <img src={displayPerson.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                          {displayPerson?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className={cn(
                    "px-3 py-2 rounded-[20px] text-[15px] relative shadow-sm",
                    message.isOwn ? "bg-[#6CD268] text-black rounded-tr-sm" : "bg-white text-black rounded-tl-sm"
                  )} style={{ wordBreak: 'break-word' }}>
                    {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                    <p className="leading-snug">
                      <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                    </p>
                  </div>
                  <span className={cn("text-[10px] text-white/90 mb-0.5 min-w-[30px]", message.isOwn ? "text-right" : "")}>
                    {formatTime(message.timestamp, appearance.use24HourFormat ?? false)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {appearance.isTyping && (
          <div className="flex justify-start mb-2">
            <div className={cn("px-3 py-2 rounded-lg shadow-sm flex items-center gap-1", appearance.darkMode ? "bg-gray-700" : "bg-white")}>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>
      <div className={cn("px-3 py-2 flex items-center gap-2", appearance.darkMode ? "bg-[#2a2a2a]" : "bg-white")}>
        <Plus className={cn("w-7 h-7", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
        <Image className={cn("w-7 h-7", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
        <div className={cn("flex-1 rounded-[20px] px-3 py-1.5 mx-1", appearance.darkMode ? "bg-[#404040]" : "bg-[#f2f2f5]")}>
          <input type="text" placeholder="Aa" className={cn("w-full bg-transparent outline-none text-[15px]", textColor)} readOnly />
        </div>
        <Mic className={cn("w-6 h-6", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
      </div>
    </div>
  );
}
