import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/AppContext";
import Button from "./Button";

/**
 * BookCard — displays a single book in the catalogue / homepage grid.
 *
 * Props:
 *   book  — book object from data/books.js
 *   view  — "grid" | "list"   (default: "grid")
 */
export default function BookCard({ book, view = "grid" }) {
  const { addToCart } = useCart();

  const discount =
    book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  if (view === "list") {
    return (
      <div className="card flex gap-4 p-4">
        <Link to={`/books/${book.id}`} className="shrink-0">
          <img
            src={book.cover}
            alt={book.title}
            className="h-32 w-24 rounded-lg object-cover shadow-sm"
            loading="lazy"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {book.category}
            </span>
            <Link to={`/books/${book.id}`}>
              <h3 className="mt-1 font-semibold text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {book.description}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <PriceBlock book={book} discount={discount} />
            <AddToCartBtn book={book} addToCart={addToCart} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:shadow-md">
      <Link to={`/books/${book.id}`} className="relative overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {discount && (
          <span className="absolute left-2 top-2 badge bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {!book.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="badge bg-gray-800 text-gray-200">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 self-start">
          {book.category}
        </span>
        <Link to={`/books/${book.id}`} className="mt-1 flex-1">
          <h3 className="font-semibold leading-snug text-gray-900 hover:text-primary-600 line-clamp-2 dark:text-white dark:hover:text-primary-400">
            {book.title}
          </h3>
        </Link>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{book.author}</p>

        <StarRating rating={book.rating} reviews={book.reviews} />

        <div className="mt-3 flex items-center justify-between">
          <PriceBlock book={book} discount={discount} />
          <AddToCartBtn book={book} addToCart={addToCart} />
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */
function StarRating({ rating, reviews }) {
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {rating} ({reviews.toLocaleString()})
      </span>
    </div>
  );
}

function PriceBlock({ book, discount }) {
  return (
    <div>
      <span className="text-base font-bold text-gray-900 dark:text-white">
        ${book.price.toFixed(2)}
      </span>
      {discount && (
        <span className="ml-1.5 text-xs text-gray-400 line-through dark:text-gray-500">
          ${book.originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}

function AddToCartBtn({ book, addToCart }) {
  return (
    <Button
      size="sm"
      disabled={!book.inStock}
      onClick={(e) => {
        e.preventDefault();
        addToCart(book);
      }}
    >
      {book.inStock ? "Add" : "Sold Out"}
    </Button>
  );
}
