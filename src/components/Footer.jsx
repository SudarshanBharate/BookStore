import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { to: "/", label: "Home" },
      { to: "/catalogue", label: "Catalogue" },
      { to: "/cart", label: "Cart" },
    ],
  },
  {
    heading: "Account",
    links: [
      { to: "/login", label: "Sign In" },
      { to: "/register", label: "Register" },
      { to: "/profile", label: "My Orders" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "#", label: "About Us" },
      { to: "#", label: "Contact" },
      { to: "#", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="text-lg font-bold text-primary-600 dark:text-primary-400"
            >
              📚 Sudarshan BookStore
            </Link>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Discover your next great read. Thousands of titles across every
              genre, delivered to your door.
            </p>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {year} BookStore. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Built with React &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
