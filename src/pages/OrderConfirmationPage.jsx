import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { StepIndicator } from "./CheckoutPage";
import Button from "../components/Button";

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

const ESTIMATED_DATE = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
  weekday: "long", month: "long", day: "numeric",
});

export default function OrderConfirmationPage() {
  const location = useLocation();
  const { orders, cancelOrder } = useAuth();

  // Prefer order number passed via navigation state; fall back to latest order
  const orderNumber = location.state?.orderNumber ?? orders[0]?.number ?? "BSK-XXXXXX";
  const latestOrder = orders.find((o) => o.number === orderNumber) ?? orders[0];

  const isCancelled = latestOrder?.status === "Cancelled";
  const withinWindow = latestOrder
    ? Date.now() - latestOrder.date < FORTY_EIGHT_HOURS
    : false;
  const canCancel = latestOrder && !isCancelled && withinWindow;

  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelled, setCancelled] = useState(isCancelled);

  function handleCancel() {
    if (!latestOrder) return;
    setCancelLoading(true);
    setTimeout(() => {
      cancelOrder(latestOrder.id);
      setCancelled(true);
      setCancelLoading(false);
    }, 700);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
      <StepIndicator current={2} />

      <div className="mt-10 text-center">
        {/* Success / Cancelled icon */}
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${cancelled ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
          {cancelled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {cancelled ? "Order Cancelled" : "Order Confirmed! 🎉"}
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          {cancelled
            ? "Your order has been cancelled and a refund will be processed within 5–7 business days."
            : "Thank you for your purchase. Your books are on their way!"}
        </p>

        {/* Order details card */}
        <div className="card mx-auto mt-8 max-w-md p-6 text-left">
          <dl className="space-y-3">
            <DetailRow term="Order Number" detail={orderNumber} />
            <DetailRow term="Estimated Arrival" detail={ESTIMATED_DATE} />
            <DetailRow
              term="Status"
              detail={
                <span className={`badge text-xs px-2.5 py-1 ${
                  cancelled
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}>
                  {cancelled ? "Cancelled" : "Processing"}
                </span>
              }
            />
            <DetailRow term="Confirmation sent to" detail="your registered email" />
          </dl>
        </div>

        {/* Cancel within 48h */}
        {canCancel && !cancelled && (
          <div className="mx-auto mt-5 max-w-md rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 text-left dark:border-yellow-700/40 dark:bg-yellow-900/10">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              ⏱ Need to cancel?
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
              You can cancel this order within 48 hours of placing it. After that, cancellation is not guaranteed.
            </p>
            <Button
              variant="danger"
              size="sm"
              loading={cancelLoading}
              onClick={handleCancel}
            >
              {cancelLoading ? "Cancelling…" : "Cancel This Order"}
            </Button>
          </div>
        )}

        {/* What happens next — only shown if not cancelled */}
        {!cancelled && (
          <div className="mt-10 text-left">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              What happens next?
            </h2>
            <ol className="space-y-4">
              {[
                { title: "Order Received", done: true, desc: "We have received your order and are preparing it." },
                { title: "Packed & Dispatched", done: false, desc: "Your books will be packed and handed to the courier." },
                { title: "Out for Delivery", done: false, desc: "Your parcel is on its way to your address." },
                { title: "Delivered", done: false, desc: `Expected by ${ESTIMATED_DATE}.` },
              ].map(({ title, done, desc }) => (
                <li key={title} className="flex gap-4">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-green-500 text-white" : "border-2 border-gray-300 text-gray-400 dark:border-gray-600"}`}>
                    {done ? "✓" : ""}
                  </div>
                  <div>
                    <p className={`font-semibold ${done ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button as={Link} to="/profile" size="lg" variant="secondary">
            View Order History
          </Button>
          <Button as={Link} to="/catalogue" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ term, detail }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{term}</dt>
      <dd className="text-sm font-semibold text-gray-900 dark:text-white text-right">
        {detail}
      </dd>
    </div>
  );
}
