import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Store, 
  Settings, 
  Menu, 
  Clock, 
  Phone, 
  MapPin, 
  Mail, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { User } from '../App';

interface RestaurantDashboardProps {
  user: User;
  onLogout: () => void;
}

interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export function RestaurantDashboard({ user, onLogout }: RestaurantDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Contact information state
  const [contactInfo, setContactInfo] = useState({
    phone: '(555) 123-4567',
    email: user.email,
    address: '123 Main Street, New York, NY 10001'
  });

  // Business hours state
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '09:00', close: '22:00', closed: false },
    tuesday: { open: '09:00', close: '22:00', closed: false },
    wednesday: { open: '09:00', close: '22:00', closed: false },
    thursday: { open: '09:00', close: '22:00', closed: false },
    friday: { open: '09:00', close: '23:00', closed: false },
    saturday: { open: '10:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '21:00', closed: false }
  });

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh tomatoes, mozzarella, basil',
      price: 18.99,
      category: 'Pizza',
      available: true
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan',
      price: 12.99,
      category: 'Salads',
      available: true
    }
  ]);

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      setIsLoading(false);
      return;
    }

    // Mock API call
    setTimeout(() => {
      setSuccessMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleContactUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setSuccessMessage('Contact information updated successfully');
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleHoursUpdate = async () => {
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setSuccessMessage('Business hours updated successfully');
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price || !newMenuItem.category) {
      alert('Please fill in all fields');
      return;
    }

    const menuItem: MenuItemData = {
      id: Date.now().toString(),
      name: newMenuItem.name,
      description: newMenuItem.description,
      price: parseFloat(newMenuItem.price),
      category: newMenuItem.category,
      available: true
    };

    setMenuItems(prev => [...prev, menuItem]);
    setNewMenuItem({ name: '', description: '', price: '', category: '' });
    setSuccessMessage('Menu item added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    setSuccessMessage('Menu item removed successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const handleWithdraw = async () => {
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      alert('Withdrawal request submitted successfully. FrontDash will review your request and send a confirmation within 2-3 business days.');
      setShowWithdrawDialog(false);
      setIsLoading(false);
      onLogout();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Active Partner
        </Badge>
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <div className="text-primary">$</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,247</div>
                <p className="text-xs text-muted-foreground">+8% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <div className="text-yellow-500">★</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">Based on 89 reviews</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and settings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => setActiveTab('menu')}>
                <Menu className="h-4 w-4 mr-2" />
                Manage Menu
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('hours')}>
                <Clock className="h-4 w-4 mr-2" />
                Update Hours
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('contact')}>
                <Phone className="h-4 w-4 mr-2" />
                Update Contact Info
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>Add, edit, or remove menu items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Item */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Menu Item
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Margherita Pizza"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={newMenuItem.category}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Pizza"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the item..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddMenuItem} className="w-full">
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing Menu Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">Current Menu Items</h3>
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge variant={item.available ? 'default' : 'secondary'}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMenuItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your restaurant's operating hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-24 font-medium capitalize">{day}</div>
                  <Switch
                    checked={!hours.closed}
                    onCheckedChange={(checked) => 
                      setBusinessHours(prev => ({
                        ...prev,
                        [day]: { ...prev[day], closed: !checked }
                      }))
                    }
                  />
                  {!hours.closed ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => 
                          setBusinessHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day], open: e.target.value }
                          }))
                        }
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => 
                          setBusinessHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day], close: e.target.value }
                          }))
                        }
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
              <Button onClick={handleHoursUpdate} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Hours'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your restaurant's contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <Phone className="h-4 w-4 mt-3 mr-3 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex">
                    <Mail className="h-4 w-4 mt-3 mr-3 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex">
                    <MapPin className="h-4 w-4 mt-3 mr-3 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Contact Information'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Withdraw from FrontDash */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Withdraw from FrontDash</CardTitle>
              <CardDescription>
                End your partnership with FrontDash. This action requires admin approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showWithdrawDialog ? (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowWithdrawDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Withdraw from FrontDash
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-destructive bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      <strong>Warning:</strong> This will initiate the process to remove your restaurant from FrontDash. 
                      Your restaurant will no longer receive orders through our platform. This action requires approval 
                      from FrontDash administration.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="destructive" 
                      onClick={handleWithdraw}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Confirm Withdrawal'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowWithdrawDialog(false)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}