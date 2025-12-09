import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Badge } from '../../../components/common/badge';
import { Separator } from '../../../components/common/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { useCart } from '../../../contexts/CartContext';

interface CartProps {
  isFullView?: boolean;
}

export function Cart({ isFullView = false }: CartProps) {
  const { items, updateQuantity, removeItem, goToCart, goToOrderSummary, restaurant } = useCart();
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <Card className={isFullView ? "text-center p-12" : "w-80 shadow-lg"}>
        <CardContent className={isFullView ? "" : "p-6"}>
          <div className="flex flex-col items-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3>Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Add some delicious items to get started
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Button onClick={() => window.location.href = '/customer/restaurants'} className="w-full">
                Browse Restaurants
              </Button>
              <Button onClick={() => window.history.back()} variant="outline" className="w-full">
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullView ? "" : "w-80 shadow-lg"}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {isFullView ? 'Your Order' : 'Cart'}
          {restaurant && (
            <Badge variant="outline" className="ml-2 text-xs">
              {restaurant.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {isFullView && (
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="w-8 text-center text-sm">{item.quantity}</span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>

                {isFullView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Order Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="pt-2">
          <Button onClick={goToOrderSummary} className="w-full">
            {isFullView ? 'Place Order' : 'Checkout'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
