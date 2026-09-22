import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/AppContext";

/**
 * CartItem — a single line-item in the shopping cart.
 *
 * Props:
 *   item  — cart item (book + quantity)
 */
export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="card flex gap-4 p-4">
      {/* Cover */}
      <Link to={`/books/${item.id}`} className="shrink-0">
        <img
          src={item.cover}
          alt={item.title}
          className="h-28 w-20 rounded-lg object-cover shadow-sm"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/books/${item.id}`}>
              <h4 className="font-semibold text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
                {item.title}
              </h4>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.author}</p>
          </div>
          {/* Remove button */}
          <button
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove item"
            className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800 rounded-l-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2ch] px-1 text-center text-sm font-medium text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-r-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Line total */}
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}
