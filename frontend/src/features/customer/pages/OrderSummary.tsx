import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Badge } from '../../../components/common/badge';
import { Separator } from '../../../components/common/separator';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/common/tabs';
import { CheckCircle, Clock, MapPin, CreditCard, Receipt, Percent, DollarSign } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

export function OrderSummary() {
  const { items, restaurant, goToNewOrder, goToDelivery, clearCart } = useCart();
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [tipType, setTipType] = useState<'percentage' | 'fixed'>('percentage');
  const [tipPercentage, setTipPercentage] = useState<string>('');
  const [tipFixed, setTipFixed] = useState<string>('');

  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceChargeRate = 0.0825; // 8.25%
  const serviceCharge = subtotal * serviceChargeRate;
  const totalBeforeTip = subtotal + serviceCharge;
  const grandTotal = totalBeforeTip + tipAmount;

  // Order details
  const orderDate = new Date();
  const orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Handle tip calculations
  const handleTipPercentageChange = (value: string) => {
    setTipPercentage(value);
    const percentage = parseFloat(value) || 0;
    // Ensure percentage is not negative
    const validPercentage = Math.max(0, percentage);
    setTipAmount((totalBeforeTip * validPercentage) / 100);
  };

  const handleTipFixedChange = (value: string) => {
    setTipFixed(value);
    const amount = parseFloat(value) || 0;
    // Ensure tip amount is not negative
    const validAmount = Math.max(0, amount);
    setTipAmount(validAmount);
  };

  const handlePresetTip = (percentage: number) => {
    setTipType('percentage');
    setTipPercentage(percentage.toString());
    // Ensure percentage is positive (should always be, but for safety)
    const validPercentage = Math.max(0, percentage);
    setTipAmount((totalBeforeTip * validPercentage) / 100);
  };

  return (
    <div className="space-y-6">
      {/* Billing Header */}
      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl text-blue-600 mb-2">Order Bill</h1>
              <p className="text-muted-foreground">
                Review your order details and complete payment
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Order #{orderNumber}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Restaurant and Order Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {restaurant && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border bg-white flex-shrink-0">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {restaurant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{restaurant.name}</p>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine} Cuisine</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <p className="font-medium">Order Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {orderDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {orderDate.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>
            
            <div>
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-sm text-muted-foreground">
                {restaurant?.deliveryTime || '30-40 min'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Food Items Ordered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {items.map((item) => {
              const itemSubtotal = item.price * item.quantity;
              return (
                <div key={item.id} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Price: ${item.price.toFixed(2)}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${itemSubtotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bill Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>Bill Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total of all items</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Service charge (8.25%)</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-medium">
              <span>Total before tips</span>
              <span>${totalBeforeTip.toFixed(2)}</span>
            </div>

            {/* Tips Section */}
            <div className="pt-4">
              <Label className="text-base font-medium mb-4 block">Add Tip</Label>
              
              {/* Preset tip buttons */}
              <div className="flex gap-2 mb-4">
                {[15, 18, 20, 25].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetTip(percentage)}
                    className={tipPercentage === percentage.toString() ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>

              {/* Custom tip input */}
              <Tabs value={tipType} onValueChange={(value) => setTipType(value as 'percentage' | 'fixed')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="percentage" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Percentage
                  </TabsTrigger>
                  <TabsTrigger value="fixed" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Fixed Amount
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="percentage" className="mt-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter percentage"
                      value={tipPercentage}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Prevent negative values by not allowing input that starts with minus
                        if (value === '' || (!value.startsWith('-') && parseFloat(value) >= 0)) {
                          handleTipPercentageChange(value);
                        }
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="flex items-center px-3 text-muted-foreground">%</span>
                  </div>
                </TabsContent>
                
                <TabsContent value="fixed" className="mt-4">
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={tipFixed}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Prevent negative values by not allowing input that starts with minus
                        if (value === '' || (!value.startsWith('-') && parseFloat(value) >= 0)) {
                          handleTipFixedChange(value);
                        }
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-between">
              <span>Tips</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="flex-1"
          onClick={goToDelivery}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Continue to Payment
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            clearCart();
            goToNewOrder();
          }}
          className="sm:w-auto"
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
}
