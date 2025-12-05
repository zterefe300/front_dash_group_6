import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/restaurant/pages/LoginPage';
import { RegistrationPage } from '@/features/restaurant/pages/RegistrationPage';
import { ForgotPasswordPage } from '@/features/restaurant/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/restaurant/pages/ResetPasswordPage';
import DashboardLayout from '@/features/restaurant/pages/DashboardLayout';
import { Dashboard } from '@/features/restaurant/pages/Dashboard';
import { MenuManagement } from '@/features/restaurant/pages/MenuManagement';
import { OrderManagement } from '@/features/restaurant/pages/OrderManagement';
import { BusinessActions } from '@/features/restaurant/pages/BusinessActions';
import { RestaurantProfile } from '@/features/restaurant/pages/settings/RestaurantProfile';
import { ContactDetails } from '@/features/restaurant/pages/settings/ContactDetails';
import { AddressLocation } from '@/features/restaurant/pages/settings/AddressLocation';
import { OperatingHours } from '@/features/restaurant/pages/settings/OperatingHours';
import { AccountSecurity } from '@/features/restaurant/pages/settings/AccountSecurity';
import { useAppStore } from '@/store';
import { useNavigate } from 'react-router-dom';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/restaurant/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/restaurant/dashboard" replace />;
  }

  return <>{children}</>;
};

const RestaurantRoutes = () => {
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/restaurant/login');
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="register"
        element={
          <PublicRoute>
            <RegistrationPage />
          </PublicRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes - All wrapped in DashboardLayout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout onLogout={handleLogout}>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="business" element={<BusinessActions />} />

                {/* Settings Routes */}
                <Route path="settings/profile" element={<RestaurantProfile />} />
                <Route path="settings/contact" element={<ContactDetails />} />
                <Route path="settings/address" element={<AddressLocation />} />
                <Route path="settings/hours" element={<OperatingHours />} />
                <Route path="settings/security" element={<AccountSecurity />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RestaurantRoutes;
