import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.jsx';
import { UserProvider, useUser } from '../contexts/UserContext.js';
import { SettingsProvider } from '../contexts/SettingsContext.js';
import { RestaurantList } from '../features/customer/pages/RestaurantList.tsx';
import { RestaurantDetail } from '../features/customer/pages/RestaurantDetail.tsx';
import { Cart } from '../features/customer/pages/Cart.tsx';
import { OrderSummary } from '../features/customer/pages/OrderSummary.tsx';
import { Delivery } from '../features/customer/pages/Delivery.tsx';
import { Payment } from '../features/customer/pages/Payment.tsx';
import { OrderConfirmation } from '../features/customer/pages/OrderConfirmation.tsx';
import { Orders } from '../features/customer/pages/Orders.tsx';
import { LoginTypeSelector } from '../features/shared/LoginTypeSelector.tsx';
import { CustomerPortalProtectedRoute, CustomerPortalPublicRoute } from './RouteGuards.tsx';

const protectedRoutes = [
  { path: '/restaurants', element: <RestaurantList /> },
  { path: '/restaurant/:id', element: <RestaurantDetail /> },
  { path: '/cart', element: <Cart /> },
  { path: '/order-summary', element: <OrderSummary /> },
  { path: '/delivery', element: <Delivery /> },
  { path: '/payment', element: <Payment /> },
  { path: '/order-confirmation', element: <OrderConfirmation /> },
  { path: '/orders', element: <Orders /> },
];

const CustomerPortalRoutes = () => (
  <Routes>
    <Route path="/login" element={<CustomerPortalPublicRoute element={<LoginTypeSelector />} />} />
    {protectedRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={<CustomerPortalProtectedRoute element={element} />} />
    ))}
    <Route path="/" element={<CustomerPortalProtectedRoute element={<RestaurantList />} />} />
    <Route path="*" element={<CustomerPortalProtectedRoute element={<RestaurantList />} />} />
  </Routes>
);

const CustomerRoutes = () => (
  <UserProvider>
    <SettingsProvider>
      <div className="min-h-screen bg-background">
        <CustomerPortalRoutes />
      </div>
    </SettingsProvider>
  </UserProvider>
);

export default CustomerRoutes;
