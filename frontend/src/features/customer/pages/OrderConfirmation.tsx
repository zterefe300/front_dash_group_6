import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Badge } from '../../../components/common/badge';
import { Separator } from '../../../components/common/separator';
import { CheckCircle, Clock, MapPin, CreditCard, Phone } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useEffect, useState } from 'react';
// @ts-ignore - JS module without type definitions
import { geoapifyService } from '../../../service/customer/geoapifyService';
// @ts-ignore - JS module without type definitions
import { orderService } from '../../../service/customer/orderService';

export function OrderConfirmation() {
  const { items, restaurant, paymentInfo, deliveryAddress, goToNewOrder, goToPayment, clearCart } = useCart();
  const [estimatedDeliveryMinutes, setEstimatedDeliveryMinutes] = useState<number>(35);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState<boolean>(true);
  const [backendOrderId, setBackendOrderId] = useState<string | null>(null);
  const [orderSubmissionError, setOrderSubmissionError] = useState<string | null>(null);
  
  // Store order snapshot before clearing cart
  const [orderSnapshot] = useState(() => {
    const orderDate = new Date();
    
    return {
      items: items,
      restaurant: restaurant,
      paymentInfo: paymentInfo,
      deliveryAddress: deliveryAddress,
      orderDate
    };
  });

  // Calculate estimated delivery time using Geoapify
  useEffect(() => {
    const calculateDeliveryTime = async () => {
      console.log('Starting delivery time calculation...');
      console.log('Restaurant:', orderSnapshot.restaurant);
      console.log('Delivery Address:', orderSnapshot.deliveryAddress);

      if (!orderSnapshot.restaurant || !orderSnapshot.deliveryAddress) {
        console.warn('Missing restaurant or delivery address for calculation');
        setIsCalculatingDelivery(false);
        return;
      }

      try {
        // Use actual restaurant address from backend
        const restaurantAddress = orderSnapshot.restaurant.address || '';
        console.log('Restaurant address:', restaurantAddress);
        
        if (!restaurantAddress) {
          console.warn('Restaurant address is empty, using default delivery time');
          setIsCalculatingDelivery(false);
          return;
        }

        // Format delivery address
        const deliveryAddr = geoapifyService.formatAddress(orderSnapshot.deliveryAddress);
        console.log('Formatted delivery address:', deliveryAddr);

        // Get delivery estimate
        console.log('Calling Geoapify API...');
        const estimate = await geoapifyService.getDeliveryEstimate(
          restaurantAddress,
          deliveryAddr,
          15 // 15 minutes preparation time
        );

        console.log('Delivery estimate received:', estimate);
        setEstimatedDeliveryMinutes(estimate.estimatedTime);
      } catch (error) {
        console.error('Failed to calculate delivery time:', error);
        // Keep default 35 minutes
      } finally {
        console.log('Delivery time calculation complete, setting isCalculatingDelivery to false');
        setIsCalculatingDelivery(false);
      }
    };

    calculateDeliveryTime();
  }, [orderSnapshot.restaurant, orderSnapshot.deliveryAddress]);
  
  // Submit order to backend (only after estimated delivery time is calculated)
  useEffect(() => {
    const submitOrder = async () => {
      // Wait for delivery time calculation to complete
      if (isCalculatingDelivery) {
        console.log('Waiting for delivery time calculation to complete...');
        return;
      }

      // Check if order was already submitted
      if (backendOrderId) {
        console.log('Order already submitted, skipping:', backendOrderId);
        return;
      }

      if (!orderSnapshot.restaurant || !orderSnapshot.items || orderSnapshot.items.length === 0) {
        console.error('Missing required order data:', {
          hasRestaurant: !!orderSnapshot.restaurant,
          hasItems: !!orderSnapshot.items,
          itemCount: orderSnapshot.items?.length || 0
        });
        return;
      }

      try {
        // Calculate subtotal and tips (service charge)
        const subtotal = orderSnapshot.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tips = subtotal * 0.0825;

        // Calculate estimated delivery time as DateTime
        const estimatedDeliveryDateTime = new Date(orderSnapshot.orderDate.getTime() + (estimatedDeliveryMinutes * 60000));
        
        // Format as ISO string for backend (will be parsed as LocalDateTime)
        const estimatedDeliveryTimeISO = estimatedDeliveryDateTime.toISOString().slice(0, 19);

        // Create address first if delivery address exists
        let addressId = null;
        if (orderSnapshot.deliveryAddress) {
          try {
            console.log('Creating address for delivery:', orderSnapshot.deliveryAddress);
            const addressResponse = await orderService.createAddress({
              streetAddress: orderSnapshot.deliveryAddress.streetName,
              building: orderSnapshot.deliveryAddress.buildingNumber || null,
              city: orderSnapshot.deliveryAddress.city,
              state: orderSnapshot.deliveryAddress.state,
              zipCode: orderSnapshot.deliveryAddress.zipCode
            });
            addressId = addressResponse.addressId;
            console.log('Address created successfully with ID:', addressId);
          } catch (error) {
            console.error('Failed to create address:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Address creation error details:', errorMessage);
            // Don't proceed with order creation if address creation fails
            throw new Error(`Address creation failed: ${errorMessage}`);
          }
        }

        // Prepare order request
        const orderRequest = {
          restaurantId: parseInt(orderSnapshot.restaurant.id),
          customerName: orderSnapshot.paymentInfo?.cardholderName || 'Guest',
          customerPhone: '000-000-0000', // Default phone - could be collected in delivery form
          addressId: addressId,
          items: orderSnapshot.items.map(item => ({
            menuItemId: parseInt(item.id),
            quantity: item.quantity,
            notes: null
          })),
          subtotal: subtotal,
          tips: tips,
          estimatedDeliveryTime: estimatedDeliveryTimeISO
        };

        console.log('Submitting order to backend:', orderRequest);
        const response = await orderService.createOrder(orderRequest);
        console.log('Order created successfully. Full response:', response);
        console.log('Response orderId:', response.orderId);
        console.log('Response keys:', Object.keys(response));
        
        if (response.orderId) {
          setBackendOrderId(response.orderId);
          console.log('Backend order ID set to:', response.orderId);
        } else {
          console.error('No orderId in response!');
        }
      } catch (error) {
        console.error('Failed to submit order to backend:', error);
        setOrderSubmissionError(error instanceof Error ? error.message : 'Failed to submit order');
      }
    };

    submitOrder();
  }, [isCalculatingDelivery, backendOrderId]);

  // Clear cart when order is confirmed
  useEffect(() => {
    // Clear the cart after a brief delay to ensure snapshot is captured
    const timer = setTimeout(() => {
      clearCart();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [clearCart]);
  
  // Use snapshot data for display
  const displayItems = orderSnapshot.items;
  const displayRestaurant = orderSnapshot.restaurant;
  const displayPaymentInfo = orderSnapshot.paymentInfo;
  const displayDeliveryAddress = orderSnapshot.deliveryAddress;
  const orderDate = orderSnapshot.orderDate;
  // Use backend-generated order ID (format: FD####)
  const orderNumber = backendOrderId || 'Pending...';
  
  // Calculate estimated delivery date/time
  const estimatedDelivery = new Date(orderSnapshot.orderDate.getTime() + (estimatedDeliveryMinutes * 60000));
  
  // Calculate totals
  const subtotal = displayItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.0825;
  const grandTotal = subtotal + serviceCharge;

  // Format address
  const fullAddress = displayDeliveryAddress ? [
    displayDeliveryAddress.buildingNumber,
    displayDeliveryAddress.streetName,
    `${displayDeliveryAddress.city}, ${displayDeliveryAddress.state} ${displayDeliveryAddress.zipCode}`
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
                {isCalculatingDelivery ? (
                  'Calculating delivery time...'
                ) : (
                  <>
                    Estimated delivery: {estimatedDelivery.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })} ({estimatedDeliveryMinutes} mins)
                  </>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Restaurant Information */}
      {displayRestaurant && (
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-white flex-shrink-0">
                {displayRestaurant.logo ? (
                  <img
                    src={displayRestaurant.logo}
                    alt={`${displayRestaurant.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xl">
                      {displayRestaurant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{displayRestaurant.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{displayRestaurant.phoneNumber || 'N/A'}</span>
                </div>
              </div>
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
            {displayItems.map((item) => {
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
                })}
              </p>
            </div>
            
            <div>
              <p className="font-medium">Delivery Instructions</p>
              <p className="text-sm text-muted-foreground">
                Will ring doorbell upon arrival.
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
              {displayPaymentInfo && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {maskCardNumber(displayPaymentInfo.cardNumber)} ({displayPaymentInfo.cardType.toUpperCase()})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {displayPaymentInfo.cardholderName}
                  </p>
                </>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Transaction ID: {orderNumber ? `TXN${orderNumber}2024` : 'Processing...'}</p>
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
