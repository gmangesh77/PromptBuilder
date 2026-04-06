import { create } from 'zustand';

const STORAGE_KEY = 'promptbuilder_history';
const MAX_ENTRIES = 100;

export interface HistoryEntry {
  id: string;
  userInput: string;
  generatedPrompt: string;
  platform: string;
  createdAt: number;
  favorite: boolean;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'createdAt' | 'favorite'>) => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAll: () => void;
}

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveToStorage(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export const useHistoryStore = create<HistoryState>((set) => ({
  entries: loadFromStorage(),

  addEntry: (entry) =>
    set((state) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        favorite: false,
      };

      let entries = [newEntry, ...state.entries];

      // Enforce max 100 entries: drop oldest non-favorite when over the limit
      if (entries.length > MAX_ENTRIES) {
        const oldestNonFavoriteIndex = entries
          .map((e, i) => ({ e, i }))
          .reverse()
          .find(({ e }) => !e.favorite)?.i;

        if (oldestNonFavoriteIndex !== undefined) {
          entries = entries.filter((_, i) => i !== oldestNonFavoriteIndex);
        } else {
          // All are favorites — drop the oldest entry regardless
          entries = entries.slice(0, MAX_ENTRIES);
        }
      }

      saveToStorage(entries);
      return { entries };
    }),

  removeEntry: (id) =>
    set((state) => {
      const entries = state.entries.filter((e) => e.id !== id);
      saveToStorage(entries);
      return { entries };
    }),

  toggleFavorite: (id) =>
    set((state) => {
      const entries = state.entries.map((e) =>
        e.id === id ? { ...e, favorite: !e.favorite } : e,
      );
      saveToStorage(entries);
      return { entries };
    }),

  clearAll: () => {
    saveToStorage([]);
    return set({ entries: [] });
  },
}));
