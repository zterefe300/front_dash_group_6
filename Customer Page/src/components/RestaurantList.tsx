import { Restaurant } from '../App';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Clock, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantListProps {
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

// Mock restaurant data
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

export function RestaurantList({ onRestaurantSelect }: RestaurantListProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl mb-2">Choose Your Restaurant</h2>
        <p className="text-muted-foreground">Discover amazing food from local restaurants</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
              !restaurant.isOpen ? 'opacity-75 grayscale' : ''
            }`}
            onClick={() => restaurant.isOpen && onRestaurantSelect(restaurant)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <ImageWithFallback
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 right-4 bg-white text-foreground">
                  {restaurant.cuisine}
                </Badge>
                
                {/* Open/Closed Status */}
                <Badge 
                  className={`absolute top-4 left-4 ${
                    restaurant.isOpen 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {restaurant.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  {/* Restaurant Logo */}
                  {restaurant.logo && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border bg-white flex-shrink-0">
                      <ImageWithFallback
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={!restaurant.isOpen ? 'text-muted-foreground' : ''}>
                      {restaurant.name}
                    </h3>
                    {!restaurant.isOpen && (
                      <p className="text-xs text-muted-foreground mt-1">Currently closed</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                    <span>{restaurant.priceRange}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}