import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  isNotificationPanelOpen: boolean;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  toggleNotificationPanel: () => void;
  closeSidebar: () => void;
  closeSearch: () => void;
  closeNotificationPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  isNotificationPanelOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleNotificationPanel: () =>
    set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen })),

  closeSidebar: () => set({ isSidebarOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  closeNotificationPanel: () => set({ isNotificationPanelOpen: false }),
}));
