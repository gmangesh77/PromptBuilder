import OpenAI from 'openai';

export function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
