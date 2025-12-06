import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Restaurant, DeliveryAddress, PaymentInfo } from '../features/customer/types';

interface CartContextType {
  // Cart state
  items: CartItem[];
  restaurant: Restaurant | null;

  // Checkout state
  deliveryAddress: DeliveryAddress | null;
  paymentInfo: PaymentInfo | null;

  // Actions
  addItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setRestaurant: (restaurant: Restaurant) => void;

  // Checkout actions
  setDeliveryAddress: (address: DeliveryAddress) => void;
  setPaymentInfo: (info: PaymentInfo) => void;

  // Calculation helpers
  getTotalItems: () => number;
  getTotalPrice: () => number;

  // Navigation helpers
  goToCart: () => void;
  goToOrderSummary: () => void;
  goToDelivery: () => void;
  goToPayment: () => void;
  goToOrderConfirmation: () => void;
  goToNewOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurant, setRestaurantState] = useState<Restaurant | null>(null);
  const [deliveryAddress, setDeliveryAddressState] = useState<DeliveryAddress | null>(null);
  const [paymentInfo, setPaymentInfoState] = useState<PaymentInfo | null>(null);
  const navigate = useNavigate();

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantState(null);
    setDeliveryAddressState(null);
    setPaymentInfoState(null);
  };

  const setRestaurant = (restaurant: Restaurant) => {
    setRestaurantState(restaurant);
  };

  const setDeliveryAddress = (address: DeliveryAddress) => {
    setDeliveryAddressState(address);
  };

  const setPaymentInfo = (info: PaymentInfo) => {
    setPaymentInfoState(info);
  };

  // Calculation helpers
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Navigation helpers using SPA navigation to preserve context/state
  const goToCart = () => navigate('/customer/cart');
  const goToOrderSummary = () => navigate('/customer/order-summary');
  const goToDelivery = () => navigate('/customer/delivery');
  const goToPayment = () => navigate('/customer/payment');
  const goToOrderConfirmation = () => navigate('/customer/order-confirmation');
  const goToNewOrder = () => navigate('/customer/restaurants');

  return (
    <CartContext.Provider value={{
      items,
      restaurant,
      deliveryAddress,
      paymentInfo,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setRestaurant,
      setDeliveryAddress,
      setPaymentInfo,
      getTotalItems,
      getTotalPrice,
      goToCart,
      goToOrderSummary,
      goToDelivery,
      goToPayment,
      goToOrderConfirmation,
      goToNewOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};
