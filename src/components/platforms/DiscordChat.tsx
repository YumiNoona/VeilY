import {
  AtSign, Bell, ChevronDown, Compass, Gift, Hash, Headphones, HelpCircle, Inbox,
  Mic, Pin, Plus, Search, Settings, Smile, Sticker, Users, Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getSenderAvatar } from "./shared";
import { VoiceNoteBubble } from "./VoiceNoteBubble";
import { getAvatarUrl } from "@/lib/avatar-utils";

const directMessages = [
  { name: 'Aarav Patel', avatar: getAvatarUrl('Aarav Patel'), status: 'online' },
  { name: 'Maya Chen', avatar: getAvatarUrl('Maya Chen'), status: 'idle' },
  { name: 'Rohan Mehta', avatar: getAvatarUrl('Rohan Mehta'), status: 'online' },
  { name: 'Priya Sharma', avatar: getAvatarUrl('Priya Sharma'), status: 'offline' },
];

export function DiscordChat({
  messages,
  people,
  activePerson,
  chatType,
  deviceView,
  appearance,
  onUpdateMessage,
  onUpdatePerson,
}: PlatformChatProps) {
  const displayPerson = activePerson || people.find(person => person.id !== 'user');
  const isDesktop = deviceView === 'desktop';
  const dark = appearance.darkMode;
  const bgColor = dark ? 'bg-[#313338]' : 'bg-white';
  const textColor = dark ? 'text-[#f2f3f5]' : 'text-[#313338]';
  const subtextColor = dark ? 'text-[#dbdee1]' : 'text-[#4e5058]';
  const iconColor = dark ? 'text-[#b5bac1]' : 'text-[#4e5058]';
  const inputBg = dark ? 'bg-[#383a40]' : 'bg-[#ebedef]';
  const panelBg = dark ? 'bg-[#2b2d31]' : 'bg-[#f2f3f5]';
  const railBg = dark ? 'bg-[#1e1f22]' : 'bg-[#e3e5e8]';
  const channelName = chatType === 'group' ? 'general' : (displayPerson?.name || 'Direct Message');
  const onlineCount = Math.max(3, people.length + 2);

  const messageList = (
    <div data-chat-scroll className={cn("flex-1 overflow-y-auto px-4 py-3", bgColor)}>
      <div className="mb-5 pt-4">
        <div className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#5865f2] text-2xl font-bold text-white">
          {chatType === 'direct' && displayPerson?.avatar
            ? <img src={displayPerson.avatar} alt="" className="h-full w-full object-cover" />
            : <Hash className="h-8 w-8" />}
        </div>
        <h2 className={cn("text-xl font-bold", textColor)}>{chatType === 'group' ? 'Welcome to #general!' : channelName}</h2>
        <p className={cn("mt-1 text-xs", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>
          {chatType === 'group' ? 'This is the start of the #general channel.' : `This is the beginning of your direct message history with ${channelName}.`}
        </p>
      </div>

      <div className="space-y-0.5">
        {messages.map((message, index) => {
          const sender = people.find(person => person.id === message.senderId);
          const senderAvatar = getSenderAvatar(message.senderId, people);
          const previous = messages[index - 1];
          const previousDate = previous ? new Date(previous.timestamp) : null;
          const currentDate = new Date(message.timestamp);
          const grouped = Boolean(previous
            && previous.senderId === message.senderId
            && previousDate
            && currentDate.getTime() - previousDate.getTime() < 7 * 60 * 1000);

          return (
            <div key={message.id} className={cn(
              "group relative flex gap-3 rounded px-1 py-0.5 hover:bg-black/[0.04]",
              dark && "hover:bg-black/[0.08]",
              !grouped && "mt-3",
            )}>
              <div className="w-10 shrink-0">
                {!grouped && (senderAvatar ? (
                  <img src={senderAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] font-semibold text-white">
                    {(message.isOwn ? 'Y' : sender?.name.charAt(0)) || 'U'}
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                {!grouped && (
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-sm font-semibold",
                      message.isOwn ? (dark ? "text-[#57f287]" : "text-[#248046]") : (dark ? "text-[#f47b67]" : "text-[#b23b2a]"),
                    )}>{message.isOwn ? 'You' : sender?.name}</span>
                    {appearance.showTimestamps && (
                      <span className={cn("text-[10px]", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>
                        {format(currentDate, appearance.use24HourFormat ? 'MM/dd/yyyy HH:mm' : 'MM/dd/yyyy h:mm a')}
                      </span>
                    )}
                  </div>
                )}
                {message.image && <img src={message.image} alt="" className="mt-1 max-w-[240px] rounded-lg" />}
                {message.isVoiceNote ? (
                  <div className="mt-1">
                    <VoiceNoteBubble duration={message.voiceDuration || "0:12"} isOwn={message.isOwn} platform="discord" darkMode={dark} />
                  </div>
                ) : (
                  <p data-chat-message className={cn("break-words text-[14px] leading-[1.25rem]", subtextColor)}>
                    <EditableText value={message.text} onSave={(text) => onUpdateMessage?.(message.id, text)} multiline />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {appearance.isTyping && (
        <div className={cn("mt-3 flex items-center gap-2 text-[11px]", dark ? "text-[#b5bac1]" : "text-[#5c5e66]")}>
          <div className="flex gap-1 rounded-lg bg-black/10 px-2 py-1.5">
            {[0, 1, 2].map(index => <div key={index} className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" style={{ animationDelay: `${index * 100}ms` }} />)}
          </div>
          {displayPerson?.name || 'Someone'} is typing...
        </div>
      )}
    </div>
  );

  const composer = (
    <div className={cn("px-4 pb-5 pt-2", bgColor)}>
      <div className={cn("flex items-center rounded-lg px-3 py-2.5", inputBg)}>
        <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#b5bac1]"><Plus className="h-3.5 w-3.5 text-[#383a40]" /></div>
        <input
          type="text"
          placeholder={`Message ${chatType === 'group' ? '#' + channelName : '@' + channelName}`}
          className={cn("min-w-0 flex-1 bg-transparent text-sm outline-none", textColor, dark ? "placeholder:text-[#6d6f78]" : "placeholder:text-[#5c5e66]")}
          readOnly
        />
        <div className="flex items-center gap-3"><Gift className={cn("h-5 w-5", iconColor)} /><Sticker className={cn("h-5 w-5", iconColor)} /><Smile className={cn("h-5 w-5", iconColor)} /></div>
      </div>
    </div>
  );

  const chatHeader = (
    <div className={cn("flex h-12 shrink-0 items-center border-b px-4 shadow-sm", bgColor, dark ? "border-[#1e1f22]" : "border-[#e1e2e4]")}>
      {chatType === 'group' ? <Hash className={cn("mr-2 h-5 w-5", iconColor)} /> : <AtSign className={cn("mr-2 h-5 w-5", iconColor)} />}
      <h3 className={cn("truncate text-sm font-semibold", textColor)}>
        {chatType === 'direct' ? (
          <EditableText value={displayPerson?.name || 'Contact'} onSave={(name) => displayPerson && onUpdatePerson?.({ ...displayPerson, name })} />
        ) : channelName}
      </h3>
      {chatType === 'group' && <><div className={cn("mx-3 h-5 w-px", dark ? "bg-[#3f4147]" : "bg-[#d6d8db]")} /><span className={cn("truncate text-[11px]", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>Talk about anything</span></>}
      <div className="ml-auto flex items-center gap-3">
        <Bell className={cn("h-[18px] w-[18px]", iconColor)} />
        <Pin className={cn("hidden h-[18px] w-[18px] 2xl:block", iconColor)} />
        <Users className={cn("h-[18px] w-[18px]", iconColor)} />
        <div className={cn("hidden h-6 w-36 items-center rounded px-2 text-[11px] 2xl:flex", dark ? "bg-[#1e1f22] text-[#949ba4]" : "bg-[#e3e5e8] text-[#5c5e66]")}><span>Search</span><Search className="ml-auto h-3.5 w-3.5" /></div>
        <Inbox className={cn("h-[18px] w-[18px]", iconColor)} />
        <HelpCircle className={cn("hidden h-[18px] w-[18px] 2xl:block", iconColor)} />
      </div>
    </div>
  );

  if (!isDesktop) {
    return (
      <div className={cn("flex h-full flex-col", appearance.transparentBackground ? "bg-transparent" : bgColor)}>
        {chatHeader}
        {messageList}
        {composer}
      </div>
    );
  }

  const currentUser = people.find(person => person.id === 'friend') ?? { name: 'You', avatar: undefined };
  const sidebarDirectMessages = displayPerson
    ? [
        {
          name: displayPerson.name,
          avatar: displayPerson.avatar || getAvatarUrl(displayPerson.name),
          status: 'online',
        },
        ...directMessages.filter(contact => contact.name !== displayPerson.name),
      ]
    : directMessages;

  return (
    <div className={cn("flex h-full w-full overflow-hidden", railBg)}>
      <aside className={cn("flex w-[72px] shrink-0 flex-col items-center gap-2 py-3", railBg)}>
        <div className="mb-1 h-10 w-8 rounded-full border-l-4 border-white" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5865f2] text-xl font-bold text-white">V</div>
        <div className={cn("h-px w-8", dark ? "bg-[#35363c]" : "bg-[#c7c9cc]")} />
        {['D', 'G', 'W'].map((letter, index) => (
          <div key={letter} className={cn("flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition", dark ? "bg-[#313338] text-[#dbdee1]" : "bg-white text-[#4e5058]", index === 1 && "bg-[#23a55a] text-white")}>{letter}</div>
        ))}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#313338] text-[#23a55a]"><Plus className="h-5 w-5" /></div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#313338] text-[#23a55a]"><Compass className="h-5 w-5" /></div>
      </aside>

      <aside className={cn("flex w-[232px] shrink-0 flex-col", panelBg)}>
        <div className={cn("flex h-12 items-center border-b px-4 text-sm font-semibold shadow-sm", textColor, dark ? "border-[#1e1f22]" : "border-[#d6d8db]")}>
          {chatType === 'group' ? 'Design Lounge' : 'Direct Messages'}
          <ChevronDown className="ml-auto h-4 w-4" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden p-2">
          <div className={cn("mb-3 flex h-8 items-center rounded px-2 text-xs", dark ? "bg-[#1e1f22] text-[#949ba4]" : "bg-[#e3e5e8] text-[#5c5e66]")}><Search className="mr-2 h-3.5 w-3.5" />Find or start a conversation</div>
          {chatType === 'group' ? (
            <>
              <div className={cn("mb-1 flex items-center px-1 text-[10px] font-semibold uppercase", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>Text channels <Plus className="ml-auto h-3.5 w-3.5" /></div>
              {['general', 'design-feedback', 'random', 'launch-notes'].map((channel, index) => (
                <div key={channel} className={cn("mb-0.5 flex h-8 items-center rounded px-2 text-[13px]", index === 0 ? (dark ? "bg-[#3f4147] text-white" : "bg-[#d6d8db] text-[#313338]") : (dark ? "text-[#949ba4]" : "text-[#5c5e66]") )}><Hash className="mr-1.5 h-4 w-4" />{channel}</div>
              ))}
              <div className={cn("mb-1 mt-4 flex items-center px-1 text-[10px] font-semibold uppercase", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>Voice channels <Plus className="ml-auto h-3.5 w-3.5" /></div>
              <div className={cn("flex h-8 items-center rounded px-2 text-[13px]", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}><Volume2 className="mr-1.5 h-4 w-4" />Lounge</div>
            </>
          ) : (
            <>
              <div className={cn("mb-1 flex items-center px-1 text-[10px] font-semibold uppercase", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>Direct messages <Plus className="ml-auto h-3.5 w-3.5" /></div>
              {sidebarDirectMessages.map((contact) => {
                const active = contact.name === displayPerson?.name;
                return (
                  <div key={contact.name} className={cn("mb-0.5 flex h-10 items-center gap-2 rounded px-2 text-[13px]", active ? (dark ? "bg-[#3f4147] text-white" : "bg-[#d6d8db] text-[#313338]") : (dark ? "text-[#949ba4]" : "text-[#5c5e66]") )}>
                    <div className="relative"><img src={contact.avatar} alt="" className="h-7 w-7 rounded-full object-cover" /><span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2", dark ? "border-[#2b2d31]" : "border-[#f2f3f5]", contact.status === 'online' ? "bg-[#23a55a]" : contact.status === 'idle' ? "bg-[#f0b232]" : "bg-[#80848e]")} /></div>
                    <span className="truncate">{contact.name}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className={cn("flex h-[52px] items-center gap-2 px-2", dark ? "bg-[#232428]" : "bg-[#ebedef]")}>
          {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">Y</div>}
          <div className="min-w-0"><div className={cn("truncate text-[11px] font-semibold", textColor)}>{currentUser.name}</div><div className="text-[9px] text-[#949ba4]">Online</div></div>
          <Mic className={cn("ml-auto h-4 w-4", iconColor)} /><Headphones className={cn("h-4 w-4", iconColor)} /><Settings className={cn("h-4 w-4", iconColor)} />
        </div>
      </aside>

      <section className={cn("flex min-w-0 flex-1 flex-col", bgColor)}>
        {chatHeader}
        {messageList}
        {composer}
      </section>

      {chatType === 'group' && (
        <aside className={cn("hidden w-[190px] shrink-0 px-3 py-4 2xl:block", panelBg)}>
          <div className={cn("mb-2 text-[10px] font-semibold uppercase", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>Online, {onlineCount}</div>
          {[displayPerson, ...people.filter(person => person.id !== displayPerson?.id)].filter(Boolean).map((person, index) => (
            <div key={person!.id} className={cn("mb-1 flex h-9 items-center gap-2 rounded px-1.5 text-[12px]", dark ? "text-[#b5bac1] hover:bg-[#35373c]" : "text-[#5c5e66] hover:bg-[#e3e5e8]")}>
              {person!.avatar ? <img src={person!.avatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5865f2] text-[10px] font-bold text-white">{person!.name.charAt(0)}</div>}
              <span className="truncate">{person!.name}</span>{index === 0 && <span className="ml-auto h-2 w-2 rounded-full bg-[#23a55a]" />}
            </div>
          ))}
          <div className={cn("mb-2 mt-5 text-[10px] font-semibold uppercase", dark ? "text-[#949ba4]" : "text-[#5c5e66]")}>Offline, 2</div>
          {['Nikhil Jain', 'Diya Shah'].map(name => <div key={name} className="mb-1 flex h-9 items-center gap-2 px-1.5 text-[12px] text-[#80848e] opacity-60"><img src={getAvatarUrl(name)} alt="" className="h-7 w-7 rounded-full object-cover grayscale" />{name}</div>)}
        </aside>
      )}
    </div>
  );
}
