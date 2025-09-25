import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Users, 
  Settings, 
  Clock, 
  MapPin, 
  Truck, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertTriangle,
  Navigation,
  Package,
  DollarSign,
  Route,
  Timer,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { User } from '../App';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  restaurantName: string;
  restaurantAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderTime: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  estimatedDeliveryTime?: number; // in minutes
  driverId?: string;
  driverName?: string;
  deliveryNotes?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  currentOrders: number;
  rating: number;
}

export function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState('queue');
  const [showPasswordDialog, setShowPasswordDialog] = useState(user.isFirstLogin || false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Order queue state
  const [orderQueue, setOrderQueue] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Alice Johnson',
      customerPhone: '(555) 123-4567',
      customerAddress: '456 Oak Street, New York, NY 10002',
      restaurantName: 'Bella Italia',
      restaurantAddress: '123 Main Street, New York, NY 10001',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
        { name: 'Caesar Salad', quantity: 1, price: 12.99 }
      ],
      total: 31.98,
      orderTime: '2025-01-09T14:30:00Z',
      status: 'pending'
    },
    {
      id: 'ORD-002',
      customerName: 'Bob Smith',
      customerPhone: '(555) 987-6543',
      customerAddress: '789 Pine Avenue, New York, NY 10003',
      restaurantName: 'Dragon Palace',
      restaurantAddress: '321 Second Street, New York, NY 10001',
      items: [
        { name: 'Sweet & Sour Chicken', quantity: 2, price: 15.99 },
        { name: 'Fried Rice', quantity: 1, price: 8.99 }
      ],
      total: 40.97,
      orderTime: '2025-01-09T14:45:00Z',
      status: 'pending'
    }
  ]);

  // Active orders state (assigned/in progress)
  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: 'ORD-100',
      customerName: 'Carol Davis',
      customerPhone: '(555) 456-7890',
      customerAddress: '321 Elm Street, New York, NY 10004',
      restaurantName: 'Taco Fiesta',
      restaurantAddress: '654 Third Avenue, New York, NY 10001',
      items: [
        { name: 'Chicken Tacos', quantity: 3, price: 4.99 },
        { name: 'Guacamole', quantity: 1, price: 3.99 }
      ],
      total: 18.96,
      orderTime: '2025-01-09T13:15:00Z',
      status: 'assigned',
      estimatedDeliveryTime: 25,
      driverId: 'DRV-001',
      driverName: 'Mike Thompson'
    }
  ]);

  // Drivers state
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 'DRV-001', name: 'Mike Thompson', phone: '(555) 111-2222', status: 'busy', currentOrders: 1, rating: 4.8 },
    { id: 'DRV-002', name: 'Sarah Wilson', phone: '(555) 333-4444', status: 'available', currentOrders: 0, rating: 4.9 },
    { id: 'DRV-003', name: 'David Brown', phone: '(555) 555-6666', status: 'available', currentOrders: 0, rating: 4.7 },
    { id: 'DRV-004', name: 'Lisa Garcia', phone: '(555) 777-8888', status: 'offline', currentOrders: 0, rating: 4.6 }
  ]);

  // Delivery completion state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryAmount, setDeliveryAmount] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<'delivered' | 'cancelled'>('delivered');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  useEffect(() => {
    if (user.isFirstLogin) {
      setShowPasswordDialog(true);
    }
  }, [user.isFirstLogin]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      setIsLoading(false);
      return;
    }

    if (user.isFirstLogin && !passwordData.currentPassword) {
      // For first-time login, we might not require current password
      // or use a different validation flow
    }

    // Mock API call
    setTimeout(() => {
      setSuccessMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordDialog(false);
      setIsLoading(false);
      
      // Update user object to mark as not first login
      if (user.isFirstLogin) {
        user.isFirstLogin = false;
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const calculateDeliveryTime = (restaurantAddress: string, customerAddress: string): number => {
    // Mock calculation - in real app would use Google Maps API or similar
    // For demo, we'll simulate different distances based on address differences
    const baseTime = 15; // Base delivery time in minutes
    const addressDistance = Math.abs(restaurantAddress.length - customerAddress.length); // Simple mock
    const additionalTime = Math.floor(addressDistance / 10) * 5; // Add 5 min per "distance unit"
    return Math.min(baseTime + additionalTime, 45); // Cap at 45 minutes
  };

  const handleProcessNextOrder = () => {
    if (orderQueue.length === 0) return;

    const nextOrder = orderQueue[0];
    // Calculate estimated delivery time
    const estimatedTime = calculateDeliveryTime(nextOrder.restaurantAddress, nextOrder.customerAddress);
    
    // Move order from queue to processing (but don't assign driver yet)
    const updatedOrder = { ...nextOrder, estimatedDeliveryTime: estimatedTime };
    setOrderQueue(prev => prev.slice(1)); // Remove from queue
    
    // Show order details for staff review
    setSelectedOrder(updatedOrder);
    setActiveTab('assignment');
  };

  const handleAssignDriver = (order: Order, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    // Update order with driver assignment
    const assignedOrder = {
      ...order,
      status: 'assigned' as const,
      driverId: driver.id,
      driverName: driver.name
    };

    // Add to active orders
    setActiveOrders(prev => [...prev, assignedOrder]);
    
    // Update driver status
    setDrivers(prev => prev.map(d => 
      d.id === driverId 
        ? { ...d, status: 'busy' as const, currentOrders: d.currentOrders + 1 }
        : d
    ));

    setSelectedOrder(null);
    setSuccessMessage(`Order ${order.id} assigned to ${driver.name}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleManualTimeUpdate = (orderId: string, newTime: number) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, estimatedDeliveryTime: newTime }
        : order
    ));
    setSuccessMessage('Delivery time updated');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCompleteDelivery = () => {
    if (!selectedOrder) return;

    const finalAmount = parseFloat(deliveryAmount) || selectedOrder.total;
    
    // Update order status
    const completedOrder = {
      ...selectedOrder,
      status: deliveryStatus,
      deliveryNotes: deliveryNotes,
      actualAmount: finalAmount
    };

    // Remove from active orders
    setActiveOrders(prev => prev.filter(order => order.id !== selectedOrder.id));
    
    // Update driver status
    if (selectedOrder.driverId) {
      setDrivers(prev => prev.map(d => 
        d.id === selectedOrder.driverId 
          ? { ...d, status: 'available' as const, currentOrders: Math.max(0, d.currentOrders - 1) }
          : d
      ));
    }

    setSelectedOrder(null);
    setDeliveryAmount('');
    setDeliveryStatus('delivered');
    setDeliveryNotes('');
    
    setSuccessMessage(`Order ${completedOrder.id} marked as ${deliveryStatus}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeSinceOrder = (orderTime: string) => {
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    return `${diffInMinutes}m ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Staff Member
          </Badge>
          {user.isFirstLogin && (
            <Badge variant="destructive">
              First Login - Change Password Required
            </Badge>
          )}
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

      {/* First-time login password change dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {user.isFirstLogin ? 'Welcome! Set Your Password' : 'Change Password'}
            </DialogTitle>
            <DialogDescription>
              {user.isFirstLogin 
                ? 'For security, please set a new password for your account.'
                : 'Update your account password'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {!user.isFirstLogin && (
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
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                {user.isFirstLogin ? 'New Password' : 'New Password'}
              </Label>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Updating...' : user.isFirstLogin ? 'Set Password' : 'Change Password'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue" className="relative">
            Order Queue
            {orderQueue.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {orderQueue.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order Queue</h2>
            <Button 
              onClick={handleProcessNextOrder}
              disabled={orderQueue.length === 0}
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>Process Next Order</span>
            </Button>
          </div>

          {orderQueue.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Orders in Queue</h3>
                  <p className="text-muted-foreground">All orders have been processed</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orderQueue.map((order, index) => (
                <Card key={order.id} className={index === 0 ? 'border-primary' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        {index === 0 && <Badge variant="default">Next</Badge>}
                        <Badge variant="outline">{getTimeSinceOrder(order.orderTime)}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(order.orderTime)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Customer</h4>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        <div className="flex items-start space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">{order.customerAddress}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Restaurant</h4>
                        <p className="text-sm">{order.restaurantName}</p>
                        <div className="flex items-start space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">{order.restaurantAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="space-y-1">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <h2 className="text-xl font-semibold">Active Orders</h2>
          
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Active Orders</h3>
                  <p className="text-muted-foreground">No orders currently assigned to drivers</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          <span>{order.estimatedDeliveryTime}m ETA</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Customer</h4>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Driver</h4>
                        <p className="text-sm">{order.driverName}</p>
                        <Badge variant="outline" className="text-xs">
                          <Truck className="h-3 w-3 mr-1" />
                          On Route
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Delivery Time</h4>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={order.estimatedDeliveryTime}
                            onChange={(e) => handleManualTimeUpdate(order.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-sm"
                          />
                          <span className="text-sm text-muted-foreground">minutes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Complete Delivery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Delivery Completion Dialog */}
          <Dialog open={!!selectedOrder && activeTab === 'active'} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Delivery</DialogTitle>
                <DialogDescription>
                  Record the final delivery details for order {selectedOrder?.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryStatus">Delivery Status</Label>
                  <Select value={deliveryStatus} onValueChange={(value: 'delivered' | 'cancelled') => setDeliveryStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivered">Successfully Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled/Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAmount">Final Amount (if different)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deliveryAmount"
                      type="number"
                      step="0.01"
                      value={deliveryAmount}
                      onChange={(e) => setDeliveryAmount(e.target.value)}
                      placeholder={selectedOrder?.total.toFixed(2)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use original amount: ${selectedOrder?.total.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryNotes">Notes (Optional)</Label>
                  <Textarea
                    id="deliveryNotes"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Any additional notes about the delivery..."
                    className="h-20"
                  />
                </div>

                <Button onClick={handleCompleteDelivery} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Delivery
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <h2 className="text-xl font-semibold">Driver Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <Badge 
                      variant={driver.status === 'available' ? 'default' : 
                               driver.status === 'busy' ? 'secondary' : 'outline'}
                      className={driver.status === 'available' ? 'bg-green-100 text-green-800' : 
                                 driver.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {driver.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{driver.phone}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{driver.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Orders:</span>
                      <span className="text-sm font-medium">{driver.currentOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-6">
          <h2 className="text-xl font-semibold">Order Assignment</h2>
          
          {selectedOrder ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
                  <CardDescription>
                    Review order details and assign to an available driver
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Customer</h4>
                      <p className="text-sm">{selectedOrder.customerName}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                      <div className="flex items-start space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{selectedOrder.customerAddress}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Restaurant</h4>
                      <p className="text-sm">{selectedOrder.restaurantName}</p>
                      <div className="flex items-start space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{selectedOrder.restaurantAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Estimated Delivery Time:</span>
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{selectedOrder.estimatedDeliveryTime} minutes</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Calculated based on distance between restaurant and customer
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Drivers</CardTitle>
                  <CardDescription>
                    Select a driver to assign this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {drivers.filter(d => d.status === 'available').map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-muted-foreground">{driver.phone}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs">Rating: {driver.rating}</span>
                              <span className="text-yellow-500 text-xs">★</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAssignDriver(selectedOrder, driver.id)}
                          size="sm"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    ))}
                    
                    {drivers.filter(d => d.status === 'available').length === 0 && (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No drivers currently available</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Order will remain in queue until a driver becomes available
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Order Selected</h3>
                  <p className="text-muted-foreground">
                    Process an order from the queue to assign it to a driver
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveTab('queue')}
                    variant="outline"
                  >
                    Go to Order Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={() => setShowPasswordDialog(true)}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}