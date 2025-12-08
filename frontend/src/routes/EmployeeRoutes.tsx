import { Route, Routes } from "react-router-dom";
import { SettingsProvider } from "../contexts/SettingsContext";
import { UserProvider } from "../contexts/UserContext";
import { ActiveDrivers } from "../features/employee/pages/ActiveDrivers";
import { ActiveRestaurants } from "../features/employee/pages/ActiveRestaurants";
import { AddNewStaff } from "../features/employee/pages/AddNewStaff";
import { AdminSettings } from "../features/employee/pages/AdminSettings";
import { Dashboard } from "../features/employee/pages/Dashboard";
import { DriverManagement } from "../features/employee/pages/DriverManagement";
import { LoginPage } from "../features/employee/pages/LoginPage";
import { ManageDrivers } from "../features/employee/pages/ManageDrivers";
import { ManageStaff } from "../features/employee/pages/ManageStaff";
import { OrderManagement } from "../features/employee/pages/OrderManagement";
import { RegistrationRequests } from "../features/employee/pages/RegistrationRequests";
import { RestaurantManagement } from "../features/employee/pages/RestaurantManagement";
import { StaffAccounts } from "../features/employee/pages/StaffAccounts";
import { StaffAccountSettings } from "../features/employee/pages/StaffAccountSettings";
import { StaffManagement } from "../features/employee/pages/StaffManagement";
import { WithdrawalRequests } from "../features/employee/pages/WithdrawalRequests";
import { EmployeePortalProtectedRoute, EmployeePortalPublicRoute } from "./RouteGuards";

const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/restaurant-management", element: <RestaurantManagement /> },
  { path: "/registration-requests", element: <RegistrationRequests /> },
  { path: "/active-restaurants", element: <ActiveRestaurants /> },
  { path: "/withdrawal-requests", element: <WithdrawalRequests /> },
  { path: "/staff-management", element: <StaffManagement /> },
  { path: "/staff-accounts", element: <StaffAccounts /> },
  { path: "/add-new-staff", element: <AddNewStaff /> },
  { path: "/manage-staff", element: <ManageStaff /> },
  { path: "/driver-management", element: <DriverManagement /> },
  { path: "/active-drivers", element: <ActiveDrivers /> },
  { path: "/manage-drivers", element: <ManageDrivers /> },
  { path: "/order-management", element: <OrderManagement /> },
  { path: "/staff-account-settings", element: <StaffAccountSettings /> },
  { path: "/admin-settings", element: <AdminSettings /> },
];

const EmployeePortalRoutes = () => (
  <Routes>
    <Route path="/login" element={<EmployeePortalPublicRoute element={<LoginPage />} />} />
    {protectedRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={<EmployeePortalProtectedRoute element={element} />} />
    ))}
    <Route path="/" element={<EmployeePortalProtectedRoute element={<Dashboard />} />} />
    <Route path="*" element={<EmployeePortalProtectedRoute element={<Dashboard />} />} />
  </Routes>
);

const EmployeeRoutes = () => (
  <UserProvider>
    <SettingsProvider>
      <div className="min-h-screen bg-background">
        <EmployeePortalRoutes />
      </div>
    </SettingsProvider>
  </UserProvider>
);

export default EmployeeRoutes;
