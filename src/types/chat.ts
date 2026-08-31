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
  isVoiceNote?: boolean;
  voiceDuration?: string;
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
  statusText?: string;
  // Wallpaper
  wallpaperUrl?: string;
  transparentBackground: boolean;
  isTyping: boolean;
  // Typography
  fontSize?: 'xs' | 'sm' | 'base' | 'lg';
  fontFamily?: 'sans' | 'serif' | 'mono';
  // Chat style
  chatStyle?: 'mixed' | 'global' | 'indian';
}

export interface ChatState {
  platform: Platform;
  chatType: ChatType;
  people: Person[];
  messages: Message[];
  appearance: AppearanceSettings;
  aiModel?: string;
}
export type CallPlatform = 'whatsapp' | 'discord' | 'facetime' | 'zoom' | 'meet';
export type CallLayout = 'grid' | 'speaker' | 'sidebar';
export type CallQuality = 'auto' | 'hd' | 'low';

export interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
}

export interface CallState {
  platform: CallPlatform;
  participants: CallParticipant[];
  title: string;
  meetingCode: string;
  duration: string;
  layout: CallLayout;
  quality: CallQuality;
  showNames: boolean;
  showTimer: boolean;
  backgroundBlur: boolean;
  isScreenSharing: boolean;
  sharedMedia?: string;
  showCaptions: boolean;
  showChatPanel: boolean;
  showParticipantPanel: boolean;
  isSignalLow?: boolean;
  isRecording?: boolean;
}

export interface GroupCallStore {
  state: CallState;
  updatePlatform: (platform: CallPlatform) => void;
  updateDuration: (duration: string) => void;
  addParticipant: (participant: CallParticipant) => void;
  updateParticipant: (id: string, updates: Partial<CallParticipant>) => void;
  updateSettings: (updates: Partial<CallState>) => void;
  removeParticipant: (id: string) => void;
  resetCall: () => void;
}

export type DeviceView = 'desktop' | 'mobile';
