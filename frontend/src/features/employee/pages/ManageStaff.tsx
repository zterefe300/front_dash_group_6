import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import { Button } from "../../../components/common/button";
import { Input } from "../../../components/common/input";
import { Label } from "../../../components/common/label";
import { Badge } from "../../../components/common/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/common/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/common/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/common/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/common/alert-dialog";
import { Search, Filter, Users, Trash2, ArrowLeft, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  fullName: string;
  username: string;
}

export const ManageStaff = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const roles = [
    "Order Manager",
    "Delivery Coordinator",
    "Customer Service",
    "Operations Manager",
    "Support Staff",
    "Supervisor",
  ];

  // Mock staff data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      fullName: "John Smith",
      username: "smith01",
    },
    {
      id: "2",
      fullName: "Emily Johnson",
      username: "johnson02",
    },
    {
      id: "3",
      fullName: "Michael Brown",
      username: "brown03",
    },
    {
      id: "4",
      fullName: "Sarah Davis",
      username: "davis04",
    },
    {
      id: "5",
      fullName: "David Wilson",
      username: "wilson05",
    },
  ]);

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedStaff) return;

    setStaffMembers((prev) => prev.filter((staff) => staff.id !== selectedStaff.id));
    toast.success(`Staff account for ${selectedStaff.fullName} has been deleted`);
    setDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  const toggleStaffStatus = (staff: StaffMember) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    setStaffMembers((prev) => prev.map((s) => (s.id === staff.id ? { ...s, status: newStatus } : s)));
    toast.success(`${staff.fullName} has been ${newStatus === "active" ? "activated" : "deactivated"}`);
  };

  const activeStaffCount = staffMembers.filter((s) => s.status === "active").length;
  const inactiveStaffCount = staffMembers.filter((s) => s.status === "inactive").length;

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
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.fullName}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>

          {staffMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No staff members found matching your criteria.</p>
            </div>
          )}
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
              Are you sure you want to delete the staff account for <strong>{selectedStaff?.fullName}</strong>
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
