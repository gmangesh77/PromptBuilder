import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'promptbuilder_theme';

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage unavailable
  }
  return 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable
  }
}

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

const initialTheme = loadTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((s) => {
      const next: Theme = s.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return { theme: next };
    }),
}));
