import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Phone, 
  MapPin, 
  CreditCard, 
  Package, 
  CheckCircle, 
  XCircle,
  User,
  FileText,
  DollarSign,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusUpdate }: OrderDetailsModalProps) {
  const [newStatus, setNewStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const getStatusConfig = (status: string) => {
    const configs = {
      'new': { color: 'bg-blue-500', icon: Clock, label: 'New Order', description: 'Order just received, needs confirmation' },
      'confirmed': { color: 'bg-indigo-500', icon: CheckCircle, label: 'Confirmed', description: 'Order confirmed, ready to prepare' },
      'preparing': { color: 'bg-yellow-500', icon: Package, label: 'Preparing', description: 'Kitchen is preparing the order' },
      'ready': { color: 'bg-green-500', icon: CheckCircle, label: 'Ready', description: 'Order is ready for pickup/delivery' },
      'out-for-delivery': { color: 'bg-purple-500', icon: Package, label: 'Out for Delivery', description: 'Order is on the way to customer' },
      'delivered': { color: 'bg-emerald-500', icon: CheckCircle, label: 'Delivered', description: 'Order has been delivered' },
      'cancelled': { color: 'bg-red-500', icon: XCircle, label: 'Cancelled', description: 'Order has been cancelled' }
    };
    return configs[status as keyof typeof configs] || configs.new;
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const statusOptions = [
    { value: 'new', label: 'New Order', disabled: false },
    { value: 'confirmed', label: 'Confirmed', disabled: false },
    { value: 'preparing', label: 'Preparing', disabled: false },
    { value: 'ready', label: 'Ready', disabled: false },
    { value: 'out-for-delivery', label: 'Out for Delivery', disabled: false },
    { value: 'delivered', label: 'Delivered', disabled: false },
    { value: 'cancelled', label: 'Cancelled', disabled: false }
  ];

  const getNextRecommendedStatus = (currentStatus: string) => {
    const progression = {
      'new': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': 'out-for-delivery',
      'out-for-delivery': 'delivered'
    };
    return progression[currentStatus as keyof typeof progression];
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateItemsTotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateGrandTotal = () => {
    return calculateItemsTotal() + order.deliveryFee + order.tax + order.tip;
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) {
      toast.error('Please select a different status');
      return;
    }

    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      onStatusUpdate(order.id, newStatus);
      toast.success(`Order status updated to ${getStatusConfig(newStatus).label}`);
      setIsUpdating(false);
      setNewStatus('');
    }, 1000);
  };

  const recommendedStatus = getNextRecommendedStatus(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <StatusIcon className="h-6 w-6" />
            Order Details - {order.id}
          </DialogTitle>
          <DialogDescription>
            Complete order information and status management
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Current Status</h4>
              <Badge className={`${statusConfig.color} text-white`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{statusConfig.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h4>
              
              <div className="space-y-3 p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`tel:${order.customer.phone}`)}
                  >
                    Call
                  </Button>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{order.customer.address}</span>
                </div>
              </div>

              {/* Payment Information */}
              <h4 className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Information
              </h4>
              
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Status:</span>
                  <Badge 
                    variant="outline" 
                    className={`${
                      order.paymentStatus === 'paid' ? 'bg-green-500' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white border-0`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timing Information */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timing Information
              </h4>
              
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Order Placed:</span>
                  <span className="font-medium">{formatDateTime(order.orderTime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Estimated Delivery:</span>
                  <span className="font-medium">{formatDateTime(order.estimatedDelivery)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge className={`${statusConfig.color} text-white`}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <h4 className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Quick Actions
              </h4>
              
              <div className="space-y-2">
                {recommendedStatus && order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setNewStatus(recommendedStatus);
                      setTimeout(handleStatusUpdate, 100);
                    }}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as {getStatusConfig(recommendedStatus).label}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${order.customer.phone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Order Items
            </h4>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-sm text-orange-600 mt-1">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Special Instructions
              </h4>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {order.specialInstructions}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Order Summary */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Order Summary
            </h4>
            
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Items Subtotal:</span>
                <span>${calculateItemsTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee:</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tip:</span>
                <span>${order.tip.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="space-y-4">
              <h4 className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Update Order Status
              </h4>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          disabled={option.value === order.status}
                        >
                          {option.label}
                          {option.value === order.status && ' (Current)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || newStatus === order.status || isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}