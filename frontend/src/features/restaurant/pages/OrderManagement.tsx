import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderDetailsModal } from './OrderDetailsModal';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Timer
} from 'lucide-react';

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
  }>;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderTime: string;
  estimatedDelivery: string;
  total: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  paymentMethod: string;
  specialInstructions?: string;
}

export function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  // Mock order data
  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'John Smith',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Apt 4B, Downtown'
      },
      items: [
        { name: 'Margherita Pizza (Large)', quantity: 1, price: 18.99 },
        { name: 'Caesar Salad', quantity: 1, price: 9.50 },
        { name: 'Garlic Bread', quantity: 2, price: 4.99 }
      ],
      status: 'preparing',
      paymentStatus: 'paid',
      orderTime: '2024-01-15 12:30:00',
      estimatedDelivery: '2024-01-15 13:15:00',
      total: 33.48,
      deliveryFee: 2.99,
      tax: 2.68,
      tip: 5.00,
      paymentMethod: 'Credit Card',
      specialInstructions: 'Extra crispy pizza, light dressing on salad'
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Avenue, Unit 12, Midtown'
      },
      items: [
        { name: 'Spaghetti Carbonara', quantity: 1, price: 16.99 },
        { name: 'Tiramisu', quantity: 1, price: 6.99 }
      ],
      status: 'ready',
      paymentStatus: 'paid',
      orderTime: '2024-01-15 12:45:00',
      estimatedDelivery: '2024-01-15 13:30:00',
      total: 23.98,
      deliveryFee: 2.99,
      tax: 1.92,
      tip: 3.50,
      paymentMethod: 'Digital Wallet'
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Mike Brown',
        phone: '+1 (555) 555-0123',
        address: '789 Pine Street, House 5, Westside'
      },
      items: [
        { name: 'Chicken Parmesan', quantity: 1, price: 19.99 },
        { name: 'Side of Pasta', quantity: 1, price: 5.99 }
      ],
      status: 'new',
      paymentStatus: 'paid',
      orderTime: '2024-01-15 13:00:00',
      estimatedDelivery: '2024-01-15 13:45:00',
      total: 25.98,
      deliveryFee: 2.99,
      tax: 2.08,
      tip: 4.00,
      paymentMethod: 'Credit Card',
      specialInstructions: 'Please ring doorbell, do not knock'
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Emily Davis',
        phone: '+1 (555) 444-5678',
        address: '321 Elm Drive, Apartment 8A, Eastside'
      },
      items: [
        { name: 'Vegetarian Lasagna', quantity: 1, price: 17.99 },
        { name: 'Mixed Green Salad', quantity: 1, price: 8.50 }
      ],
      status: 'out-for-delivery',
      paymentStatus: 'paid',
      orderTime: '2024-01-15 11:30:00',
      estimatedDelivery: '2024-01-15 12:15:00',
      total: 26.49,
      deliveryFee: 2.99,
      tax: 2.12,
      tip: 5.50,
      paymentMethod: 'Cash'
    },
    {
      id: 'ORD-2024-005',
      customer: {
        name: 'David Wilson',
        phone: '+1 (555) 333-7890',
        address: '654 Maple Road, Suite 3, Northside'
      },
      items: [
        { name: 'BBQ Chicken Pizza (Medium)', quantity: 1, price: 16.99 },
        { name: 'Buffalo Wings (12pc)', quantity: 1, price: 12.99 }
      ],
      status: 'delivered',
      paymentStatus: 'paid',
      orderTime: '2024-01-15 11:00:00',
      estimatedDelivery: '2024-01-15 11:45:00',
      total: 29.98,
      deliveryFee: 2.99,
      tax: 2.40,
      tip: 6.00,
      paymentMethod: 'Credit Card'
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      'new': { color: 'bg-blue-500', icon: Clock, label: 'New Order' },
      'confirmed': { color: 'bg-indigo-500', icon: CheckCircle, label: 'Confirmed' },
      'preparing': { color: 'bg-yellow-500', icon: Package, label: 'Preparing' },
      'ready': { color: 'bg-green-500', icon: CheckCircle, label: 'Ready' },
      'out-for-delivery': { color: 'bg-purple-500', icon: Package, label: 'Out for Delivery' },
      'delivered': { color: 'bg-emerald-500', icon: CheckCircle, label: 'Delivered' },
      'cancelled': { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' }
    };
    return configs[status as keyof typeof configs] || configs.new;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'refunded': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOrderTotal = (order: Order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return itemsTotal + order.deliveryFee + order.tax + order.tip;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrdersByStatus = (status: string) => {
    return filteredOrders.filter(order => order.status === status);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // In a real app, this would update the backend
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    setIsModalOpen(false);
  };

  const activeOrders = filteredOrders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  ).length;

  const completedOrders = filteredOrders.filter(order => 
    order.status === 'delivered'
  ).length;

  const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{order.id}</h3>
                <Badge 
                  variant="secondary" 
                  className={`${statusConfig.color} text-white`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.customer.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${calculateOrderTotal(order).toFixed(2)}</p>
              <Badge 
                variant="outline" 
                className={`${getPaymentStatusColor(order.paymentStatus)} text-white border-0`}
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Ordered: {formatTime(order.orderTime)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="h-4 w-4 mr-2" />
              ETA: {formatTime(order.estimatedDelivery)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {order.customer.address}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm">
              {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleViewOrder(order)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`tel:${order.customer.phone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Order Management</h2>
        <p className="text-muted-foreground">Manage and track all your restaurant orders</p>
      </div>

      {/* Order Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-medium">{activeOrders}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-medium">{completedOrders}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-medium">{filteredOrders.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-medium">
                  ${filteredOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toFixed(2)}
                </p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New Orders</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders ({filteredOrders.length})</TabsTrigger>
          <TabsTrigger value="new">New ({getOrdersByStatus('new').length})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({getOrdersByStatus('preparing').length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({getOrdersByStatus('ready').length})</TabsTrigger>
          <TabsTrigger value="delivery">Delivery ({getOrdersByStatus('out-for-delivery').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({getOrdersByStatus('delivered').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getOrdersByStatus('new').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preparing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getOrdersByStatus('preparing').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getOrdersByStatus('ready').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getOrdersByStatus('out-for-delivery').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getOrdersByStatus('delivered').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Orders will appear here when customers place them'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}