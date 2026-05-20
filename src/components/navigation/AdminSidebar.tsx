import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BookMarked, 
  BarChart3, 
  FolderTree,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.ADMIN },
  { icon: BookOpen, label: 'Books', href: ROUTES.ADMIN_BOOKS },
  { icon: Users, label: 'Users', href: ROUTES.ADMIN_USERS },
  { icon: BookMarked, label: 'Borrows', href: ROUTES.ADMIN_BORROWS },
  { icon: BarChart3, label: 'Analytics', href: ROUTES.ADMIN_ANALYTICS },
  { icon: FolderTree, label: 'Categories', href: ROUTES.ADMIN_CATEGORIES },
];

export default function AdminSidebar() {
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
