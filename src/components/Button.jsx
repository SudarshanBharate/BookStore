import React, { useRef, useCallback } from "react";

/**
 * Button — polymorphic magnetic button component.
 *
 * The cursor position inside the button drives a radial glow highlight
 * via CSS custom properties (--mx / --my). Works on every variant.
 *
 * Props:
 *   variant   "primary" | "secondary" | "ghost" | "danger"  (default: "primary")
 *   size      "sm" | "md" | "lg"                            (default: "md")
 *   as        element tag or component                       (default: "button")
 *   loading   boolean — shows spinner, disables interaction
 *   fullWidth boolean — stretches to 100% width
 *   ...rest   forwarded to the underlying element
 */
const VARIANT_CLASSES = {
  primary: "btn-primary btn-magnetic",
  secondary: "btn-secondary btn-magnetic",
  ghost: "btn-ghost btn-magnetic",
  danger: "btn-danger btn-magnetic",
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
  onMouseMove,
  onMouseLeave,
  style,
  ...rest
}) {
  const ref = useRef(null);

  /* Track cursor inside the button to position the radial glow */
  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      }
      onMouseMove?.(e);
    },
    [onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      const el = ref.current;
      if (el) {
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
      }
      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  const baseClass = `${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  return (
    <Tag
      ref={ref}
      disabled={Tag === "button" ? disabled || loading : undefined}
      className={baseClass}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ "--mx": "50%", "--my": "50%", ...style }}
      {...rest}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </Tag>
  );
}
