import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_STORAGE_KEY } from '@/config/constants';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
    }),
    {
      name: THEME_STORAGE_KEY,
    }
  )
);

function applyTheme(theme: Theme) {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      applyTheme(state.theme);
    } catch (e) {
      applyTheme('system');
    }
  } else {
    applyTheme('dark');
  }
}
