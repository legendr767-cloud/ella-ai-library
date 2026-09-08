import { Moon, Sun, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/store/themeStore';
import UserMenu from '@/components/navigation/UserMenu';
import NotificationsBell from '@/components/navigation/NotificationsBell';

export default function DashboardNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent text-muted-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <NotificationsBell />

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
