import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useCart } from "../context/AppContext";
import { formatINR } from "../utils/format";
import Button from "../components/Button";

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export default function ProfilePage() {
  const { user, logout, orders, cancelOrder } = useAuth();
  const { addToCart, switchCart } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout({ switchCart });
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            My Account
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {user?.name} &middot; {user?.email}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      {/* Order History */}
      <section>
        <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-5xl">📦</span>
            <p className="text-gray-500 dark:text-gray-400">
              You haven&apos;t placed any orders yet.
            </p>
            <Button as={Link} to="/catalogue">
              Browse Books
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onBuyAgain={(items) => {
                  items.forEach((item) => addToCart(item, item.quantity));
                  navigate("/cart");
                }}
                onCancel={cancelOrder}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OrderCard({ order, onBuyAgain, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const isCancelled = order.status === "Cancelled";
  const withinWindow = Date.now() - order.date < FORTY_EIGHT_HOURS;
  const canCancel = !isCancelled && withinWindow;

  const statusColors = {
    Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Dispatched: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    Delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div className="card overflow-hidden">
      {/* Order header */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Order</p>
          <p className="font-bold text-gray-900 dark:text-white">{order.number}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {new Date(order.date).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`badge text-xs px-2.5 py-1 ${statusColors[order.status] || statusColors.Processing}`}>
            {order.status}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {formatINR(order.total)}
          </span>

          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs text-primary-600 hover:underline dark:text-primary-400"
          >
            {expanded ? "Hide items ▲" : "View items ▼"}
          </button>
        </div>
      </div>

      {/* Expandable items */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 pb-4 pt-3">
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="h-12 w-9 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-gray-400 dark:text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="shrink-0 font-semibold text-gray-700 dark:text-gray-300">
                  {formatINR(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Subtotal</span><span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>GST (18%)</span><span>{formatINR(order.tax)}</span>
            </div>
            <div className="mt-2 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total</span><span>{formatINR(order.total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              size="sm"
              onClick={() => onBuyAgain(order.items)}
            >
              🔁 Buy Again
            </Button>
            {canCancel && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => onCancel(order.id)}
              >
                Cancel Order
              </Button>
            )}
            {isCancelled && (
              <span className="text-xs text-red-500 dark:text-red-400 self-center">
                Order cancelled
                {order.cancelledAt
                  ? ` on ${new Date(order.cancelledAt).toLocaleDateString("en-IN")}`
                  : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
