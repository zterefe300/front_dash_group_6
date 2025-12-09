import React from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../common/button";
import { Badge } from "../common/badge";
import { ShoppingCart, User, ArrowLeft, Home } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "../common/sheet";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();

  const cartCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const cartTotal = items.reduce((sum, it) => sum + (it.quantity || 0) * (it.price || 0), 0);
  
  // Determine if we should show back button or home button
  const isOrderConfirmation = location.pathname === '/customer/order-confirmation';
  const showBackButton = !isOrderConfirmation &&
                         location.pathname !== '/customer' && 
                         location.pathname !== '/customer/restaurants' &&
                         !location.pathname.startsWith('/customer/login');
  const showHomeButton = isOrderConfirmation;

  // Determine if we should show cart button in header
  const showCartButton = cartCount > 0 && 
                        !['/customer/cart'].some(p => location.pathname.startsWith(p));

  const handleBack = () => {
    if (location.pathname.startsWith('/customer/restaurant/')) {
      navigate('/customer/restaurants');
    } else if (location.pathname === '/customer/order-summary') {
      navigate('/customer/cart');
    } else if (location.pathname === '/customer/payment') {
      navigate('/customer/order-summary');
    } else if (location.pathname === '/customer/delivery') {
      navigate('/customer/payment');
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    navigate('/customer/restaurants');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background customer-theme">
      <header className="w-full bg-card border-b sticky top-0 z-40 shadow-sm">
        <div className="h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10">
                {showBackButton && (
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                {showHomeButton && (
                  <Button variant="ghost" size="sm" onClick={handleHome}>
                    <Home className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <button onClick={() => navigate('/customer')} className="flex items-center hover:opacity-80 transition">
                <h1 className="text-2xl font-bold text-primary">FrontDash</h1>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {showCartButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/customer/cart')}
                  className="gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm font-medium">{cartCount}</span>
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={() => navigate('/customer/login')}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating continue button (shows when cart has items and not on checkout pages).
          Render into document.body via portal so it's positioned relative to viewport
          and not affected by any transformed ancestor. */}
      {cartCount > 0 && !['/customer/cart','/customer/order-summary','/customer/payment','/customer/delivery','/customer/order-confirmation'].some(p => location.pathname.startsWith(p)) && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)' }} className="z-50">
          <Button
            onClick={() => navigate('/customer/cart')}
            className="bg-gradient-primary text-primary-foreground shadow-lg px-6 py-3 rounded-full min-w-[200px] transition-all duration-300 hover:shadow-xl"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-xs opacity-90">${cartTotal.toFixed(2)}</span>
            </div>
          </Button>
        </div>,
        document.body
      )}

      <footer className="border-t bg-card mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 FrontDash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export { CustomerLayout };
