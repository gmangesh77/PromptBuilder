import OpenAI from 'openai';

export function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

export function getModel(tier: 'fast' | 'quality' | 'best'): string {
  const models = {
    fast: 'gpt-4.1-mini',
    quality: 'gpt-4.1',
    best: 'gpt-4o',
  };
  return models[tier];
}
