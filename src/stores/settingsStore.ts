import { create } from 'zustand';

const STORAGE_KEY = 'promptbuilder_api_key';
const TIER_STORAGE_KEY = 'promptbuilder_model_tier';
const PROVIDER_STORAGE_KEY = 'promptbuilder_provider';

export type ModelTier = 'fast' | 'quality' | 'best';
export type Provider = 'openai' | 'anthropic' | 'google';

function loadString(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function loadKey(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? atob(stored) : '';
  } catch {
    return '';
  }
}

function saveKey(key: string) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY, btoa(key));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

function loadModelTier(): ModelTier {
  const v = loadString(TIER_STORAGE_KEY, 'fast');
  return v === 'fast' || v === 'quality' || v === 'best' ? v : 'fast';
}

function loadProvider(): Provider {
  const v = loadString(PROVIDER_STORAGE_KEY, 'openai');
  return v === 'openai' || v === 'anthropic' || v === 'google' ? v : 'openai';
}

interface SettingsState {
  apiKey: string;
  modelTier: ModelTier;
  provider: Provider;
  showSettings: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  setModelTier: (tier: ModelTier) => void;
  setProvider: (provider: Provider) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: loadKey(),
  modelTier: loadModelTier(),
  provider: loadProvider(),
  showSettings: false,
  setApiKey: (key) => {
    saveKey(key);
    set({ apiKey: key });
  },
  clearApiKey: () => {
    saveKey('');
    set({ apiKey: '' });
  },
  setModelTier: (tier) => {
    try { localStorage.setItem(TIER_STORAGE_KEY, tier); } catch {}
    set({ modelTier: tier });
  },
  setProvider: (provider) => {
    try { localStorage.setItem(PROVIDER_STORAGE_KEY, provider); } catch {}
    set({ provider });
  },
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
}));
