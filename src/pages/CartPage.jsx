import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";
import CartItem from "../components/CartItem";
import Button from "../components/Button";

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = totalPrice > 25 || totalPrice === 0 ? 0 : 4.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-7xl">🛒</span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button as={Link} to="/catalogue" size="lg">
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Shopping Cart
          <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
            ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                valueClass={shipping === 0 ? "text-green-600 dark:text-green-400 font-semibold" : ""}
              />
              <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
            </div>

            {totalPrice < 25 && totalPrice > 0 && (
              <p className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                Add ${(25 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}

            <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
            <Row
              label="Total"
              value={`$${orderTotal.toFixed(2)}`}
              labelClass="text-base font-bold text-gray-900 dark:text-white"
              valueClass="text-base font-bold text-gray-900 dark:text-white"
            />

            <Button
              fullWidth
              size="lg"
              className="mt-5"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>

            <Link
              to="/catalogue"
              className="mt-3 block text-center text-sm text-primary-600 hover:underline dark:text-primary-400"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, labelClass = "", valueClass = "" }) {
  return (
    <div className="flex justify-between">
      <span className={`text-gray-600 dark:text-gray-300 ${labelClass}`}>{label}</span>
      <span className={`text-gray-900 dark:text-white ${valueClass}`}>{value}</span>
    </div>
  );
}
