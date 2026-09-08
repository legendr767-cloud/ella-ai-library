import { useState } from 'react';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import UserMenu from '@/components/navigation/UserMenu';
import NotificationsBell from '@/components/navigation/NotificationsBell';
import { useThemeStore } from '@/store/themeStore';

export default function AdminNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [query, setQuery] = useState('');
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center gap-4 px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent text-muted-foreground"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, members, categories..."
            className="w-full h-10 rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-accent text-muted-foreground"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <NotificationsBell />

      <UserMenu />
    </header>
  );
}
