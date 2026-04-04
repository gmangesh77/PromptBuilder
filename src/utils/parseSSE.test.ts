import { describe, it, expect } from 'vitest';
import { parseSSE } from './parseSSE';

describe('parseSSE', () => {
  it('parses content chunk', () => {
    const result = parseSSE('data: {"content":"Hello"}');
    expect(result).toEqual({ type: 'content', content: 'Hello' });
  });

  it('parses [DONE] sentinel', () => {
    const result = parseSSE('data: [DONE]');
    expect(result).toEqual({ type: 'done' });
  });

  it('parses error chunk', () => {
    const result = parseSSE(
      'data: {"error":{"code":"API_ERROR","message":"Something failed"}}',
    );
    expect(result).toEqual({
      type: 'error',
      error: { code: 'API_ERROR', message: 'Something failed' },
    });
  });

  it('returns null for empty lines', () => {
    expect(parseSSE('')).toBeNull();
    expect(parseSSE('  ')).toBeNull();
  });

  it('returns null for non-data lines', () => {
    expect(parseSSE('event: message')).toBeNull();
    expect(parseSSE('id: 123')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    expect(parseSSE('data: {invalid')).toBeNull();
  });

  it('returns null for content chunk with empty content', () => {
    expect(parseSSE('data: {"content":""}')).toBeNull();
    expect(parseSSE('data: {}')).toBeNull();
  });

  it('handles whitespace around data line', () => {
    const result = parseSSE('  data: {"content":"test"}  ');
    expect(result).toEqual({ type: 'content', content: 'test' });
  });
});
