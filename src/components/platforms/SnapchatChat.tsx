import { Phone, Video, Camera, Mic, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getWallpaperStyle } from "./shared";

export function SnapchatChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-white' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full font-sans", bgColor)}>
      <div className={cn("px-4 py-2 flex items-center border-b-[0.5px] border-b-gray-100", bgColor)}>
        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center font-bold text-gray-500">
          {displayPerson?.avatar ? <img src={displayPerson.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : displayPerson?.name?.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className={cn("font-bold text-[17px]", textColor)}>
            <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
          </h3>
          <p className="text-[13px] text-gray-500 font-medium">Online</p>
        </div>
        <div className="flex gap-4 text-gray-900">
          <Phone className={cn("w-6 h-6", textColor)} />
          <Video className={cn("w-7 h-7", textColor)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={getWallpaperStyle(appearance)}>
        <div className="flex justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today</span>
        </div>
        {messages.map((message) => {
          const isOwn = message.isOwn;
          const indicatorColor = isOwn ? "text-[#E91E63]" : "text-[#2196F3]";
          return (
            <div key={message.id} className="flex flex-col gap-0.5">
              <span className={cn("text-[11px] font-bold uppercase tracking-wider mb-0.5", indicatorColor)}>
                {isOwn ? 'ME' : (displayPerson?.name || 'FRIEND')}
              </span>
              <div className={cn("pl-3 border-l-[2px] py-0.5", isOwn ? "border-l-[#E91E63]" : "border-l-[#2196F3]")}>
                {message.image && <img src={message.image} alt="" className="max-w-[200px] rounded-lg mb-2" />}
                <p className={cn("text-[15px] font-medium leading-snug", indicatorColor)}>
                  <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
          <div className="w-6 h-6 border-2 border-gray-800 rounded-sm" />
        </button>
      </div>
    </div>
  );
}
