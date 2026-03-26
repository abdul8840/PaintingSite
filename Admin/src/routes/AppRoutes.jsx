import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import AdminLayout from '../components/layout/AdminLayout';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ArtworksPage from '../pages/ArtworksPage';
import ArtworkCreatePage from '../pages/ArtworkCreatePage';
import ArtworkEditPage from '../pages/ArtworkEditPage';
import CategoriesPage from '../pages/CategoriesPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import CustomOrdersPage from '../pages/CustomOrdersPage';
import CustomOrderDetailPage from '../pages/CustomOrderDetailPage';
import CouponsPage from '../pages/CouponsPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="artworks" element={<ArtworksPage />} />
        <Route path="artworks/create" element={<ArtworkCreatePage />} />
        <Route path="artworks/edit/:id" element={<ArtworkEditPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="custom-orders" element={<CustomOrdersPage />} />
        <Route path="custom-orders/:id" element={<CustomOrderDetailPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}