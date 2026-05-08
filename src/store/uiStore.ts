import { create } from 'zustand';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  search: string;
  setSearch: (value: string) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  darkMode: false,
  sidebarOpen: true,
  search: '',
  setSearch: (value) => set({ search: value }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
