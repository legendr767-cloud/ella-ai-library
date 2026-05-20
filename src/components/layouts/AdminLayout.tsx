import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminSidebar from '@/components/navigation/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
