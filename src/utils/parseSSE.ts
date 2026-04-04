import type { AppError } from '../types/error';

export interface SSEChunk {
  type: 'content' | 'done' | 'error';
  content?: string;
  error?: AppError;
}

export function parseSSE(line: string): SSEChunk | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data: ')) return null;

  const data = trimmed.slice(6);

  if (data === '[DONE]') {
    return { type: 'done' };
  }

  try {
    const parsed = JSON.parse(data) as
      | { content?: string }
      | { error: { code: string; message: string } };

    if ('error' in parsed) {
      return {
        type: 'error',
        error: {
          code: parsed.error.code as AppError['code'],
          message: parsed.error.message,
        },
      };
    }

    if ('content' in parsed && parsed.content) {
      return { type: 'content', content: parsed.content };
    }

    return null;
  } catch {
    return null;
  }
}
