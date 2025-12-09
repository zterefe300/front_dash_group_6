import { ChevronDown, Lock, Shield, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { staffService } from "../../../service/employee/staffService";
import { Badge } from "../../../components/common/badge";
import { Button } from "../../../components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/common/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/common/dropdown-menu";
import { Input } from "../../../components/common/input";
import { Label } from "../../../components/common/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/common/tabs";
import { useUser } from "../../../contexts/UserContext";

export const StaffAccountSettings: React.FC = () => {
  const { user, currentView, switchView } = useUser();

  const [profileData, setProfileData] = useState({
    username: "",
    firstname: "",
    lastname: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch current user staff data
  useEffect(() => {
    const fetchStaffData = async () => {
      if (user?.username) {
        try {
          const staffData = await staffService.getStaffByUsername(user.username);
          setProfileData(staffData);
        } catch (error) {
          console.error('Failed to fetch staff data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStaffData();
  }, [user?.username]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSuccessDialogOpen, setPasswordSuccessDialogOpen] = useState(false);
  const [passwordValidationDialogOpen, setPasswordValidationDialogOpen] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    confirmMismatch: false,
  });

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
      await staffService.updatePassword({
        username: user?.username || "",
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccessDialogOpen(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Failed to update password:", error);
      setValidationErrorMessage("Failed to update password. Please try again.");
      setPasswordValidationDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Account Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {/* View Switch for Admins */}
        {user?.role === "admin" && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Current View:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Badge variant={currentView === "admin" ? "default" : "secondary"}>
                    {currentView === "admin" ? "Admin View" : "Staff View"}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchView("admin")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchView("staff")}>
                  <User className="mr-2 h-4 w-4" />
                  Staff View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    value={profileData.firstname}
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    value={profileData.lastname}
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user?.role} disabled={true} />
                </div>
              </div>

              <div className="pt-4">
                <div className="mb-4">
                  <h4 className="font-medium">Account Information</h4>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Member Since</Label>
                      <p className="text-sm mt-1">January 15, 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                {passwordErrors.confirmMismatch && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <div className="pt-4">
                <Button onClick={handlePasswordChange}>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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