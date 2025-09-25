import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/common/dialog';
import { useUser } from '../../../contexts/UserContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { Lock, Settings2, DollarSign, Activity, ToggleLeft, Monitor, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { user, currentView, switchView } = useUser();
  const { serviceChargePercentage, dashboardConfig, updateServiceCharge, updateDashboardCardVisibility } = useSettings();
  
  const [tempServiceCharge, setTempServiceCharge] = useState<string>(serviceChargePercentage.toString());
  const [serviceChargeDialogOpen, setServiceChargeDialogOpen] = useState(false);
  const [dashboardConfigDialogOpen, setDashboardConfigDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  const handleServiceChargeSave = () => {
    const newPercentage = parseFloat(tempServiceCharge);
    if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= 100) {
      updateServiceCharge(newPercentage);
      setServiceChargeDialogOpen(false);
    }
  };

  const handleCardToggle = (viewType: 'admin' | 'staff', cardId: string, enabled: boolean) => {
    updateDashboardCardVisibility(viewType, cardId, enabled);
  };

  const handlePasswordChange = () => {
    // Validate passwords
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }
    
    // In a real app, this would validate the current password against the backend
    // For demo purposes, we'll simulate a successful password change
    toast.success('Password changed successfully');
    setChangePasswordDialogOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const resetPasswordForm = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Manage account security and system configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Account Security</span>
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={resetPasswordForm}
                  >
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
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
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
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your new password"
                      />
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
            <CardDescription>
              System settings and preferences
            </CardDescription>
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
                      Set the service charge percentage applied to all orders. This affects restaurant commission calculations.
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



              {user?.role === 'admin' && (
                <Button 
                  onClick={() => switchView(currentView === 'admin' ? 'staff' : 'admin')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Switch to {currentView === 'admin' ? 'Staff' : 'Admin'} View
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};