import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext.js";
import { SettingsProvider } from "../contexts/SettingsContext.js";
import { Dashboard } from "../features/employee/pages/Dashboard.js";
import { RestaurantManagement } from "../features/employee/pages/RestaurantManagement.js";
import { StaffManagement } from "../features/employee/pages/StaffManagement.js";
import { OrderManagement } from "../features/employee/pages/OrderManagement.js";
import { AccountSettings } from "../features/employee/pages/AccountSettings.js";
import { RegistrationRequests } from "../features/employee/pages/RegistrationRequests.js";
import { ActiveRestaurants } from "../features/employee/pages/ActiveRestaurants.js";
import { WithdrawalRequests } from "../features/employee/pages/WithdrawalRequests.js";
import { StaffAccounts } from "../features/employee/pages/StaffAccounts.js";
import { AddNewStaff } from "../features/employee/pages/AddNewStaff.js";
import { ManageStaff } from "../features/employee/pages/ManageStaff.js";
import { ActiveDrivers } from "../features/employee/pages/ActiveDrivers.js";
import { ManageDrivers } from "../features/employee/pages/ManageDrivers.js";
import { DriverManagement } from "../features/employee/pages/DriverManagement.js";
import { Settings } from "../features/employee/pages/Settings.js";
import { EmployeePortalProtectedRoute, EmployeePortalPublicRoute } from "./RouteGuards.tsx";
import { LoginPage } from "../features/employee/pages/LoginPage.js";

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
  { path: "/account-settings", element: <AccountSettings /> },
  { path: "/settings", element: <Settings /> },
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
