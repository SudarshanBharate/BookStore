import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BOOKS } from "../data/books";
import { useCart } from "../context/AppContext";
import { formatINR } from "../utils/format";
import BookCard from "../components/BookCard";
import Button from "../components/Button";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const book = BOOKS.find((b) => b.id === Number(id));
  const related = BOOKS.filter((b) => b.category === book?.category && b.id !== book?.id).slice(0, 3);

  if (!book) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-6xl">📚</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book not found</h1>
        <Button onClick={() => navigate("/catalogue")}>Back to Catalogue</Button>
      </div>
    );
  }

  const discount = book.originalPrice > book.price
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  function handleAddToCart() {
    addToCart(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
        <span>/</span>
        <Link to="/catalogue" className="hover:text-primary-600 dark:hover:text-primary-400">Catalogue</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white line-clamp-1">{book.title}</span>
      </nav>

      {/* Main layout */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        {/* Cover */}
        <div className="flex justify-center lg:col-span-2">
          <div className="relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full max-w-xs rounded-2xl object-cover shadow-lg"
            />
            {discount && (
              <span className="absolute left-3 top-3 badge bg-red-500 text-white text-sm px-3 py-1">
                -{discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-3">
          <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            {book.category}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            {book.title}
          </h1>
          <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">by {book.author}</p>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="h-5 w-5" viewBox="0 0 20 20" fill={s <= Math.round(book.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{book.rating}</span>
            <span className="text-sm text-gray-500">({book.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
              {formatINR(book.price)}
            </span>
            {discount && (
              <span className="text-lg text-gray-400 line-through dark:text-gray-500">
                {formatINR(book.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Save {formatINR(book.originalPrice - book.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className={`mt-2 text-sm font-medium ${book.inStock ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {book.inStock ? "✓ In stock — ready to ship" : "✗ Out of stock"}
          </p>

          {/* Description */}
          <p className="mt-5 leading-relaxed text-gray-600 dark:text-gray-300">
            {book.description}
          </p>

          {/* Qty + Add to cart */}
          {book.inStock && (
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-l-lg"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="min-w-[2.5ch] px-2 text-center font-medium text-gray-900 dark:text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-r-lg"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <Button size="lg" onClick={handleAddToCart} className="flex-1 sm:flex-none">
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => { addToCart(book, qty); navigate("/cart"); }}
              >
                Buy Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Related books */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            More in {book.category}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
