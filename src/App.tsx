import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import AuthLayout from '@/components/layouts/AuthLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Public Pages
import HomePage from '@/pages/HomePage';
import BooksPage from '@/pages/BooksPage';
import BookDetailsPage from '@/pages/BookDetailsPage';

// Protected Pages
import MyBooksPage from '@/pages/dashboard/MyBooksPage';
import FavoritesPage from '@/pages/dashboard/FavoritesPage';
import HistoryPage from '@/pages/dashboard/HistoryPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import ReaderPage from '@/pages/ReaderPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBooks from '@/pages/admin/AdminBooks';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminBorrows from '@/pages/admin/AdminBorrows';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminSettings from '@/pages/admin/AdminSettings';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingScreen from '@/components/common/LoadingScreen';

function App() {
  const { checkAuth, isInitializing } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.BOOKS} element={<BooksPage />} />
          <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailsPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected User Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.MY_BOOKS} element={<MyBooksPage />} />
          <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
          <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        {/* Reader Route */}
        <Route
          path={ROUTES.READER}
          element={
            <ProtectedRoute>
              <ReaderPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes — also serves as the main dashboard now */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'librarian']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.ADMIN} replace />} />
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_BOOKS} element={<AdminBooks />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
          <Route path={ROUTES.ADMIN_BORROWS} element={<AdminBorrows />} />
          <Route path={ROUTES.ADMIN_ANALYTICS} element={<AdminAnalytics />} />
          <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategories />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
