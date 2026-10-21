import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Restaurants } from './pages/customer/Restaurants';
import { RestaurantDetail } from './pages/customer/RestaurantDetail';
import { Cart } from './pages/customer/Cart';
import { MyOrders } from './pages/customer/MyOrders';
import { OrderDetail } from './pages/customer/OrderDetail';
import { Profile } from './pages/customer/Profile';
import { MyRestaurant } from './pages/restaurant/MyRestaurant';
import { MenuManagement } from './pages/restaurant/MenuManagement';
import { IncomingOrders } from './pages/restaurant/IncomingOrders';
import { MyDeliveries } from './pages/delivery/MyDeliveries';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/restaurants" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />

        {/* Customer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Restaurant Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['RESTAURANT_ADMIN', 'ADMIN']} />}>
          <Route path="/my-restaurant" element={<MyRestaurant />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/incoming-orders" element={<IncomingOrders />} />
        </Route>

        {/* Delivery Person Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['DELIVERY_PERSON', 'ADMIN']} />}>
          <Route path="/my-deliveries" element={<MyDeliveries />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};