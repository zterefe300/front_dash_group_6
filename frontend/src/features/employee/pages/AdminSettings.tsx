import { AlertCircle, DollarSign, Lock, Save, Settings2, ToggleLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/common/dialog";
import { Input } from "../../../components/common/input";
import { Label } from "../../../components/common/label";
import { useUser } from "../../../contexts/UserContext";
import { adminService } from "../../../service/employee/adminService";

export const AdminSettings: React.FC = () => {
  const { user, currentView, switchView } = useUser();

  const [serviceChargePercentage, setServiceChargePercentage] = useState<number>(8.25);
  const [tempServiceCharge, setTempServiceCharge] = useState<string>("8.25");
  const [serviceChargeDialogOpen, setServiceChargeDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordSuccessDialogOpen, setPasswordSuccessDialogOpen] = useState(false);
  const [passwordValidationDialogOpen, setPasswordValidationDialogOpen] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    confirmMismatch: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceCharge = async () => {
      try {
        const serviceCharge = await adminService.getServiceCharge();
        const percentage = parseFloat(serviceCharge.percentage);
        setServiceChargePercentage(percentage);
        setTempServiceCharge(percentage.toString());
      } catch (error) {
        console.error("Failed to fetch service charge:", error);
        toast.error("Failed to load service charge settings");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCharge();
  }, []);

  const handleServiceChargeSave = async () => {
    const newPercentage = parseFloat(tempServiceCharge);
    if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= 100) {
      try {
        await adminService.updateServiceCharge(newPercentage);
        setServiceChargePercentage(newPercentage);
        setServiceChargeDialogOpen(false);
        toast.success("Service charge updated successfully");
      } catch (error) {
        console.error("Failed to update service charge:", error);
        toast.error("Failed to update service charge");
      }
    }
  };

  const validatePassword = (password: string): boolean => {
    // At least 6 characters, one uppercase, one lowercase, one number
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handlePasswordChange = async () => {
    // Reset errors
    setPasswordErrors({ confirmMismatch: false });

    // Validate passwords
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setValidationErrorMessage("All fields are required");
      setPasswordValidationDialogOpen(true);
      return;
    }

    if (!validatePassword(passwordForm.newPassword)) {
      setValidationErrorMessage(
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
      setPasswordValidationDialogOpen(true);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrors({ confirmMismatch: true });
      return;
    }

    try {
      await adminService.updateAdminPassword({
        username: user?.username || "",
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccessDialogOpen(true);
      setChangePasswordDialogOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Failed to update password:", error);
      setValidationErrorMessage("Failed to update password. Please try again.");
      setPasswordValidationDialogOpen(true);
    }
  };

  const resetPasswordForm = () => {
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">Manage account security and system configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Account Security</span>
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start" onClick={resetPasswordForm}>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Update your account password. Make sure to use a strong password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                        }
                        placeholder="Enter your current password"
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                        }
                        placeholder="Enter your new password"
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        placeholder="Confirm your new password"
                      />
                      {passwordErrors.confirmMismatch && (
                        <p className="text-sm text-red-600">Passwords do not match</p>
                      )}
                    </div>

                    {/* Password strength indicator */}
                    {passwordForm.newPassword && (
                      <div className="flex items-center space-x-2 text-sm">
                        {passwordForm.newPassword.length >= 6 ? (
                          <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                            <span>Strong password</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span>Password too short</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setChangePasswordDialogOpen(false);
                        resetPasswordForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange}>
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings2 className="h-5 w-5" />
              <span>System Configuration</span>
            </CardTitle>
            <CardDescription>System settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Service Charge Configuration */}
              <Dialog open={serviceChargeDialogOpen} onOpenChange={setServiceChargeDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setTempServiceCharge(serviceChargePercentage.toString())}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Adjust Service Charge ({serviceChargePercentage}%)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Service Charge Configuration</DialogTitle>
                    <DialogDescription>
                      Set the service charge percentage applied to all orders. This affects restaurant
                      commission calculations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-charge">Service Charge Percentage</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="service-charge"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={tempServiceCharge}
                          onChange={(e) => setTempServiceCharge(e.target.value)}
                          placeholder="8.25"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Current: {serviceChargePercentage}% - Enter a value between 0 and 100
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setServiceChargeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleServiceChargeSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {user?.role === "admin" && (
                <Button
                  onClick={() => switchView(currentView === "admin" ? "staff" : "admin")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Switch to {currentView === "admin" ? "Staff" : "Admin"} View
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Success Dialog */}
      <Dialog open={passwordSuccessDialogOpen} onOpenChange={setPasswordSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Changed Successfully</DialogTitle>
            <DialogDescription>
              Your password has been successfully changed. You can now use your new password to log in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setPasswordSuccessDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Validation Error Dialog */}
      <Dialog open={passwordValidationDialogOpen} onOpenChange={setPasswordValidationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation Error</DialogTitle>
            <DialogDescription>{validationErrorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setPasswordValidationDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
