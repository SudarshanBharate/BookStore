import React, { useState, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart, useTheme, useAuth } from "../context/AppContext";

/**
 * Dynamic Island Navbar
 * ─────────────────────
 * Floats as a centred glass pill, positioned absolutely over the hero.
 * Nav links are glass 3D pills — active state has a raised inset highlight
 * and a glowing indigo underline so the user always knows their location.
 */
export default function Navbar() {
  const { totalItems } = useCart();
  const { dark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const islandRef = useRef(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalogue", label: "Catalogue" },
  ];

  /* Track cursor over the island for the radial glow */
  const handleMouseMove = useCallback((e) => {
    const el = islandRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = islandRef.current;
    if (el) { el.style.setProperty("--mx", "50%"); el.style.setProperty("--my", "50%"); }
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); setSearchOpen(false); setMenuOpen(false);
    }
  }

  function handleLogout() {
    logout(); navigate("/login"); setMenuOpen(false);
  }

  return (
    /* Fixed, centred, sits ON TOP of the hero — no layout space consumed */
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-3 pointer-events-none">
      {/* ── Island pill ─────────────────────────────────────────────── */}
      <div
        ref={islandRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`island pointer-events-auto relative flex items-center gap-2 px-3 py-2 ${
          menuOpen ? "island-expanded rounded-3xl" : "rounded-full"
        } w-[min(94vw,720px)]`}
        style={{ "--mx": "50%", "--my": "50%" }}
      >
        {/* Cursor glow overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{ background: "radial-gradient(circle at var(--mx) var(--my), rgba(99,102,241,0.15) 0%, transparent 65%)" }}
        />

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-1.5 z-10"
        >
          <BookIcon />
          <span className="hidden sm:inline text-[13px] font-bold tracking-tight bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-violet-400">
            Sudarshan BookStore
          </span>
        </Link>

        {/* ── Desktop glass 3D nav links ─────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1 z-10 ml-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-pill relative ${isActive ? "nav-pill-active" : "nav-pill-idle"}`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {/* Glowing active dot */}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500 shadow-[0_0_6px_2px_rgba(99,102,241,0.7)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center z-10">
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                type="search"
                placeholder="Search books…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                className="w-40 rounded-full border border-white/30 bg-white/40 px-3 py-1 text-xs text-gray-900 placeholder-gray-400 outline-none backdrop-blur-sm focus:border-primary-400 dark:border-white/10 dark:bg-gray-800/60 dark:text-gray-100 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="island-icon-btn"
              >
                <XIcon size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="island-icon-btn"
            >
              <SearchIcon />
            </button>
          )}
        </form>

        {/* Theme toggle */}
        <button onClick={toggleTheme} aria-label="Toggle theme" className="island-icon-btn z-10">
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Cart */}
        <Link to="/cart" aria-label="Cart" className="island-icon-btn relative z-10">
          <CartIcon />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-1 ring-white dark:ring-gray-950">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>

        {/* Auth */}
        {user ? (
          <div className="hidden sm:flex items-center gap-1.5 z-10">
            <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 max-w-[72px] truncate">
              {user.name.split(" ")[0]}
            </span>
            <button onClick={handleLogout} className="nav-pill nav-pill-idle text-[11px] !px-2.5 !py-0.5">
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="hidden sm:inline-flex z-10 nav-pill nav-pill-cta">
            Sign In
          </Link>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          className="island-icon-btn z-10 md:hidden"
        >
          {menuOpen ? <XIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────────── */}
      {menuOpen && (
        <div className="island pointer-events-auto mt-2 w-[min(94vw,720px)] rounded-3xl px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="search"
                placeholder="Search books…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 text-sm"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `mobile-nav-pill ${isActive ? "mobile-nav-pill-active" : "mobile-nav-pill-idle"}`
                }
              >
                {label}
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ── SVG icons ────────────────────────────────────────────────────────── */
function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}
function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
function XIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
