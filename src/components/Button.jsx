import React from "react";

/**
 * Button — polymorphic button / anchor component.
 *
 * Props:
 *   variant  "primary" | "secondary" | "ghost" | "danger"  (default: "primary")
 *   size     "sm" | "md" | "lg"                            (default: "md")
 *   as       "button" | "a" | any element tag              (default: "button")
 *   loading  boolean — shows spinner and disables clicks
 *   fullWidth boolean — stretches to 100% width
 *   ...rest  forwarded to the underlying element
 */
const VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
};

const SIZE_CLASSES = {
  sm: "!px-3 !py-1.5 !text-xs",
  md: "",
  lg: "!px-5 !py-3 !text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  as: Tag = "button",
  loading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...rest
}) {
  return (
    <Tag
      disabled={Tag === "button" ? disabled || loading : undefined}
      className={`${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </Tag>
  );
}
