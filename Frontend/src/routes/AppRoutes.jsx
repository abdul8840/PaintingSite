import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute     from './GuestRoute';

/* ── Page imports ── */
import HomePage             from '../pages/HomePage';
import ShopPage             from '../pages/ShopPage';
import ArtworkDetailPage    from '../pages/ArtworkDetailPage';
import CategoryPage         from '../pages/CategoryPage';
import CartPage             from '../pages/CartPage';
import CheckoutPage         from '../pages/CheckoutPage';
import CustomPaintingPage   from '../pages/CustomPaintingPage';
import OrderSuccessPage     from '../pages/OrderSuccessPage';
import OrdersPage           from '../pages/OrdersPage';
import OrderDetailPage      from '../pages/OrderDetailPage';
import CustomOrdersPage     from '../pages/CustomOrdersPage';
import CustomOrderDetailPage from '../pages/CustomOrderDetailPage';
import TrackOrderPage       from '../pages/TrackOrderPage';
import ProfilePage          from '../pages/ProfilePage';
import WishlistPage         from '../pages/WishlistPage';
import LoginPage            from '../pages/LoginPage';
import RegisterPage         from '../pages/RegisterPage';
import ForgotPasswordPage   from '../pages/ForgotPasswordPage';
import ResetPasswordPage    from '../pages/ResetPasswordPage';
import AboutPage            from '../pages/AboutPage';
import ContactPage          from '../pages/ContactPage';
import NotFoundPage         from '../pages/NotFoundPage';

/* ── Page transition wrapper ── */
function PageWrapper({ children }) {
  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  );
}

/* ── Route-level loading fallback ── */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <span className="absolute inset-0 rounded-full border-4
                           border-[var(--color-cream)]" />
          <span className="absolute inset-0 rounded-full border-4
                           border-t-[var(--color-rust)] border-r-transparent
                           border-b-transparent border-l-transparent
                           animate-spin" />
        </div>
        <p className="text-sm text-[var(--color-mist)] font-medium animate-pulse">
          Loading…
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/"
          element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/shop"
          element={<PageWrapper><ShopPage /></PageWrapper>} />
        <Route path="/artwork/:slug"
          element={<PageWrapper><ArtworkDetailPage /></PageWrapper>} />
        <Route path="/category/:slug"
          element={<PageWrapper><CategoryPage /></PageWrapper>} />
        <Route path="/custom-painting"
          element={<PageWrapper><CustomPaintingPage /></PageWrapper>} />
        <Route path="/track-order"
          element={<PageWrapper><TrackOrderPage /></PageWrapper>} />
        <Route path="/about"
          element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/contact"
          element={<PageWrapper><ContactPage /></PageWrapper>} />

        {/* ── Guest-only routes ── */}
        <Route path="/login"
          element={
            <GuestRoute>
              <PageWrapper><LoginPage /></PageWrapper>
            </GuestRoute>
          }
        />
        <Route path="/register"
          element={
            <GuestRoute>
              <PageWrapper><RegisterPage /></PageWrapper>
            </GuestRoute>
          }
        />
        <Route path="/forgot-password"
          element={
            <GuestRoute>
              <PageWrapper><ForgotPasswordPage /></PageWrapper>
            </GuestRoute>
          }
        />
        <Route path="/reset-password/:token"
          element={
            <GuestRoute>
              <PageWrapper><ResetPasswordPage /></PageWrapper>
            </GuestRoute>
          }
        />

        {/* ── Protected routes ── */}
        <Route path="/cart"
          element={
            <ProtectedRoute>
              <PageWrapper><CartPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/checkout"
          element={
            <ProtectedRoute>
              <PageWrapper><CheckoutPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/order-success"
          element={
            <ProtectedRoute>
              <PageWrapper><OrderSuccessPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/orders"
          element={
            <ProtectedRoute>
              <PageWrapper><OrdersPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/orders/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><OrderDetailPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/custom-orders"
          element={
            <ProtectedRoute>
              <PageWrapper><CustomOrdersPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/custom-orders/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><CustomOrderDetailPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><ProfilePage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/wishlist"
          element={
            <ProtectedRoute>
              <PageWrapper><WishlistPage /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* ── 404 ── */}
        <Route path="*"
          element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </Suspense>
  );
}