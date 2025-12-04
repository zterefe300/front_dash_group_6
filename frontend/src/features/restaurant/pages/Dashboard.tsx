import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      title: 'Active Customers',
      value: '156',
      change: '-3%',
      trend: 'down',
      icon: Users,
    },
  ];



  return (
    <div className="space-y-6">
      <div>
        <h2>Welcome back!</h2>
        <p className="text-muted-foreground">Here's an overview of your restaurant's performance today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stat.value}</span>
                  <span className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full justify-start" variant="outline">
            Add New Menu Item
          </Button>
          <Button className="w-full justify-start" variant="outline">
            Update Operating Hours
          </Button>
        </CardContent>
      </Card>

      {/* Restaurant Status */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Status</CardTitle>
          <CardDescription>Current operational status and setup progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Restaurant Status</span>
            <Badge variant="secondary" className="bg-green-500 text-white">Active</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completion</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">
            Complete your restaurant profile to get more visibility on the platform.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}