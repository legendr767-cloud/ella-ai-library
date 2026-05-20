import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Heart, 
  History, 
  User, 
  LogOut,
  BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.DASHBOARD },
  { icon: BookMarked, label: 'My Books', href: ROUTES.MY_BOOKS },
  { icon: Heart, label: 'Favorites', href: ROUTES.FAVORITES },
  { icon: History, label: 'History', href: ROUTES.HISTORY },
  { icon: User, label: 'Profile', href: ROUTES.PROFILE },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-background min-h-[calc(100vh-4rem)]">
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t">
        <button
          onClick={() => logout()}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
