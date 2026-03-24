import { cn } from "@/lib/utils";
import { Platform } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { Crown } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcons";

interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

// Platform data with proper brand colors
const platforms: { id: Platform; name: string; color: string; activeColor: string }[] = [
  { id: 'discord', name: 'Discord', color: 'bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/30', activeColor: 'bg-[#5865F2] text-white border-[#5865F2]' },
  { id: 'imessage', name: 'iMessage', color: 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/30', activeColor: 'bg-[#34C759] text-white border-[#34C759]' },
  { id: 'instagram', name: 'Instagram', color: 'bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30', activeColor: 'bg-[#E4405F] text-white border-[#E4405F]' },
  { id: 'line', name: 'LINE', color: 'bg-[#00B900]/10 text-[#00B900] border-[#00B900]/30', activeColor: 'bg-[#00B900] text-white border-[#00B900]' },
  { id: 'messenger', name: 'Messenger', color: 'bg-[#0084FF]/10 text-[#0084FF] border-[#0084FF]/30', activeColor: 'bg-[#0084FF] text-white border-[#0084FF]' },
  { id: 'teams', name: 'Teams', color: 'bg-[#6264A7]/10 text-[#6264A7] border-[#6264A7]/30', activeColor: 'bg-[#6264A7] text-white border-[#6264A7]' },
  { id: 'reddit', name: 'Reddit', color: 'bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/30', activeColor: 'bg-[#FF4500] text-white border-[#FF4500]' },
  { id: 'signal', name: 'Signal', color: 'bg-[#3A76F0]/10 text-[#3A76F0] border-[#3A76F0]/30', activeColor: 'bg-[#3A76F0] text-white border-[#3A76F0]' },
  { id: 'slack', name: 'Slack', color: 'bg-[#4A154B]/10 text-[#4A154B] border-[#4A154B]/30', activeColor: 'bg-[#4A154B] text-white border-[#4A154B]' },
  { id: 'snapchat', name: 'Snapchat', color: 'bg-[#FFFC00]/10 text-[#000000] border-[#FFFC00]/50', activeColor: 'bg-[#FFFC00] text-black border-[#FFFC00]' },
  { id: 'telegram', name: 'Telegram', color: 'bg-[#0088CC]/10 text-[#0088CC] border-[#0088CC]/30', activeColor: 'bg-[#0088CC] text-white border-[#0088CC]' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-[#000000]/10 text-[#000000] border-[#000000]/30', activeColor: 'bg-[#000000] text-white border-[#000000]' },
  { id: 'tinder', name: 'Tinder', color: 'bg-[#FE3C72]/10 text-[#FE3C72] border-[#FE3C72]/30', activeColor: 'bg-[#FE3C72] text-white border-[#FE3C72]' },
  { id: 'wechat', name: 'WeChat', color: 'bg-[#07C160]/10 text-[#07C160] border-[#07C160]/30', activeColor: 'bg-[#07C160] text-white border-[#07C160]' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30', activeColor: 'bg-[#25D366] text-white border-[#25D366]' },
  { id: 'x', name: 'X', color: 'bg-[#000000]/10 text-[#000000] border-[#000000]/30', activeColor: 'bg-[#000000] text-white border-[#000000]' },
];

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  const { plan, setUpgradeModalOpen } = useAuth();
  const lockedPlatforms = ['imessage', 'snapchat'];

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const isActive = selected === platform.id;
        const isLocked = lockedPlatforms.includes(platform.id) && plan === 'free';

        return (
          <button
            key={platform.id}
            onClick={() => {
                if (isLocked) {
                    setUpgradeModalOpen(true);
                } else {
                    onSelect(platform.id);
                }
            }}
            className={cn(
              "inline-flex relative items-center justify-center grow gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
              "hover:shadow-md hover:-translate-y-0.5",
              isActive ? platform.activeColor : platform.color
            )}
          >
            <PlatformIcon platform={platform.id} />
            <span>{platform.name}</span>
            {isLocked && <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 drop-shadow-sm" />}
          </button>
        );
      })}
    </div>
  );
}
