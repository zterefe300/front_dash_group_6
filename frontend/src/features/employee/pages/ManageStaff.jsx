import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { PageType } from '../../App';
import { Search, Filter, Users, Trash2, ArrowLeft, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ManageStaffProps {
  onNavigate: (page: PageType) => void;
}

interface StaffMember {
  id: string;
  fullName: string;
  username: string;
  status: 'active' | 'inactive';
  dateCreated: string;
  lastLogin: string;
  role: string;
}

export const ManageStaff: React.FC<ManageStaffProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const roles = [
    'Order Manager',
    'Delivery Coordinator',
    'Customer Service',
    'Operations Manager',
    'Support Staff',
    'Supervisor'
  ];

  // Mock staff data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      fullName: 'John Smith',
      username: 'smith01',
      status: 'active',
      dateCreated: '2024-01-15',
      lastLogin: '2024-09-08',
      role: 'Order Manager'
    },
    {
      id: '2',
      fullName: 'Emily Johnson',
      username: 'johnson02',
      status: 'active',
      dateCreated: '2024-02-20',
      lastLogin: '2024-09-09',
      role: 'Delivery Coordinator'
    },
    {
      id: '3',
      fullName: 'Michael Brown',
      username: 'brown03',
      status: 'inactive',
      dateCreated: '2024-01-10',
      lastLogin: '2024-08-15',
      role: 'Customer Service'
    },
    {
      id: '4',
      fullName: 'Sarah Davis',
      username: 'davis04',
      status: 'active',
      dateCreated: '2024-03-05',
      lastLogin: '2024-09-09',
      role: 'Operations Manager'
    },
    {
      id: '5',
      fullName: 'David Wilson',
      username: 'wilson05',
      status: 'active',
      dateCreated: '2024-02-28',
      lastLogin: '2024-09-08',
      role: 'Support Staff'
    }
  ]);

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedStaff) return;

    setStaffMembers(prev => prev.filter(staff => staff.id !== selectedStaff.id));
    toast.success(`Staff account for ${selectedStaff.fullName} has been deleted`);
    setDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  const toggleStaffStatus = (staff: StaffMember) => {
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    setStaffMembers(prev => prev.map(s => 
      s.id === staff.id ? { ...s, status: newStatus } : s
    ));
    toast.success(`${staff.fullName} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const activeStaffCount = staffMembers.filter(s => s.status === 'active').length;
  const inactiveStaffCount = staffMembers.filter(s => s.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => onNavigate('staff-management')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff Management
        </Button>
        <div>
          <h1>Manage Staff</h1>
          <p className="text-muted-foreground">
            Edit and delete staff accounts
          </p>
        </div>
      </div>



      {/* Staff Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Staff Management</span>
          </CardTitle>
          <CardDescription>
            Edit staff details, change status, or delete accounts
          </CardDescription>
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
            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.fullName}</TableCell>
                    <TableCell className="font-mono text-sm">{staff.username}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{new Date(staff.lastLogin).toLocaleDateString()}</TableCell>
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

          {filteredStaff.length === 0 && (
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
              Are you sure you want to delete the staff account for <strong>{selectedStaff?.fullName}</strong>?
              This action cannot be undone and will permanently remove all account data.
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