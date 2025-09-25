import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { 
  ShoppingCart, 
  Search, 
  Clock, 
  CheckCircle, 
  History,
  MapPin,
  User,
  DollarSign,
  Package,
  UserCheck
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  restaurant: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'not_delivered' | 'cancelled';
  orderTime: string;
  deliveryAddress: string;
  driver?: string;
  estimatedDelivery?: string;
}

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  phone: string;
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Mike Wilson',
    status: 'available',
    phone: '+1 (555) 0101'
  },
  {
    id: '2',
    name: 'Sarah Garcia',
    status: 'available',
    phone: '+1 (555) 0102'
  },
  {
    id: '3',
    name: 'Tom Chen',
    status: 'busy',
    phone: '+1 (555) 0103'
  },
  {
    id: '4',
    name: 'Lisa Brown',
    status: 'available',
    phone: '+1 (555) 0104'
  }
];

export const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);

  const [orderQueue, setOrderQueue] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'John Smith',
      restaurant: 'Pizza Palace',
      items: ['Large Pepperoni Pizza', 'Garlic Bread', 'Coke'],
      total: 28.50,
      status: 'pending',
      orderTime: '2024-01-15 14:30',
      deliveryAddress: '123 Main St, City, State'
    },
    {
      id: '2',  
      orderNumber: 'ORD-002',
      customer: 'Jane Doe',
      restaurant: 'Sushi Zen',
      items: ['California Roll', 'Salmon Sashimi', 'Miso Soup'],
      total: 35.00,
      status: 'pending',
      orderTime: '2024-01-15 14:25',
      deliveryAddress: '456 Oak Ave, City, State'
    }
  ]);

  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: '3',
      orderNumber: 'ORD-003',
      customer: 'Mike Johnson',
      restaurant: 'Burger House',
      items: ['Cheeseburger', 'Fries', 'Milkshake'],
      total: 22.75,
      status: 'out_for_delivery',
      orderTime: '2024-01-15 14:00',
      deliveryAddress: '789 Pine St, City, State',
      driver: 'Tom Wilson',
      estimatedDelivery: '15:00'
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      customer: 'Sarah Wilson',
      restaurant: 'Taco Fiesta',
      items: ['Chicken Tacos (3)', 'Guacamole', 'Mexican Rice'],
      total: 18.25,
      status: 'out_for_delivery',
      orderTime: '2024-01-15 13:45',
      deliveryAddress: '321 Elm St, City, State',
      driver: 'Lisa Garcia',
      estimatedDelivery: '14:45'
    }
  ]);

  const [orderHistory] = useState<Order[]>([
    {
      id: '5',
      orderNumber: 'ORD-005',
      customer: 'Robert Brown',
      restaurant: 'Pizza Palace',
      items: ['Margherita Pizza', 'Caesar Salad'],
      total: 24.00,
      status: 'delivered',
      orderTime: '2024-01-14 19:30',
      deliveryAddress: '555 Maple Dr, City, State',
      driver: 'Lisa Garcia'
    },
    {
      id: '6',
      orderNumber: 'ORD-006',
      customer: 'Emily Davis',
      restaurant: 'Sushi Zen',
      items: ['Spicy Tuna Roll', 'Chicken Teriyaki'],
      total: 32.50,
      status: 'delivered',
      orderTime: '2024-01-14 18:15',
      deliveryAddress: '777 Cedar Ln, City, State',
      driver: 'Mike Chen'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, text: 'Pending' },
      preparing: { variant: 'outline' as const, icon: Package, text: 'Preparing' },
      ready: { variant: 'default' as const, icon: CheckCircle, text: 'Ready' },
      out_for_delivery: { variant: 'default' as const, icon: MapPin, text: 'Out for Delivery' },
      delivered: { variant: 'default' as const, icon: CheckCircle, text: 'Delivered' },
      not_delivered: { variant: 'destructive' as const, icon: Clock, text: 'Not Delivered' },
      cancelled: { variant: 'destructive' as const, icon: Clock, text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleAssignDriver = () => {
    if (selectedOrder && selectedDriver) {
      const driverName = mockDrivers.find(d => d.id === selectedDriver)?.name;
      
      // Remove from order queue
      setOrderQueue(prev => prev.filter(order => order.id !== selectedOrder.id));
      
      // Add to active orders with driver assigned and status as "out_for_delivery"
      const updatedOrder: Order = {
        ...selectedOrder,
        driver: driverName,
        status: 'out_for_delivery',
        estimatedDelivery: '16:00' // Default ETA
      };
      
      setActiveOrders(prev => [...prev, updatedOrder]);
      
      toast.success(`Order ${selectedOrder.orderNumber} assigned to ${driverName}`);
      setIsProcessDialogOpen(false);
      setSelectedOrder(null);
      setSelectedDriver('');
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    ));
    toast.success('Order status updated successfully');
  };

  const updateOrderETA = (orderId: string, newETA: string) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, estimatedDelivery: newETA } : order
    ));
    toast.success('ETA updated successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Order Management</h1>
        <p className="text-muted-foreground">
          Manage orders from queue to delivery completion.
        </p>
      </div>

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Order Queue</TabsTrigger>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Order Queue</span>
                <Badge variant="secondary">{orderQueue.length}</Badge>
              </CardTitle>
              <CardDescription>
                New orders waiting to be processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderQueue.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} items
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {order.customer}
                          </div>
                        </TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            ${order.total.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>{order.orderTime}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                Process
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Process Order</DialogTitle>
                                <DialogDescription>
                                  Review order details and assign a driver
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {selectedOrder && (
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">Order Summary</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p><strong>Order:</strong> {selectedOrder.orderNumber}</p>
                                          <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                                          <p><strong>Restaurant:</strong> {selectedOrder.restaurant}</p>
                                        </div>
                                        <div>
                                          <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                                          <p><strong>Time:</strong> {selectedOrder.orderTime}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                                      </div>
                                      <div>
                                        <p><strong>Items:</strong></p>
                                        <ul className="list-disc list-inside ml-2 space-y-1">
                                          {selectedOrder.items.map((item, index) => (
                                            <li key={index}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="space-y-2">
                                  <Label>Assign Driver</Label>
                                  <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a driver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockDrivers
                                        .filter(driver => driver.status === 'available')
                                        .map((driver) => (
                                        <SelectItem key={driver.id} value={driver.id}>
                                          {driver.name} - {driver.phone}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setIsProcessDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleAssignDriver}
                                    disabled={!selectedDriver}
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Assign Driver
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Active Orders</span>
                <Badge variant="default">{activeOrders.length}</Badge>
              </CardTitle>
              <CardDescription>
                Orders currently being prepared or delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search active orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>
                          {order.driver ? (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {order.driver}
                            </div>
                          ) : (
                            <Badge variant="secondary">Not Assigned</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.estimatedDelivery ? (
                            <Input
                              type="time"
                              value={order.estimatedDelivery}
                              onChange={(e) => updateOrderETA(order.id, e.target.value)}
                              className="w-32"
                            />
                          ) : (
                            <Input
                              type="time"
                              placeholder="Set ETA"
                              onChange={(e) => updateOrderETA(order.id, e.target.value)}
                              className="w-32"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="not_delivered">Not Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Order History</span>
                <Badge variant="secondary">{orderHistory.length}</Badge>
              </CardTitle>
              <CardDescription>
                Completed and cancelled orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search order history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderHistory.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} items
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>
                          {order.driver && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {order.driver}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            ${order.total.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>{order.orderTime}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};