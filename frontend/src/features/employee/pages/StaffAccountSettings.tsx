import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/common/tabs';
import { Badge } from '../../../components/common/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import { useUser } from '../../../contexts/UserContext';
import {
  User,
  Lock,
  Shield,
  Save,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/common/dropdown-menu';

export const StaffAccountSettings: React.FC = () => {
  const { user, currentView, switchView } = useUser();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: '+1 234 567 8901',
    jobTitle: 'Staff Member'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccessDialogOpen, setPasswordSuccessDialogOpen] = useState(false);
  const [passwordValidationDialogOpen, setPasswordValidationDialogOpen] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    confirmMismatch: false
  });



  const handleProfileSave = () => {
    console.log('Saving profile:', profileData);
    // In real app, make API call
  };

  const validatePassword = (password: string): boolean => {
    // At least 6 characters, one uppercase, one lowercase, one number
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handlePasswordChange = () => {
    // Reset errors
    setPasswordErrors({ confirmMismatch: false });

    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setValidationErrorMessage('All fields are required');
      setPasswordValidationDialogOpen(true);
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setValidationErrorMessage('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      setPasswordValidationDialogOpen(true);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors({ confirmMismatch: true });
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setValidationErrorMessage('New password must be different from current password');
      setPasswordValidationDialogOpen(true);
      return;
    }

    // In a real app, this would validate the current password against the backend
    // For demo purposes, we'll simulate a successful password change
    setPasswordSuccessDialogOpen(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        {/* View Switch for Admins */}
        {user?.role === 'admin' && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Current View:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Badge variant={currentView === 'admin' ? 'default' : 'secondary'}>
                    {currentView === 'admin' ? 'Admin View' : 'Staff View'}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchView('admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchView('staff')}>
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
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={true}
                  />
                  {user?.role === 'staff' && (
                    <p className="text-xs text-muted-foreground">Full name cannot be edited by staff members</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Level</Label>
                  <Input
                    id="jobTitle"
                    value={user?.role}
                    disabled={true}
                  />
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
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
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
            <Button onClick={() => setPasswordSuccessDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Validation Error Dialog */}
      <Dialog open={passwordValidationDialogOpen} onOpenChange={setPasswordValidationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation Error</DialogTitle>
            <DialogDescription>
              {validationErrorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setPasswordValidationDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
