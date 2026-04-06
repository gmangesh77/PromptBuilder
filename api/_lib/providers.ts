import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type Provider = 'openai' | 'anthropic' | 'google';
export type ModelTier = 'fast' | 'quality' | 'best';

const MODEL_MAP: Record<Provider, Record<ModelTier, string>> = {
  openai: {
    fast: 'gpt-4.1-mini',
    quality: 'gpt-4.1',
    best: 'gpt-4o',
  },
  anthropic: {
    fast: 'claude-haiku-4-5-20251001',
    quality: 'claude-sonnet-4-6-20250514',
    best: 'claude-opus-4-6-20250514',
  },
  google: {
    fast: 'gemini-2.0-flash-lite',
    quality: 'gemini-2.5-flash',
    best: 'gemini-2.5-pro',
  },
};

export function getModel(provider: Provider, tier: ModelTier): string {
  return MODEL_MAP[provider][tier];
}

export interface StreamResult {
  readable: ReadableStream<Uint8Array>;
}

export async function streamGeneration(opts: {
  provider: Provider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  signal: AbortSignal;
}): Promise<StreamResult> {
  const encoder = new TextEncoder();

  switch (opts.provider) {
    case 'openai':
      return streamOpenAI(opts, encoder);
    case 'anthropic':
      return streamAnthropic(opts, encoder);
    case 'google':
      return streamGoogle(opts, encoder);
  }
}

async function streamOpenAI(
  opts: { apiKey: string; model: string; systemPrompt: string; userMessage: string; signal: AbortSignal },
  encoder: TextEncoder,
): Promise<StreamResult> {
  const client = new OpenAI({ apiKey: opts.apiKey });
  const stream = await client.chat.completions.create(
    {
      model: opts.model,
      stream: true,
      messages: [
        { role: 'system', content: opts.systemPrompt },
        { role: 'user', content: opts.userMessage },
      ],
    },
    { signal: opts.signal },
  );

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const message = err instanceof Error && err.name === 'AbortError' ? 'Request timed out.' : 'Stream interrupted.';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: { code: 'API_ERROR', message } })}\n\n`));
        controller.close();
      }
    },
  });

  return { readable };
}

async function streamAnthropic(
  opts: { apiKey: string; model: string; systemPrompt: string; userMessage: string; signal: AbortSignal },
  encoder: TextEncoder,
): Promise<StreamResult> {
  const client = new Anthropic({ apiKey: opts.apiKey });
  const stream = client.messages.stream(
    {
      model: opts.model,
      max_tokens: 4096,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: opts.userMessage }],
    },
    { signal: opts.signal },
  );

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const message = err instanceof Error && err.name === 'AbortError' ? 'Request timed out.' : 'Stream interrupted.';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: { code: 'API_ERROR', message } })}\n\n`));
        controller.close();
      }
    },
  });

  return { readable };
}

async function streamGoogle(
  opts: { apiKey: string; model: string; systemPrompt: string; userMessage: string },
  encoder: TextEncoder,
): Promise<StreamResult> {
  const client = new GoogleGenerativeAI(opts.apiKey);
  const model = client.getGenerativeModel({
    model: opts.model,
    systemInstruction: opts.systemPrompt,
  });

  const response = await model.generateContentStream([opts.userMessage]);

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const message = err instanceof Error && err.name === 'AbortError' ? 'Request timed out.' : 'Stream interrupted.';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: { code: 'API_ERROR', message } })}\n\n`));
        controller.close();
      }
    },
  });

  return { readable };
}
