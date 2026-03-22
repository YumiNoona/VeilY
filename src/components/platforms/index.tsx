// Barrel re-export for all platform chat components
// Each platform lives in its own file for maintainability

export type { PlatformChatProps } from './shared';

export { WhatsAppChat } from './whatsapp';
export { IMessageChat } from './imessage';
export { DiscordChat } from './discord';
export { InstagramChat } from './instagram';
export { TelegramChat } from './telegram';
export { MessengerChat } from './messenger';
export { SlackChat } from './slack';
export { TikTokChat } from './tiktok';
export { SnapchatChat } from './snapchat';
export { RedditChat } from './reddit';
export { LineChat } from './line';
export { TeamsChat } from './teams';
export { SignalChat } from './signal';
export { TinderChat } from './tinder';
export { WeChatChat } from './wechat';
export { XChat } from './x';

export { ChatGPTChat } from './ChatGPTChat';
export { ClaudeChat } from './ClaudeChat';
export { GeminiChat } from './GeminiChat';
export { GrokChat } from './GrokChat';

// Component map — replaces the switch statement in ChatPreview.tsx
import React from 'react';
import type { PlatformChatProps as PCProps } from './shared';
import { Platform } from '@/types/chat';
import { WhatsAppChat } from './whatsapp';
import { IMessageChat } from './imessage';
import { DiscordChat } from './discord';
import { InstagramChat } from './instagram';
import { TelegramChat } from './telegram';
import { MessengerChat } from './messenger';
import { SlackChat } from './slack';
import { TikTokChat } from './tiktok';
import { SnapchatChat } from './snapchat';
import { RedditChat } from './reddit';
import { LineChat } from './line';
import { TeamsChat } from './teams';
import { SignalChat } from './signal';
import { TinderChat } from './tinder';
import { WeChatChat } from './wechat';
import { XChat } from './x';
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
