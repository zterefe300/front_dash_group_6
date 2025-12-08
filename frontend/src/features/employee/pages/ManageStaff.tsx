import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/common/alert-dialog";
import { Search, Filter, Users, Trash2, ArrowLeft, UserCheck, UserX, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { staffService } from "../../../service/employee/staffService";

interface StaffMember {
  username: string;
  firstname: string;
  lastname: string;
}

export const ManageStaff = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [staffData, setStaffData] = useState({
    staff: [] as StaffMember[],
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setStaffData(prev => ({ ...prev, loading: true, error: null }));
        const staff = await staffService.getAllStaff();
        setStaffData({
          staff: staff || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to fetch staff data:', error);
        setStaffData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load staff data'
        }));
      }
    };

    fetchStaffData();
  }, []);

  const filteredStaff = staffData.staff.filter((staff) => {
    const fullName = `${staff.firstname} ${staff.lastname}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;

    try {
      await staffService.deleteStaff(selectedStaff.username);
      setStaffData(prev => ({
        ...prev,
        staff: prev.staff.filter(s => s.username !== selectedStaff.username)
      }));
      toast.success(`Staff account for ${selectedStaff.firstname} ${selectedStaff.lastname} has been deleted`);
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Failed to delete staff:', error);
      toast.error('Failed to delete staff account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate("/employee/staff-management")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff Management
        </Button>
        <div>
          <h1>Manage Staff</h1>
          <p className="text-muted-foreground">Edit and delete staff accounts</p>
        </div>
      </div>

      {/* Staff Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Staff Management</span>
          </CardTitle>
          <CardDescription>Edit staff details, change status, or delete accounts</CardDescription>
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

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffData.loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading staff data...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.username}>
                      <TableCell className="font-medium">
                        {`${staff.firstname} ${staff.lastname}`}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{staff.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStaff(staff)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No staff members found matching your criteria.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Delete Staff Account</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the staff account for <strong>{selectedStaff ? `${selectedStaff.firstname} ${selectedStaff.lastname}` : ''}</strong>
              ? This action cannot be undone and will permanently remove all account data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
