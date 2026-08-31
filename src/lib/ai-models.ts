import { Platform } from '@/types/chat';

export type AIPlatform = Extract<Platform, 'chatgpt' | 'claude' | 'gemini' | 'grok'>;

export interface AIModelOption {
  id: string;
  label: string;
  description: string;
}

export const AI_PROVIDER_CONFIG: Record<AIPlatform, {
  label: string;
  defaultModel: string;
  models: AIModelOption[];
}> = {
  chatgpt: {
    label: 'ChatGPT',
    defaultModel: 'gpt-5.6-sol',
    models: [
      { id: 'gpt-5.6-sol', label: 'GPT-5.6 Sol', description: 'Highest capability' },
      { id: 'gpt-5.6-terra', label: 'GPT-5.6 Terra', description: 'Balanced' },
      { id: 'gpt-5.6-luna', label: 'GPT-5.6 Luna', description: 'Fast and efficient' },
    ],
  },
  claude: {
    label: 'Claude',
    defaultModel: 'claude-opus-5',
    models: [
      { id: 'claude-fable-5', label: 'Claude Fable 5', description: 'Long-running agents' },
      { id: 'claude-opus-5', label: 'Claude Opus 5', description: 'Complex work' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', description: 'Speed and intelligence' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', description: 'Fastest' },
    ],
  },
  gemini: {
    label: 'Gemini',
    defaultModel: 'gemini-3.6-flash',
    models: [
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', description: 'Latest stable' },
      { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', description: 'Agentic and multimodal' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', description: 'High throughput' },
      { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro', description: 'Advanced reasoning' },
    ],
  },
  grok: {
    label: 'Grok',
    defaultModel: 'grok-4.6',
    models: [
      { id: 'grok-4.6', label: 'Grok 4.6', description: 'Frontier model' },
      { id: 'grok-420-reasoning', label: 'Grok 4.20 Reasoning', description: 'Deep reasoning' },
      { id: 'grok-4.3', label: 'Grok 4.3', description: 'Stable and fast' },
    ],
  },
};

export function isAIPlatform(platform: Platform): platform is AIPlatform {
  return platform === 'chatgpt' || platform === 'claude' || platform === 'gemini' || platform === 'grok';
}

export function getAIModelDisplayName(platform: AIPlatform, model?: string): string {
  const config = AI_PROVIDER_CONFIG[platform];
  return config.models.find(option => option.id === model)?.label || model?.trim() || config.label;
}
