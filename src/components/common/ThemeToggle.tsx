import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </Button>
  );
}
