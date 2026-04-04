import { create } from 'zustand';
import type { Platform } from '../types/platform';
import { DEFAULT_PLATFORM } from '../constants/platforms';

interface PromptState {
  userInput: string;
  selectedPlatform: Platform;
  setUserInput: (input: string) => void;
  setPlatform: (platform: Platform) => void;
  clearInput: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  userInput: '',
  selectedPlatform: DEFAULT_PLATFORM,
  setUserInput: (input) => set({ userInput: input }),
  setPlatform: (platform) => set({ selectedPlatform: platform }),
  clearInput: () => set({ userInput: '' }),
}));

// Selector hooks for selective re-renders
export const useUserInput = () => usePromptStore((s) => s.userInput);
export const useSelectedPlatform = () => usePromptStore((s) => s.selectedPlatform);
