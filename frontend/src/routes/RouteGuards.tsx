import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { DashboardLayout } from "../components/layout/DashboardLayout";

import { useAppStore } from '@/store';

/* RouteGuard for Employee portal*/
export const EmployeePortalProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? (
    <DashboardLayout>{element}</DashboardLayout>
  ) : (
    <Navigate to="/employee/login" replace />
  );
};

export const EmployeePortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  return !isAuthenticated ? element : <Navigate to="/employee/dashboard" replace />;
};

export const CustomerPortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  return element
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