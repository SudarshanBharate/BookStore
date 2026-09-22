import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ── helpers ────────────────────────────────────────────────────────── */
function ordersKey(email) {
  return `orders:${email}`;
}
function cartKey(email) {
  return email ? `cart:${email}` : "cart:guest";
}
function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}

/* ── Cart Context ───────────────────────────────────────────────────── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Cart is keyed per-user; we get the current user email from localStorage
  // so CartProvider doesn't need to depend on AuthProvider directly.
  function currentCartKey() {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      return cartKey(u?.email);
    } catch { return cartKey(null); }
  }

  const [items, setItems] = useState(() => readJSON(currentCartKey(), []));
  // Track which key we're currently writing to so we can switch on login/logout
  const [activeCartKey, setActiveCartKey] = useState(currentCartKey);

  // Persist whenever items or the active key change
  useEffect(() => {
    localStorage.setItem(activeCartKey, JSON.stringify(items));
  }, [items, activeCartKey]);

  // Called by AuthContext when the user changes (login / logout)
  const switchCart = useCallback((email) => {
    const key = cartKey(email);
    setActiveCartKey(key);
    setItems(readJSON(key, []));
  }, []);

  const addToCart = useCallback((book, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === book.id);
      if (existing)
        return prev.map((i) => i.id === book.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...book, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setItems((prev) => prev.filter((i) => i.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === bookId ? { ...i, quantity: qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart,
               totalItems, totalPrice, switchCart }}
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
    return false; // default to light theme
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

/* ── Auth Context ───────────────────────────────────────────────────── */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON("user", null));

  // Orders are per-user: stored under "orders:<email>"
  const [orders, setOrders] = useState(() => {
    const u = readJSON("user", null);
    return u ? readJSON(ordersKey(u.email), []) : [];
  });

  // Persist orders under the current user's key whenever they change
  useEffect(() => {
    if (user) localStorage.setItem(ordersKey(user.email), JSON.stringify(orders));
  }, [orders, user]);

  const login = useCallback((userData, { switchCart } = {}) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Load this user's orders from their own key
    setOrders(readJSON(ordersKey(userData.email), []));
    // Switch the cart to this user's cart
    switchCart?.(userData.email);
  }, []);

  const logout = useCallback(({ switchCart } = {}) => {
    setUser(null);
    localStorage.removeItem("user");
    // Clear orders from state — leave storage intact for next login
    setOrders([]);
    // Switch cart to guest (empty)
    switchCart?.(null);
  }, []);

  /** Persist a completed order under the logged-in user's key. */
  const addOrder = useCallback((orderData) => {
    setOrders((prev) => [orderData, ...prev]);
  }, []);

  /** Cancel an order within 48 h of placement. */
  const cancelOrder = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "Cancelled", cancelledAt: Date.now() } : o
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
