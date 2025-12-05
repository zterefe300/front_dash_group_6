import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Badge } from '../../../components/common/badge';
import { Separator } from '../../../components/common/separator';
import { CheckCircle, Clock, MapPin, CreditCard, Phone, Star } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

export function OrderConfirmation() {
  const { items, restaurant, paymentInfo, deliveryAddress, goToNewOrder, goToPayment } = useCart();
  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.0825;
  const deliveryFee = restaurant?.deliveryFee || 0;
  const grandTotal = subtotal + serviceCharge + deliveryFee;

  // Order details
  const orderDate = new Date();
  const orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
  const estimatedDelivery = new Date(orderDate.getTime() + (35 * 60000)); // Add 35 minutes

  // Format address
  const fullAddress = deliveryAddress ? [
    deliveryAddress.buildingNumber,
    deliveryAddress.streetName,
    deliveryAddress.apartmentUnit && `Apt ${deliveryAddress.apartmentUnit}`,
    `${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}`
  ].filter(Boolean).join(' ') : '';

  const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\s/g, '');
    return `•••• •••• •••• ${cleaned.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-green-600 mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-4">
                Your order has been placed successfully and is being prepared
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Order #{orderNumber}
              </Badge>
            </div>
            
            {/* Estimated delivery time */}
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-orange-600 font-medium">
                Estimated delivery: {estimatedDelivery.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Restaurant Information */}
      {restaurant && (
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-white flex-shrink-0">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xl">
                      {restaurant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                <p className="text-muted-foreground">{restaurant.cuisine} Cuisine</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{restaurant.deliveryTime}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">${itemTotal.toFixed(2)}</p>
                </div>
              );
            })}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Service charge (8.25%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Delivery fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="font-medium mb-2">Delivery Address</p>
            <p className="text-sm text-muted-foreground">
              {fullAddress}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Estimated Arrival</p>
              <p className="text-sm text-muted-foreground">
                {estimatedDelivery.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })} ({restaurant?.deliveryTime})
              </p>
            </div>
            
            <div>
              <p className="font-medium">Delivery Instructions</p>
              <p className="text-sm text-muted-foreground">
                Please ring doorbell upon arrival
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Payment Method</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Paid
                </Badge>
              </div>
              {paymentInfo && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {maskCardNumber(paymentInfo.cardNumber)} ({paymentInfo.cardType.toUpperCase()})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentInfo.cardholderName}
                  </p>
                </>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Transaction ID: TXN{orderNumber}2024</p>
              <p>Payment processed securely on {orderDate.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={goToNewOrder}
          className="w-full sm:w-auto min-w-[200px]"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Place Another Order
        </Button>
      </div>

      {/* Thank You Message */}
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-2">
          Thank you for choosing FrontDash!
        </p>
        <p className="text-sm text-muted-foreground">
          We'll send you updates about your order via SMS and email
        </p>
      </div>
    </div>
  );
}
