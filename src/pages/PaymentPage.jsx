import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, useAuth } from "../context/AppContext";
import { formatINR } from "../utils/format";
import { StepIndicator } from "./CheckoutPage";
import Button from "../components/Button";

const PAYMENT_METHODS = [
  { id: "card",   label: "Credit / Debit Card", icon: "💳" },
  { id: "upi",    label: "UPI",                  icon: "📱" },
  { id: "paypal", label: "PayPal",               icon: "🅿️" },
  { id: "apple",  label: "Apple Pay",            icon: "" },
];

const UPI_APPS = [
  { id: "gpay",    label: "Google Pay",  color: "bg-white border-gray-200" },
  { id: "phonepe", label: "PhonePe",     color: "bg-white border-gray-200" },
  { id: "paytm",   label: "Paytm",       color: "bg-white border-gray-200" },
  { id: "other",   label: "Other UPI",   color: "bg-white border-gray-200" },
];

const GIFT_POINTS_RATE = 0.5; // ₹0.50 per point
const USER_GIFT_POINTS = 400; // mock: user has 400 points = ₹200 max redemption

function generateOrderId() {
  return `BSK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder, user } = useAuth();

  const [method, setMethod] = useState("card");
  const [upiApp, setUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [upiIdError, setUpiIdError] = useState("");
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Gift points
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [pointsInput, setPointsInput] = useState(String(USER_GIFT_POINTS));
  const [pointsError, setPointsError] = useState("");

  const pointsToRedeem = redeemPoints
    ? Math.min(Math.max(0, parseInt(pointsInput, 10) || 0), USER_GIFT_POINTS)
    : 0;
  const pointsDiscount = pointsToRedeem * GIFT_POINTS_RATE;

  const shipping = totalPrice > 999 ? 0 : 99;
  const tax = totalPrice * 0.18;
  const orderTotal = Math.max(0, totalPrice + shipping + tax - pointsDiscount);

  /* ── Card input handlers ─────────────────────────────────────────── */
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

  function validateCard() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      errs.cardNumber = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errs.expiry = "Use MM/YY format";
    if (form.cvv.length < 3) errs.cvv = "3–4 digits required";
    return errs;
  }

  function validateUpi() {
    if (!upiId.trim()) return "UPI ID is required.";
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId.trim()))
      return "Enter a valid UPI ID (e.g. name@upi).";
    return "";
  }

  function validatePoints() {
    const val = parseInt(pointsInput, 10);
    if (isNaN(val) || val < 1) return "Enter at least 1 point.";
    if (val > USER_GIFT_POINTS) return `You only have ${USER_GIFT_POINTS} points.`;
    return "";
  }

  function handlePointsToggle(checked) {
    setRedeemPoints(checked);
    setPointsError("");
  }

  function handlePointsBlur() {
    if (redeemPoints) setPointsError(validatePoints());
  }

  function handlePay(e) {
    e.preventDefault();

    // Validate gift points input
    if (redeemPoints) {
      const pErr = validatePoints();
      if (pErr) { setPointsError(pErr); return; }
    }

    // Method-specific validation
    if (method === "card") {
      const errs = validateCard();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    if (method === "upi") {
      const upiErr = validateUpi();
      if (upiErr) { setUpiIdError(upiErr); return; }
    }

    setLoading(true);
    // Simulate payment processing — replace with real API
    setTimeout(() => {
      const orderId = generateOrderId();
      addOrder({
        id: Date.now(),
        number: orderId,
        date: Date.now(),
        items: items.map((i) => ({ ...i })),
        subtotal: totalPrice,
        shipping,
        tax,
        pointsDiscount,
        total: orderTotal,
        status: "Processing",
        cancelledAt: null,
      });
      clearCart();
      navigate("/order-confirmation", { state: { orderNumber: orderId } });
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
      <StepIndicator current={1} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment</h2>

          {/* Method selector */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Card form */}
          {method === "card" && (
            <form onSubmit={handlePay} noValidate className="card p-6 space-y-4">
              <Field
                label="Name on Card" name="name" value={form.name}
                onChange={handleChange} error={errors.name} placeholder="Sudarshan Bharate"
              />
              <Field
                label="Card Number" name="cardNumber" value={form.cardNumber}
                onChange={handleChange} error={errors.cardNumber}
                placeholder="1234 5678 9012 3456" inputMode="numeric"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Expiry" name="expiry" value={form.expiry}
                  onChange={handleChange} error={errors.expiry} placeholder="MM/YY"
                />
                <Field
                  label="CVV" name="cvv" value={form.cvv}
                  onChange={handleChange} error={errors.cvv}
                  placeholder="•••" inputMode="numeric"
                />
              </div>

              <SecurityBadge />
              <GiftPointsPanel
                redeemPoints={redeemPoints}
                onToggle={handlePointsToggle}
                pointsInput={pointsInput}
                setPointsInput={setPointsInput}
                pointsError={pointsError}
                onBlur={handlePointsBlur}
                userPoints={USER_GIFT_POINTS}
                discount={pointsDiscount}
              />
              <Button type="submit" loading={loading} size="lg" fullWidth>
                {loading ? "Processing payment…" : `Pay ${formatINR(orderTotal)}`}
              </Button>
            </form>
          )}

          {/* UPI form */}
          {method === "upi" && (
            <form onSubmit={handlePay} noValidate className="card p-6 space-y-5">
              {/* App selector */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Choose UPI App
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id)}
                      className={`rounded-lg border py-2 px-1 text-xs font-medium transition ${
                        upiApp === app.id
                          ? "border-primary-500 ring-1 ring-primary-500 text-primary-700 dark:text-primary-400"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UPI ID
                </label>
                <input
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setUpiIdError(""); }}
                  placeholder="yourname@upi"
                  className={`input ${upiIdError ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {upiIdError && <p className="mt-1 text-xs text-red-500">{upiIdError}</p>}
              </div>

              <SecurityBadge />
              <GiftPointsPanel
                redeemPoints={redeemPoints}
                onToggle={handlePointsToggle}
                pointsInput={pointsInput}
                setPointsInput={setPointsInput}
                pointsError={pointsError}
                onBlur={handlePointsBlur}
                userPoints={USER_GIFT_POINTS}
                discount={pointsDiscount}
              />
              <Button type="submit" loading={loading} size="lg" fullWidth>
                {loading ? "Verifying UPI…" : `Pay ${formatINR(orderTotal)} via UPI`}
              </Button>
            </form>
          )}

          {/* Non-card/UPI redirect methods */}
          {method !== "card" && method !== "upi" && (
            <div className="card flex flex-col items-center justify-center gap-4 p-10 text-center">
              <span className="text-5xl">
                {PAYMENT_METHODS.find((m) => m.id === method)?.icon}
              </span>
              <p className="text-gray-600 dark:text-gray-300">
                You will be redirected to complete payment via{" "}
                <strong>{PAYMENT_METHODS.find((m) => m.id === method)?.label}</strong>.
              </p>
              <GiftPointsPanel
                redeemPoints={redeemPoints}
                onToggle={handlePointsToggle}
                pointsInput={pointsInput}
                setPointsInput={setPointsInput}
                pointsError={pointsError}
                onBlur={handlePointsBlur}
                userPoints={USER_GIFT_POINTS}
                discount={pointsDiscount}
              />
              <Button size="lg" onClick={handlePay} loading={loading}>
                {loading ? "Redirecting…" : `Continue — ${formatINR(orderTotal)}`}
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-24 space-y-2 text-sm">
          <h3 className="mb-3 font-bold text-gray-900 dark:text-white">Order Total</h3>
          <SumRow label="Subtotal" value={formatINR(totalPrice)} />
          <SumRow label="Shipping" value={shipping === 0 ? "Free" : formatINR(shipping)} />
          <SumRow label="GST (18%)" value={formatINR(tax)} />
          {redeemPoints && pointsToRedeem > 0 && (
            <SumRow
              label={`Gift Points (${pointsToRedeem} pts)`}
              value={`−${formatINR(pointsDiscount)}`}
              className="text-green-600 dark:text-green-400"
            />
          )}
          <div className="border-t border-gray-200 pt-2 dark:border-gray-700" />
          <SumRow label="Total" value={formatINR(orderTotal)} bold />
          {redeemPoints && pointsToRedeem > 0 && (
            <p className="text-xs text-green-600 dark:text-green-400">
              🎁 Saving {formatINR(pointsDiscount)} with gift points
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function GiftPointsPanel({
  redeemPoints, onToggle, pointsInput, setPointsInput,
  pointsError, onBlur, userPoints, discount,
}) {
  return (
    <div className="rounded-lg border border-dashed border-primary-300 bg-primary-50/50 p-4 dark:border-primary-700 dark:bg-primary-900/10">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={redeemPoints}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 rounded accent-primary-600"
        />
        <div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            🎁 Redeem Gift Points
          </span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            You have <strong>{userPoints}</strong> pts
            ({formatINR(userPoints * 0.5)} value)
          </span>
        </div>
      </label>

      {redeemPoints && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              min={1}
              max={userPoints}
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              onBlur={onBlur}
              className={`input py-1.5 text-sm ${pointsError ? "border-red-500" : ""}`}
              placeholder={`1 – ${userPoints}`}
            />
            {pointsError && <p className="mt-1 text-xs text-red-500">{pointsError}</p>}
          </div>
          {discount > 0 && (
            <span className="shrink-0 text-sm font-bold text-green-600 dark:text-green-400">
              −{formatINR(discount)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder, inputMode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        name={name} value={value} onChange={onChange}
        placeholder={placeholder} inputMode={inputMode}
        className={`input ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SumRow({ label, value, bold = false, className = "" }) {
  const base = bold
    ? "font-bold text-gray-900 dark:text-white"
    : `text-gray-600 dark:text-gray-300 ${className}`;
  return (
    <div className={`flex justify-between ${base}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function SecurityBadge() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      Your payment info is encrypted and never stored.
    </div>
  );
}
