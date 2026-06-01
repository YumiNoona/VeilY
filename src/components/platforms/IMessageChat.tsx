import { ChevronLeft, Video, Mic, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, getWallpaperStyle } from "./shared";
import { VoiceNoteBubble } from "./VoiceNoteBubble";

export function IMessageChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1c1c1e]' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#2c2c2e]' : 'bg-[#f6f6f6]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  const lastOwnIdx = messages.map((m, i) => ({ m, i })).filter(x => x.m.isOwn).pop()?.i ?? -1;

  return (
    <div className={cn("flex flex-col h-full", appearance.transparentBackground ? 'bg-transparent' : bgColor)}>
      <div className={cn("px-3 py-2 flex items-center border-b", headerBg, appearance.darkMode ? "border-[#3a3a3c]" : "border-[#c6c6c8]")}>
        <button className="text-[#007aff] flex items-center gap-0.5"><ChevronLeft className="w-6 h-6" /><span className="text-[17px]">Back</span></button>
        <div className="flex-1 text-center">
          {displayPerson?.avatar ? (
            <img src={displayPerson.avatar} alt={displayPerson.name} className="w-10 h-10 rounded-full mx-auto object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#a0a0a0] to-[#7a7a7a] mx-auto flex items-center justify-center text-white text-lg font-medium">
              {chatType === 'group' ? <Users className="w-5 h-5" /> : displayPerson?.name.charAt(0) || 'U'}
            </div>
          )}
          {appearance.showStatus && <p className="text-[11px] text-[#8e8e93] mt-0.5">{chatType === 'group' ? `${people.length} people` : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}</p>}
        </div>
        <button className="text-[#007aff]"><Video className="w-6 h-6" /></button>
      </div>
      <div className={cn("flex-1 overflow-y-auto p-3 space-y-1", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const prevMsg = i > 0 ? messages[i - 1] : null;
          const prevTimestamp = prevMsg ? new Date(prevMsg.timestamp).getTime() : 0;
          const currTimestamp = new Date(message.timestamp).getTime();
          const showTimestamp = i === 0 || (currTimestamp - prevTimestamp > 300000);
          return (
            <div key={message.id}>
              {showTimestamp && (
                <div className="w-full flex justify-center my-3">
                  <span className="text-[11px] font-medium text-[#8e8e93]">{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>
                </div>
              )}
              <div className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] px-3 py-2 rounded-[18px]", message.isOwn ? "bg-[#007aff] text-white rounded-br-[4px]" : appearance.darkMode ? "bg-[#3a3a3c] text-white rounded-bl-[4px]" : "bg-[#e9e9eb] text-black rounded-bl-[4px]")} style={{ wordBreak: 'break-word' }}>
                  {chatType === 'group' && !message.isOwn && <p className="text-[11px] font-medium text-[#8e8e93] mb-0.5">{people.find(p => p.id === message.senderId)?.name}</p>}
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                  {message.isVoiceNote ? (
                    <VoiceNoteBubble duration={message.voiceDuration || "0:05"} isOwn={message.isOwn} platform="imessage" darkMode={appearance.darkMode} />
                  ) : (
                    <p className="text-[17px] leading-[22px]">
                      <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                    </p>
                  )}
                </div>
              </div>
              {message.isOwn && (
                <div className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                  <span className="text-[10px] text-[#8e8e93] mt-0.5 px-3">
                    {i === lastOwnIdx ? 'Read' : 'Delivered'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {appearance.isTyping && (
          <div className="flex justify-start mb-2">
            <div className={cn("px-3 py-2 rounded-lg shadow-sm flex items-center gap-1", appearance.darkMode ? "bg-[#3a3a3c]" : "bg-[#e9e9eb]")}>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>
      <div className={cn("border-t p-2 flex items-center gap-2", headerBg, appearance.darkMode ? "border-[#3a3a3c]" : "border-[#c6c6c8]")}>
        <button className="text-[#007aff]"><Plus className="w-7 h-7" /></button>
        <div className={cn("flex-1 rounded-full border px-4 py-2", appearance.darkMode ? "bg-[#3a3a3c] border-[#3a3a3c]" : "bg-white border-[#c6c6c8]")}><input type="text" placeholder="iMessage" className={cn("w-full bg-transparent text-[17px] outline-none", textColor)} readOnly /></div>
        <button className="text-[#007aff]"><Mic className="w-6 h-6" /></button>
      </div>
    </div>
  );
}
