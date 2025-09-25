import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Badge } from '../../../components/common/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/common/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/common/dialog';
import { Search, Filter, Truck, ArrowLeft, MapPin, Star, Phone, Clock, UserCheck, Activity } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../../components/common/avatar';

interface Driver {
  id: string;
  fullName: string;
  phone: string;
  status: 'online' | 'busy' | 'offline';
  rating: number;
  totalDeliveries: number;
  currentLocation: string;
  vehicleType: string;
  joinDate: string;
  todayDeliveries: number;
  earnings: number;
}

export const ActiveDrivers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'busy' | 'offline'>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Mock driver data
  const activeDrivers: Driver[] = [
    {
      id: '1',
      fullName: 'Michael Rodriguez',
      phone: '+1 (555) 123-4567',
      status: 'online',
      rating: 4.9,
      totalDeliveries: 1245,
      currentLocation: 'Downtown District',
      vehicleType: 'Motorcycle',
      joinDate: '2024-01-15',
      todayDeliveries: 8,
      earnings: 145.50
    },
    {
      id: '2',
      fullName: 'Sarah Chen',
      phone: '+1 (555) 234-5678',
      status: 'busy',
      rating: 4.8,
      totalDeliveries: 980,
      currentLocation: 'Business Quarter',
      vehicleType: 'Car',
      joinDate: '2024-02-20',
      todayDeliveries: 12,
      earnings: 198.75
    },
    {
      id: '3',
      fullName: 'David Park',
      phone: '+1 (555) 345-6789',
      status: 'online',
      rating: 4.7,
      totalDeliveries: 756,
      currentLocation: 'Residential Area',
      vehicleType: 'Bicycle',
      joinDate: '2024-03-10',
      todayDeliveries: 6,
      earnings: 89.25
    },
    {
      id: '4',
      fullName: 'Lisa Thompson',
      phone: '+1 (555) 456-7890',
      status: 'offline',
      rating: 4.9,
      totalDeliveries: 1543,
      currentLocation: 'Uptown Area',
      vehicleType: 'Car',
      joinDate: '2023-11-05',
      todayDeliveries: 15,
      earnings: 267.80
    },
    {
      id: '5',
      fullName: 'Ahmed Hassan',
      phone: '+1 (555) 567-8901',
      status: 'busy',
      rating: 4.6,
      totalDeliveries: 623,
      currentLocation: 'Mall District',
      vehicleType: 'Motorcycle',
      joinDate: '2024-04-12',
      todayDeliveries: 9,
      earnings: 156.40
    }
  ];

  const filteredDrivers = activeDrivers.filter(driver => {
    const matchesSearch = driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setViewDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-amber-100 text-amber-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const onlineDrivers = activeDrivers.filter(d => d.status === 'online').length;
  const busyDrivers = activeDrivers.filter(d => d.status === 'busy').length;
  const totalDeliveriesToday = activeDrivers.reduce((sum, d) => sum + d.todayDeliveries, 0);
  const avgRating = activeDrivers.reduce((sum, d) => sum + d.rating, 0) / activeDrivers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/driver-management')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Driver Management
        </Button>
        <div>
          <h1>Active Drivers</h1>
          <p className="text-muted-foreground">
            View and manage currently active delivery drivers
          </p>
        </div>
      </div>

      {/* Driver Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online Drivers</p>
                <p className="text-2xl font-bold text-green-600">{onlineDrivers}</p>
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
                <p className="text-sm text-muted-foreground">Busy Drivers</p>
                <p className="text-2xl font-bold text-amber-600">{busyDrivers}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Deliveries</p>
                <p className="text-2xl font-bold text-primary">{totalDeliveriesToday}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Active Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Active Driver Directory</span>
          </CardTitle>
          <CardDescription>
            Current active drivers with filtering and sorting options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'online' | 'busy' | 'offline') => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Today's Deliveries</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
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
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {driver.phone}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                        {driver.todayDeliveries}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDrivers.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No drivers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected driver
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                    {getInitials(selectedDriver.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDriver.fullName}</h3>
                  <p className="text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {selectedDriver.phone}
                  </p>
                  <Badge className={getStatusColor(selectedDriver.status)}>
                    {selectedDriver.status.charAt(0).toUpperCase() + selectedDriver.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-lg font-bold">{selectedDriver.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-lg font-bold">{selectedDriver.totalDeliveries}</p>
                  <p className="text-xs text-muted-foreground">Total Deliveries</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-lg font-bold">{selectedDriver.todayDeliveries}</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-lg">💰</span>
                  </div>
                  <p className="text-lg font-bold">${selectedDriver.earnings}</p>
                  <p className="text-xs text-muted-foreground">Today's Earnings</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Location</label>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    {selectedDriver.currentLocation}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                  <p>{selectedDriver.vehicleType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <p>{new Date(selectedDriver.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(selectedDriver.status)}>
                    {selectedDriver.status.charAt(0).toUpperCase() + selectedDriver.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
