import { z } from 'zod';

export const generateRequestSchema = z.object({
  userInput: z.string().min(10).max(1000),
  platform: z.enum(['chatgpt', 'claude', 'gemini', 'grok', 'perplexity']),
  apiKey: z.string().min(1, 'API key is required'),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
