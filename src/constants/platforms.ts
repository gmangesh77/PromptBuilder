import type { Platform } from '../types/platform';

export const PLATFORMS: readonly { label: string; value: Platform }[] = [
  { label: 'ChatGPT', value: 'chatgpt' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Grok', value: 'grok' },
  { label: 'Perplexity', value: 'perplexity' },
] as const;

export const DEFAULT_PLATFORM: Platform = 'chatgpt';
