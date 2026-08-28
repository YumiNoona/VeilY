import { Platform } from '@/types/chat';

export const DESKTOP_CHAT_PLATFORMS: Platform[] = [
  'whatsapp',
  'telegram',
];

export const supportsDesktopChatPreview = (platform: Platform) =>
  DESKTOP_CHAT_PLATFORMS.includes(platform);
