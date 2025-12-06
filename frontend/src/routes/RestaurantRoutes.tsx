import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/restaurant/pages/LoginPage';
import { RegistrationPage } from '@/features/restaurant/pages/RegistrationPage';
import { ForgotPasswordPage } from '@/features/restaurant/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/restaurant/pages/ResetPasswordPage';
import { Dashboard } from '@/features/restaurant/pages/Dashboard';
import { MenuManagement } from '@/features/restaurant/pages/MenuManagement';
import { BusinessActions } from '@/features/restaurant/pages/BusinessActions';
import { RestaurantProfile } from '@/features/restaurant/pages/settings/RestaurantProfile';
import { ContactDetails } from '@/features/restaurant/pages/settings/ContactDetails';
import { AddressLocation } from '@/features/restaurant/pages/settings/AddressLocation';
import { OperatingHours } from '@/features/restaurant/pages/settings/OperatingHours';
import { AccountSecurity } from '@/features/restaurant/pages/settings/AccountSecurity';
import DashboardLayout from '@/features/restaurant/pages/DashboardLayout';
import { UserProvider } from '@/contexts/UserContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { RestaurantPortalProtectedRoute, RestaurantPortalPublicRoute } from './RouteGuards';

const RestaurantPortalRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<RestaurantPortalPublicRoute element={<LoginPage />} />} />
    <Route path="/register" element={<RestaurantPortalPublicRoute element={<RegistrationPage />} />} />
    <Route path="/forgot-password" element={<RestaurantPortalPublicRoute element={<ForgotPasswordPage />} />} />
    <Route path="/reset-password" element={<RestaurantPortalPublicRoute element={<ResetPasswordPage />} />} />

    {/* Protected routes with DashboardLayout */}
    <Route element={<RestaurantPortalProtectedRoute element={<DashboardLayout />} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/menu" element={<MenuManagement />} />
      <Route path="/business" element={<BusinessActions />} />
      <Route path="/settings/profile" element={<RestaurantProfile />} />
      <Route path="/settings/contact" element={<ContactDetails />} />
      <Route path="/settings/address" element={<AddressLocation />} />
      <Route path="/settings/hours" element={<OperatingHours />} />
      <Route path="/settings/security" element={<AccountSecurity />} />
      <Route path="/" element={<Navigate to="/restaurant/dashboard" replace />} />
    </Route>

    {/* Catch all - redirect to dashboard */}
    <Route path="*" element={<Navigate to="/restaurant/dashboard" replace />} />
  </Routes>
);

const RestaurantRoutes = () => (
  <UserProvider>
    <SettingsProvider>
      <div className="min-h-screen bg-background">
        <RestaurantPortalRoutes />
      </div>
    </SettingsProvider>
  </UserProvider>
);

export default RestaurantRoutes;
