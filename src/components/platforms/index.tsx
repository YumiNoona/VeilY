// Barrel re-export for all platform chat components
// Each platform lives in its own file for maintainability

export type { PlatformChatProps } from './shared';

export { WhatsAppChat } from './WhatsAppChat';
export { IMessageChat } from './IMessageChat';
export { DiscordChat } from './DiscordChat';
export { InstagramChat } from './InstagramChat';
export { TelegramChat } from './TelegramChat';
export { MessengerChat } from './MessengerChat';
export { SlackChat } from './SlackChat';
export { TikTokChat } from './TikTokChat';
export { SnapchatChat } from './SnapchatChat';
export { RedditChat } from './RedditChat';
export { LineChat } from './LineChat';
export { TeamsChat } from './TeamsChat';
export { SignalChat } from './SignalChat';
export { TinderChat } from './TinderChat';
export { WeChatChat } from './WeChatChat';
export { XChat } from './XChat';

export { ChatGPTChat } from './ChatGPTChat';
export { ClaudeChat } from './ClaudeChat';
export { GeminiChat } from './GeminiChat';
export { GrokChat } from './GrokChat';

// Component map — replaces the switch statement in ChatPreview.tsx
import React from 'react';
import type { PlatformChatProps as PCProps } from './shared';
import { Platform } from '@/types/chat';
import { WhatsAppChat } from './WhatsAppChat';
import { IMessageChat } from './IMessageChat';
import { DiscordChat } from './DiscordChat';
import { InstagramChat } from './InstagramChat';
import { TelegramChat } from './TelegramChat';
import { MessengerChat } from './MessengerChat';
import { SlackChat } from './SlackChat';
import { TikTokChat } from './TikTokChat';
import { SnapchatChat } from './SnapchatChat';
import { RedditChat } from './RedditChat';
import { LineChat } from './LineChat';
import { TeamsChat } from './TeamsChat';
import { SignalChat } from './SignalChat';
import { TinderChat } from './TinderChat';
import { WeChatChat } from './WeChatChat';
import { XChat } from './XChat';
import { ChatGPTChat } from './ChatGPTChat';
import { ClaudeChat } from './ClaudeChat';
import { GeminiChat } from './GeminiChat';
import { GrokChat } from './GrokChat';

export const PLATFORM_CHAT_MAP: Record<Platform, React.ComponentType<PCProps>> = {
  whatsapp: WhatsAppChat,
  imessage: IMessageChat,
  discord: DiscordChat,
  instagram: InstagramChat,
  telegram: TelegramChat,
  messenger: MessengerChat,
  slack: SlackChat,
  tiktok: TikTokChat,
  snapchat: SnapchatChat,
  reddit: RedditChat,
  line: LineChat,
  teams: TeamsChat,
  signal: SignalChat,
  tinder: TinderChat,
  wechat: WeChatChat,
  x: XChat,
  chatgpt: ChatGPTChat as React.ComponentType<PCProps>,
  claude: ClaudeChat as React.ComponentType<PCProps>,
  gemini: GeminiChat as React.ComponentType<PCProps>,
  grok: GrokChat as React.ComponentType<PCProps>,
};
