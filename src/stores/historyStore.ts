import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from './authStore';

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
  // Cloud sync surface — no-ops when Supabase is not configured.
  loadFromCloud: (userId: string) => Promise<void>;
  uploadLocalToCloud: (userId: string) => Promise<void>;
  resetLocal: () => void;
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

function getSignedInUserId(): string | null {
  if (!isSupabaseConfigured) return null;
  return useAuthStore.getState().user?.id ?? null;
}

function entryToRow(entry: HistoryEntry, userId: string) {
  return {
    id: entry.id,
    user_id: userId,
    user_input: entry.userInput,
    generated_prompt: entry.generatedPrompt,
    platform: entry.platform,
    favorite: entry.favorite,
    created_at: new Date(entry.createdAt).toISOString(),
  };
}

function rowToEntry(row: {
  id: string;
  user_input: string;
  generated_prompt: string;
  platform: string;
  favorite: boolean;
  created_at: string;
}): HistoryEntry {
  return {
    id: row.id,
    userInput: row.user_input,
    generatedPrompt: row.generated_prompt,
    platform: row.platform,
    favorite: Boolean(row.favorite),
    createdAt: new Date(row.created_at).getTime(),
  };
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: loadFromStorage(),

  addEntry: (entry) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      favorite: false,
    };

    set((state) => {
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
    });

    const userId = getSignedInUserId();
    if (userId) {
      void (async () => {
        const { error } = await supabase
          .from('history')
          .insert(entryToRow(newEntry, userId));
        if (error) console.error('[historyStore] addEntry', error);
      })();
    }
  },

  removeEntry: (id) => {
    set((state) => {
      const entries = state.entries.filter((e) => e.id !== id);
      saveToStorage(entries);
      return { entries };
    });

    const userId = getSignedInUserId();
    if (userId) {
      void (async () => {
        const { error } = await supabase
          .from('history')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (error) console.error('[historyStore] removeEntry', error);
      })();
    }
  },

  toggleFavorite: (id) => {
    let nextFavorite = false;
    set((state) => {
      const entries = state.entries.map((e) => {
        if (e.id === id) {
          nextFavorite = !e.favorite;
          return { ...e, favorite: nextFavorite };
        }
        return e;
      });
      saveToStorage(entries);
      return { entries };
    });

    const userId = getSignedInUserId();
    if (userId) {
      void (async () => {
        const { error } = await supabase
          .from('history')
          .update({ favorite: nextFavorite })
          .eq('id', id)
          .eq('user_id', userId);
        if (error) console.error('[historyStore] toggleFavorite', error);
      })();
    }
  },

  clearAll: () => {
    saveToStorage([]);
    set({ entries: [] });

    const userId = getSignedInUserId();
    if (userId) {
      void (async () => {
        const { error } = await supabase
          .from('history')
          .delete()
          .eq('user_id', userId);
        if (error) console.error('[historyStore] clearAll', error);
      })();
    }
  },

  loadFromCloud: async (userId: string) => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('history')
      .select('id, user_input, generated_prompt, platform, favorite, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_ENTRIES);
    if (error) {
      console.error('[historyStore] loadFromCloud', error);
      return;
    }
    const entries = (data ?? []).map(rowToEntry);
    saveToStorage(entries);
    set({ entries });
  },

  uploadLocalToCloud: async (userId: string) => {
    if (!isSupabaseConfigured) return;
    const entries = get().entries;
    if (entries.length === 0) return;
    const rows = entries.map((e) => entryToRow(e, userId));
    // upsert on id — preserves local IDs and is idempotent if we retry.
    const { error } = await supabase
      .from('history')
      .upsert(rows, { onConflict: 'id' });
    if (error) console.error('[historyStore] uploadLocalToCloud', error);
  },

  resetLocal: () => {
    saveToStorage([]);
    set({ entries: [] });
  },
}));
