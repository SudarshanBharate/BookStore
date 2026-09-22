import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

// Generate a readable order number
const ORDER_NUMBER = `BSK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
const ESTIMATED_DATE = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric",
});

export default function OrderConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      {/* Success icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600 dark:text-green-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        Order Confirmed! 🎉
      </h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
        Thank you for your purchase. Your books are on their way!
      </p>

      {/* Order details card */}
      <div className="card mx-auto mt-8 max-w-md p-6 text-left">
        <dl className="space-y-3">
          <DetailRow term="Order Number" detail={ORDER_NUMBER} />
          <DetailRow term="Estimated Arrival" detail={ESTIMATED_DATE} />
          <DetailRow term="Status" detail={
            <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
              Processing
            </span>
          } />
          <DetailRow term="Confirmation sent to" detail="your registered email" />
        </dl>
      </div>

      {/* Timeline */}
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

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button as={Link} to="/" size="lg">
          Back to Home
        </Button>
        <Button as={Link} to="/catalogue" size="lg" variant="secondary">
          Continue Shopping
        </Button>
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
