import { useCallback } from 'react';

export function useLocalStorage<T>(key: string) {
  const get = useCallback((): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage full or unavailable — silently fail
      }
    },
    [key],
  );

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }, [key]);

  return { get, set, clear };
}
