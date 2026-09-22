import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useCart } from "../context/AppContext";
import Button from "../components/Button";

export default function RegisterPage() {
  const { login } = useAuth();
  const { switchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters.";
    else if (!/[A-Z]/.test(form.password)) errs.password = "Must contain at least one uppercase letter.";
    else if (!/[0-9]/.test(form.password)) errs.password = "Must contain at least one number.";
    if (!form.confirm) errs.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) errs.confirm = "Passwords do not match.";
    return errs;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate async registration — replace with real API call
    setTimeout(() => {
      login({ name: form.name.trim(), email: form.email.trim() }, { switchCart });
      setLoading(false);
      navigate("/");
    }, 900);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-20 pb-12 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            📚 Sudarshan BookStore
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Join 120,000+ readers today — it&apos;s free
          </p>
        </div>

        {/* Form card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField
              id="name" label="Full Name" type="text"
              name="name" value={form.name} onChange={handleChange}
              error={errors.name} placeholder="Sudarshan Bharate"
              autoComplete="name"
            />
            <FormField
              id="email" label="Email address" type="email"
              name="email" value={form.email} onChange={handleChange}
              error={errors.email} placeholder="you@example.com"
              autoComplete="email"
            />
            <FormField
              id="password" label="Password" type="password"
              name="password" value={form.password} onChange={handleChange}
              error={errors.password} placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
            />
            <FormField
              id="confirm" label="Confirm Password" type="password"
              name="confirm" value={form.confirm} onChange={handleChange}
              error={errors.confirm} placeholder="Repeat your password"
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading} fullWidth className="mt-2">
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            By registering you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function FormField({ id, label, type, name, value, onChange, error, placeholder, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        autoComplete={autoComplete}
        value={value} onChange={onChange}
        placeholder={placeholder}
        className={`input ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
