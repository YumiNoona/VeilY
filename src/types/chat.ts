export type Platform =
  | 'whatsapp'
  | 'discord'
  | 'imessage'
  | 'instagram'
  | 'telegram'
  | 'messenger'
  | 'tiktok'
  | 'slack'
  | 'reddit'
  | 'snapchat'
  | 'line'
  | 'teams'
  | 'signal'
  | 'tinder'
  | 'wechat'
  | 'x'
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'grok';

export type ChatType = 'direct' | 'group';

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  isOwn: boolean;
  image?: string;
}

export interface AppearanceSettings {
  darkMode: boolean;
  showTimestamps: boolean;
  showStatus: boolean;
  use24HourFormat: boolean;
  // Mobile device options
  showDeviceStatusBar: boolean;
  showDeviceFrame: boolean;
  statusBarTime: string;
  batteryLevel: number;
  // Wallpaper
  wallpaperUrl?: string;
  transparentBackground: boolean;
}

export interface ChatState {
  platform: Platform;
  chatType: ChatType;
  people: Person[];
  messages: Message[];
  appearance: AppearanceSettings;
  aiModel?: string;
}

export type DeviceView = 'desktop' | 'mobile';
