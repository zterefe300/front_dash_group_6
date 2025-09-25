import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.jsx';
import { UserProvider } from '../contexts/UserContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import Dashboard from '../features/employee/pages/Dashboard';
import RestaurantManagement from '../features/employee/pages/RestaurantManagement';
import StaffManagement from '../features/employee/pages/StaffManagement';
import OrderManagement from '../features/employee/pages/OrderManagement';
import AccountSettings from '../features/employee/pages/AccountSettings';
import RegistrationRequests from '../features/employee/pages/RegistrationRequests';
import ActiveRestaurants from '../features/employee/pages/ActiveRestaurants';
import WithdrawalRequests from '../features/employee/pages/WithdrawalRequests';
import StaffAccounts from '../features/employee/pages/StaffAccounts';
import AddNewStaff from '../features/employee/pages/AddNewStaff';
import ManageStaff from '../features/employee/pages/ManageStaff';
import ActiveDrivers from '../features/employee/pages/ActiveDrivers';
import ManageDrivers from '../features/employee/pages/ManageDrivers';
import DriverManagement from '../features/employee/pages/DriverManagement';
import Settings from '../features/employee/pages/Settings';

const EmployeeRoutes = () => (
  <UserProvider>
    <SettingsProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/restaurant-management" element={<RestaurantManagement />} />
          <Route path="/registration-requests" element={<RegistrationRequests />} />
          <Route path="/active-restaurants" element={<ActiveRestaurants />} />
          <Route path="/withdrawal-requests" element={<WithdrawalRequests />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/staff-accounts" element={<StaffAccounts />} />
          <Route path="/add-new-staff" element={<AddNewStaff />} />
          <Route path="/manage-staff" element={<ManageStaff />} />
          <Route path="/driver-management" element={<DriverManagement />} />
          <Route path="/active-drivers" element={<ActiveDrivers />} />
          <Route path="/manage-drivers" element={<ManageDrivers />} />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
    </SettingsProvider>
  </UserProvider>
);

export default EmployeeRoutes;
