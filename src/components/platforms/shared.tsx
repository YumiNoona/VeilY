import { Message, Person, AppearanceSettings, ChatType } from "@/types/chat";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface PlatformChatProps {
  messages: Message[];
  people: Person[];
  activePerson: Person | null;
  chatType: ChatType;
  appearance: AppearanceSettings;
  aiModel?: string;
  onUpdateMessage?: (id: string, text: string) => void;
  onUpdatePerson?: (person: Person) => void;
}

// Shared helpers
export const getSenderName = (senderId: string, people: Person[]) => {
  return people.find(p => p.id === senderId)?.name || 'Unknown';
};

export const getSenderAvatar = (senderId: string, people: Person[]) => {
  const avatar = people.find(p => p.id === senderId)?.avatar;
  return avatar || null; // normalize '' to null to prevent broken <img> requests
};

export const formatTime = (date: Date | string | number, use24Hour: boolean) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  return format(d, use24Hour ? 'HH:mm' : 'h:mm a');
};

export const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

export const formatDateSeparator = (date: Date) => {
  const now = new Date();
  if (isSameDay(date, now)) return "TODAY";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "YESTERDAY";
  return format(date, 'MMMM d, yyyy');
};

// Avatar component with null/empty guard
export const Avatar = ({ person, size = 'md', className = '' }: { person?: Person | null; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
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
export const getWallpaperStyle = (appearance: AppearanceSettings) => {
  if (appearance.wallpaperUrl) {
    return {
      backgroundImage: `url(${appearance.wallpaperUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return {};
};
