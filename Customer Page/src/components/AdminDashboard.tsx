import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  UserPlus, 
  UserMinus, 
  Building2, 
  LogOut as LogOutIcon, 
  DollarSign, 
  Users, 
  Truck, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Eye,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { User } from '../App';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface RestaurantRegistration {
  id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  cuisine: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
}

interface WithdrawalRequest {
  id: string;
  restaurantId: string;
  restaurantName: string;
  requestDate: string;
  reason: string;
  amountDue?: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface StaffMember {
  id: string;
  fullName: string;
  username: string;
  email: string;
  password: string; // Auto-generated initial password
  createdDate: string;
  status: 'active' | 'inactive';
}

interface Driver {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  hiredDate: string;
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  deliveries?: number;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('registrations');
  const [successMessage, setSuccessMessage] = useState('');

  // Registration requests state
  const [registrations, setRegistrations] = useState<RestaurantRegistration[]>([
    {
      id: 'REG-001',
      restaurantName: 'Pizza Palace',
      ownerName: 'Michael Chen',
      email: 'michael@pizzapalace.com',
      phone: '(555) 123-4567',
      address: '456 Main Street, New York, NY 10001',
      cuisine: 'Italian',
      submissionDate: '2025-01-08T10:30:00Z',
      status: 'pending',
      documents: ['business_license.pdf', 'health_certificate.pdf']
    },
    {
      id: 'REG-002',
      restaurantName: 'Sushi Express',
      ownerName: 'Yuki Tanaka',
      email: 'yuki@sushiexpress.com',
      phone: '(555) 987-6543',
      address: '789 Second Avenue, New York, NY 10002',
      cuisine: 'Japanese',
      submissionDate: '2025-01-07T14:20:00Z',
      status: 'pending'
    }
  ]);

  // Withdrawal requests state
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 'WTH-001',
      restaurantId: 'REST-001',
      restaurantName: 'Bella Italia',
      requestDate: '2025-01-09T09:15:00Z',
      reason: 'Business closure due to relocation',
      amountDue: 1250.75,
      status: 'pending'
    },
    {
      id: 'WTH-002',
      restaurantId: 'REST-002',
      restaurantName: 'Dragon Palace',
      requestDate: '2025-01-08T16:45:00Z',
      reason: 'Switching to different delivery platform',
      status: 'pending'
    }
  ]);

  // Staff members state
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 'STF-001',
      fullName: 'John Smith',
      username: 'smith01',
      email: 'staff@frontdash.com',
      password: 'temp123!',
      createdDate: '2025-01-01T10:00:00Z',
      status: 'active'
    },
    {
      id: 'STF-002',
      fullName: 'Jane Doe',
      username: 'doe02',
      email: 'newstaff@frontdash.com',
      password: 'temp456!',
      createdDate: '2025-01-05T14:30:00Z',
      status: 'active'
    },
    {
      id: 'STF-003',
      fullName: 'Robert Johnson',
      username: 'johnson03',
      email: 'robert.johnson@frontdash.com',
      password: 'temp789!',
      createdDate: '2024-12-15T09:20:00Z',
      status: 'inactive'
    }
  ]);

  // Drivers state
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 'DRV-001',
      name: 'Mike Thompson',
      phone: '(555) 111-2222',
      email: 'mike.thompson@frontdash.com',
      hiredDate: '2024-11-15T00:00:00Z',
      status: 'active',
      rating: 4.8,
      deliveries: 245
    },
    {
      id: 'DRV-002',
      name: 'Sarah Wilson',
      phone: '(555) 333-4444',
      email: 'sarah.wilson@frontdash.com',
      hiredDate: '2024-12-01T00:00:00Z',
      status: 'active',
      rating: 4.9,
      deliveries: 189
    },
    {
      id: 'DRV-003',
      name: 'David Brown',
      phone: '(555) 555-6666',
      hiredDate: '2024-10-20T00:00:00Z',
      status: 'suspended',
      rating: 4.2,
      deliveries: 156
    }
  ]);

  // New staff form state
  const [newStaffData, setNewStaffData] = useState({
    fullName: '',
    lastName: '',
    digits: ''
  });

  // New driver form state
  const [newDriverName, setNewDriverName] = useState('');

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateUniqueUsername = (lastName: string, digits: string) => {
    return `${lastName.toLowerCase()}${digits}`;
  };

  const handleRegistrationAction = (id: string, action: 'approve' | 'reject') => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id 
        ? { ...reg, status: action === 'approve' ? 'approved' : 'rejected' }
        : reg
    ));
    
    const registration = registrations.find(r => r.id === id);
    showSuccess(`Registration for ${registration?.restaurantName} has been ${action}d`);
  };

  const handleWithdrawalAction = (id: string, action: 'approve' | 'reject') => {
    setWithdrawalRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
        : req
    ));
    
    const request = withdrawalRequests.find(r => r.id === id);
    showSuccess(`Withdrawal request for ${request?.restaurantName} has been ${action}d`);
  };

  const handleAddStaff = () => {
    if (!newStaffData.fullName || !newStaffData.lastName || !newStaffData.digits) {
      alert('Please fill in all fields');
      return;
    }

    if (newStaffData.digits.length !== 2 || !/^\d{2}$/.test(newStaffData.digits)) {
      alert('Digits must be exactly 2 numbers');
      return;
    }

    // Check if full name is unique
    const nameExists = staffMembers.some(staff => 
      staff.fullName.toLowerCase() === newStaffData.fullName.toLowerCase()
    );
    if (nameExists) {
      alert('Staff member with this full name already exists');
      return;
    }

    // Check if username is unique
    const username = generateUniqueUsername(newStaffData.lastName, newStaffData.digits);
    const usernameExists = staffMembers.some(staff => staff.username === username);
    if (usernameExists) {
      alert('Username already exists. Please use different digits.');
      return;
    }

    const newStaff: StaffMember = {
      id: `STF-${String(staffMembers.length + 1).padStart(3, '0')}`,
      fullName: newStaffData.fullName,
      username: username,
      email: `${username}@frontdash.com`,
      password: generatePassword(),
      createdDate: new Date().toISOString(),
      status: 'active'
    };

    setStaffMembers(prev => [...prev, newStaff]);
    setNewStaffData({ fullName: '', lastName: '', digits: '' });
    showSuccess(`Staff member ${newStaff.fullName} added successfully. Username: ${newStaff.username}, Password: ${newStaff.password}`);
  };

  const handleDeleteStaff = (id: string) => {
    const staff = staffMembers.find(s => s.id === id);
    setStaffMembers(prev => prev.filter(s => s.id !== id));
    showSuccess(`Staff member ${staff?.fullName} has been deleted`);
  };

  const handleAddDriver = () => {
    if (!newDriverName.trim()) {
      alert('Please enter driver name');
      return;
    }

    // Check if name is unique
    const nameExists = drivers.some(driver => 
      driver.name.toLowerCase() === newDriverName.toLowerCase()
    );
    if (nameExists) {
      alert('Driver with this name already exists');
      return;
    }

    const newDriver: Driver = {
      id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      name: newDriverName,
      hiredDate: new Date().toISOString(),
      status: 'active',
      rating: 0,
      deliveries: 0
    };

    setDrivers(prev => [...prev, newDriver]);
    setNewDriverName('');
    showSuccess(`Driver ${newDriver.name} has been hired successfully`);
  };

  const handleFireDriver = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    setDrivers(prev => prev.filter(d => d.id !== id));
    showSuccess(`Driver ${driver?.name} has been fired`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-red-100 text-red-800">
            Administrator
          </Badge>
        </div>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registrations" className="relative">
            Restaurant Registrations
            {registrations.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {registrations.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="relative">
            Withdrawal Requests
            {withdrawalRequests.filter(w => w.status === 'pending').length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {withdrawalRequests.filter(w => w.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="drivers">Driver Management</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Restaurant Registration Requests</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {registrations.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Registration Requests</h3>
                  <p className="text-muted-foreground">All registration requests have been processed</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <Card key={registration.id} className={registration.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{registration.restaurantName}</CardTitle>
                        <Badge 
                          variant={registration.status === 'pending' ? 'default' : 
                                   registration.status === 'approved' ? 'secondary' : 'destructive'}
                          className={registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                     registration.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {registration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(registration.submissionDate)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Restaurant Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Cuisine:</strong> {registration.cuisine}</p>
                          <div className="flex items-start space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span>{registration.address}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Owner Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {registration.ownerName}</p>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{registration.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{registration.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {registration.documents && (
                      <div>
                        <h4 className="font-medium mb-2">Submitted Documents</h4>
                        <div className="flex flex-wrap gap-2">
                          {registration.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {registration.status === 'pending' && (
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegistrationAction(registration.id, 'reject')}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRegistrationAction(registration.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6">
          <h2 className="text-xl font-semibold">Restaurant Withdrawal Requests</h2>
          
          {withdrawalRequests.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LogOutIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Withdrawal Requests</h3>
                  <p className="text-muted-foreground">No restaurants have requested to withdraw from FrontDash</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {withdrawalRequests.map((request) => (
                <Card key={request.id} className={request.status === 'pending' ? 'border-orange-200 bg-orange-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{request.restaurantName}</CardTitle>
                        <Badge 
                          variant={request.status === 'pending' ? 'default' : 
                                   request.status === 'approved' ? 'secondary' : 'destructive'}
                          className={request.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                                     request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {request.status}
                        </Badge>
                        {request.amountDue && request.amountDue > 0 && (
                          <Badge variant="destructive">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Payment Due
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(request.requestDate)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Reason for Withdrawal</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {request.reason}
                      </p>
                    </div>
                    
                    {request.amountDue && request.amountDue > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Outstanding Payment:</strong> ${request.amountDue.toFixed(2)}
                          <br />
                          <span className="text-sm">This amount must be settled before withdrawal approval.</span>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {request.status === 'pending' && (
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdrawalAction(request.id, 'reject')}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleWithdrawalAction(request.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={request.amountDue && request.amountDue > 0}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Staff Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Create a new staff account with auto-generated credentials
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name (must be unique)</Label>
                    <Input
                      id="fullName"
                      value={newStaffData.fullName}
                      onChange={(e) => setNewStaffData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newStaffData.lastName}
                      onChange={(e) => setNewStaffData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Smith"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="digits">Two Digits</Label>
                    <Input
                      id="digits"
                      value={newStaffData.digits}
                      onChange={(e) => setNewStaffData(prev => ({ ...prev, digits: e.target.value }))}
                      placeholder="01"
                      maxLength={2}
                      pattern="[0-9]{2}"
                    />
                    <p className="text-xs text-muted-foreground">
                      Username will be: {newStaffData.lastName.toLowerCase()}{newStaffData.digits}
                    </p>
                  </div>
                  
                  <Button onClick={handleAddStaff} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Staff Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {staffMembers.map((staff) => (
              <Card key={staff.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{staff.fullName}</CardTitle>
                      <Badge 
                        variant={staff.status === 'active' ? 'default' : 'secondary'}
                        className={staff.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {staff.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(staff.createdDate)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Username:</strong> {staff.username}</p>
                      <p><strong>Email:</strong> {staff.email}</p>
                    </div>
                    <div>
                      <p><strong>Initial Password:</strong> {staff.password}</p>
                      <p className="text-xs text-muted-foreground">
                        Password should be changed on first login
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-3 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {staff.fullName}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Driver Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Truck className="h-4 w-4 mr-2" />
                  Hire Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Hire New Driver</DialogTitle>
                  <DialogDescription>
                    Add a new driver to the FrontDash fleet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name (must be unique)</Label>
                    <Input
                      id="driverName"
                      value={newDriverName}
                      onChange={(e) => setNewDriverName(e.target.value)}
                      placeholder="Alex Rodriguez"
                    />
                  </div>
                  
                  <Button onClick={handleAddDriver} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Hire Driver
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <Badge 
                      variant={driver.status === 'active' ? 'default' : 
                               driver.status === 'suspended' ? 'destructive' : 'secondary'}
                      className={driver.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {driver.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    {driver.phone && <p><strong>Phone:</strong> {driver.phone}</p>}
                    {driver.email && <p><strong>Email:</strong> {driver.email}</p>}
                    <p><strong>Hired:</strong> {formatDate(driver.hiredDate)}</p>
                  </div>
                  
                  {driver.rating !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Rating:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{driver.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                  )}
                  
                  {driver.deliveries !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Deliveries:</span>
                      <span className="font-medium">{driver.deliveries}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-3 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <UserMinus className="h-4 w-4 mr-1" />
                          Fire
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Fire Driver</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to fire {driver.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleFireDriver(driver.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Fire Driver
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}