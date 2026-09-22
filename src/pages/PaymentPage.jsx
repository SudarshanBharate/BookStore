import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { formatINR } from "../utils/format";
import { StepIndicator } from "./CheckoutPage";
import Button from "../components/Button";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "apple", label: "Apple Pay", icon: "" },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice > 999 ? 0 : 99;
  const tax = totalPrice * 0.18;
  const orderTotal = totalPrice + shipping + tax;

  function handleChange(e) {
    let val = e.target.value;
    if (e.target.name === "cardNumber")
      val = val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    if (e.target.name === "expiry")
      val = val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
    if (e.target.name === "cvv")
      val = val.replace(/\D/g, "").slice(0, 4);
    setForm((f) => ({ ...f, [e.target.name]: val }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  function validate() {
    if (method !== "card") return {};
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (form.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errs.expiry = "Use MM/YY format";
    if (form.cvv.length < 3) errs.cvv = "3–4 digits required";
    return errs;
  }

  function handlePay(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate("/order-confirmation");
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
      <StepIndicator current={1} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment</h2>

          {/* Method selector */}
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`card flex flex-col items-center justify-center gap-1 py-4 transition ${
                  method === id
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
              </button>
            ))}
          </div>

          {/* Card form */}
          {method === "card" && (
            <form onSubmit={handlePay} noValidate className="card p-6 space-y-4">
              <Field label="Name on Card" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Alex Reader" />
              <Field label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} error={errors.cardNumber} placeholder="1234 5678 9012 3456" inputMode="numeric" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" name="expiry" value={form.expiry} onChange={handleChange} error={errors.expiry} placeholder="MM/YY" />
                <Field label="CVV" name="cvv" value={form.cvv} onChange={handleChange} error={errors.cvv} placeholder="•••" inputMode="numeric" />
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <LockIcon />
                Your payment info is encrypted and never stored.
              </div>

              <Button type="submit" loading={loading} size="lg" fullWidth>
                {loading ? "Processing payment…" : `Pay ${formatINR(orderTotal)}`}
              </Button>
            </form>
          )}

          {/* Non-card methods */}
          {method !== "card" && (
            <div className="card flex flex-col items-center justify-center gap-4 p-10 text-center">
              <span className="text-5xl">
                {PAYMENT_METHODS.find((m) => m.id === method)?.icon}
              </span>
              <p className="text-gray-600 dark:text-gray-300">
                You will be redirected to complete payment via{" "}
                <strong>{PAYMENT_METHODS.find((m) => m.id === method)?.label}</strong>.
              </p>
              <Button size="lg" onClick={handlePay} loading={loading}>
                {loading ? "Redirecting…" : `Continue — ${formatINR(orderTotal)}`}
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="mb-3 font-bold text-gray-900 dark:text-white">Order Total</h3>
          <div className="space-y-2 text-sm">
            <SumRow label="Subtotal" value={formatINR(totalPrice)} />
            <SumRow label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
            <SumRow label="GST (18%)" value={formatINR(tax)} />
            <div className="border-t border-gray-200 pt-2 dark:border-gray-700" />
            <SumRow label="Total" value={formatINR(orderTotal)} bold />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder, inputMode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        name={name} value={value} onChange={onChange}
        placeholder={placeholder} inputMode={inputMode}
        className={`input ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SumRow({ label, value, bold = false }) {
  const cls = bold ? "font-bold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300";
  return (
    <div className={`flex justify-between ${cls}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
