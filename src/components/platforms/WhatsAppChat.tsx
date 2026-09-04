import { ArrowLeft, Video, Phone, Camera, Mic, Smile, Paperclip, CheckCheck, MoreVertical, Edit2, Trash2, Search, MessageSquarePlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, isSameDay, formatDateSeparator, getWallpaperStyle, getSenderName } from "./shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VoiceNoteBubble } from "./VoiceNoteBubble";
import { EditMessageModal } from "@/components/modals/EditMessageModal";
import { useState } from "react";
import { getAvatarUrl } from "@/lib/avatar-utils";

interface DesktopSidebarChat {
  id: string;
  name: string;
  snippet: string;
  time: string;
  unread?: number;
  groupAvatars?: string[];
  active?: boolean;
}

export function WhatsAppChat({ messages, people, activePerson, chatType, deviceView, appearance, onUpdateMessage, onRemoveMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgClass = appearance.darkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]';
  const headerBg = appearance.darkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]';
  const textColor = appearance.darkMode ? 'text-[#e9edef]' : 'text-[#111b21]';
  const ownBubble = appearance.darkMode ? 'bg-[#005c4b]' : 'bg-[#d9fdd3]';
  const otherBubble = appearance.darkMode ? 'bg-[#202c33]' : 'bg-white';
  const iconColor = appearance.darkMode ? 'text-[#aebac1]' : 'text-[#54656f]';

  const [editingMessage, setEditingMessage] = useState<{ id: string, text: string } | null>(null);
  const groupMembers = people.filter(person => person.name !== 'You' && person.id !== 'friend');
  const groupTitle = groupMembers.map(person => person.name).join(', ') || 'Group chat';
  const conversationTitle = chatType === 'group' ? groupTitle : (displayPerson?.name || 'Contact');
  const latestMessage = messages.at(-1)?.text || 'No messages yet';
  const [desktopChats, setDesktopChats] = useState<DesktopSidebarChat[]>([
    { id: 'maya', name: 'Maya Chen', snippet: 'The final screens look great. Sending notes now.', time: '3:48 PM' },
    { id: 'design-team', name: 'Design Team', snippet: 'Sofia: I updated the prototype link.', time: '2:15 PM', unread: 3, groupAvatars: ['/avatars/sofia-martinez.png', '/avatars/liam-carter.png'] },
    { id: 'weekend', name: 'Weekend Plans', snippet: 'Dinner at 8 works for everyone 🙌', time: 'Yesterday', groupAvatars: ['/avatars/maya-chen.png', '/avatars/daniel-kim.png'] },
    { id: 'daniel', name: 'Daniel Kim', snippet: 'Thanks! I’ll review it tomorrow morning.', time: 'Tuesday' },
    { id: 'sofia', name: 'Sofia Martinez', snippet: 'Coffee after the client call?', time: 'Monday' },
    { id: 'liam', name: 'Liam Carter', snippet: 'The photos are uploaded. Take a look.', time: 'Sunday' },
  ]);

  const updateDesktopChat = (id: string, field: 'name' | 'snippet', value: string) => {
    setDesktopChats(chats => chats.map(chat => chat.id === id ? { ...chat, [field]: value } : chat));
  };

  const sidebarChats: DesktopSidebarChat[] = [
    { id: 'active', name: conversationTitle, snippet: latestMessage, time: '4:22 PM', active: true },
    ...desktopChats,
  ];

  const isSameGroup = (msg: typeof messages[0], prevMsg: typeof messages[0] | null) => {
    if (!prevMsg) return false;
    if (msg.senderId !== prevMsg.senderId) return false;
    const diff = Math.abs(new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime());
    return diff < 120000;
  };

  const conversation = (
    <div className={cn("flex flex-col h-full min-w-0 font-whatsapp", appearance.transparentBackground ? 'bg-transparent' : bgClass)}>
      {/* Header */}
      <div className={cn("h-[60px] px-2 flex items-center gap-1 border-b shrink-0", headerBg, appearance.darkMode ? "border-[#202c33]" : "border-[#e3e6e8]")}>
        {deviceView !== 'desktop' && (
          <button aria-label="Back" className={cn("p-2 rounded-full", iconColor)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        {displayPerson?.avatar ? (
          <img src={displayPerson.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white font-semibold shrink-0">
            {(chatType === 'group' ? 'G' : displayPerson?.name?.charAt(0)) || 'C'}
          </div>
        )}
        <div className="flex-1 min-w-0 ml-1">
          <h3 className={cn("font-medium text-[16px] leading-tight truncate", textColor)}>
            {chatType === 'group' ? groupTitle : (
              <EditableText
                value={displayPerson?.name || 'Contact'}
                onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
              />
            )}
          </h3>
          {appearance.showStatus && (
            <p className="text-[12px] leading-tight text-[#667781] truncate">
              {chatType === 'group'
                ? groupMembers.map(person => person.name).join(', ')
                : appearance.statusText || (displayPerson?.isOnline ? 'online' : 'last seen today at 12:00 PM')}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <button aria-label="Video call" className={cn("p-2 rounded-full", iconColor)}><Video className="w-5 h-5" /></button>
          <button aria-label="Voice call" className={cn("p-2 rounded-full", iconColor)}><Phone className="w-5 h-5" /></button>
          <button aria-label="More options" className={cn("p-2 rounded-full", iconColor)}><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-repeat"
          style={appearance.wallpaperUrl ? {
            ...getWallpaperStyle(appearance),
            backgroundImage: `url(${appearance.wallpaperUrl})`,
          } : {
            backgroundColor: appearance.darkMode ? '#0b141a' : '#efeae2',
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundSize: '412px 749px',
            filter: appearance.darkMode
              ? 'invert(1) saturate(0.7) brightness(0.72) contrast(1.15)'
              : undefined,
          }}
        />
        <div data-chat-scroll className="relative z-10 h-full overflow-y-auto p-3">
        {messages.map((message, i) => {
          const msgDate = new Date(message.timestamp);
          const prevMsg = i > 0 ? messages[i - 1] : null;
          const prevMsgDate = prevMsg ? new Date(prevMsg.timestamp) : null;
          const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);
          const grouped = isSameGroup(message, prevMsg);

          return (
            <div key={message.id} className="flex flex-col" style={{ marginBottom: grouped ? '2px' : '8px' }}>
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
                      "px-2 py-1.5 rounded-lg text-[15px] shadow-sm relative cursor-pointer group hover:brightness-95 transition-all outline-none",
                      deviceView === 'desktop' ? "max-w-[68%]" : "max-w-[80%]",
                      message.isOwn ? ownBubble : otherBubble
                    )} style={{ wordBreak: 'break-word' }}>
                      {chatType === 'group' && !message.isOwn && (
                        <span className="block mb-0.5 text-[12px] leading-tight font-semibold text-[#00a884]">
                          {getSenderName(message.senderId, people)}
                        </span>
                      )}
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
                          <span data-chat-message className={cn(
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
                              <CheckCheck className="w-4 h-4 ml-0.5 text-[#53bdeb] shrink-0" />
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
      </div>

      {/* Input */}
      <div className={cn("p-2 flex items-center gap-2 shrink-0", appearance.darkMode ? "bg-[#202c33]" : "bg-[#f0f2f5]")}>
        <div className={cn("flex-1 min-w-0 rounded-full px-3 py-2 flex items-center gap-2", appearance.darkMode ? "bg-[#2a3942]" : "bg-white")}>
          <Smile className={cn("w-5 h-5 shrink-0", iconColor)} />
          <input type="text" placeholder="Message" className={cn("min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#8696a0]", textColor)} readOnly />
          <Paperclip className={cn("w-5 h-5 shrink-0", iconColor)} />
          <Camera className={cn("w-5 h-5 shrink-0", iconColor)} />
        </div>
        <button aria-label="Record voice message" className="w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
          <Mic className="w-5 h-5" />
        </button>
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
    <div className={cn("flex h-full w-full overflow-hidden font-whatsapp", appearance.darkMode ? "bg-[#111b21]" : "bg-white")}>
      <aside className={cn(
        "w-[34%] min-w-[270px] max-w-[350px] h-full flex flex-col border-r",
        appearance.darkMode ? "bg-[#111b21] border-[#2a3942]" : "bg-white border-[#e9edef]"
      )}>
        <div className={cn("h-[60px] px-4 flex items-center gap-3 shrink-0", headerBg)}>
          <div className="w-10 h-10 rounded-full bg-[#dfe5e7] text-[#54656f] flex items-center justify-center font-semibold">Y</div>
          <div className="ml-auto flex items-center gap-1">
            <button aria-label="Communities" className={cn("p-2 rounded-full", iconColor)}><Users className="w-5 h-5" /></button>
            <button aria-label="New chat" className={cn("p-2 rounded-full", iconColor)}><MessageSquarePlus className="w-5 h-5" /></button>
            <button aria-label="More options" className={cn("p-2 rounded-full", iconColor)}><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className={cn("px-3 py-2 border-b", appearance.darkMode ? "border-[#2a3942]" : "border-[#f0f2f5]")}>
          <div className={cn("h-9 rounded-lg px-3 flex items-center gap-3", appearance.darkMode ? "bg-[#202c33]" : "bg-[#f0f2f5]")}>
            <Search className={cn("w-4 h-4", iconColor)} />
            <span className="text-[13px] text-[#667781]">Search or start new chat</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sidebarChats.map(chat => (
            <div
              key={chat.id}
              title="Click the contact name or message preview to edit"
              className={cn(
                "h-[72px] px-3 flex items-center gap-3 border-b cursor-default group/chat",
                appearance.darkMode ? "border-[#222d34]" : "border-[#f0f2f5]",
                chat.active && (appearance.darkMode ? "bg-[#2a3942]" : "bg-[#f0f2f5]")
              )}
            >
              {chat.active && displayPerson?.avatar ? (
                <img src={displayPerson.avatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
              ) : chat.groupAvatars ? (
                <div className="relative w-11 h-11 shrink-0" aria-label={`${chat.name} group picture`}>
                  <img src={chat.groupAvatars[0]} alt="" className="absolute left-0 top-0 w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                  <img src={chat.groupAvatars[1]} alt="" className="absolute bottom-0 right-0 w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                </div>
              ) : (
                <img src={getAvatarUrl(chat.name)} alt={`${chat.name} profile`} className="w-11 h-11 rounded-full object-cover shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className={cn("min-w-0 flex-1 text-[15px] truncate", textColor)}>
                    <EditableText
                      value={chat.name}
                      onSave={(newName) => {
                        if (chat.active && displayPerson && chatType === 'direct') {
                          onUpdatePerson?.({ ...displayPerson, name: newName, avatar: getAvatarUrl(newName) });
                        } else if (!chat.active) {
                          updateDesktopChat(chat.id, 'name', newName);
                        }
                      }}
                      disabled={chat.active && chatType === 'group'}
                      className="block max-w-full truncate"
                      inputClassName="text-[14px]"
                    />
                  </div>
                  <span className={cn("ml-auto text-[11px] shrink-0", chat.unread ? "text-[#00a884]" : "text-[#667781]")}>{chat.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="min-w-0 flex-1 text-[12px] text-[#667781] truncate">
                    <EditableText
                      value={chat.snippet}
                      onSave={(newSnippet) => {
                        const lastMessage = messages.at(-1);
                        if (chat.active && lastMessage) {
                          onUpdateMessage?.(lastMessage.id, newSnippet);
                        } else if (!chat.active) {
                          updateDesktopChat(chat.id, 'snippet', newSnippet);
                        }
                      }}
                      className="block max-w-full truncate"
                      inputClassName="text-[12px]"
                    />
                  </div>
                  {chat.unread && <span className="ml-auto w-5 h-5 rounded-full bg-[#25d366] text-white text-[10px] flex items-center justify-center shrink-0">{chat.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
      <section className="flex-1 min-w-0 h-full">{conversation}</section>
    </div>
  );
}
