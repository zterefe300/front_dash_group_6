import { Card, CardContent, CardHeader } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Badge } from '../../../components/common/badge';
import { Star, Clock, DollarSign, Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../../contexts/CartContext';

// Restaurant type definition
interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo?: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  priceRange: string;
  menu: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

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
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Restaurant Logo */}
                {restaurant.logo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-white shadow-sm">
                    <ImageWithFallback
                      src={restaurant.logo}
                      alt={`${restaurant.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{restaurant.name}</h1>
                  <Badge variant="secondary">
                    {restaurant.cuisine}
                  </Badge>
                </div>
              </div>
              
              {/* Open/Closed Status */}
              <Badge 
                className={`${
                  restaurant.isOpen 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-foreground font-medium">{restaurant.rating}</span>
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

// Mock restaurant data (same as in RestaurantList)
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pasta Palace',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1653557659183-9701378e2c9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbG9nbyUyMHBhc3RhJTIwaXRhbGlhbnxlbnwxfHx8fDE3NTczNjIwMzR8MA&ixlib=rb-4.1.0&q=80&w=80&utm_source=figma&utm_medium=referral',
    cuisine: 'Italian',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    isOpen: true,
    priceRange: '$$',
    menu: [
      {
        id: '1-1',
        name: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with eggs, cheese, pancetta, and black pepper',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
        category: 'Pasta'
      },
      {
        id: '1-2',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil on crispy crust',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
        category: 'Pizza'
      },
      {
        id: '1-3',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, parmesan, croutons, and Caesar dressing',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop',
        category: 'Salads'
      },
      {
        id: '1-4',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
        category: 'Desserts'
      }
    ]
  },
  {
    id: '2',
    name: 'Dragon Wok',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1663250714088-4f4657e584a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbG9nbyUyMGNoaW5lc2UlMjBkcmFnb258ZW58MXx8fHwxNzU3MzYyMDM3fDA&ixlib=rb-4.1.0&q=80&w=80&utm_source=figma&utm_medium=referral',
    cuisine: 'Chinese',
    rating: 4.6,
    deliveryTime: '25-35 min',
    deliveryFee: 3.49,
    isOpen: true,
    priceRange: '$$',
    menu: [
      {
        id: '2-1',
        name: 'Kung Pao Chicken',
        description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
        category: 'Main Dishes'
      },
      {
        id: '2-2',
        name: 'Beef and Broccoli',
        description: 'Tender beef with fresh broccoli in savory brown sauce',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop',
        category: 'Main Dishes'
      },
      {
        id: '2-3',
        name: 'Vegetable Spring Rolls',
        description: 'Crispy rolls filled with fresh vegetables, served with sweet and sour sauce',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1619367315408-1c7b6c4b4e9c?w=300&h=200&fit=crop',
        category: 'Appetizers'
      },
      {
        id: '2-4',
        name: 'Fried Rice',
        description: 'Wok-fried rice with eggs, vegetables, and choice of protein',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop',
        category: 'Rice & Noodles'
      }
    ]
  },
  {
    id: '3',
    name: 'Burger Boulevard',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1625331725309-83e4f3c1373b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbG9nbyUyMGJ1cmdlciUyMGFtZXJpY2FufGVufDF8fHx8MTc1NzM2MjA0MXww&ixlib=rb-4.1.0&q=80&w=80&utm_source=figma&utm_medium=referral',
    cuisine: 'American',
    rating: 4.4,
    deliveryTime: '15-25 min',
    deliveryFee: 2.49,
    isOpen: false,
    priceRange: '$',
    menu: [
      {
        id: '3-1',
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheddar cheese, lettuce, tomato, onion, and pickles',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        category: 'Burgers'
      },
      {
        id: '3-2',
        name: 'BBQ Bacon Burger',
        description: 'Beef patty with bacon, BBQ sauce, onion rings, and cheddar cheese',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop',
        category: 'Burgers'
      },
      {
        id: '3-3',
        name: 'Loaded Fries',
        description: 'Crispy fries topped with cheese, bacon bits, and green onions',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
        category: 'Sides'
      },
      {
        id: '3-4',
        name: 'Chocolate Milkshake',
        description: 'Thick and creamy chocolate milkshake topped with whipped cream',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop',
        category: 'Beverages'
      }
    ]
  },
  {
    id: '4',
    name: 'Sushi Sakura',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    logo: 'https://images.unsplash.com/photo-1695335753896-946f9297be0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbG9nbyUyMHN1c2hpJTIwamFwYW5lc2V8ZW58MXx8fHwxNzU3MzYyMDQ2fDA&ixlib=rb-4.1.0&q=80&w=80&utm_source=figma&utm_medium=referral',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '30-40 min',
    deliveryFee: 4.99,
    isOpen: true,
    priceRange: '$$$',
    menu: [
      {
        id: '4-1',
        name: 'Salmon Sashimi',
        description: 'Fresh sliced salmon, served with wasabi and pickled ginger',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
        category: 'Sashimi'
      },
      {
        id: '4-2',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber rolled in nori and rice',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
        category: 'Rolls'
      },
      {
        id: '4-3',
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with miso paste, tofu, and green onions',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=300&h=200&fit=crop',
        category: 'Soups'
      },
      {
        id: '4-4',
        name: 'Chicken Teriyaki',
        description: 'Grilled chicken glazed with teriyaki sauce, served with rice',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        category: 'Main Dishes'
      }
    ]
  }
];

// Wrapper component that handles routing and state management
export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { items, addItem, updateQuantity, setRestaurant } = useCart();

  const restaurant = mockRestaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl mb-4">Restaurant not found</h2>
        <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleAddToCart = (item: MenuItem) => {
    // Set the restaurant in context when adding first item
    if (items.length === 0) {
      setRestaurant(restaurant);
    }
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  return (
    <RestaurantDetail
      restaurant={restaurant}
      onAddToCart={handleAddToCart}
      cartItems={items}
      onUpdateQuantity={handleUpdateQuantity}
    />
  );
}
