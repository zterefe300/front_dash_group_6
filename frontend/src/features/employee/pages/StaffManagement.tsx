import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import { Button } from "../../../components/common/button";
import { Users, UserPlus, Settings2 } from "lucide-react";

export const StaffManagement = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1>Staff Management</h1>
        <p className="text-muted-foreground">Manage staff accounts, permissions, and employee operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="stat-card cursor-pointer" onClick={() => navigate("/employee/staff-accounts")}>
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
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Total employees</p>
              </div>
              <Button
                size="sm"
                onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  navigate("/employee/staff-accounts");
                }}
              >
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer" onClick={() => navigate("/employee/add-new-staff")}>
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
              <Button
                size="sm"
                onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  navigate("/employee/add-new-staff");
                }}
              >
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card cursor-pointer" onClick={() => navigate("/employee/manage-staff")}>
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
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Active accounts</p>
              </div>
              <Button
                size="sm"
                onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  navigate("/employee/manage-staff");
                }}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
