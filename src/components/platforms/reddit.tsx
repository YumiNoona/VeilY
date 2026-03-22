import { ArrowLeft, Camera, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { EditableText } from "@/components/ui/EditableText";
import { PlatformChatProps, getSenderName, formatTime, getWallpaperStyle } from "./shared";

function Share2({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
}

export function RedditChat({ messages, people, activePerson, chatType, appearance, onUpdateMessage, onUpdatePerson }: PlatformChatProps) {
  const displayPerson = activePerson || people.find(p => p.id !== 'user');
  const bgColor = appearance.darkMode ? 'bg-black' : 'bg-white';
  const headerBg = appearance.darkMode ? 'bg-[#1a1a1b]' : 'bg-white';
  const textColor = appearance.darkMode ? 'text-[#d7dadc]' : 'text-black';

  return (
    <div className={cn("flex flex-col h-full", bgColor)}>
      <div className={cn("px-4 py-2 flex items-center border-b", headerBg, appearance.darkMode ? "border-[#343536]" : "border-[#edeff1]")}>
        <button><ArrowLeft className={cn("w-6 h-6 mr-4", textColor)} /></button>
        <h3 className={cn("font-bold text-[16px]", textColor)}>{chatType === 'group' ? 'Group Chat' : (
          <EditableText value={displayPerson?.name || 'Contact'} onSave={(newName) => displayPerson && onUpdatePerson?.({ ...displayPerson, name: newName })} />
        )}</h3>
        <div className="ml-auto flex gap-4">
          <Share2 className={cn("w-6 h-6", textColor)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4" style={getWallpaperStyle(appearance)}>
        <div className="flex justify-center my-4">
          <span className="text-xs text-gray-400 font-bold">January 13, 2026</span>
        </div>
        {messages.map((message) => {
          const senderName = message.isOwn ? 'u/You' : `u/${getSenderName(message.senderId, people)}`;
          return (
            <div key={message.id} className="flex gap-3">
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
                  <EditableText value={message.text} onSave={(newText) => onUpdateMessage?.(message.id, newText)} multiline />
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("px-4 py-3 flex items-center gap-2 border-t", headerBg, appearance.darkMode ? "border-[#343536]" : "border-[#edeff1]")}>
        <button className="p-1"><Camera className="w-6 h-6 text-gray-400" /></button>
        <div className="flex-1 bg-[#F6F7F8] rounded-[20px] px-4 py-2 flex items-center gap-2">
          <input type="text" placeholder="Message" className="bg-transparent outline-none w-full text-sm text-black" readOnly />
          <div className="flex gap-2">
            <Smile className="w-5 h-5 text-gray-400" />
            <Image className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <button><Send className="w-6 h-6 text-[#2378D6]" /></button>
      </div>
    </div>
  );
}
