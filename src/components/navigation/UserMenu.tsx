import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  /** Use the dark admin styling instead of the light dashboard styling */
  variant?: 'light' | 'dark';
}

export default function UserMenu({ variant = 'light' }: UserMenuProps) {
  const { profile, user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = profile?.full_name || 'User';
  const role = user?.role || 'student';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg transition-colors',
          isDark ? 'hover:bg-slate-100' : 'hover:bg-accent'
        )}
      >
        <div
          className={cn(
            'h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0',
            isDark ? 'bg-slate-200' : 'bg-primary/10'
          )}
        >
          <span className={cn('text-sm font-semibold', isDark ? 'text-slate-600' : 'text-primary')}>
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left leading-tight">
          <p className={cn('text-sm font-semibold', isDark ? 'text-slate-800' : 'text-foreground')}>
            {displayName}
          </p>
          <p className={cn('text-xs capitalize', isDark ? 'text-slate-400' : 'text-muted-foreground')}>
            {role}
          </p>
        </div>
        <ChevronDown
          className={cn(
            'hidden sm:block w-4 h-4 transition-transform',
            isDark ? 'text-slate-400' : 'text-muted-foreground',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-52 rounded-lg border shadow-lg py-1.5 z-50',
            isDark ? 'bg-white border-slate-200' : 'bg-popover border-border'
          )}
        >
          <div className={cn('px-3 py-2 border-b', isDark ? 'border-slate-100' : 'border-border')}>
            <p className={cn('text-sm font-medium truncate', isDark ? 'text-slate-800' : 'text-foreground')}>
              {displayName}
            </p>
            <p className={cn('text-xs truncate', isDark ? 'text-slate-400' : 'text-muted-foreground')}>
              {user?.email}
            </p>
          </div>
          <Link
            to={ROUTES.PROFILE}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
              isDark ? 'text-slate-600 hover:bg-slate-50' : 'text-foreground hover:bg-accent'
            )}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-2 w-full text-left px-3 py-2 text-sm transition-colors',
              isDark ? 'text-red-600 hover:bg-red-50' : 'text-destructive hover:bg-accent'
            )}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
