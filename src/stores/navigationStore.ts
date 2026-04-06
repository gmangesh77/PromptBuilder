import { create } from 'zustand';

export type Page = 'generate' | 'templates' | 'library';

interface NavigationState {
  currentPage: Page;
  sidebarOpen: boolean;
  navigate: (page: Page) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'generate',
  sidebarOpen: false,
  navigate: (page) => set({ currentPage: page, sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
