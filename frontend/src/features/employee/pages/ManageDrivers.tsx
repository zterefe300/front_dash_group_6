import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Badge } from '../../../components/common/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/common/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/common/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/common/alert-dialog';
import { Search, Truck, ArrowLeft, UserCheck, UserX, UserPlus, Star, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../components/common/avatar';
import { toast } from 'sonner';

interface Driver {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  rating: number;
  totalDeliveries: number;
  vehicleType: string;
  joinDate: string;
  status: 'active' | 'available' | 'terminated';
  terminationDate?: string;
  terminationReason?: string;
  location: string;
}

export const ManageDrivers = () => {
  const navigate = useNavigate();
  const [searchTerms, setSearchTerms] = useState({
    active: '',
    available: '',
    terminated: ''
  });
  
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'hire' | 'terminate' | 'rehire' | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Mock driver data
  const [drivers, setDrivers] = useState<Driver[]>([
    // Active Drivers
    {
      id: '1',
      fullName: 'Michael Rodriguez',
      phone: '+1 (555) 123-4567',
      email: 'michael.r@email.com',
      rating: 4.9,
      totalDeliveries: 1245,
      vehicleType: 'Motorcycle',
      joinDate: '2024-01-15',
      status: 'active',
      location: 'Downtown District'
    },
    {
      id: '2',
      fullName: 'Sarah Chen',
      phone: '+1 (555) 234-5678',
      email: 'sarah.c@email.com',
      rating: 4.8,
      totalDeliveries: 980,
      vehicleType: 'Car',
      joinDate: '2024-02-20',
      status: 'active',
      location: 'Business Quarter'
    },
    // Available to Hire
    {
      id: '3',
      fullName: 'James Wilson',
      phone: '+1 (555) 345-6789',
      email: 'james.w@email.com',
      rating: 0,
      totalDeliveries: 0,
      vehicleType: 'Bicycle',
      joinDate: '2024-09-01',
      status: 'available',
      location: 'Suburban Area'
    },
    {
      id: '4',
      fullName: 'Emma Thompson',
      phone: '+1 (555) 456-7890',
      email: 'emma.t@email.com',
      rating: 0,
      totalDeliveries: 0,
      vehicleType: 'Motorcycle',
      joinDate: '2024-09-05',
      status: 'available',
      location: 'City Center'
    },
    // Terminated Drivers
    {
      id: '5',
      fullName: 'David Park',
      phone: '+1 (555) 567-8901',
      email: 'david.p@email.com',
      rating: 4.2,
      totalDeliveries: 456,
      vehicleType: 'Car',
      joinDate: '2024-03-10',
      status: 'terminated',
      terminationDate: '2024-08-15',
      terminationReason: 'Poor performance',
      location: 'East District'
    },
    {
      id: '6',
      fullName: 'Lisa Johnson',
      phone: '+1 (555) 678-9012',
      email: 'lisa.j@email.com',
      rating: 4.6,
      totalDeliveries: 789,
      vehicleType: 'Motorcycle',
      joinDate: '2024-02-01',
      status: 'terminated',
      terminationDate: '2024-07-20',
      terminationReason: 'Policy violation',
      location: 'West Side'
    }
  ]);

  const activeDrivers = drivers.filter(d => d.status === 'active');
  const availableDrivers = drivers.filter(d => d.status === 'available');
  const terminatedDrivers = drivers.filter(d => d.status === 'terminated');

  const getFilteredDrivers = (driverList: Driver[], searchTerm: string) => {
    return driverList.filter(driver =>
      driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAction = (driver: Driver, action: 'hire' | 'terminate' | 'rehire') => {
    setSelectedDriver(driver);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedDriver || !actionType) return;

    setDrivers(prev => prev.map(driver => {
      if (driver.id === selectedDriver.id) {
        switch (actionType) {
          case 'hire':
            return { ...driver, status: 'active' as const };
          case 'terminate':
            return { 
              ...driver, 
              status: 'terminated' as const,
              terminationDate: new Date().toISOString().split('T')[0],
              terminationReason: 'Administrative action'
            };
          case 'rehire':
            return { 
              ...driver, 
              status: 'active' as const,
              terminationDate: undefined,
              terminationReason: undefined
            };
          default:
            return driver;
        }
      }
      return driver;
    }));

    const actionMessages = {
      hire: `${selectedDriver.fullName} has been hired successfully`,
      terminate: `${selectedDriver.fullName} has been terminated`,
      rehire: `${selectedDriver.fullName} has been rehired successfully`
    };

    toast.success(actionMessages[actionType]);
    setActionDialogOpen(false);
    setSelectedDriver(null);
    setActionType(null);
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setViewDetailsOpen(true);
  };

  const getActionButtonConfig = (action: 'hire' | 'terminate' | 'rehire') => {
    switch (action) {
      case 'hire':
        return {
          text: 'Hire',
          icon: UserPlus,
          className: 'bg-green-600 hover:bg-green-700'
        };
      case 'terminate':
        return {
          text: 'Terminate',
          icon: UserX,
          className: 'bg-red-600 hover:bg-red-700'
        };
      case 'rehire':
        return {
          text: 'Hire Back',
          icon: UserCheck,
          className: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/driver-management')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Driver Management
        </Button>
        <div>
          <h1>Manage Drivers</h1>
          <p className="text-muted-foreground">
            Hire, terminate, and manage driver accounts
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drivers</p>
                <p className="text-2xl font-bold text-green-600">{activeDrivers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available to Hire</p>
                <p className="text-2xl font-bold text-blue-600">{availableDrivers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminated</p>
                <p className="text-2xl font-bold text-gray-600">{terminatedDrivers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Management Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Active Drivers ({activeDrivers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Ready to Hire ({availableDrivers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="terminated" className="flex items-center space-x-2">
            <UserX className="h-4 w-4" />
            <span>Terminated ({terminatedDrivers.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Active Drivers Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Drivers</CardTitle>
              <CardDescription>
                Currently active drivers with termination options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search active drivers..."
                    value={searchTerms.active}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, active: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDrivers(activeDrivers, searchTerms.active).map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                                {getInitials(driver.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{driver.fullName}</p>
                              <p className="text-sm text-muted-foreground">{driver.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{driver.totalDeliveries}</TableCell>
                        <TableCell>{new Date(driver.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAction(driver, 'terminate')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available to Hire Tab */}
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Ready to Hire</CardTitle>
              <CardDescription>
                Drivers available for hiring with hire action buttons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search available drivers..."
                    value={searchTerms.available}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, available: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDrivers(availableDrivers, searchTerms.available).map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {getInitials(driver.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{driver.fullName}</p>
                              <p className="text-sm text-muted-foreground">{driver.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAction(driver, 'hire')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Hire
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terminated Drivers Tab */}
        <TabsContent value="terminated">
          <Card>
            <CardHeader>
              <CardTitle>Terminated Drivers</CardTitle>
              <CardDescription>
                Previously terminated drivers with rehire options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search terminated drivers..."
                    value={searchTerms.terminated}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, terminated: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Termination Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDrivers(terminatedDrivers, searchTerms.terminated).map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                {getInitials(driver.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{driver.fullName}</p>
                              <p className="text-sm text-muted-foreground">{driver.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{driver.totalDeliveries}</TableCell>
                        <TableCell>
                          {driver.terminationDate ? new Date(driver.terminationDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            {driver.terminationReason || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAction(driver, 'rehire')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Hire Back
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Confirm Action</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType && selectedDriver && (
                <>
                  Are you sure you want to <strong>{actionType}</strong> {selectedDriver.fullName}?
                  {actionType === 'terminate' && ' This action will remove the driver from active duty.'}
                  {actionType === 'hire' && ' This action will activate the driver for deliveries.'}
                  {actionType === 'rehire' && ' This action will reactivate the driver for deliveries.'}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={actionType ? getActionButtonConfig(actionType).className : ''}
            >
              {actionType && (
                <>
                  {React.createElement(getActionButtonConfig(actionType).icon, { className: "h-4 w-4 mr-2" })}
                  {getActionButtonConfig(actionType).text}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Driver Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected driver
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                    {getInitials(selectedDriver.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDriver.fullName}</h3>
                  <p className="text-muted-foreground">{selectedDriver.email}</p>
                  <p className="text-muted-foreground">{selectedDriver.phone}</p>
                  <Badge className={
                    selectedDriver.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedDriver.status === 'available' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedDriver.status.charAt(0).toUpperCase() + selectedDriver.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                  <p>{selectedDriver.vehicleType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p>{selectedDriver.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <p>{new Date(selectedDriver.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Deliveries</label>
                  <p>{selectedDriver.totalDeliveries}</p>
                </div>
                {selectedDriver.rating > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rating</label>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {selectedDriver.rating}
                    </div>
                  </div>
                )}
                {selectedDriver.terminationDate && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Termination Date</label>
                      <p>{new Date(selectedDriver.terminationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Termination Reason</label>
                      <p>{selectedDriver.terminationReason || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
