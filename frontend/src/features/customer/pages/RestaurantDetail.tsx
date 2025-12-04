import { Restaurant, MenuItem, CartItem } from '../types';
import { Card, CardContent, CardHeader } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Badge } from '../../../components/common/badge';
import { Star, Clock, DollarSign, Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem) => void;
  cartItems: CartItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

export function RestaurantDetail({ restaurant, onAddToCart, cartItems, onUpdateQuantity }: RestaurantDetailProps) {
  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddItem = (item: MenuItem) => {
    onAddToCart(item);
  };

  const handleRemoveItem = (itemId: string) => {
    const currentQuantity = getItemQuantityInCart(itemId);
    if (currentQuantity > 0 && onUpdateQuantity) {
      onUpdateQuantity(itemId, currentQuantity - 1);
    }
  };

  // Group menu items by category
  const groupedMenu = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-8">
      {/* Restaurant Header */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <ImageWithFallback
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-64 md:h-80 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg" />
            
            {/* Restaurant Logo */}
            {restaurant.logo && (
              <div className="absolute top-6 left-6 w-16 h-16 rounded-full overflow-hidden border-3 border-white bg-white shadow-lg">
                <ImageWithFallback
                  src={restaurant.logo}
                  alt={`${restaurant.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Open/Closed Status */}
            <Badge 
              className={`absolute top-6 right-6 ${
                restaurant.isOpen 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Badge>
            
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl mb-2">{restaurant.name}</h1>
              <Badge variant="secondary" className="mb-4">
                {restaurant.cuisine}
              </Badge>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Delivery: ${restaurant.deliveryFee}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Closed Restaurant Notice */}
      {!restaurant.isOpen && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-center">
              This restaurant is currently closed. You can browse the menu but cannot place orders at this time.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      <div className="space-y-8">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl mb-6 pb-2 border-b">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => {
                const quantityInCart = getItemQuantityInCart(item.id);
                
                return (
                  <Card key={item.id} className={`overflow-hidden ${!restaurant.isOpen ? 'opacity-60' : ''}`}>
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex-1 p-6">
                          <div className="space-y-3">
                            <h3>{item.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold">
                                ${item.price.toFixed(2)}
                              </span>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                {quantityInCart === 0 ? (
                                  // Add button when quantity is 0
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddItem(item)}
                                    className="shrink-0"
                                    disabled={!restaurant.isOpen}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                  </Button>
                                ) : (
                                  // Plus/minus controls when quantity > 0
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRemoveItem(item.id)}
                                      className="h-8 w-8 p-0"
                                      disabled={!restaurant.isOpen}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    
                                    <span className="text-sm font-medium min-w-[2rem] text-center">
                                      {quantityInCart}
                                    </span>
                                    
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAddItem(item)}
                                      className="h-8 w-8 p-0"
                                      disabled={!restaurant.isOpen}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-32 md:w-40">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}