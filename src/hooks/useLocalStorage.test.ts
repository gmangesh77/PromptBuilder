import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('get returns null when key does not exist', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>('missing-key'),
    );
    expect(result.current.get()).toBeNull();
  });

  it('set and get round-trips data', () => {
    const { result } = renderHook(() =>
      useLocalStorage<{ name: string }>('test-key'),
    );
    result.current.set({ name: 'Alice' });
    expect(result.current.get()).toEqual({ name: 'Alice' });
  });

  it('clear removes the key', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>('test-key'),
    );
    result.current.set('hello');
    result.current.clear();
    expect(result.current.get()).toBeNull();
  });

  it('get returns null for corrupted JSON', () => {
    localStorage.setItem('bad-key', '{invalid json');
    const { result } = renderHook(() =>
      useLocalStorage<unknown>('bad-key'),
    );
    expect(result.current.get()).toBeNull();
  });
});
