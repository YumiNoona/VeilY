import { ArrowLeft, Phone, Video, Plus, Camera, Image, Mic, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getSenderName, getSenderAvatar, formatTime, isSameDay, formatDateSeparator, getWallpaperStyle } from "./shared";

export function MessengerChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = 'text-[#65676b]';
  const otherBubble = appearance.darkMode ? 'bg-[#3e4042]' : 'bg-[#e4e6eb]';
  const ownBubbleGradient = "bg-gradient-to-r from-[#0084ff] to-[#00c6ff]";

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-3 py-2 flex items-center shadow-sm z-10", bgColor)}>
        <button className="p-1"><ArrowLeft className={cn("w-6 h-6", appearance.darkMode ? "text-white" : "text-[#0084ff]")} /></button>
        <div className="ml-2 flex items-center gap-3 flex-1">
          {displayPerson?.avatar ? (
            <img src={displayPerson.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
              {displayPerson?.name?.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className={cn("font-semibold text-[15px] leading-tight", textColor)}>{chatType === 'group' ? 'Group' : (
              <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
            )}</h3>
            {appearance.showStatus && <p className={cn("text-[12px]", subtextColor)}>Active now</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <Phone className="w-6 h-6 text-[#0084ff]" />
          <Video className="w-6 h-6 text-[#0084ff]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={getWallpaperStyle(appearance)}>
        <div className="flex flex-col gap-1">
          {messages.map((message, i) => {
            const isLastFromSender = i === messages.length - 1 || messages[i + 1].senderId !== message.senderId;
            const showAvatar = !message.isOwn && isLastFromSender;
            const msgDate = new Date(message.timestamp);
            const prevMsgDate = i > 0 ? new Date(messages[i - 1].timestamp) : null;
            const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
            return (
              <div key={message.id} className="flex flex-col">
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <span className={cn("text-[11px] font-bold uppercase opacity-50", textColor)}>{formatDateSeparator(msgDate)}</span>
                  </div>
                )}
                <div className={cn("flex w-full mb-1", message.isOwn ? "justify-end" : "justify-start gap-2")}>
                  {!message.isOwn && (
                    <div className="w-8 flex-shrink-0 flex items-end">
                      {showAvatar && (
                        getSenderAvatar(message.senderId, people) ?
                          <img src={getSenderAvatar(message.senderId, people)!} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm" /> :
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                            {getSenderName(message.senderId, people).charAt(0)}
                          </div>
                      )}
                    </div>
                  )}
                  <div className={cn(
                    "px-3 py-2 max-w-[70%] text-[15px] leading-[1.3] shadow-sm relative",
                    message.isOwn ? cn(ownBubbleGradient, "text-white rounded-[18px]") : cn(otherBubble, textColor, "rounded-[18px]")
                  )} style={{ wordBreak: 'break-word' }}>
                    {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                    <p>
                      <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {messages.length > 0 && messages[messages.length - 1].isOwn && (
            <div className="flex justify-end mr-3 mt-1">
              {displayPerson?.avatar ?
                <img src={displayPerson.avatar} alt="Seen" className="w-3.5 h-3.5 rounded-full border border-white" /> :
                <div className="w-3.5 h-3.5 rounded-full bg-gray-300 border border-white" />
              }
            </div>
          )}
        </div>
      </div>

      <div className={cn("p-2 flex items-center gap-2", bgColor)}>
        <Plus className="w-7 h-7 text-[#0084ff]" />
        <Camera className="w-6 h-6 text-[#0084ff]" />
        <Image className="w-6 h-6 text-[#0084ff]" />
        <Mic className="w-6 h-6 text-[#0084ff]" />
        <div className={cn("flex-1 rounded-full px-3 py-1.5", appearance.darkMode ? "bg-[#3e4042]" : "bg-[#f0f2f5]")}>
          <input type="text" placeholder="Aa" className={cn("w-full bg-transparent outline-none text-[15px]", textColor)} readOnly />
        </div>
        <ThumbsUp className="w-6 h-6 text-[#0084ff]" />
      </div>
    </div>
  );
}
