import { ChevronLeft, Send, Smile, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, formatTime, getWallpaperStyle } from "./shared";

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
            <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
          )}
        </h3>
        <ChevronLeft className={cn("w-3 h-3 rotate-[270deg] ml-1 mt-1", subtextColor)} />
      </div>
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-5", bgColor)} style={getWallpaperStyle(appearance)}>
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
                  <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("p-4", bgColor)}>
        <div className={cn("border rounded-xl shadow-sm", inputBorder)}>
          <div className={cn("flex items-center gap-1 p-1 bg-gray-50/50 rounded-t-xl border-b", borderColor)}>
            <button className={cn("p-1.5 rounded hover:bg-gray-200", subtextColor)}><span className="font-bold text-xs serif">B</span></button>
            <button className={cn("p-1.5 rounded hover:bg-gray-200", subtextColor)}><span className="italic text-xs serif">I</span></button>
            <button className={cn("p-1.5 rounded hover:bg-gray-200", subtextColor)}><span className="line-through text-xs serif">S</span></button>
          </div>
          <div className="px-3 py-2">
            <input type="text" placeholder={`Message ${chatType === 'group' ? '#general' : displayPerson?.name}`} className={cn("w-full bg-transparent outline-none text-[15px]", textColor)} readOnly />
          </div>
          <div className={cn("flex items-center justify-between px-2 py-1.5 rounded-b-xl")}>
            <div className="flex gap-1"><button className={cn("p-1.5", subtextColor)}><Plus className="w-4 h-4" /></button></div>
            <button className="p-1.5 rounded bg-[#007a5a]"><Send className="w-3 h-3 text-white" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
