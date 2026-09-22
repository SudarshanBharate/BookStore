import React from "react";
import { Link } from "react-router-dom";
import { BOOKS } from "../data/books";
import BookCard from "../components/BookCard";
import Button from "../components/Button";

const FEATURED = BOOKS.filter((b) => b.featured);
const NEW_ARRIVALS = BOOKS.slice(0, 4);
const GENRES = [
  { name: "Fiction", emoji: "📖" },
  { name: "Science", emoji: "🔬" },
  { name: "History", emoji: "🏛️" },
  { name: "Technology", emoji: "💻" },
  { name: "Self-Help", emoji: "🌱" },
  { name: "Fantasy", emoji: "🐉" },
  { name: "Mystery", emoji: "🔍" },
  { name: "Biography", emoji: "👤" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 px-4 pt-28 pb-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-200">
            Your Next Great Read Awaits
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Discover Books You&apos;ll
            <span className="block text-yellow-300">Absolutely Love</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-primary-100">
            Browse thousands of titles across every genre. Fast delivery,
            unbeatable prices, and hand-picked recommendations — from{" "}
            <span className="font-semibold text-white">Sudarshan BookStore</span>.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              as={Link}
              to="/catalogue"
              size="lg"
              className="!bg-white !text-primary-700 hover:!bg-primary-50"
            >
              Browse Catalogue
            </Button>
            <Button
              as={Link}
              to="/catalogue?category=Fiction"
              size="lg"
              variant="ghost"
              className="!text-white hover:!bg-white/10"
            >
              Top Fiction →
            </Button>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 md:grid-cols-4 dark:divide-gray-700">
          {[
            { label: "Books Available", value: "50,000+" },
            { label: "Happy Readers", value: "120,000+" },
            { label: "Genres", value: "50+" },
            { label: "Next-Day Delivery", value: "Free" },
          ].map(({ label, value }) => (
            <div key={label} className="px-6 py-5 text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured books */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader title="Featured Books" subtitle="Handpicked favourites our readers love" href="/catalogue" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Genre chips */}
      <section className="bg-gray-50 py-14 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Browse by Genre" subtitle="Find exactly what you're in the mood for" />
          <div className="mt-6 flex flex-wrap gap-3">
            {GENRES.map(({ name, emoji }) => (
              <Link
                key={name}
                to={`/catalogue?category=${encodeURIComponent(name)}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-primary-400 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                <span>{emoji}</span>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader title="New Arrivals" subtitle="Fresh titles added this week" href="/catalogue" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NEW_ARRIVALS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600 px-4 py-14 text-center text-white dark:bg-primary-800">
        <h2 className="text-3xl font-bold">Ready to start reading?</h2>
        <p className="mx-auto mt-3 max-w-md text-primary-100">
          Join over 120,000 readers. Free shipping on orders over $25.
        </p>
        <Button
          as={Link}
          to="/catalogue"
          size="lg"
          className="mt-6 !bg-white !text-primary-700 hover:!bg-primary-50"
        >
          Shop Now
        </Button>
      </section>
    </main>
  );
}

function SectionHeader({ title, subtitle, href }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {href && (
        <Link
          to={href}
          className="shrink-0 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
        >
          View all →
        </Link>
      )}
    </div>
  );
}
