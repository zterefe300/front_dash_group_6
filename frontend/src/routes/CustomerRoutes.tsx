// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { DashboardLayout } from '../components/layout/DashboardLayout';
// import { UserProvider, useUser } from '../contexts/UserContext';
// import { SettingsProvider } from '../contexts/SettingsContext';
// import { RestaurantList } from '../features/customer/pages/RestaurantList';
// import { RestaurantDetail } from '../features/customer/pages/RestaurantDetail';
// import { Cart } from '../features/customer/pages/Cart';
// import { OrderSummary } from '../features/customer/pages/OrderSummary';
// import { Delivery } from '../features/customer/pages/Delivery';
// import { Payment } from '../features/customer/pages/Payment';
// import { OrderConfirmation } from '../features/customer/pages/OrderConfirmation';
// import { Orders } from '../features/customer/pages/Orders';
// import { LoginTypeSelector } from '../features/shared/LoginTypeSelector';
// import { CustomerPortalProtectedRoute, CustomerPortalPublicRoute } from './RouteGuards';

// const protectedRoutes = [
//   { path: '/restaurants', element: <RestaurantList /> },
//   { path: '/restaurant/:id', element: <RestaurantDetail /> },
//   { path: '/cart', element: <Cart /> },
//   { path: '/order-summary', element: <OrderSummary /> },
//   { path: '/delivery', element: <Delivery /> },
//   { path: '/payment', element: <Payment /> },
//   { path: '/order-confirmation', element: <OrderConfirmation /> },
//   { path: '/orders', element: <Orders /> },
// ];

// const CustomerPortalRoutes = () => (
//   <Routes>
//     <Route path="/login" element={<CustomerPortalPublicRoute element={<LoginTypeSelector />} />} />
//     {protectedRoutes.map(({ path, element }) => (
//       <Route key={path} path={path} element={<CustomerPortalProtectedRoute element={element} />} />
//     ))}
//     <Route path="/" element={<CustomerPortalProtectedRoute element={<RestaurantList />} />} />
//     <Route path="*" element={<CustomerPortalProtectedRoute element={<RestaurantList />} />} />
//   </Routes>
// );

// const CustomerRoutes = () => (
//   <UserProvider>
//     <SettingsProvider>
//       <div className="min-h-screen bg-background">
//         <CustomerPortalRoutes />
//       </div>
//     </SettingsProvider>
//   </UserProvider>
// );

// export default CustomerRoutes;
