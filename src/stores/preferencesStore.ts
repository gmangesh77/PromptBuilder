import { create } from 'zustand';
import type { Platform } from '../types/platform';
import { DEFAULT_PLATFORM } from '../constants/platforms';

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

export const usePreferencesStore = create<PreferencesState>((set, get) => {
  const persist = () => {
    const {
      preferredPlatform,
      defaultInstructionSuffix,
      favoriteDomains,
      clarificationMode,
    } = get();
    saveToStorage({
      preferredPlatform,
      defaultInstructionSuffix,
      favoriteDomains,
      clarificationMode,
    });
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
  };
});
