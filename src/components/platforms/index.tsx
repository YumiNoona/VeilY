import { Message, Person, ChatType, AppearanceSettings } from "@/types/chat";
import { ArrowLeft, Phone, Video, MoreVertical, Plus, Camera, Mic, Smile, Users, ChevronLeft, Send, Image, Sticker, AtSign, Hash, Search, Inbox, Gift, Heart, ThumbsUp, Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";

export interface PlatformChatProps {
  messages: Message[];
  people: Person[];
  activePerson: Person | null;
  chatType: ChatType;
  appearance: AppearanceSettings;
  onUpdateMessage?: (id: string, text: string) => void;
  onUpdatePerson?: (person: Person) => void;
}

// Shared helper
const getSenderName = (senderId: string, people: Person[]) => {
  return people.find(p => p.id === senderId)?.name || 'Unknown';
};

const getSenderAvatar = (senderId: string, people: Person[]) => {
  return people.find(p => p.id === senderId)?.avatar;
};

const formatTime = (date: Date | string | number, use24Hour: boolean) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  return format(d, use24Hour ? 'HH:mm' : 'h:mm a');
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const formatDateSeparator = (date: Date) => {
  const now = new Date();
  if (isSameDay(date, now)) return "TODAY";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "YESTERDAY";
  return format(date, 'MMMM d, yyyy');
};

// Avatar component
const Avatar = ({ person, size = 'md', className = '' }: { person?: Person | null; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
  };

  if (person?.avatar) {
    return <img src={person.avatar} alt={person.name} className={cn("rounded-full object-cover", sizeClasses[size], className)} />;
  }

  return (
    <div className={cn("rounded-full bg-[#6b7c85] flex items-center justify-center font-medium text-[#cfd8dc]", sizeClasses[size], className)}>
      {person?.name?.charAt(0) || 'U'}
    </div>
  );
};

// Get wallpaper style
const getWallpaperStyle = (appearance: AppearanceSettings) => {
  if (appearance.wallpaperUrl) {
    return {
      backgroundImage: `url(${appearance.wallpaperUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return {};
};

// WhatsApp
export function WhatsAppChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgClass = appearance.darkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]';
  const headerBg = appearance.darkMode ? 'bg-[#202c33]' : 'bg-[#f6f6f6]'; // iOS Header (Light Gray/White)
  const textColor = appearance.darkMode ? 'text-[#e9edef]' : 'text-black';
  const ownBubble = appearance.darkMode ? 'bg-[#005c4b]' : 'bg-[#dcf8c6]'; // Classic WhatsApp Green
  const otherBubble = appearance.darkMode ? 'bg-[#202c33]' : 'bg-white';
  const iconColor = appearance.darkMode ? 'text-[#8696a0]' : 'text-[#007aff]'; // iOS Blue Icons

  return (
    <div className={cn("flex flex-col h-full", bgClass)}>
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
          {appearance.showStatus && <p className="text-[11px] text-[#8696a0]">{displayPerson?.isOnline ? 'online' : 'last seen today at 12:00 PM'}</p>}
        </div>
        <div className="flex items-center gap-4">
          <Video className={cn("w-6 h-6", iconColor)} />
          <Phone className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{
        ...getWallpaperStyle(appearance),
        backgroundImage: appearance.wallpaperUrl ? `url(${appearance.wallpaperUrl})` : "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" // Standard WhatsApp Doodle
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
                <div className={cn(
                  "px-2 py-1.5 rounded-lg max-w-[80%] text-[15px] shadow-sm relative",
                  message.isOwn ? ownBubble : otherBubble
                )} style={{ wordBreak: 'break-word' }}>

                  {/* Image */}
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}

                  {/* Text & Time */}
                  <div className="flex items-end gap-2 flex-wrap min-w-[60px] justify-between">
                    <span className={cn("leading-[1.35] pt-0.5", appearance.darkMode ? "text-white" : "text-black")}>{message.text}</span>
                    <span className={cn("text-[11px] flex items-center gap-0.5 ml-auto translate-y-0.5", appearance.darkMode ? "text-[#8696a0]" : "text-[#999]")}>
                      {formatTime(message.timestamp, appearance.use24HourFormat ?? false)}
                      {message.isOwn && (
                        <span className="ml-0.5">
                          <CheckCheck className={cn("w-4 h-4", appearance.darkMode ? "text-[#53bdeb]" : "text-[#53bdeb]")} />
                        </span>
                      )} {/* Blue ticks */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className={cn("p-2 flex items-center gap-2", appearance.darkMode ? "bg-[#202c33]" : "bg-[#f6f6f6]")}>
        <Plus className={cn("w-7 h-7", "#007aff")} />
        <div className={cn("flex-1 rounded-full px-3 py-1.5 border", appearance.darkMode ? "bg-[#2a3942] border-none" : "bg-white border-[#dbdbdb]")}>
          <input type="text" placeholder="" className={cn("w-full bg-transparent text-[16px] outline-none", textColor)} readOnly />
        </div>
        {!appearance.darkMode && <Camera className="w-6 h-6 text-[#007aff]" />}
        <Mic className="w-6 h-6 text-[#007aff]" />
      </div>
    </div>
  );
}

// iMessage
export function IMessageChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1c1c1e]' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#2c2c2e]' : 'bg-[#f6f6f6]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
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
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <div className={cn("max-w-[75%] px-3 py-2 rounded-[18px]", message.isOwn ? "bg-[#007aff] text-white rounded-br-[4px]" : appearance.darkMode ? "bg-[#3a3a3c] text-white rounded-bl-[4px]" : "bg-[#e9e9eb] text-black rounded-bl-[4px]")} style={{ wordBreak: 'break-word' }}>
              {chatType === 'group' && !message.isOwn && <p className="text-[11px] font-medium text-[#8e8e93] mb-0.5">{getSenderName(message.senderId, people)}</p>}
              {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
              <p className="text-[17px] leading-[22px]">
                <EditableText
                  value={message.text}
                  onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                  multiline
                />
              </p>
            </div>
            {appearance.showTimestamps && <span className="text-[10px] text-[#8e8e93] mt-0.5 mx-2">{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
          </div>
        ))}
      </div>
      <div className={cn("border-t p-2 flex items-center gap-2", headerBg, appearance.darkMode ? "border-[#3a3a3c]" : "border-[#c6c6c8]")}>
        <button className="text-[#007aff]"><Plus className="w-7 h-7" /></button>
        <div className={cn("flex-1 rounded-full border px-4 py-2", appearance.darkMode ? "bg-[#3a3a3c] border-[#3a3a3c]" : "bg-white border-[#c6c6c8]")}><input type="text" placeholder="iMessage" className={cn("w-full bg-transparent text-[17px] outline-none", textColor)} readOnly /></div>
        <button className="text-[#007aff]"><Mic className="w-6 h-6" /></button>
      </div>
    </div>
  );
}

// Discord
export function DiscordChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#313338]' : 'bg-[#f2f3f5]';
  const headerBg = appearance.darkMode ? 'bg-[#313338]' : 'bg-[#f2f3f5]';
  const msgBg = appearance.darkMode ? 'hover:bg-[#2e3035]' : 'hover:bg-[#e3e5e8]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#313338]';
  const subtextColor = appearance.darkMode ? 'text-[#dbdee1]' : 'text-[#5c5e66]';
  const iconColor = appearance.darkMode ? 'text-[#b5bac1]' : 'text-[#4e5058]';
  const inputBg = appearance.darkMode ? 'bg-[#383a40]' : 'bg-[#ebedef]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b shadow-sm", headerBg, appearance.darkMode ? "border-[#1e1f22]" : "border-[#e1e2e4]")}>
        {chatType === 'group' ? <Hash className={cn("w-6 h-6 mr-2", iconColor)} /> : <AtSign className={cn("w-6 h-6 mr-2", iconColor)} />}
        <h3 className={cn("font-semibold", textColor)}>
          {chatType === 'group' ? 'general' : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}
        </h3>
        <div className="ml-auto flex items-center gap-4"><Search className={cn("w-5 h-5", iconColor)} /><Inbox className={cn("w-5 h-5", iconColor)} /></div>
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message) => {
          const sender = people.find(p => p.id === message.senderId);
          const senderAvatar = getSenderAvatar(message.senderId, people);
          return (
            <div key={message.id} className={cn("flex gap-3 px-1 py-0.5 rounded", msgBg)}>
              {senderAvatar ? (
                <img src={senderAvatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex-shrink-0 flex items-center justify-center text-white font-medium">
                  {(message.isOwn ? 'Y' : sender?.name.charAt(0)) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={cn("font-medium", message.isOwn ? "text-[#57f287]" : "text-[#f47b67]")}>{message.isOwn ? 'You' : sender?.name}</span>
                  {appearance.showTimestamps && <span className={cn("text-[11px]", appearance.darkMode ? "text-[#949ba4]" : "text-[#5c5e66]")}>{format(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp), appearance.use24HourFormat ? 'MM/dd/yyyy HH:mm' : 'MM/dd/yyyy h:mm a')}</span>}
                </div>
                {message.image && <img src={message.image} alt="" className="max-w-[200px] rounded-lg mt-1" />}
                <p className={cn("text-[15px] leading-[1.375rem] break-words", subtextColor)}>
                  <EditableText
                    value={message.text}
                    onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                    multiline
                  />
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("p-4", bgColor)}>
        <div className={cn("rounded-lg flex items-center px-4 py-2.5", inputBg)}>
          <Plus className={cn("w-6 h-6 mr-3", iconColor)} />
          <input type="text" placeholder={`Message ${chatType === 'group' ? '#general' : displayPerson?.name}`} className={cn("flex-1 bg-transparent outline-none", textColor, appearance.darkMode ? "placeholder:text-[#6d6f78]" : "placeholder:text-[#5c5e66]")} readOnly />
          <div className="flex items-center gap-3"><Gift className={cn("w-6 h-6", iconColor)} /><Sticker className={cn("w-6 h-6", iconColor)} /><Smile className={cn("w-6 h-6", iconColor)} /></div>
        </div>
      </div>
    </div>
  );
}

// Instagram
export function InstagramChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = appearance.darkMode ? 'text-[#a8a8a8]' : 'text-[#8e8e8e]';
  const otherBubble = appearance.darkMode ? 'bg-[#262626]' : 'bg-[#efefef]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-3 py-2 flex items-center", bgColor)}>
        <button className="p-1"><ArrowLeft className={cn("w-6 h-6", textColor)} /></button>
        <div className="ml-2 flex items-center gap-3 flex-1">
          {displayPerson?.avatar ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
              <img src={displayPerson.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
              <div className={cn("w-full h-full rounded-full flex items-center justify-center text-sm font-semibold", bgColor, textColor)}>
                {chatType === 'group' ? <Users className="w-4 h-4" /> : displayPerson?.name?.charAt(0)}
              </div>
            </div>
          )}
          <div>
            <p className={cn("font-semibold text-[15px]", textColor)}>
              {chatType === 'group' ? people.filter(p => p.id !== 'user').map(p => p.name).join(', ') : (
                <EditableText
                  value={displayPerson?.name || 'Contact'}
                  onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
                />
              )}
            </p>
            {appearance.showStatus && <p className={cn("text-xs", subtextColor)}>{displayPerson?.isOnline ? 'Active now' : 'Active 2h ago'}</p>}
          </div>
        </div>
        <div className="flex gap-5"><Phone className={cn("w-6 h-6", textColor)} /><Video className={cn("w-6 h-6", textColor)} /></div>
      </div>
      <div className={cn("flex-1 overflow-y-auto px-4 py-2 space-y-1", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const msgDate = new Date(message.timestamp);
          const prevMsgDate = i > 0 ? new Date(messages[i - 1].timestamp) : null;
          const showDateSeparator = !prevMsgDate || !isSameDay(msgDate, prevMsgDate);

          return (
            <div key={message.id} className="flex flex-col mb-2">
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <span className={cn("text-[11px] font-medium opacity-60 uppercase tracking-tighter", textColor)}>
                    {formatDateSeparator(msgDate)}
                  </span>
                </div>
              )}
              <div className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
                <div className={cn("max-w-[75%] px-4 py-2.5 rounded-[22px]", message.isOwn ? "bg-[#3797f0] text-white" : cn(otherBubble, textColor))} style={{ wordBreak: 'break-word' }}>
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                  <p className="text-[15px] leading-[20px]">
                    <EditableText
                      value={message.text}
                      onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                      multiline
                    />
                  </p>
                </div>
                {appearance.showTimestamps && (
                  <span className={cn("text-[11px] mt-1 px-1", subtextColor)}>
                    {formatTime(message.timestamp, appearance.use24HourFormat ?? false)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("p-3", bgColor)}>
        <div className={cn("flex items-center gap-3 rounded-full border px-4 py-2.5", appearance.darkMode ? "border-[#363636]" : "border-[#dbdbdb]")}>
          <input type="text" placeholder="Message..." className={cn("flex-1 bg-transparent text-[15px] outline-none", textColor, "placeholder:text-[#a8a8a8]")} readOnly />
          <div className="flex gap-4">
            <Mic className={cn("w-6 h-6", textColor)} />
            <Image className={cn("w-6 h-6", textColor)} />
            <Heart className={cn("w-6 h-6", textColor)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Telegram
export function TelegramChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const today = new Date();

  return (
    <div className="flex flex-col h-full bg-[#0e1621]">
      <div className="bg-[#17212b] px-3 py-2 flex items-center">
        <button className="p-2"><ArrowLeft className="w-5 h-5 text-[#6ab2f2]" /></button>
        {displayPerson?.avatar ? (
          <img src={displayPerson.avatar} alt="" className="w-10 h-10 rounded-full ml-1 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#5288c1] flex items-center justify-center text-white font-medium ml-1">
            {chatType === 'group' ? <Users className="w-5 h-5" /> : displayPerson?.name?.charAt(0)}
          </div>
        )}
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-white">{chatType === 'group' ? 'Group Chat' : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}</h3>
          {appearance.showStatus && <p className="text-xs text-[#6ab2f2]">{chatType === 'group' ? `${people.length} members` : displayPerson?.isOnline ? 'online' : 'last seen recently'}</p>}
        </div>
        <div className="flex items-center gap-2"><Search className="w-5 h-5 text-[#6ab2f2]" /><MoreVertical className="w-5 h-5 text-[#6ab2f2]" /></div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{
        ...getWallpaperStyle(appearance),
        background: appearance.wallpaperUrl ? undefined : 'linear-gradient(180deg, #0f1a24 0%, #0e1621 100%)'
      }}>
        {appearance.showTimestamps && (
          <div className="flex justify-center mb-2"><span className="bg-[#182533] text-[#6ab2f2] text-xs px-3 py-1 rounded-full">{format(today, 'MMMM d')}</span></div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <div className={cn("max-w-[85%] px-3 py-1.5 rounded-xl", message.isOwn ? "bg-[#2b5278] rounded-tr-[4px]" : "bg-[#182533] rounded-tl-[4px]")} style={{ wordBreak: 'break-word' }}>
              {chatType === 'group' && !message.isOwn && <p className="text-[13px] font-medium text-[#6ab2f2] mb-0.5">{getSenderName(message.senderId, people)}</p>}
              {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
              <div className="flex items-end gap-2">
                <p className="text-[15px] text-white leading-[20px]">
                  <EditableText
                    value={message.text}
                    onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                    multiline
                  />
                </p>
                {appearance.showTimestamps && <span className="text-[11px] text-[#6ab2f2] whitespace-nowrap">{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#17212b] p-2 flex items-center gap-2">
        <button className="p-2 text-[#6ab2f2]"><Smile className="w-6 h-6" /></button>
        <div className="flex-1 bg-[#242f3d] rounded-xl px-4 py-2"><input type="text" placeholder="Message" className="w-full bg-transparent text-white outline-none placeholder:text-[#6b7c85]" readOnly /></div>
        <button className="p-2 text-[#6ab2f2]"><Plus className="w-6 h-6" /></button>
        <button className="p-2 text-[#6ab2f2]"><Mic className="w-6 h-6" /></button>
      </div>
    </div>
  );
}

// Messenger
export function MessengerChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = appearance.darkMode ? 'text-[#65676b]' : 'text-[#65676b]';
  const otherBubble = appearance.darkMode ? 'bg-[#3e4042]' : 'bg-[#e4e6eb]';

  // Facebook Messenger Gradient
  const ownBubbleGradient = "bg-gradient-to-r from-[#0084ff] to-[#00c6ff]";

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      {/* Header */}
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
              <EditableText
                value={displayPerson?.name || 'Contact'}
                onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
              />
            )}</h3>
            {appearance.showStatus && <p className={cn("text-[12px]", subtextColor)}>Active now</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <Phone className={cn("w-6 h-6", appearance.darkMode ? "text-[#0084ff]" : "text-[#0084ff]")} />
          <Video className={cn("w-6 h-6", appearance.darkMode ? "text-[#0084ff]" : "text-[#0084ff]")} />
        </div>
      </div>

      {/* Messages */}
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
                    <span className={cn("text-[11px] font-bold uppercase opacity-50", textColor)}>
                      {formatDateSeparator(msgDate)}
                    </span>
                  </div>
                )}
                <div className={cn("flex w-full mb-1", message.isOwn ? "justify-end" : "justify-start gap-2")}>
                  {/* Avatar for Other */}
                  {!message.isOwn && (
                    <div className="w-8 flex-shrink-0 flex items-end">
                      {showAvatar && (
                        getSenderAvatar(message.senderId, people) ?
                          <img src={getSenderAvatar(message.senderId, people)} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm" /> :
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
                      <EditableText
                        value={message.text}
                        onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                        multiline
                      />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Seen Indicator (Simplified: Just verify last message is own and "seen") */}
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

      {/* Input */}
      <div className={cn("p-2 flex items-center gap-2", bgColor)}>
        <Plus className={cn("w-7 h-7", "#0084ff")} />
        <Camera className={cn("w-6 h-6", "#0084ff")} />
        <Image className={cn("w-6 h-6", "#0084ff")} />
        <Mic className={cn("w-6 h-6", "#0084ff")} />
        <div className={cn("flex-1 rounded-full px-3 py-1.5", appearance.darkMode ? "bg-[#3e4042]" : "bg-[#f0f2f5]")}>
          <input type="text" placeholder="Aa" className={cn("w-full bg-transparent outline-none text-[15px]", textColor)} readOnly />
        </div>
        <ThumbsUp className={cn("w-6 h-6", "#0084ff")} />
      </div>
    </div>
  );
}

// Slack
export function SlackChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1a1d21]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#1d1c1d]';
  const subtextColor = appearance.darkMode ? 'text-[#d1d2d3]' : 'text-[#616061]';
  const borderColor = appearance.darkMode ? 'border-[#35373b]' : 'border-[#e1e1e1]';
  const hoverBg = appearance.darkMode ? 'hover:bg-[#222529]' : 'hover:bg-[#f8f8f8]';
  const inputBorder = appearance.darkMode ? 'border-[#565856]' : 'border-[#868686]';

  return (
    <div className={cn("flex flex-col h-full font-lato", bgColor)}>
      <div className={cn("px-4 py-3 border-b flex items-center shadow-sm z-10", bgColor, borderColor)}>
        <h3 className={cn("font-black text-[18px]", textColor)}>
          {chatType === 'group' ? '# general' : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}
        </h3>
        <ChevronLeft className={cn("w-3 h-3 rotate-[270deg] ml-1 mt-1", subtextColor)} />
      </div>

      <div className={cn("flex-1 overflow-y-auto p-4 space-y-5", bgColor)} style={getWallpaperStyle(appearance)}>
        {/* Date Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className={cn("h-[1px] flex-1", borderColor)} />
          <div className={cn("px-3 py-1 rounded-full border text-xs font-bold", borderColor, subtextColor)}>Today</div>
          <div className={cn("h-[1px] flex-1", borderColor)} />
        </div>

        {messages.map((message) => {
          const sender = people.find(p => p.id === message.senderId);
          const isOwn = message.isOwn;
          return (
            <div key={message.id} className={cn("flex gap-3 -mx-2 px-2 py-1 rounded group", hoverBg)}>
              {/* Avatar */}
              <div className="w-9 h-9 flex-shrink-0">
                {isOwn ? (
                  <div className="w-9 h-9 rounded bg-[#4a154b] flex items-center justify-center text-white font-bold text-sm">Y</div>
                ) : (
                  sender?.avatar ?
                    <img src={sender.avatar} alt="" className="w-9 h-9 rounded object-cover" /> :
                    <div className="w-9 h-9 rounded bg-green-700 flex items-center justify-center text-white font-bold text-sm">{sender?.name?.charAt(0)}</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={cn("font-black text-[15px]", textColor)}>{isOwn ? 'You' : (sender?.name || 'User')}</span>
                  <span className={cn("text-[12px]", subtextColor)}>{formatTime(message.timestamp, true)}</span>
                </div>
                <div className={cn("text-[15px] leading-[1.46668]", textColor)}>
                  {message.image && <img src={message.image} alt="" className="max-w-[300px] rounded-lg mb-1 mt-1 border" />}
                  <EditableText
                    value={message.text}
                    onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                    multiline
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn("p-4", bgColor)}>
        <div className={cn("border rounded-xl shadow-sm", inputBorder)}>
          {/* Toolbar */}
          <div className={cn("flex items-center gap-1 p-1 bg-gray-50/50 rounded-t-xl border-b", borderColor)}>
            <button className={cn("p-1.5 rounded hover:bg-gray-200", subtextColor)}><span className="font-bold text-xs serif">B</span></button>
            <button className={cn("p-1.5 rounded hover:bg-gray-200", subtextColor)}><span className="italic text-xs serif">I</span></button>
            <button className={cn("p-1.5 rounded hover:bg-gray-200", subtextColor)}><span className="line-through text-xs serif">S</span></button>
          </div>
          <div className="px-3 py-2">
            <input type="text" placeholder={`Message ${chatType === 'group' ? '#general' : displayPerson?.name}`} className={cn("w-full bg-transparent outline-none text-[15px]", textColor)} readOnly />
          </div>
          <div className={cn("flex items-center justify-between px-2 py-1.5", "rounded-b-xl")}>
            <div className="flex gap-1"><button className={cn("p-1.5", subtextColor)}><Plus className="w-4 h-4" /></button></div>
            <button className={cn("p-1.5 rounded bg-[#007a5a]")}><Send className="w-3 h-3 text-white" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TikTok
export function TikTokChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const subtextColor = appearance.darkMode ? 'text-[#8a8b8f]' : 'text-[#8a8b8f]';
  const borderColor = appearance.darkMode ? 'border-[#2f2f2f]' : 'border-[#e8e8e8]';
  const inputBg = appearance.darkMode ? 'bg-[#2f2f2f]' : 'bg-[#f1f1f2]';
  const otherBubble = appearance.darkMode ? 'bg-[#2f2f2f]' : 'bg-[#f1f1f2]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-3 flex items-center border-b", borderColor)}>
        <button><ArrowLeft className={cn("w-6 h-6", textColor)} /></button>
        <div className="flex-1 text-center">
          <p className={cn("font-semibold", textColor)}>{chatType === 'group' ? 'Group Chat' : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}</p>
          {appearance.showStatus && <p className={cn("text-xs", subtextColor)}>{displayPerson?.isOnline ? 'Active now' : 'Tap to view profile'}</p>}
        </div>
        <MoreVertical className={cn("w-6 h-6", textColor)} />
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-3", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
            <div className={cn("max-w-[70%] px-4 py-2 rounded-2xl", message.isOwn ? "bg-[#fe2c55] text-white" : cn(otherBubble, textColor))} style={{ wordBreak: 'break-word' }}>
              {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
              <p className="text-[15px]">
                <EditableText
                  value={message.text}
                  onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                  multiline
                />
              </p>
            </div>
            {appearance.showTimestamps && <span className={cn("text-[10px] mt-1", subtextColor)}>{formatTime(message.timestamp, appearance.use24HourFormat ?? false)}</span>}
          </div>
        ))}
      </div>
      <div className={cn("p-3 border-t", borderColor)}>
        <div className={cn("flex items-center gap-3 rounded-full px-4 py-2.5", inputBg)}>
          <input type="text" placeholder="Send a message..." className={cn("flex-1 bg-transparent text-sm outline-none", textColor, "placeholder:text-[#8a8b8f]")} readOnly />
          <Smile className={cn("w-6 h-6", subtextColor)} />
        </div>
      </div>
    </div>
  );
}

// Snapchat
export function SnapchatChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full font-sans", bgColor)}>
      {/* Header */}
      <div className={cn("px-4 py-2 flex items-center border-b-[0.5px] border-b-gray-100", bgColor)}>
        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center font-bold text-gray-500">
          {displayPerson?.avatar ? <img src={displayPerson.avatar} className="w-full h-full rounded-full object-cover" /> : displayPerson?.name?.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className={cn("font-bold text-[17px]", textColor)}>
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          </h3>
          <p className="text-[13px] text-gray-500 font-medium">Online</p>
        </div>
        <div className="flex gap-4 text-gray-900">
          <Phone className={cn("w-6 h-6", textColor)} />
          <Video className={cn("w-7 h-7", textColor)} />
        </div>
      </div>

      {/* Messages (No Bubbles!) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={getWallpaperStyle(appearance)}>
        <div className="flex justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today</span>
        </div>

        {messages.map((message) => {
          const isOwn = message.isOwn;
          const indicatorColor = isOwn ? "text-[#E91E63]" : "text-[#2196F3]"; // Red for Me, Blue for Friend
          const barColor = isOwn ? "bg-[#E91E63]" : "bg-[#2196F3]";

          return (
            <div key={message.id} className="flex flex-col gap-0.5">
              <span className={cn("text-[11px] font-bold uppercase tracking-wider mb-0.5", indicatorColor)}>
                {isOwn ? 'ME' : (displayPerson?.name || 'FRIEND')}
              </span>
              <div className={cn("pl-3 border-l-[2px] py-0.5", isOwn ? "border-l-[#E91E63]" : "border-l-[#2196F3]")}>
                {message.image && <img src={message.image} alt="" className="max-w-[200px] rounded-lg mb-2" />}
                <p className={cn("text-[15px] font-medium leading-snug", indicatorColor)}>
                  <EditableText
                    value={message.text}
                    onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                    multiline
                  />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className={cn("px-2 py-2 flex items-center gap-2", bgColor)}>
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Camera className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 bg-gray-100 h-10 rounded-full flex items-center px-4">
          <input type="text" placeholder="Send a chat" className="bg-transparent outline-none w-full text-[15px] font-medium placeholder:text-gray-500" readOnly />
          <Mic className="w-5 h-5 text-gray-500 ml-2" />
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center">
          <Smile className="w-7 h-7 text-gray-800" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-800 rounded-sm" /> {/* Cards Icon Placeholder */}
        </button>
      </div>
    </div>
  );
}

// Reddit
export function RedditChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#1a1a1b]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-[#d7dadc]' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      {/* Header */}
      <div className={cn("px-4 py-2 flex items-center border-b", headerBg, appearance.darkMode ? "border-[#343536]" : "border-[#edeff1]")}>
        <button><ArrowLeft className={cn("w-6 h-6 mr-4", textColor)} /></button>
        <h3 className={cn("font-bold text-[16px]", textColor)}>{chatType === 'group' ? 'Group Chat' : (
          <EditableText
            value={displayPerson?.name || 'Contact'}
            onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
          />
        )}</h3>
        <div className="ml-auto flex gap-4">
          <Share2 className={cn("w-6 h-6", textColor)} />
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4" style={getWallpaperStyle(appearance)}>
        <div className="flex justify-center my-4">
          <span className="text-xs text-gray-400 font-bold">January 13, 2026</span>
        </div>

        {messages.map((message) => {
          const senderName = message.isOwn ? 'u/You' : `u/${getSenderName(message.senderId, people)}` || 'u/Friend';
          return (
            <div key={message.id} className="flex gap-3">
              {/* Avatar: Red Circle with Initial */}
              <div className="w-9 h-9 rounded-full bg-[#FF4500] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {message.isOwn ? 'Y' : (displayPerson?.name?.charAt(0) || 'F')}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[#2378D6] text-sm">{senderName}</span>
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp, true)}</span>
                </div>
                {message.image && <img src={message.image} alt="" className="max-w-full rounded mb-1 mt-1" />}
                <p className={cn("text-[15px] leading-snug mt-0.5", textColor)}>
                  <EditableText
                    value={message.text}
                    onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                    multiline
                  />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className={cn("px-4 py-3 flex items-center gap-2 border-t", headerBg, appearance.darkMode ? "border-[#343536]" : "border-[#edeff1]")}>
        <button className="p-1"><Camera className="w-6 h-6 text-gray-400" /></button>
        <div className="flex-1 bg-[#F6F7F8] rounded-[20px] px-4 py-2 flex items-center gap-2">
          <input type="text" placeholder="Message" className="bg-transparent outline-none w-full text-sm text-black" readOnly />
          <div className="flex gap-2">
            <Smile className="w-5 h-5 text-gray-400" />
            <FileImage className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <button><Send className="w-6 h-6 text-[#2378D6]" /></button>
      </div>
    </div>
  );
}

// Helper for Reddit
function Share2({ className }: { className?: string }) { // Placeholder for Share
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
}
function FileImage({ className }: { className?: string }) { return <Image className={className} />; } // Re-use Image icon

// LINE
// LINE
export function LineChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1a1a1a]' : 'bg-[#8c9dbb]'; // Standard Line Blue-Grey background
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const headerBg = appearance.darkMode ? 'bg-[#2a2a2a]' : 'bg-white'; // White header
  const headerText = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      {/* Header */}
      <div className={cn("px-4 py-3 flex items-center shadow-sm z-10", headerBg)}>
        <button className="mr-3"><ArrowLeft className={cn("w-6 h-6", headerText)} /></button>
        <div className="flex-1">
          <h3 className={cn("font-semibold text-lg leading-tight", headerText)}>{chatType === 'group' ? 'Group' : (
            <EditableText
              value={displayPerson?.name || 'Contact'}
              onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })}
            />
          )}</h3>
        </div>
        <div className="flex gap-4">
          <Search className={cn("w-6 h-6", headerText)} />
          <Phone className={cn("w-6 h-6", headerText)} />
          <MoreVertical className={cn("w-6 h-6", headerText)} />
        </div>
      </div>

      {/* Messages */}
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
              <div className={cn("flex flex-col", message.isOwn ? "items-end" : "items-start")}>
                <div className="flex items-end gap-1.5 max-w-[85%]">
                  {!message.isOwn && (
                    <div className="flex flex-col items-center mr-1">
                      {displayPerson?.avatar ? (
                        <img src={displayPerson.avatar} alt="" className="w-8 h-8 rounded-full mb-1 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold mb-1">
                          {displayPerson?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn(
                    "px-3 py-2 rounded-[20px] text-[15px] relative shadow-sm",
                    message.isOwn
                      ? "bg-[#6CD268] text-black rounded-tr-sm" // iOS Line Green
                      : "bg-white text-black rounded-tl-sm"
                  )} style={{ wordBreak: 'break-word' }}>
                    {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                    <p className="leading-snug">
                      <EditableText
                        value={message.text}
                        onSave={(newText) => onUpdateMessage?.(message.id, newText)}
                        multiline
                      />
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
      </div>

      {/* Input Area */}
      <div className={cn("px-3 py-2 flex items-center gap-2", appearance.darkMode ? "bg-[#2a2a2a]" : "bg-white")}>
        <Plus className={cn("w-7 h-7", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
        <Camera className={cn("w-7 h-7", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
        <Image className={cn("w-7 h-7", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
        <div className={cn("flex-1 rounded-[20px] px-3 py-1.5 mx-1", appearance.darkMode ? "bg-[#404040]" : "bg-[#f2f2f5]")}>
          <input type="text" placeholder="Aa" className={cn("w-full bg-transparent outline-none text-[15px]", textColor)} readOnly />
        </div>
        <Mic className={cn("w-6 h-6", appearance.darkMode ? "text-white" : "text-[#1d4475]")} />
      </div>
    </div>
  );
}

// Microsoft Teams
export function TeamsChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1f1f1f]' : 'bg-[#f0f0f0]'; // Light gray background
  const headerBg = appearance.darkMode ? 'bg-[#292929]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#242424]';
  const subtextColor = appearance.darkMode ? 'text-[#c8c6c4]' : 'text-[#616161]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      {/* Header */}
      <div className={cn("px-4 py-2 flex items-center shadow-sm z-10", headerBg)}>
        <div className="flex items-center gap-3 flex-1">
          {displayPerson?.avatar ? (
            <img src={displayPerson.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#D1D1D1] flex items-center justify-center text-white text-sm font-bold">
              {displayPerson?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className={cn("font-semibold text-[14px]", textColor)}>{chatType === 'group' ? 'Group Chat' : displayPerson?.name}</h3>
            <p className="text-[11px] text-[#616161]">Chat</p>
          </div>
        </div>
        <div className="flex gap-4 text-[#616161]">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={getWallpaperStyle(appearance)}>
        {/* Date Separator */}
        <div className="flex justify-center">
          <span className="text-[11px] text-[#616161]">Tuesday 11:37 PM</span>
        </div>

        {messages.map((message) => {
          const isOwn = message.isOwn;
          return (
            <div key={message.id} className={cn("flex flex-col group", isOwn ? "items-end" : "items-start")}>
              <div className={cn(
                "p-3 rounded-md shadow-sm max-w-[85%] min-w-[120px]",
                isOwn ? "bg-[#5B5FC7] text-white" : "bg-white text-[#242424]"
              )} style={{ wordBreak: 'break-word' }}>
                {/* Message Header */}
                <div className="flex justify-between items-baseline mb-1 gap-4">
                  <span className={cn("font-semibold text-[11px]", isOwn ? "text-white" : "text-[#242424]")}>
                    {isOwn ? 'You' : getSenderName(message.senderId, people)}
                  </span>
                  <span className={cn("text-[10px]", isOwn ? "text-white/80" : "text-[#616161]")}>
                    {formatTime(message.timestamp, true)}
                  </span>
                </div>

                {message.image && <img src={message.image} alt="" className="max-w-full rounded mb-2" />}
                <p className="text-[13px] leading-[1.4]">{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className={cn("p-4", headerBg)}>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-[#5B5FC7] flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 border rounded-sm px-3 py-2 bg-white">
            <input type="text" placeholder="Type a message" className="w-full text-[13px] outline-none placeholder:text-[#616161]" readOnly />
          </div>
          <div className="flex gap-2 text-[#616161]">
            <Smile className="w-5 h-5" />
            <Camera className="w-5 h-5" />
            <Mic className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Signal
export function SignalChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1b1c1f]' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#1b1c1f]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';
  const bubbleOwn = "bg-[#2C6BED]"; // Signal Blue
  const bubbleOther = appearance.darkMode ? 'bg-[#2b2d31]' : 'bg-[#e8e8e8]';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      {/* Header */}
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

      {/* Messages */}
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
              <div key={message.id} className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
                <div className={cn(
                  "px-4 py-2.5 max-w-[75%] relative text-[15px]",
                  isOwn ? cn(bubbleOwn, "text-white rounded-[22px] rounded-br-[6px]") : cn(bubbleOther, textColor, "rounded-[22px] rounded-bl-[6px]")
                )} style={{ wordBreak: 'break-word' }}>
                  {message.image && <img src={message.image} alt="" className="max-w-full rounded-lg mb-1" />}
                  <p>{message.text}</p>

                  {/* Internal Timestamp & Status */}
                  <div className={cn("flex items-center justify-end gap-1 mt-0.5", isOwn ? "text-white/80" : "text-gray-500")}>
                    <span className="text-[10px]">{formatTime(msgDate, appearance.use24HourFormat ?? false)}</span>
                    {isOwn && <CheckCheck className="w-3 h-3" />} {/* Double checks */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className={cn("p-2 flex items-center gap-2", bgColor)}>
        <button className={cn("p-2 rounded-full hover:bg-gray-100", appearance.darkMode ? "text-gray-300" : "text-gray-600")}>
          <Plus className="w-7 h-7" />
        </button>
        <div className={cn("flex-1 rounded-full px-4 py-2 border flex items-center", appearance.darkMode ? "bg-[#2b2d31] border-none" : "bg-[#f2f2f5] border-transparent")}>
          <input type="text" placeholder="Signal message" className={cn("w-full bg-transparent outline-none text-[16px]", textColor)} readOnly />
          <div className={cn("p-1.5 rounded-lg border-2 border-gray-400 ml-2")}>
            <div className="bg-transparent border-gray-400 border-2 border-dashed w-3 h-3 rounded-sm" />
          </div>
        </div>
        <button className={cn("p-2 rounded-full bg-[#2C6BED] text-white")}>
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Tinder
export function TinderChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#111418]' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#111418]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-[#21262e]';
  const subtextColor = appearance.darkMode ? 'text-[#656e7b]' : 'text-[#656e7b]';

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

// WeChat
// WeChat
export function WeChatChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-[#1e1e1e]' : 'bg-[#f3f3f3]';
  const headerBg = appearance.darkMode ? 'bg-[#2e2e2e]' : 'bg-[#f3f3f3]';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      {/* Header */}
      <div className={cn("px-4 py-3 flex items-center border-b-[0.5px]", headerBg, appearance.darkMode ? "border-[#3a3a3a]" : "border-[#e0e0e0]")}>
        <button><ChevronLeft className={cn("w-6 h-6", textColor)} /></button>
        <h3 className={cn("flex-1 text-center font-bold text-[17px]", textColor)}>{chatType === 'group' ? 'Group Chat' : displayPerson?.name || 'Friend'}</h3>
        <MoreVertical className={cn("w-6 h-6 rotate-90", textColor)} />
      </div>

      {/* Messages */}
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-6", bgColor)} style={getWallpaperStyle(appearance)}>
        {messages.map((message, i) => {
          const senderAvatar = getSenderAvatar(message.senderId, people);
          const showTime = i === 0 || (message.timestamp.getTime() - messages[i - 1].timestamp.getTime() > 300000);

          return (
            <div key={message.id} className="flex flex-col">
              {showTime && (
                <div className="flex justify-center mb-4">
                  <span className="text-[12px] text-[#b2b2b2]">{formatTime(message.timestamp, appearance.use24HourFormat ?? true)}</span>
                </div>
              )}

              <div className={cn("flex gap-3", message.isOwn ? "flex-row-reverse" : "flex-row")}>
                {/* Avatar: Square Green with White Text */}
                <div className="w-10 h-10 rounded-[4px] bg-[#62b900] flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden">
                  {senderAvatar ? (
                    <img src={senderAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{message.isOwn ? 'Y' : (getSenderName(message.senderId, people).charAt(0) || 'F')}</span>
                  )}
                </div>

                <div className="relative flex flex-col">
                  <div className={cn(
                    "max-w-[280px] px-3 py-2.5 rounded-[4px] relative shadow-sm min-h-[40px] flex items-center",
                    message.isOwn ? "bg-[#95ec69] text-black" : "bg-white text-black"
                  )} style={{ wordBreak: 'break-word' }}>
                    {/* Triangle pointer */}
                    <div className={cn(
                      "absolute top-[14px] w-0 h-0 border-y-[6px] border-y-transparent",
                      message.isOwn
                        ? "right-[-6px] border-l-[6px] border-l-[#95ec69]" // Right triangle
                        : "left-[-6px] border-r-[6px] border-r-white"    // Left triangle
                    )} />
                    {message.image && <img src={message.image} alt="" className="max-w-full rounded-sm mb-1" />}
                    <p className="text-[15px] leading-[1.4]">{message.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className={cn("px-2 py-2 flex items-center gap-3 border-t-[0.5px]", headerBg, appearance.darkMode ? "border-[#3a3a3a]" : "border-[#e0e0e0]")}>
        <div className="flex items-center justify-center p-1">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#7f7f7f]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M8 8v8M4 11v2M16 8v8M20 11v2" strokeLinecap="round" /></svg>
        </div>
        <div className="flex-1 bg-white border-[0.5px] border-[#d9d9d9] rounded-[4px] px-3 py-2">
          <input type="text" placeholder="" className="w-full bg-transparent outline-none text-[16px]" readOnly />
        </div>
        <Smile className="w-7 h-7 text-[#7f7f7f]" />
        <Plus className="w-7 h-7 text-[#7f7f7f]" />
      </div>
    </div>
  );
}

// X (Twitter DMs)
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
          <Send className={cn("w-5 h-5 text-[#1d9bf0]")} />
        </div>
      </div>
    </div>
  );
}

export { ChatGPTChat } from './ChatGPTChat';
export { ClaudeChat } from './ClaudeChat';
export { GeminiChat } from './GeminiChat';
export { GrokChat } from './GrokChat';
