import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  const writeTextMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.useFakeTimers();
    writeTextMock.mockClear().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('isCopied is initially false', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.isCopied).toBe(false);
  });

  it('sets isCopied to true after copy', async () => {
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current.copy('hello');
    });
    expect(result.current.isCopied).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('hello');
  });

  it('resets isCopied after 2 seconds', async () => {
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current.copy('hello');
    });
    expect(result.current.isCopied).toBe(true);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.isCopied).toBe(false);
  });

  it('uses fallback when clipboard API unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current.copy('fallback text');
    });
    expect(result.current.isCopied).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('uses fallback when clipboard API throws', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('denied'));
    document.execCommand = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current.copy('retry text');
    });
    expect(result.current.isCopied).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
