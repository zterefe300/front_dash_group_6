import React, { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { UserProvider, useUser } from "../contexts/UserContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import { Dashboard } from "../features/employee/pages/Dashboard";
import { RestaurantManagement } from "../features/employee/pages/RestaurantManagement";
import { StaffManagement } from "../features/employee/pages/StaffManagement";
import { OrderManagement } from "../features/employee/pages/OrderManagement";
import { AccountSettings } from "../features/employee/pages/AccountSettings";
import { RegistrationRequests } from "../features/employee/pages/RegistrationRequests";
import { ActiveRestaurants } from "../features/employee/pages/ActiveRestaurants";
import { WithdrawalRequests } from "../features/employee/pages/WithdrawalRequests";
import { StaffAccounts } from "../features/employee/pages/StaffAccounts";
import { AddNewStaff } from "../features/employee/pages/AddNewStaff";
import { ManageStaff } from "../features/employee/pages/ManageStaff";
import { ActiveDrivers } from "../features/employee/pages/ActiveDrivers";
import { ManageDrivers } from "../features/employee/pages/ManageDrivers";
import { DriverManagement } from "../features/employee/pages/DriverManagement";
import { Settings } from "../features/employee/pages/Settings";
import { EmployeePortalProtectedRoute, EmployeePortalPublicRoute } from "./RouteGuards";
import { LoginPage } from "../features/employee/pages/LoginPage";

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
