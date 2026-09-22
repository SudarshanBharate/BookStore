import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import Button from "../components/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters.";
    return errs;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate async auth — replace with real API call
    setTimeout(() => {
      login({ name: "Alex Reader", email: form.email });
      setLoading(false);
      navigate("/");
    }, 800);
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className={`input ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <a href="#" className="text-xs text-primary-600 hover:underline dark:text-primary-400">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`input ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" loading={loading} fullWidth>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          {/* Demo hint */}
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Demo: any valid email &amp; 8+ char password
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
