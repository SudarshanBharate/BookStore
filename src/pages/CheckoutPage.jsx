import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { formatINR } from "../utils/format";
import Button from "../components/Button";

const SAVED_ADDRESSES = [
  {
    id: 1,
    label: "Home",
    name: "Alex Reader",
    line1: "123 Bookworm Lane",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    country: "United States",
  },
  {
    id: 2,
    label: "Work",
    name: "Alex Reader",
    line1: "456 Office Park Drive",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0].id);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "", line1: "", city: "", state: "", zip: "", country: "United States",
  });
  const [errors, setErrors] = useState({});

  const shipping = totalPrice > 999 ? 0 : 99;

  function handleNewChange(e) {
    setNewAddress((a) => ({ ...a, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  function validateNew() {
    const errs = {};
    if (!newAddress.name.trim()) errs.name = "Required";
    if (!newAddress.line1.trim()) errs.line1 = "Required";
    if (!newAddress.city.trim()) errs.city = "Required";
    if (!newAddress.state.trim()) errs.state = "Required";
    if (!newAddress.zip.trim()) errs.zip = "Required";
    return errs;
  }

  function handleContinue() {
    if (showNewForm) {
      const errs = validateNew();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    navigate("/payment");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
      <StepIndicator current={1} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Address section */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Delivery Address
          </h2>

          {/* Saved addresses */}
          {SAVED_ADDRESSES.map((addr) => (
            <label
              key={addr.id}
              className={`card flex cursor-pointer items-start gap-4 p-4 transition ${
                selectedAddress === addr.id
                  ? "border-primary-500 ring-1 ring-primary-500"
                  : "hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => { setSelectedAddress(addr.id); setShowNewForm(false); }}
                className="mt-1 accent-primary-600"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {addr.label} — {addr.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {addr.line1}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                </p>
              </div>
            </label>
          ))}

          {/* Add new address toggle */}
          <button
            onClick={() => { setShowNewForm((s) => !s); setSelectedAddress(null); }}
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            <span className="text-lg">{showNewForm ? "−" : "+"}</span>
            Add a new address
          </button>

          {showNewForm && (
            <div className="card grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <FieldGroup label="Full Name" name="name" value={newAddress.name} onChange={handleNewChange} error={errors.name} />
              <FieldGroup label="Address" name="line1" value={newAddress.line1} onChange={handleNewChange} error={errors.line1} className="sm:col-span-2" />
              <FieldGroup label="City" name="city" value={newAddress.city} onChange={handleNewChange} error={errors.city} />
              <FieldGroup label="State" name="state" value={newAddress.state} onChange={handleNewChange} error={errors.state} />
              <FieldGroup label="ZIP / Postal Code" name="zip" value={newAddress.zip} onChange={handleNewChange} error={errors.zip} />
              <FieldGroup label="Country" name="country" value={newAddress.country} onChange={handleNewChange} error={errors.country} />
            </div>
          )}

          <Button size="lg" fullWidth onClick={handleContinue}>
            Continue to Payment
          </Button>
        </div>

        {/* Mini order summary */}
        <OrderSummary items={items} totalPrice={totalPrice} shipping={shipping} />
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */
function FieldGroup({ label, name, value, onChange, error, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input name={name} value={value} onChange={onChange} className={`input ${error ? "border-red-500" : ""}`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function OrderSummary({ items, totalPrice, shipping }) {
  return (
    <div className="card p-5 h-fit sticky top-24">
      <h3 className="mb-3 font-bold text-gray-900 dark:text-white">Order Summary</h3>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between gap-2 text-gray-600 dark:text-gray-300">
            <span className="line-clamp-1">{i.title} × {i.quantity}</span>
            <span className="shrink-0">{formatINR(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Shipping</span>
        <span className={shipping === 0 ? "text-green-600 dark:text-green-400 font-semibold" : ""}>
          {shipping === 0 ? "Free" : formatINR(shipping)}
        </span>
      </div>
      <div className="mt-2 flex justify-between font-bold text-gray-900 dark:text-white">
        <span>Total</span>
        <span>{formatINR(totalPrice + shipping)}</span>
      </div>
    </div>
  );
}

export function StepIndicator({ current }) {
  const steps = ["Delivery", "Payment", "Confirmation"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
              i < current ? "bg-primary-600 text-white" :
              i === current ? "border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400" :
              "border-2 border-gray-300 text-gray-400 dark:border-gray-600"
            }`}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`mt-1 text-xs font-medium ${i === current ? "text-primary-600 dark:text-primary-400" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-2 mb-5 ${i < current ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
