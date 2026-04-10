import { create } from 'zustand';
import type { Platform } from '../types/platform';
import { usePreferencesStore } from './preferencesStore';

interface PromptState {
  userInput: string;
  selectedPlatform: Platform;
  setUserInput: (input: string) => void;
  setPlatform: (platform: Platform) => void;
  clearInput: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  userInput: '',
  // Hydrate from persisted preferences so platform choice survives reloads.
  selectedPlatform: usePreferencesStore.getState().preferredPlatform,
  setUserInput: (input) => set({ userInput: input }),
  setPlatform: (platform) => {
    set({ selectedPlatform: platform });
    // Keep preferences in sync so the next session remembers this platform.
    usePreferencesStore.getState().setPreferredPlatform(platform);
  },
  clearInput: () => set({ userInput: '' }),
}));

// Selector hooks for selective re-renders
export const useUserInput = () => usePromptStore((s) => s.userInput);
export const useSelectedPlatform = () => usePromptStore((s) => s.selectedPlatform);
