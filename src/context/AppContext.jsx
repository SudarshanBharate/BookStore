import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ── Cart Context ───────────────────────────────────────────────────── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((book, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.id === book.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...book, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setItems((prev) => prev.filter((i) => i.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === bookId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/* ── Theme Context ──────────────────────────────────────────────────── */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = useCallback(() => setDark((d) => !d), []);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/* ── Auth Context (with Order History) ─────────────────────────────── */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // Orders: [{ id, number, date, items, subtotal, shipping, tax, total, status, cancelledAt }]
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  /** Call this when payment succeeds to persist the order. */
  const addOrder = useCallback((orderData) => {
    setOrders((prev) => [orderData, ...prev]);
  }, []);

  /** Cancel an order if within 48 hours of placement. */
  const cancelOrder = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "Cancelled", cancelledAt: Date.now() }
          : o
      )
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, orders, addOrder, cancelOrder }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
