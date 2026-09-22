import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BOOKS, CATEGORIES } from "../data/books";
import BookCard from "../components/BookCard";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "Title A–Z" },
];

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState("list");

  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "default";

  function setParam(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "All" || value === "default") next.delete(key);
      else next.set(key, value);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let books = [...BOOKS];
    if (activeCategory !== "All")
      books = books.filter((b) => b.category === activeCategory);
    if (searchQuery)
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    switch (sortBy) {
      case "price-asc":
        return books.sort((a, b) => a.price - b.price);
      case "price-desc":
        return books.sort((a, b) => b.price - a.price);
      case "rating":
        return books.sort((a, b) => b.rating - a.rating);
      case "title":
        return books.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return books;
    }
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catalogue</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
          {activeCategory !== "All" && ` in "${activeCategory}"`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar filters — sticky so categories stay visible while scrolling */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="card p-4 lg:sticky lg:top-24">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </h2>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setParam("category", cat)}
                    className={`w-full rounded-lg px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* View toggles */}
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`rounded-lg p-1.5 transition-colors ${view === "grid" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`rounded-lg p-1.5 transition-colors ${view === "list" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                <ListIcon />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setParam("sort", e.target.value)}
              className="input w-auto cursor-pointer py-1.5 pr-8 text-sm"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Active search chip */}
          {searchQuery && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Search: <strong>"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => setParam("search", "")}
                className="text-xs text-red-500 hover:underline"
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Book grid / list */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl">📚</span>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                No books found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} view={view} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}
