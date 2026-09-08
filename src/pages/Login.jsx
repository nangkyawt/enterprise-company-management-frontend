import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ================= MAIN CONTAINER ================= */}
      <div className="flex min-h-screen">

        {/* ================= LEFT BRAND PANEL ================= */}
        <div className="relative hidden overflow-hidden bg-[#111827] lg:flex lg:w-[48%] xl:w-[52%]">

          {/* Decorative background */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#4F46E5]/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#4F46E5]/10 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5] text-lg font-bold text-white shadow-lg shadow-indigo-950/30">
                E
              </div>

              <div>
                <p className="text-base font-semibold text-white">
                  Enterprise
                </p>

                <p className="text-[11px] text-slate-500">
                  Management System
                </p>
              </div>
            </div>

            {/* Main message */}
            <div className="max-w-lg">

              <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />

                <span className="text-xs font-medium text-slate-300">
                  Enterprise Management Platform
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                Everything your organization needs,
                <span className="text-indigo-400">
                  {" "}in one place.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 xl:text-base">
                Manage companies, administrators, users, and
                organizational operations through a secure,
                centralized platform.
              </p>

              {/* Small feature indicators */}
              <div className="mt-10 grid max-w-md grid-cols-2 gap-3">

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">
                    Centralized
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    One platform for your organization
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">
                    Secure Access
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Role-based enterprise access
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6">

              <p className="text-xs text-slate-500">
                Secure enterprise access
              </p>

              <p className="text-xs text-slate-600">
                © 2026 Enterprise
              </p>

            </div>
          </div>
        </div>

        {/* ================= RIGHT LOGIN PANEL ================= */}
        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[52%] xl:w-[48%]">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5] text-lg font-bold text-white">
                E
              </div>

              <div>
                <p className="text-base font-semibold text-[#111827]">
                  Enterprise
                </p>

                <p className="text-[11px] text-[#64748B]">
                  Management System
                </p>
              </div>

            </div>

            {/* Heading */}
            <div>
              <p className="text-sm font-medium text-[#4F46E5]">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                Enter your credentials to access the enterprise
                management system.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Work email
                </label>

                <div className="relative">

                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#94A3B8] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#334155]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-[#4F46E5] transition hover:text-[#4338CA]"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]" />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#94A3B8] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                  />

                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5]"
                  />

                  <span className="text-sm text-[#64748B]">
                    Remember me
                  </span>

                </label>

              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-[#4338CA] hover:shadow-md hover:shadow-indigo-500/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 border-t border-[#E2E8F0] pt-6 text-center">

              <p className="text-sm text-[#64748B]">
                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-[#4F46E5] transition hover:text-[#4338CA] hover:underline"
                >
                  Create an account
                </Link>
              </p>

            </div>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#94A3B8]">

              <LockKeyhole className="h-3.5 w-3.5" />

              <span>
                Your connection is secure
              </span>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;