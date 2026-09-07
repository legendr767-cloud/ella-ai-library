import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  ArrowLeftRight,
  CalendarClock,
  Heart,
  Star,
  BarChart3,
  Settings,
  UserCog,
  Cloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [{ icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.ADMIN }],
  },
  {
    title: 'Manage',
    items: [
      { icon: BookOpen, label: 'Books', href: ROUTES.ADMIN_BOOKS },
      { icon: FolderTree, label: 'Categories', href: ROUTES.ADMIN_CATEGORIES },
      { icon: Users, label: 'Members', href: ROUTES.ADMIN_USERS },
      { icon: ArrowLeftRight, label: 'Borrow/Return', href: ROUTES.ADMIN_BORROWS },
      { icon: CalendarClock, label: 'Reservations', href: ROUTES.ADMIN_BORROWS },
    ],
  },
  {
    title: 'Recommendation',
    items: [
      { icon: Heart, label: 'Recommended Books', href: ROUTES.BOOKS },
      { icon: Star, label: 'Popular Books', href: ROUTES.BOOKS },
    ],
  },
  {
    title: 'Reports',
    items: [{ icon: BarChart3, label: 'Reports & Analytics', href: ROUTES.ADMIN_ANALYTICS }],
  },
  {
    title: 'System',
    items: [
      { icon: Settings, label: 'Settings', href: ROUTES.ADMIN_SETTINGS },
      { icon: UserCog, label: 'Users', href: ROUTES.ADMIN_USERS },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#0b1324] min-h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Cloud className="w-5 h-5 text-blue-400" />
        </div>
        <div className="leading-tight">
          <p className="text-white font-bold text-base -mb-0.5">CloudLib</p>
          <p className="text-[10px] tracking-wide text-slate-400">CLOUD LIBRARY SYSTEM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Storage / plan card */}
      <div className="p-4">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">Premium Plan</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">Cloud Storage: 2.4 GB / 10 GB</p>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
