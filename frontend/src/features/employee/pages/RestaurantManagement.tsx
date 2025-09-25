import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { FileText, CheckCircle, Clock, Building2 } from 'lucide-react';

export const RestaurantManagement = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1>Restaurant Management</h1>
        <p className="text-muted-foreground">
          Manage restaurant registrations, approvals, and operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="stat-card cursor-pointer" onClick={() => navigate('/registration-requests')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Registration Requests</CardTitle>
                <CardDescription>Pending restaurant applications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </div>
              <Button size="sm" onClick={(e: React.ChangeEvent<HTMLInputElement>) => { e.stopPropagation(); navigate('/registration-requests'); }}>
                View Queue
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer" onClick={() => navigate('/active-restaurants')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Active Restaurants</CardTitle>
                <CardDescription>Currently approved partners</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">Active partners</p>
              </div>
              <Button size="sm" onClick={(e: React.ChangeEvent<HTMLInputElement>) => { e.stopPropagation(); navigate('/active-restaurants'); }}>
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer" onClick={() => navigate('/withdrawal-requests')}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>Pending withdrawal processing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </div>
              <Button size="sm" onClick={(e: React.ChangeEvent<HTMLInputElement>) => { e.stopPropagation(); navigate('/withdrawal-requests'); }}>
                Process
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};
