import { ArrowLeft, ChevronLeft, Video, Phone, Camera, Mic, Plus, CheckCheck, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getSenderName, formatTime, isSameDay, formatDateSeparator, getWallpaperStyle } from "./shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VoiceNoteBubble } from "./VoiceNoteBubble";
import { EditMessageModal } from "@/components/modals/EditMessageModal";
import { useState } from "react";

export function WhatsAppChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onRemoveMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgClass = appearance.darkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]';
  const headerBg = appearance.darkMode ? 'bg-[#202c33]' : 'bg-[#f6f6f6]';
  const textColor = appearance.darkMode ? 'text-[#e9edef]' : 'text-black';
  const ownBubble = appearance.darkMode ? 'bg-[#005c4b]' : 'bg-[#dcf8c6]';
  const otherBubble = appearance.darkMode ? 'bg-[#202c33]' : 'bg-white';
  const iconColor = appearance.darkMode ? 'text-[#8696a0]' : 'text-[#007aff]';

  const [editingMessage, setEditingMessage] = useState<{ id: string, text: string } | null>(null);

  return (
    <div className={cn("flex flex-col h-full font-whatsapp", bgClass)}>
      {/* Header */}
      <div className={cn("px-3 py-2 flex items-center border-b", headerBg, appearance.darkMode ? "border-[#202c33]" : "border-[#bdc1c6]")}>
        <button className={cn("p-1 flex items-center gap-1", iconColor)}>
          <ChevronLeft className="w-7 h-7 -ml-2" />
          <span className="text-[17px] -ml-1">Back</span>
        </button>
        <div className="flex-1 flex flex-col items-center mr-8">
          <h3 className={cn("font-semibold text-[16px]", textColor)}>
            {chatType === 'group' ? 'Group' : (
              <EditableText
                value={displayPerson?.name || 'Contact'}
                onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
              />
            )}
          </h3>
          {appearance.showStatus && (
            <p className="text-[11px] text-[#8696a0]">
              {appearance.statusText || (displayPerson?.isOnline ? 'online' : 'last seen today at 12:00 PM')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Video className={cn("w-6 h-6", iconColor)} />
          <Phone className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{
        ...getWallpaperStyle(appearance),
        backgroundImage: appearance.wallpaperUrl ? `url(${appearance.wallpaperUrl})` : "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"
      }}>
        {messages.map((message, i) => {
          const msgDate = new Date(message.timestamp);
          const prevMsgDate = i > 0 ? new Date(messages[i - 1].timestamp) : null;
          const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);

          return (
            <div key={message.id} className="flex flex-col mb-1">
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className={cn(
                    "px-3 py-1 rounded-md text-[12.5px] shadow-sm uppercase font-medium",
                    appearance.darkMode ? "bg-[#182229] text-[#8696a0]" : "bg-[#e1f3fb] text-[#54656f]"
                  )}>
                    {formatDateSeparator(msgDate)}
                  </span>
                </div>
              )}
              <div className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className={cn(
                      "px-2 py-1.5 rounded-lg max-w-[80%] text-[15px] shadow-sm relative cursor-pointer group hover:brightness-95 transition-all outline-none",
                      message.isOwn ? ownBubble : otherBubble
                    )} style={{ wordBreak: 'break-word' }}>
                      {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                      {message.isVoiceNote ? (
                        <VoiceNoteBubble
                          duration={message.voiceDuration || "0:12"}
                          isOwn={message.isOwn}
                          platform="whatsapp"
                          darkMode={appearance.darkMode}
                          timestamp={appearance.showTimestamps ? formatTime(message.timestamp, appearance.use24HourFormat ?? false) : undefined}
                          senderAvatar={people.find(p => p.id === message.senderId)?.avatar}
                        />
                      ) : (
                        <div className="flex items-end gap-1.5">
                          <span className={cn(
                            "text-[15px] leading-[1.375] break-words whitespace-pre-wrap flex-1",
                            appearance.darkMode ? "text-[#e9edef]" : "text-black"
                          )}>
                            {message.text}
                          </span>
                          <span className={cn(
                            "flex items-center gap-0.5 text-[11px] leading-none shrink-0 mb-[1px]",
                            appearance.darkMode ? "text-[#8696a0]" : "text-[#667781]"
                          )}>
                            {appearance.showTimestamps && formatTime(message.timestamp, appearance.use24HourFormat ?? false)}
                            {message.isOwn && (
                              <div className="flex -mb-[1px] ml-0.5 shrink-0">
                                <svg width="15" height="10" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                                  <path d="M4 8.5L1.5 6L0.5 7L4 10.5L12 1.5L11 0.5L4 8.5Z" fill="#53bdeb"/>
                                  <path d="M8 8.5L7.5 8L6.5 9L8 10.5L16 1.5L15 0.5L8 8.5Z" fill="#53bdeb"/>
                                </svg>
                              </div>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={message.isOwn ? "end" : "start"} className="w-40">
                    <DropdownMenuItem 
                      className="cursor-pointer gap-2"
                      onClick={() => {
                        setEditingMessage({ id: message.id, text: message.text });
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                      onClick={() => onRemoveMessage?.(message.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator as Bubble */}
        {appearance.isTyping && (
          <div className="flex justify-start mb-2 animate-in slide-in-from-left-2 fade-in">
            <div className={cn("px-3 py-2 rounded-lg shadow-sm flex items-center gap-1", otherBubble)}>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={cn("p-2 flex items-center gap-2", appearance.darkMode ? "bg-[#202c33]" : "bg-[#f6f6f6]")}>
        <Plus className="w-7 h-7 text-[#007aff]" />
        <div className={cn("flex-1 rounded-full px-3 py-1.5 border", appearance.darkMode ? "bg-[#2a3942] border-none" : "bg-white border-[#dbdbdb]")}>
          <input type="text" placeholder="" className={cn("w-full bg-transparent text-[16px] outline-none", textColor)} readOnly />
        </div>
        {!appearance.darkMode && <Camera className="w-6 h-6 text-[#007aff]" />}
        <Mic className="w-6 h-6 text-[#007aff]" />
      </div>
      {/* Edit Modal */}
      <EditMessageModal
        isOpen={!!editingMessage}
        onClose={() => setEditingMessage(null)}
        initialText={editingMessage?.text || ""}
        onSave={(newText) => {
          if (editingMessage) onUpdateMessage?.(editingMessage.id, newText);
        }}
      />
    </div>
  );
}
