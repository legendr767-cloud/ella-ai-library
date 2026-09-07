import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AdminNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { profile, user } = useAuthStore();
  const [query, setQuery] = useState('');

  const displayName = profile?.full_name || 'Admin User';
  const role = user?.role || 'Administrator';

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, members, categories..."
            className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
          3
        </span>
      </button>

      <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100">
        <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
          <span className="text-sm font-semibold text-slate-600">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left leading-tight">
          <p className="text-sm font-semibold text-slate-800">{displayName}</p>
          <p className="text-xs text-slate-400 capitalize">{role}</p>
        </div>
        <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
      </button>
    </header>
  );
}
