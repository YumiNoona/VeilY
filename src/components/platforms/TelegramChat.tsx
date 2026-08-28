import { ArrowLeft, Search, MoreVertical, Smile, Plus, Mic, Users, Edit2, Trash2, Menu, SquarePen } from "lucide-react";
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
import { getAvatarUrl } from "@/lib/avatar-utils";

export function TelegramChat({ messages, people, activePerson, chatType, deviceView, appearance, onUpdateMessage, onRemoveMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const today = new Date();

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
  const desktopContacts = [
    { name: displayPerson?.name || 'Contact', snippet: messages.at(-1)?.text || 'No messages yet', time: '4:22 PM', active: true, avatar: displayPerson?.avatar },
    { name: 'Priya Sharma', snippet: 'Cold coffee without sugar, remember?', time: '3:48 PM' },
    { name: 'Daniel Kim', snippet: 'The files are in the shared folder.', time: '2:31 PM' },
    { name: 'Design Crew', snippet: 'Maya: Review moved to 3:30.', time: '1:05 PM' },
    { name: 'Sofia Martinez', snippet: 'Dinner after the client call?', time: 'Tue' },
    { name: 'Aarav Patel', snippet: 'Train tickets are confirmed 👍', time: 'Mon' },
  ];

  // Read receipt parity for own messages: even = single check, odd = double check
  let ownMsgIndex = 0;
  const receiptMap = new Map<string, 'sent' | 'read'>();
  messages.forEach((m) => {
    if (m.isOwn) {
      ownMsgIndex++;
      receiptMap.set(m.id, ownMsgIndex % 2 === 0 ? 'sent' : 'read');
    }
  });

  const conversation = (
    <div className={cn("flex flex-col h-full font-telegram", appearance.transparentBackground ? 'bg-transparent' : bgClass)}>
      <div className={cn("px-3 py-2 flex items-center border-b", headerBg, appearance.darkMode ? "border-transparent" : "border-[#c8c8cc]")}>
        {deviceView !== 'desktop' && <button aria-label="Back" className="p-2"><ArrowLeft className={cn("w-5 h-5", iconColor)} /></button>}
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
      <div data-chat-scroll className="flex-1 overflow-y-auto p-3 space-y-1" style={{
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
                      <p data-chat-message className={cn("text-[15px] leading-[20px]", msgTextColor)}>
                        {message.text}
                      </p>
                      <span className={cn("text-[11px] whitespace-nowrap flex items-center gap-0.5", timeColor)}>
                        {appearance.showTimestamps && formatTime(message.timestamp, appearance.use24HourFormat ?? false)}
                        {message.isOwn && receiptMap.get(message.id) === 'read' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 7L9.5 15.5L6 12" stroke="#6ab2f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 7L13.5 15.5L10 12" stroke="#6ab2f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        {message.isOwn && receiptMap.get(message.id) === 'sent' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 7L9.5 15.5L6 12" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
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
        ))}
        {appearance.isTyping && (
          <div className="flex justify-start mb-2">
            <div className={cn("px-3 py-2 rounded-lg shadow-sm flex items-center gap-1", otherBubble)}>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}
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

  if (deviceView !== 'desktop') return conversation;

  return (
    <div className={cn("flex h-full w-full overflow-hidden font-telegram", appearance.darkMode ? "bg-[#17212b]" : "bg-white")}>
      <aside className={cn(
        "w-[35%] min-w-[280px] max-w-[360px] h-full flex flex-col border-r",
        appearance.darkMode ? "bg-[#17212b] border-[#253340]" : "bg-white border-[#dfe5e8]"
      )}>
        <div className={cn("h-[60px] px-3 flex items-center gap-3 border-b", appearance.darkMode ? "border-[#253340]" : "border-[#e6ebee]")}>
          <button aria-label="Menu" className={cn("p-2 rounded-full", appearance.darkMode ? "text-[#8b9ba7]" : "text-[#707f89]")}>
            <Menu className="w-5 h-5" />
          </button>
          <div className={cn("flex-1 h-9 rounded-full px-3 flex items-center gap-2", appearance.darkMode ? "bg-[#242f3d]" : "bg-[#f1f3f4]")}>
            <Search className={cn("w-4 h-4", appearance.darkMode ? "text-[#8b9ba7]" : "text-[#7d8b94]")} />
            <span className={cn("text-[13px]", appearance.darkMode ? "text-[#8b9ba7]" : "text-[#7d8b94]")}>Search</span>
          </div>
          <button aria-label="New message" className={cn("p-2 rounded-full", iconColor)}>
            <SquarePen className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {desktopContacts.map((contact) => (
            <div
              key={contact.name}
              className={cn(
                "h-[68px] px-3 flex items-center gap-3 border-b",
                appearance.darkMode ? "border-[#202d38]" : "border-[#edf0f2]",
                contact.active && (appearance.darkMode ? "bg-[#2b5278]" : "bg-[#419fd9]")
              )}
            >
              <img
                src={contact.avatar || getAvatarUrl(contact.name)}
                alt={`${contact.name} profile`}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium text-[14px] truncate", contact.active ? "text-white" : headerTextColor)}>{contact.name}</span>
                  <span className={cn("ml-auto text-[11px] shrink-0", contact.active ? "text-white/80" : "text-[#8b9ba7]")}>{contact.time}</span>
                </div>
                <p className={cn("text-[12px] truncate mt-0.5", contact.active ? "text-white/85" : "text-[#8b9ba7]")}>{contact.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
      <section className="flex-1 min-w-0 h-full">{conversation}</section>
    </div>
  );
}
