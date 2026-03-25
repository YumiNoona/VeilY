import { ArrowLeft, Search, MoreVertical, Smile, Plus, Mic, Users, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getSenderName, formatTime, getWallpaperStyle } from "./shared";
import { VoiceNoteBubble } from "./VoiceNoteBubble";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMessageModal } from "@/components/modals/EditMessageModal";
import { useState } from "react";

export function TelegramChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onRemoveMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const today = new Date();

  // Telegram dark/light mode aware colors
  const bgClass = appearance.darkMode ? 'bg-[#0e1621]' : 'bg-[#efeff4]';
  const headerBg = appearance.darkMode ? 'bg-[#17212b]' : 'bg-white';
  const inputBg = appearance.darkMode ? 'bg-[#17212b]' : 'bg-white';
  const inputFieldBg = appearance.darkMode ? 'bg-[#242f3d]' : 'bg-[#f1f1f3]';
  const inputTextColor = appearance.darkMode ? 'text-white' : 'text-black';
  const headerTextColor = appearance.darkMode ? 'text-white' : 'text-[#000000]';
  const iconColor = 'text-[#6ab2f2]';
  const [editingMessage, setEditingMessage] = useState<{ id: string, text: string } | null>(null);
  const ownBubble = appearance.darkMode ? 'bg-[#2b5278]' : 'bg-[#effdde]';
  const otherBubble = appearance.darkMode ? 'bg-[#182533]' : 'bg-white';
  const msgTextColor = appearance.darkMode ? 'text-white' : 'text-black';
  const timeColor = appearance.darkMode ? 'text-[#6ab2f2]' : 'text-[#aaaaaa]';
  const dateBadgeBg = appearance.darkMode ? 'bg-[#182533] text-[#6ab2f2]' : 'bg-[rgba(0,0,0,0.15)] text-white';

  return (
    <div className={cn("flex flex-col h-full font-telegram", bgClass)}>
      <div className={cn("px-3 py-2 flex items-center border-b", headerBg, appearance.darkMode ? "border-transparent" : "border-[#c8c8cc]")}>
        <button className="p-2"><ArrowLeft className={cn("w-5 h-5", iconColor)} /></button>
        {displayPerson?.avatar ? (
          <img src={displayPerson.avatar} alt="" className="w-10 h-10 rounded-full ml-1 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#5288c1] flex items-center justify-center text-white font-medium ml-1">
            {chatType === 'group' ? <Users className="w-5 h-5" /> : displayPerson?.name?.charAt(0)}
          </div>
        )}
        <div className="ml-3 flex-1">
          <h3 className={cn("font-medium", headerTextColor)}>{chatType === 'group' ? 'Group Chat' : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}</h3>
          {appearance.showStatus && (
            <p className={cn("text-xs", iconColor)}>
              {appearance.statusText || (chatType === 'group' ? `${people.length} members` : displayPerson?.isOnline ? 'online' : 'last seen recently')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Search className={cn("w-5 h-5", iconColor)} />
          <MoreVertical className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{
        ...getWallpaperStyle(appearance),
        background: appearance.wallpaperUrl ? undefined : (appearance.darkMode ? 'linear-gradient(180deg, #0f1a24 0%, #0e1621 100%)' : '#efeff4')
      }}>
        {appearance.showTimestamps && (
          <div className="flex justify-center mb-2">
            <span className={cn("text-xs px-3 py-1 rounded-full", dateBadgeBg)}>
              {format(today, 'MMMM d')}
            </span>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className={cn("max-w-[85%] px-3 py-1.5 rounded-xl cursor-pointer group hover:brightness-95 transition-all outline-none relative", message.isOwn ? cn(ownBubble, "rounded-tr-[4px]") : cn(otherBubble, "rounded-tl-[4px]"))} style={{ wordBreak: 'break-word' }}>
                  {chatType === 'group' && !message.isOwn && <p className="text-[13px] font-medium text-[#6ab2f2] mb-0.5">{getSenderName(message.senderId, people)}</p>}
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                  {message.isVoiceNote ? (
                    <VoiceNoteBubble
                      duration={message.voiceDuration || "0:06"}
                      isOwn={message.isOwn}
                      platform="telegram"
                      darkMode={appearance.darkMode}
                      timestamp={appearance.showTimestamps ? formatTime(message.timestamp, appearance.use24HourFormat ?? false) : undefined}
                    />
                  ) : (
                    <div className="flex items-end gap-2">
                      <p className={cn("text-[15px] leading-[20px]", msgTextColor)}>
                        {message.text}
                      </p>
                      {appearance.showTimestamps && <span className={cn("text-[11px] whitespace-nowrap", timeColor)}>{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
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
        ))}
      </div>
      <div className={cn("p-2 flex items-center gap-2", inputBg)}>
        <button className={cn("p-2", iconColor)}><Smile className="w-6 h-6" /></button>
        <div className={cn("flex-1 rounded-xl px-4 py-2", inputFieldBg)}><input type="text" placeholder="Message" className={cn("w-full bg-transparent outline-none placeholder:text-[#6b7c85]", inputTextColor)} readOnly /></div>
        <button className={cn("p-2", iconColor)}><Plus className="w-6 h-6" /></button>
        <button className={cn("p-2", iconColor)}><Mic className="w-6 h-6" /></button>
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
