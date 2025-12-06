import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { DashboardLayout } from "../components/layout/DashboardLayout";

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

/* RouteGuard for Customer portal*/
export const CustomerPortalProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? (
    <DashboardLayout>{element}</DashboardLayout>
  ) : (
    <Navigate to="/customer/login" replace />
  );
};

export const CustomerPortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  return !isAuthenticated ? element : <Navigate to="/customer/restaurants" replace />;
};

/* RouteGuard for Restaurant portal*/
export const RestaurantPortalProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? element : <Navigate to="/restaurant/login" replace />;
};

export const RestaurantPortalPublicRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  return !isAuthenticated ? element : <Navigate to="/restaurant/dashboard" />;
};