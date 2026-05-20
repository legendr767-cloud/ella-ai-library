import { Outlet } from 'react-router-dom';
import DashboardNavbar from '@/components/navigation/DashboardNavbar';
import DashboardSidebar from '@/components/navigation/DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
