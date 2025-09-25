import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.js";
import { DashboardLayout } from "../components/layout/DashboardLayout.js";

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
