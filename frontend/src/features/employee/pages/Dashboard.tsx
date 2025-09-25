import React from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { useUser } from '../../../contexts/UserContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { 
  Building2, 
  Users, 
  Truck, 
  ShoppingCart, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentView } = useUser();
  const { dashboardConfig } = useSettings();

  const adminStats = [
    {
      id: 'total-restaurants',
      title: 'Total Restaurants',
      value: '4',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      id: 'active-staff',
      title: 'Active Staff',
      value: '5',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 'active-drivers',
      title: 'Active Drivers',
      value: '5',
      icon: Truck,
      color: 'text-purple-600'
    },
    {
      id: 'pending-requests',
      title: 'Pending Requests',
      value: '6',
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  const staffStats = [
    {
      id: 'orders-today',
      title: 'Orders Today',
      value: '4',
      change: '+8 from yesterday',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      id: 'active-orders',
      title: 'Active Orders',
      value: '2',
      change: 'In progress',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      id: 'completed-orders',
      title: 'Completed Orders',
      value: '2',
      change: 'Today',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 'available-drivers',
      title: 'Available Drivers',
      value: '3',
      change: 'Ready for delivery',
      icon: Truck,
      color: 'text-purple-600'
    }
  ];

  const allStats = currentView === 'admin' ? adminStats : staffStats;
  const enabledCardIds = new Set(
    dashboardConfig[currentView].filter(card => card.enabled).map(card => card.id)
  );
  const stats = allStats.filter(stat => enabledCardIds.has(stat.id));
  
  const recentActivity = currentView === 'admin' ? [
    {
      type: 'Restaurant Registration',
      description: 'New restaurant "Pizza Palace" submitted registration',
      time: '2 hours ago'
    },
    {
      type: 'Staff Account',
      description: 'Staff member John Doe updated profile',
      time: '4 hours ago'
    },
    {
      type: 'Driver Application',
      description: 'New driver application from Mike Smith',
      time: '6 hours ago'
    },
    {
      type: 'System Update',
      description: 'System configuration updated successfully',
      time: '1 day ago'
    }
  ] : [
    {
      type: 'Order Assigned',
      description: 'Order #1234 assigned to driver Tom Wilson',
      time: '15 minutes ago'
    },
    {
      type: 'Order Completed',
      description: 'Order #1230 delivered successfully',
      time: '30 minutes ago'
    },
    {
      type: 'Driver Check-in',
      description: 'Driver Sarah Johnson checked in',
      time: '1 hour ago'
    },
    {
      type: 'Order Processing',
      description: 'Order #1235 being prepared at restaurant',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No dashboard cards are currently enabled. You can configure which cards to display in the Settings page.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {currentView === 'admin' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {currentView === 'admin' ? (
                <>
                  <button className="quick-action-button flex items-center space-x-3 p-3 rounded-lg text-left" onClick={() => navigate("/employee/registration-requests")}>
                    <div className="w-8 h-8 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-accent-foreground">Review Restaurant Requests</span>
                  </button>
                  <button className="quick-action-button flex items-center space-x-3 p-3 rounded-lg text-left" onClick={() => navigate("/employee/add-new-staff")}>
                    <div className="w-8 h-8 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-accent-foreground">Add New Staff Member</span>
                  </button>
                  <button className="quick-action-button flex items-center space-x-3 p-3 rounded-lg text-left" onClick={() => navigate("/employee/manage-drivers")}>
                    <div className="w-8 h-8 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-accent-foreground">Manage Drivers</span>
                  </button>

                </>
              ) : (
                <>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>}
    </div>
  );
};