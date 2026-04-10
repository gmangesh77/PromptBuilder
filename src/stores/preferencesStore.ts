import { create } from 'zustand';
import type { Platform } from '../types/platform';
import { DEFAULT_PLATFORM } from '../constants/platforms';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from './authStore';

const STORAGE_KEY = 'promptbuilder_preferences';
export const INSTRUCTION_SUFFIX_MAX_LENGTH = 500;

export type ClarificationMode = 'auto' | 'always' | 'never';

// Fixed set of domains surfaced in PreferencesSection. Matches the domains
// the system prompt (api/_lib/systemPrompt.ts) explicitly handles.
export const AVAILABLE_DOMAINS = [
  'Technical',
  'Business',
  'Creative',
  'Sales',
  'Customer Success',
  'HR',
  'Consulting',
  'Healthcare',
] as const;

const PLATFORMS: readonly Platform[] = [
  'chatgpt',
  'claude',
  'gemini',
  'grok',
  'perplexity',
];

const MODES: readonly ClarificationMode[] = ['auto', 'always', 'never'];

interface StoredPreferences {
  preferredPlatform: Platform;
  defaultInstructionSuffix: string;
  favoriteDomains: string[];
  clarificationMode: ClarificationMode;
}

const DEFAULTS: StoredPreferences = {
  preferredPlatform: DEFAULT_PLATFORM,
  defaultInstructionSuffix: '',
  favoriteDomains: [],
  clarificationMode: 'auto',
};

export interface PreferencesState extends StoredPreferences {
  setPreferredPlatform: (platform: Platform) => void;
  setDefaultInstructionSuffix: (suffix: string) => void;
  toggleFavoriteDomain: (domain: string) => void;
  setClarificationMode: (mode: ClarificationMode) => void;
  resetPreferences: () => void;
  // Cloud sync surface — no-ops when Supabase is not configured.
  loadFromCloud: (userId: string) => Promise<void>;
  uploadLocalToCloud: (userId: string) => Promise<void>;
  resetLocal: () => void;
}

function loadFromStorage(): StoredPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<StoredPreferences>;
    return {
      preferredPlatform:
        typeof parsed.preferredPlatform === 'string' &&
        PLATFORMS.includes(parsed.preferredPlatform as Platform)
          ? (parsed.preferredPlatform as Platform)
          : DEFAULTS.preferredPlatform,
      defaultInstructionSuffix:
        typeof parsed.defaultInstructionSuffix === 'string'
          ? parsed.defaultInstructionSuffix.slice(0, INSTRUCTION_SUFFIX_MAX_LENGTH)
          : DEFAULTS.defaultInstructionSuffix,
      favoriteDomains: Array.isArray(parsed.favoriteDomains)
        ? parsed.favoriteDomains.filter(
            (d): d is string => typeof d === 'string',
          )
        : DEFAULTS.favoriteDomains,
      clarificationMode:
        typeof parsed.clarificationMode === 'string' &&
        MODES.includes(parsed.clarificationMode as ClarificationMode)
          ? (parsed.clarificationMode as ClarificationMode)
          : DEFAULTS.clarificationMode,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveToStorage(prefs: StoredPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage full or unavailable — silently fail.
  }
}

async function writeToCloud(
  prefs: StoredPreferences,
  userId: string,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('preferences').upsert(
    {
      user_id: userId,
      preferred_platform: prefs.preferredPlatform,
      default_instruction_suffix: prefs.defaultInstructionSuffix,
      favorite_domains: prefs.favoriteDomains,
      clarification_mode: prefs.clarificationMode,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (error) {
    console.error('[preferencesStore] writeToCloud', error);
  }
}

export const usePreferencesStore = create<PreferencesState>((set, get) => {
  const persist = () => {
    const snapshot: StoredPreferences = {
      preferredPlatform: get().preferredPlatform,
      defaultInstructionSuffix: get().defaultInstructionSuffix,
      favoriteDomains: get().favoriteDomains,
      clarificationMode: get().clarificationMode,
    };
    saveToStorage(snapshot);
    // Write-through to cloud when a user is signed in. Fire-and-forget;
    // errors are logged but never break the local update.
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      void writeToCloud(snapshot, userId);
    }
  };

  return {
    ...loadFromStorage(),

    setPreferredPlatform: (platform) => {
      set({ preferredPlatform: platform });
      persist();
    },

    setDefaultInstructionSuffix: (suffix) => {
      const trimmed = suffix.slice(0, INSTRUCTION_SUFFIX_MAX_LENGTH);
      set({ defaultInstructionSuffix: trimmed });
      persist();
    },

    toggleFavoriteDomain: (domain) => {
      const current = get().favoriteDomains;
      const next = current.includes(domain)
        ? current.filter((d) => d !== domain)
        : [...current, domain];
      set({ favoriteDomains: next });
      persist();
    },

    setClarificationMode: (mode) => {
      set({ clarificationMode: mode });
      persist();
    },

    resetPreferences: () => {
      set({ ...DEFAULTS });
      persist();
    },

    loadFromCloud: async (userId: string) => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('preferences')
        .select(
          'preferred_platform, default_instruction_suffix, favorite_domains, clarification_mode',
        )
        .eq('user_id', userId)
        .maybeSingle();
      if (error) {
        console.error('[preferencesStore] loadFromCloud', error);
        return;
      }
      if (!data) return; // No cloud row yet — local stays as-is.
      const loaded: StoredPreferences = {
        preferredPlatform: PLATFORMS.includes(data.preferred_platform as Platform)
          ? (data.preferred_platform as Platform)
          : DEFAULTS.preferredPlatform,
        defaultInstructionSuffix:
          typeof data.default_instruction_suffix === 'string'
            ? data.default_instruction_suffix.slice(
                0,
                INSTRUCTION_SUFFIX_MAX_LENGTH,
              )
            : DEFAULTS.defaultInstructionSuffix,
        favoriteDomains: Array.isArray(data.favorite_domains)
          ? data.favorite_domains.filter(
              (d: unknown): d is string => typeof d === 'string',
            )
          : DEFAULTS.favoriteDomains,
        clarificationMode: MODES.includes(
          data.clarification_mode as ClarificationMode,
        )
          ? (data.clarification_mode as ClarificationMode)
          : DEFAULTS.clarificationMode,
      };
      set(loaded);
      saveToStorage(loaded);
    },

    uploadLocalToCloud: async (userId: string) => {
      if (!isSupabaseConfigured) return;
      const snapshot: StoredPreferences = {
        preferredPlatform: get().preferredPlatform,
        defaultInstructionSuffix: get().defaultInstructionSuffix,
        favoriteDomains: get().favoriteDomains,
        clarificationMode: get().clarificationMode,
      };
      await writeToCloud(snapshot, userId);
    },

    resetLocal: () => {
      // Explicitly does NOT call persist() — used on sign-out to clear the
      // browser without touching the cloud or writing a defaults row.
      saveToStorage(DEFAULTS);
      set({ ...DEFAULTS });
    },
  };
});
