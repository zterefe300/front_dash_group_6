import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PageType } from '../../App';
import { Users, UserPlus, Settings2 } from 'lucide-react';

interface StaffManagementProps {
  onNavigate: (page: PageType) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1>Staff Management</h1>
        <p className="text-muted-foreground">
          Manage staff accounts, permissions, and employee operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="stat-card cursor-pointer" onClick={() => onNavigate('staff-accounts')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Staff Accounts</CardTitle>
                <CardDescription>View all staff employees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Total employees</p>
              </div>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onNavigate('staff-accounts'); }}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer" onClick={() => onNavigate('add-new-staff')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Add New Staff</CardTitle>
                <CardDescription>Create new staff accounts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">+</div>
                <p className="text-xs text-muted-foreground">Single or bulk creation</p>
              </div>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onNavigate('add-new-staff'); }}>
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer" onClick={() => onNavigate('manage-staff')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                <Settings2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Manage Staff</CardTitle>
                <CardDescription>Edit and delete accounts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">13</div>
                <p className="text-xs text-muted-foreground">Active accounts</p>
              </div>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onNavigate('manage-staff'); }}>
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Overview</CardTitle>
          <CardDescription>Current staff management statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15</div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">13</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};