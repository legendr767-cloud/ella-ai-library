import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';

export default function UserMenu() {
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg transition-colors hover:bg-accent"
      >
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left leading-tight">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p className="text-xs capitalize text-muted-foreground">{role}</p>
        </div>
        <ChevronDown
          className={`hidden sm:block w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-popover shadow-lg py-1.5 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium truncate text-foreground">{displayName}</p>
            <p className="text-xs truncate text-muted-foreground">{user?.email}</p>
          </div>
          <Link
            to={ROUTES.PROFILE}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors text-foreground hover:bg-accent"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          {(role === 'admin' || role === 'librarian') && (
            <Link
              to={ROUTES.ADMIN}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm transition-colors text-foreground hover:bg-accent"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm transition-colors text-destructive hover:bg-accent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
