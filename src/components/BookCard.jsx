import React, { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { formatINR } from "../utils/format";
import Button from "./Button";

/**
 * BookCard — glass-morphism card with cursor-tracked glow.
 *
 * Props:
 *   book  — book object from data/books.js
 *   view  — "grid" | "list"   (default: "grid")
 */
export default function BookCard({ book, view = "grid" }) {
  const { addToCart } = useCart();
  const cardRef = useRef(null);
  const [cartAnim, setCartAnim] = useState(false); // drives add-to-cart burst

  const discount =
    book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  /* Cursor glow tracking */
  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    }
  }, []);

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart(book);
    setCartAnim(true);
    setTimeout(() => setCartAnim(false), 1400);
  }

  if (view === "list") {
    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card-glass book-glow relative flex gap-4 p-4"
        style={{ "--mx": "50%", "--my": "50%" }}
      >
        <Link to={`/books/${book.id}`} className="shrink-0">
          <img
            src={book.cover}
            alt={book.title}
            className="h-32 w-24 rounded-xl object-cover shadow-sm transition duration-300 hover:scale-105"
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
            <AddToCartBtn book={book} addToCart={addToCart} cartAnim={cartAnim} onAdd={handleAddToCart} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-glass book-glow group relative flex flex-col overflow-hidden"
      style={{ "--mx": "50%", "--my": "50%" }}
    >
      <Link to={`/books/${book.id}`} className="relative overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {discount && (
          <span className="absolute left-2 top-2 badge bg-red-500 text-white shadow-sm">
            -{discount}%
          </span>
        )}
        {!book.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="badge bg-gray-900/80 text-gray-200 text-sm px-3 py-1">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 bg-gray-100/90 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
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
          <AddToCartBtn book={book} addToCart={addToCart} cartAnim={cartAnim} onAdd={handleAddToCart} />
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
        {formatINR(book.price)}
      </span>
      {discount && (
        <span className="ml-1.5 text-xs text-gray-400 line-through dark:text-gray-500">
          {formatINR(book.originalPrice)}
        </span>
      )}
    </div>
  );
}

function AddToCartBtn({ book, cartAnim, onAdd }) {
  if (!book.inStock) {
    return (
      <Button size="sm" disabled variant="secondary">
        Sold Out
      </Button>
    );
  }

  return (
    <div className="relative">
      {/* Burst rings — appear on add */}
      {cartAnim && (
        <>
          <span className="absolute inset-0 rounded-xl animate-ping-once bg-primary-400/30 pointer-events-none" />
          <span className="absolute inset-0 rounded-xl animate-ping-once-delay bg-primary-300/20 pointer-events-none" />
        </>
      )}

      <Button
        size="sm"
        onClick={onAdd}
        className={`relative transition-all duration-300 ${
          cartAnim
            ? "!bg-green-500 !border-green-400 scale-105 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
            : ""
        }`}
      >
        {cartAnim ? (
          <span className="flex items-center gap-1">
            <CheckIcon />
            Added!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <CartPlusIcon />
            Add
          </span>
        )}
      </Button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function CartPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
