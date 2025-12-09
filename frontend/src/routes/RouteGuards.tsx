import { Navigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useUser } from "../contexts/UserContext";

import { useAppStore } from '@/store';

/* RouteGuard for Employee portal*/
export const EmployeePortalProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, forcePasswordChange } = useUser();

  // If authenticated but needs to change password, redirect to change password
  if (isAuthenticated && forcePasswordChange) {
    return <Navigate to="/employee/change-password" replace />;
  }

  return isAuthenticated ? (
    <DashboardLayout>{element}</DashboardLayout>
  ) : (
    <Navigate to="/employee/login" replace />
  );
};

export const EmployeePortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, forcePasswordChange } = useUser();

  // Allow authenticated users access to change-password if they need to change password
  if (isAuthenticated && forcePasswordChange && window.location.pathname.includes('/change-password')) {
    return element;
  }

  return !isAuthenticated ? element : <Navigate to="/employee/dashboard" replace />;
};

export const CustomerPortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  return element;
};

export const CustomerPortalProtectedRoute = ({ element }: { element: JSX.Element }) => {
  // For now, just return the element (no authentication required for customer portal)
  // This can be updated later to include customer authentication logic
  return element;
};

/* RouteGuard for Restaurant portal*/
export const RestaurantPortalProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? element : <Navigate to="/restaurant/login" replace />;
};

export const RestaurantPortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAppStore();
  return !isAuthenticated ? element : <Navigate to="/restaurant/dashboard" />;
};
