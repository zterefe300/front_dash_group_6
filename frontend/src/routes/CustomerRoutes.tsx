import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { RestaurantList } from "../features/customer/pages/RestaurantList.js";
import { RestaurantDetailPage } from "../features/customer/pages/RestaurantDetail.js";
import { Cart } from "../features/customer/pages/Cart.js";
import { OrderSummary } from "../features/customer/pages/OrderSummary.js";
import { Delivery } from "../features/customer/pages/Delivery.js";
import { Payment } from "../features/customer/pages/Payment.js";
import { OrderConfirmation } from "../features/customer/pages/OrderConfirmation.js";
import { Orders } from "../features/customer/pages/Orders.js";
import { LoginTypeSelector } from "../features/shared/LoginTypeSelector.js";
import { CustomerPortalProtectedRoute, CustomerPortalPublicRoute } from "./RouteGuards.js";
import { CartProvider, useCart } from "../contexts/CartContext.js";

type PublicRoute = {
  path: string | string[];
  element: () => JSX.Element;
};

const publicRoutes: PublicRoute[] = [
  { path: "/login", element: () => <LoginTypeSelector /> },
  { path: ["/restaurants", "/", "*"], element: () => <RestaurantList /> },
  { path: "/restaurant/:id", element: () => <RestaurantDetailPage /> },
  { path: "/cart", element: () => <Cart /> },
  { path: "/order-summary", element: () => <OrderSummary /> },
  { path: "/delivery", element: () => <Delivery /> },
  { path: "/payment", element: () => <Payment /> },
  { path: "/order-confirmation", element: () => <OrderConfirmation /> },
  { path: "/orders", element: () => <Orders /> },
];

const CustomerPortalRoutes = () => (
  <Routes>
    {publicRoutes.map(({ path, element: createElement }) =>
      Array.isArray(path) ? (
        path.map((p) => (
          <Route key={p} path={p} element={<CustomerPortalPublicRoute element={createElement()} />} />
        ))
      ) : (
        <Route key={path} path={path} element={<CustomerPortalPublicRoute element={createElement()} />} />
      )
    )}
  </Routes>
);

const CustomerRoutes = () => (
  <CartProvider>
    <div className="min-h-screen bg-background">
      <CustomerPortalRoutes />
    </div>
  </CartProvider>
);

export default CustomerRoutes;
