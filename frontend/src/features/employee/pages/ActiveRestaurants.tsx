import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Badge } from '../../../components/common/badge';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/common/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/common/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/common/alert-dialog';
import {
  ArrowLeft,
  Building2,
  Search,
  Eye,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Filter
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  cuisine: string;
  status: 'active' | 'inactive';
  joinDate: string;
  rating: number;
  totalOrders: number;
  revenue: string;
  commission: string;
  lastActive: string;
}

const mockActiveRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Sushi Zen',
    owner: 'Mike Chen',
    email: 'mike@sushizen.com',
    phone: '+1 234 567 8903',
    address: '789 Pine St, City, State 12345',
    cuisine: 'Japanese',
    status: 'active',
    joinDate: '2023-12-01',
    rating: 4.8,
    totalOrders: 1247,
    revenue: '$24,850.00',
    commission: '$3,727.50',
    lastActive: '2024-01-15 14:30'
  },
  {
    id: '2',
    name: 'Taco Fiesta',
    owner: 'Maria Garcia',
    email: 'maria@tacofiesta.com',
    phone: '+1 234 567 8904',
    address: '321 Elm St, City, State 12345',
    cuisine: 'Mexican',
    status: 'active',
    joinDate: '2023-11-15',
    rating: 4.6,
    totalOrders: 892,
    revenue: '$15,670.00',
    commission: '$2,350.50',
    lastActive: '2024-01-15 16:45'
  },
  {
    id: '3',
    name: 'Burger Corner',
    owner: 'Tom Wilson',
    email: 'tom@burgercorner.com',
    phone: '+1 234 567 8905',
    address: '555 Main Ave, City, State 12345',
    cuisine: 'American',
    status: 'active',
    joinDate: '2023-10-20',
    rating: 4.4,
    totalOrders: 1563,
    revenue: '$31,260.00',
    commission: '$4,689.00',
    lastActive: '2024-01-15 12:15'
  },
  {
    id: '4',
    name: 'Mediterranean Delight',
    owner: 'Omar Hassan',
    email: 'omar@meddelight.com',
    phone: '+1 234 567 8906',
    address: '777 Olive Dr, City, State 12345',
    cuisine: 'Mediterranean',
    status: 'inactive',
    joinDate: '2023-09-10',
    rating: 3.9,
    totalOrders: 423,
    revenue: '$8,940.00',
    commission: '$1,341.00',
    lastActive: '2024-01-10 09:20'
  }
];

export const ActiveRestaurants = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const filteredRestaurants = mockActiveRestaurants.filter(restaurant => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeactivate = (id: string) => {
    console.log('Deactivating restaurant:', id);
    // In real app, make API call
  };

  const handleActivate = (id: string) => {
    console.log('Activating restaurant:', id);
    // In real app, make API call
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default">
            <Check className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/restaurant-management')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Restaurant Management</span>
        </Button>
      </div>

      <div>
        <h1>Restaurant Directory</h1>
        <p className="text-muted-foreground">
          Manage all restaurant partners - view and update their status
        </p>
      </div>



      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Restaurant Directory ({filteredRestaurants.length})</span>
          </CardTitle>
          <CardDescription>
            View and manage all restaurant partners on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by restaurant name, owner, or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Owner</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{restaurant.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {restaurant.address}
                        </p>
                        <Badge variant="outline" className="mt-1">{restaurant.cuisine}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{restaurant.owner}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {restaurant.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {restaurant.phone}
                        </p>
                      </div>
                    </TableCell>


                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRestaurant(restaurant)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Restaurant Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {selectedRestaurant?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRestaurant && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Restaurant Name</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.name}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Owner</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.owner}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Cuisine Type</h4>
                                    <Badge variant="outline">{selectedRestaurant.cuisine}</Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Join Date</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.joinDate}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <h4 className="font-medium">Address</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.address}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Contact Email</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Phone</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.phone}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Last Active</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.lastActive}</p>
                                  </div>

                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline">Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>


                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No restaurants found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
