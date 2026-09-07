import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '@/components/navigation/DashboardNavbar';
import DashboardSidebar from '@/components/navigation/DashboardSidebar';

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar onMenuClick={() => setMobileNavOpen(true)} />
      <div className="flex">
        <DashboardSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
