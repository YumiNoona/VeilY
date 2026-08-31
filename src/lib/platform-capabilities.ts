import { Platform } from '@/types/chat';

export const DESKTOP_CHAT_PLATFORMS: Platform[] = [
  'whatsapp',
  'telegram',
  'discord',
];

export const supportsDesktopChatPreview = (platform: Platform) =>
  DESKTOP_CHAT_PLATFORMS.includes(platform);
