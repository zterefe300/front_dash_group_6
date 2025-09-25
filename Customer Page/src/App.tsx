import { useState } from 'react';
import { RestaurantList } from './components/RestaurantList';
import { RestaurantDetail } from './components/RestaurantDetail';
import { Cart } from './components/Cart';
import { OrderSummary } from './components/OrderSummary';
import { Payment } from './components/Payment';
import { Delivery } from './components/Delivery';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Orders } from './components/Orders';
import { LoginTypeSelector } from './components/LoginTypeSelector';
import { RestaurantLogin } from './components/RestaurantLogin';
import { StaffLogin } from './components/StaffLogin';
import { AdminLogin } from './components/AdminLogin';
import { RestaurantRegistration } from './components/RestaurantRegistration';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Button } from './components/ui/button';
import { ShoppingCart, ArrowLeft, Menu, Home, ClipboardList, LogIn, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Separator } from './components/ui/separator';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo?: string; // Optional restaurant logo/icon
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean; // Restaurant open/closed status
  priceRange: '$' | '$$' | '$$$'; // Price range indicator
  menu: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface PaymentInfo {
  cardType: string;
  cardNumber: string;
  cardholderName: string;
  billingAddress: string;
  expiryMonth: string;
  expiryYear: string;
  securityCode: string;
}

export interface DeliveryAddress {
  buildingNumber: string;
  streetName: string;
  apartmentUnit?: string;
  city: string;
  state: string;
  zipCode: string;
}

type View = 'restaurants' | 'restaurant-detail' | 'cart' | 'order-summary' | 'payment' | 'delivery' | 'order-confirmation' | 'orders' | 'login-type' | 'restaurant-login' | 'staff-login' | 'admin-login' | 'restaurant-registration' | 'restaurant-dashboard' | 'staff-dashboard' | 'admin-dashboard';

export interface User {
  id: string;
  type: 'customer' | 'restaurant' | 'staff' | 'admin';
  name: string;
  email: string;
  isFirstLogin?: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addToCart = (menuItem: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant-detail');
  };

  const handleBackToRestaurants = () => {
    setCurrentView('restaurants');
    setSelectedRestaurant(null);
  };

  const handleViewCart = () => {
    setCurrentView('cart');
    setIsCartOpen(false);
  };

  const handlePlaceOrder = () => {
    setCurrentView('order-summary');
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
  };

  const handleNewOrder = () => {
    setCartItems([]);
    setCurrentView('restaurants');
    setSelectedRestaurant(null);
    setPaymentInfo(null);
    setDeliveryAddress(null);
    setOrderTotal(0);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.type === 'restaurant') {
      setCurrentView('restaurant-dashboard');
    } else if (user.type === 'staff') {
      setCurrentView('staff-dashboard');
    } else if (user.type === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('restaurants');
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    // Reset app state
    setCurrentUser(null);
    setCartItems([]);
    setCurrentView('restaurants');
    setSelectedRestaurant(null);
    setIsCartOpen(false);
    setIsSidebarOpen(false);
    setPaymentInfo(null);
    setDeliveryAddress(null);
    setOrderTotal(0);
  };

  const handleProceedToPayment = (total: number) => {
    setOrderTotal(total);
    setCurrentView('payment');
  };

  const handlePaymentSuccess = (payment: PaymentInfo) => {
    setPaymentInfo(payment);
    setCurrentView('delivery');
  };

  const handleDeliverySuccess = (address: DeliveryAddress) => {
    setDeliveryAddress(address);
    setCurrentView('order-confirmation');
  };

  const handleBackNavigation = () => {
    switch (currentView) {
      case 'restaurant-detail':
        handleBackToRestaurants();
        break;
      case 'cart':
        setCurrentView('restaurant-detail');
        break;
      case 'order-summary':
        handleBackToCart();
        break;
      case 'payment':
        setCurrentView('order-summary');
        break;
      case 'delivery':
        setCurrentView('payment');
        break;
      case 'order-confirmation':
        setCurrentView('delivery');
        break;
      case 'restaurant-login':
      case 'staff-login':
      case 'admin-login':
        setCurrentView('login-type');
        break;
      case 'restaurant-registration':
        setCurrentView('restaurant-login');
        break;
      case 'login-type':
        setCurrentView('restaurants');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Sidebar Menu */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-3">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col h-full py-6">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-6">Navigation</h2>
                      <nav className="space-y-2">
                        <Button
                          variant={currentView === 'restaurants' ? 'secondary' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                            setCurrentView('restaurants');
                            setSelectedRestaurant(null);
                            setIsSidebarOpen(false);
                          }}
                        >
                          <Home className="h-4 w-4 mr-3" />
                          Home
                        </Button>
                        
                        <Button
                          variant={currentView === 'orders' ? 'secondary' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                            setCurrentView('orders');
                            setIsSidebarOpen(false);
                          }}
                        >
                          <ClipboardList className="h-4 w-4 mr-3" />
                          Orders
                        </Button>
                      </nav>
                    </div>
                    
                    {/* Logout Button at Bottom */}
                    {currentUser && (
                      <div className="mt-auto pt-6">
                        <Separator className="mb-4" />
                        <div className="mb-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{currentUser.type}</p>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Back Button */}
              {(['restaurant-detail', 'cart', 'order-summary', 'payment', 'delivery', 'order-confirmation', 'login-type', 'restaurant-login', 'staff-login', 'admin-login', 'restaurant-registration'].includes(currentView)) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackNavigation}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              
              <h1 className="text-2xl font-bold text-primary">FrontDash</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Login Button */}
              {!currentUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('login-type')}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            
              {!(['order-summary', 'payment', 'delivery', 'order-confirmation'].includes(currentView)) && cartItems.length > 0 && !(['restaurant', 'staff', 'admin'].includes(currentUser?.type || '')) && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                  {isCartOpen && (
                    <div className="absolute right-0 top-12 z-50">
                      <Cart
                        items={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onViewCart={handleViewCart}
                        onClose={() => setIsCartOpen(false)}
                        restaurant={selectedRestaurant}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'restaurants' && (
          <RestaurantList onRestaurantSelect={handleRestaurantSelect} />
        )}
        
        {currentView === 'restaurant-detail' && selectedRestaurant && (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onAddToCart={addToCart}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
          />
        )}
        
        {currentView === 'cart' && (
          <div className="max-w-2xl mx-auto">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onPlaceOrder={handlePlaceOrder}
              restaurant={selectedRestaurant}
              isFullView={true}
            />
          </div>
        )}
        
        {currentView === 'order-summary' && (
          <div className="max-w-2xl mx-auto">
            <OrderSummary
              items={cartItems}
              restaurant={selectedRestaurant}
              onNewOrder={handleNewOrder}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        )}
        
        {currentView === 'payment' && (
          <div className="max-w-2xl mx-auto">
            <Payment
              items={cartItems}
              restaurant={selectedRestaurant}
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              onPlaceOrder={handlePaymentSuccess}
              onBack={handleBackNavigation}
            />
          </div>
        )}
        
        {currentView === 'delivery' && (
          <div className="max-w-2xl mx-auto">
            <Delivery
              items={cartItems}
              restaurant={selectedRestaurant}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              onPlaceOrder={handleDeliverySuccess}
              onBack={handleBackNavigation}
            />
          </div>
        )}
        
        {currentView === 'order-confirmation' && (
          <div className="max-w-2xl mx-auto">
            <OrderConfirmation
              items={cartItems}
              restaurant={selectedRestaurant}
              paymentInfo={paymentInfo}
              deliveryAddress={deliveryAddress}
              onNewOrder={handleNewOrder}
              onBack={handleBackNavigation}
            />
          </div>
        )}
        
        {currentView === 'orders' && (
          <div className="max-w-2xl mx-auto">
            <Orders />
          </div>
        )}
        
        {currentView === 'login-type' && (
          <div className="max-w-md mx-auto">
            <LoginTypeSelector
              onSelectType={(type) => {
                if (type === 'restaurant') setCurrentView('restaurant-login');
                else if (type === 'staff') setCurrentView('staff-login');
                else if (type === 'admin') setCurrentView('admin-login');
              }}
            />
          </div>
        )}
        
        {currentView === 'restaurant-login' && (
          <div className="max-w-md mx-auto">
            <RestaurantLogin
              onLogin={handleLogin}
              onRegister={() => setCurrentView('restaurant-registration')}
            />
          </div>
        )}
        
        {currentView === 'staff-login' && (
          <div className="max-w-md mx-auto">
            <StaffLogin onLogin={handleLogin} />
          </div>
        )}
        
        {currentView === 'admin-login' && (
          <div className="max-w-md mx-auto">
            <AdminLogin onLogin={handleLogin} />
          </div>
        )}
        
        {currentView === 'restaurant-registration' && (
          <div className="max-w-md mx-auto">
            <RestaurantRegistration
              onComplete={() => setCurrentView('restaurant-login')}
            />
          </div>
        )}
        
        {currentView === 'restaurant-dashboard' && currentUser?.type === 'restaurant' && (
          <div className="max-w-4xl mx-auto">
            <RestaurantDashboard user={currentUser} onLogout={handleLogout} />
          </div>
        )}
        
        {currentView === 'staff-dashboard' && currentUser?.type === 'staff' && (
          <div className="max-w-6xl mx-auto">
            <StaffDashboard user={currentUser} onLogout={handleLogout} />
          </div>
        )}
        
        {currentView === 'admin-dashboard' && currentUser?.type === 'admin' && (
          <div className="max-w-6xl mx-auto">
            <AdminDashboard user={currentUser} onLogout={handleLogout} />
          </div>
        )}
      </main>

      {/* Floating Continue Button */}
      {cartItems.length > 0 && !(['cart', 'order-summary', 'payment', 'delivery', 'order-confirmation'].includes(currentView)) && !(['restaurant', 'staff', 'admin'].includes(currentUser?.type || '')) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={handleViewCart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-6 py-3 rounded-full min-w-[200px] transition-all duration-300 hover:shadow-xl"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </span>
              <span className="text-xs opacity-90">
                ${getTotalPrice().toFixed(2)} • Continue
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}