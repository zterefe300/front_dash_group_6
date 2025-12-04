import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Badge } from '../../../components/common/badge';
import { Separator } from '../../../components/common/separator';
import { Clock, MapPin, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: 'preparing' | 'on-the-way' | 'delivered';
  orderTime: string;
  estimatedDelivery?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    restaurantName: 'Pasta Palace',
    items: ['Spaghetti Carbonara', 'Caesar Salad'],
    total: 29.98,
    status: 'on-the-way',
    orderTime: '12:30 PM',
    estimatedDelivery: '1:15 PM'
  },
  {
    id: 'ORD002',
    restaurantName: 'Dragon Wok',
    items: ['Kung Pao Chicken', 'Fried Rice', 'Spring Rolls'],
    total: 39.97,
    status: 'delivered',
    orderTime: 'Yesterday, 7:45 PM'
  },
  {
    id: 'ORD003',
    restaurantName: 'Sushi Sakura',
    items: ['Salmon Sashimi', 'California Roll'],
    total: 31.98,
    status: 'delivered',
    orderTime: '2 days ago, 6:20 PM'
  }
];

const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'preparing':
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Preparing</Badge>;
    case 'on-the-way':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">On the way</Badge>;
    case 'delivered':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Delivered</Badge>;
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'preparing':
      return <Clock className="h-4 w-4 text-orange-600" />;
    case 'on-the-way':
      return <MapPin className="h-4 w-4 text-blue-600" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
  }
};

export function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Your Orders</h1>
        <p className="text-muted-foreground">Track your current and past orders</p>
      </div>

      {mockOrders.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3>No orders yet</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  When you place your first order, it will appear here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <CardTitle className="text-lg">{order.restaurantName}</CardTitle>
                      <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Items ordered:</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.join(', ')}
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Ordered: {order.orderTime}</p>
                    {order.estimatedDelivery && (
                      <p className="text-muted-foreground">
                        Estimated delivery: {order.estimatedDelivery}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}