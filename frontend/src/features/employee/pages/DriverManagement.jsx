import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PageType } from '../../App';
import { Truck, Users, UserCheck, UserX, ArrowRight } from 'lucide-react';

interface DriverManagementProps {
  onNavigate: (page: PageType) => void;
}

export const DriverManagement: React.FC<DriverManagementProps> = ({ onNavigate }) => {
  // Mock data for dashboard overview
  const driverStats = {
    activeDrivers: 24,
    readyToHire: 8,
    terminated: 12,
    totalDeliveries: 156
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Driver Management</h1>
        <p className="text-muted-foreground">
          Manage active drivers, hire new drivers, and handle terminations
        </p>
      </div>

      {/* Driver Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drivers</p>
                <p className="text-2xl font-bold text-primary">{driverStats.activeDrivers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready to Hire</p>
                <p className="text-2xl font-bold text-blue-600">{driverStats.readyToHire}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminated</p>
                <p className="text-2xl font-bold text-gray-600">{driverStats.terminated}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('active-drivers')}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>Active Drivers</span>
            </CardTitle>
            <CardDescription>
              View and manage currently active delivery drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {driverStats.activeDrivers} drivers currently active
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online: 18
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Busy: 6
                  </Badge>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('manage-drivers')}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Manage Drivers</span>
            </CardTitle>
            <CardDescription>
              Hire, terminate, and manage driver accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {driverStats.readyToHire} drivers ready to hire
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Available: {driverStats.readyToHire}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Terminated: {driverStats.terminated}
                  </Badge>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};