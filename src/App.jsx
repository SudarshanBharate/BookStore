import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider, ThemeProvider, AuthProvider, useAuth, useCart } from "./context/AppContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProfilePage from "./pages/ProfilePage";

/** Guard: redirect unauthenticated users to /login */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** Guard: redirect to /cart if cart is empty */
function CartRequiredRoute({ children }) {
  const { items } = useCart();
  return items.length > 0 ? children : <Navigate to="/cart" replace />;
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Auth + cart required */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CartRequiredRoute>
                  <CheckoutPage />
                </CartRequiredRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <CartRequiredRoute>
                  <PaymentPage />
                </CartRequiredRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />

          {/* Profile / Order history */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
