import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { MenuManagement } from "./components/MenuManagement";
import { RestaurantProfile } from "./components/settings/RestaurantProfile";
import { ContactDetails } from "./components/settings/ContactDetails";
import { AddressLocation } from "./components/settings/AddressLocation";
import { OperatingHours } from "./components/settings/OperatingHours";
import { AccountSecurity } from "./components/settings/AccountSecurity";
import { BusinessActions } from "./components/BusinessActions";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegistrationPage />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ForgotPasswordPage />
              )
            }
          />
          <Route
            path="/reset-password"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ResetPasswordPage />
              )
            }
          />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />
                    <Route
                      path="/menu"
                      element={<MenuManagement />}
                    />
                    <Route
                      path="/business"
                      element={<BusinessActions />}
                    />
                    <Route
                      path="/settings/profile"
                      element={<RestaurantProfile />}
                    />
                    <Route
                      path="/settings/contact"
                      element={<ContactDetails />}
                    />
                    <Route
                      path="/settings/address"
                      element={<AddressLocation />}
                    />
                    <Route
                      path="/settings/hours"
                      element={<OperatingHours />}
                    />
                    <Route
                      path="/settings/security"
                      element={<AccountSecurity />}
                    />
                    <Route
                      path="/"
                      element={
                        <Navigate to="/dashboard" replace />
                      }
                    />
                  </Routes>
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}