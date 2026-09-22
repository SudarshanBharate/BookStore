/**
 * formatINR — formats a number as Indian Rupees using the
 * en-IN locale and the ₹ symbol. Single source of truth for
 * all price display across the app.
 *
 * @param {number} amount  - price value
 * @param {boolean} compact - use compact notation (e.g. ₹1.2K) for large numbers
 * @returns {string}
 */
export function formatINR(amount, compact = false) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}
