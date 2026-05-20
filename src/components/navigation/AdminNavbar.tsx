import { Bell, Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export default function AdminNavbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { profile, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center flex-1">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {profile?.full_name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
