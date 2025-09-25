import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Badge } from '../../../components/common/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/common/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/common/dialog';
import { Search, Filter, Users, UserPlus, Edit, UserCheck, UserX } from 'lucide-react';

interface StaffMember {
  id: string;
  fullName: string;
  username: string;
  status: 'active' | 'inactive';
  dateCreated: string;
  lastLogin: string;
  role: string;
}

export const StaffAccounts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Mock staff data
  const staffMembers: StaffMember[] = [
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
  ];

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeStaffCount = staffMembers.filter(s => s.status === 'active').length;
  const inactiveStaffCount = staffMembers.filter(s => s.status === 'inactive').length;

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setViewDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Staff Accounts</h1>
          <p className="text-muted-foreground">
            Manage staff employee accounts and permissions
          </p>
        </div>
        <Button onClick={() => navigate('/add-new-staff')} className="bg-gradient-primary">
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
          <CardDescription>
            View and manage all staff members with filtering options
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

          {/* Staff Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.fullName}</TableCell>
                    <TableCell className="font-mono text-sm">{staff.username}</TableCell>
                    <TableCell>{staff.role}</TableCell>

                    <TableCell>{new Date(staff.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(staff.lastLogin).toLocaleDateString()}</TableCell>

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
        <Card className="quick-action-button hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/add-new-staff')}>
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

        <Card className="quick-action-button hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/manage-staff')}>
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

      {/* Staff Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Staff Account Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected staff member
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{selectedStaff.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="font-mono text-sm">{selectedStaff.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p>{selectedStaff.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge 
                    variant={selectedStaff.status === 'active' ? 'default' : 'secondary'}
                    className={selectedStaff.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {selectedStaff.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Created</label>
                  <p>{new Date(selectedStaff.dateCreated).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <p>{new Date(selectedStaff.lastLogin).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
