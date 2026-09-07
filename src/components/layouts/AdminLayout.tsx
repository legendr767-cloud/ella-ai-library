import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminSidebar from '@/components/navigation/AdminSidebar';

export default function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminNavbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
