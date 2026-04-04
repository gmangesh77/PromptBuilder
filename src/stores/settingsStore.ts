import { create } from 'zustand';

const STORAGE_KEY = 'promptbuilder_api_key';

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
  } catch {
    // Storage unavailable
  }
}

interface SettingsState {
  apiKey: string;
  showSettings: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: loadKey(),
  showSettings: false,
  setApiKey: (key) => {
    saveKey(key);
    set({ apiKey: key });
  },
  clearApiKey: () => {
    saveKey('');
    set({ apiKey: '' });
  },
  openSettings: () => set({ showSettings: true }),
  closeSettings: () => set({ showSettings: false }),
}));
