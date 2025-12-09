import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { staffService } from "../../../service/employee/staffService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import { Button } from "../../../components/common/button";
import { Input } from "../../../components/common/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/common/table";
import { Search, Filter, Users, UserPlus, Edit, UserCheck, UserX } from "lucide-react";

interface StaffMember {
  username: string;
  firstname: string;
  lastname: string;
  employeeType: string;
}

export const StaffAccounts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffService.getAllStaff();
        setStaffMembers(data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = staffMembers.filter((staff) => {
    const fullName = `${staff.firstname} ${staff.lastname}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Staff Accounts</h1>
          <p className="text-muted-foreground">Manage staff employee accounts and permissions</p>
        </div>
        <Button onClick={() => navigate("/employee/add-new-staff")} className="bg-gradient-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Staff Directory ({staffMembers.length})</span>
          </CardTitle>
          <CardDescription>View and manage all staff members with filtering options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Staff Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.username}>
                    <TableCell className="font-medium">{`${staff.firstname} ${staff.lastname}`}</TableCell>
                    <TableCell className="font-mono text-sm">{staff.username}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No staff members found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="quick-action-button hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate("/employee/add-new-staff")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Add New Staff</h3>
                <p className="text-sm text-muted-foreground">Create single or bulk staff accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="quick-action-button hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate("/employee/manage-staff")}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Staff</h3>
                <p className="text-sm text-muted-foreground">Edit and delete staff accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
