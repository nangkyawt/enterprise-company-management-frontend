import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  BriefcaseBusiness,
  UserRound,
  ChevronRight,
  Activity,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";

function Dashboard() {
  const { user, logout } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let endpoint = "";

        if (user?.roles?.includes("SYSTEM_ADMIN")) {
          endpoint = "/dashboard/system-admin";
        } else if (user?.roles?.includes("COMPANY_ADMIN")) {
          endpoint = "/dashboard/company-admin";
        } else if (
          user?.roles?.some((role) =>
            ["HR", "MANAGER", "USER"].includes(role)
          )
        ) {
          endpoint = "/dashboard/user";
        } else {
          throw new Error("No dashboard access for your role.");
        }

        const response = await apiRequest(endpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard."
          );
        }

        setDashboardData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#4F46E5]" />

          <p className="mt-4 text-sm text-[#64748B]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <header className="flex h-16 items-center border-b border-[#E2E8F0] bg-white px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827] text-sm font-bold text-white">
              E
            </div>

            <span className="font-semibold text-[#111827]">
              Enterprise
            </span>
          </div>
        </header>

        <main className="p-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-semibold text-red-700">
              Dashboard Error
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const stats = dashboardData?.dashboard;

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#111827] lg:block">

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-bold text-white">
            E
          </div>

          <span className="ml-3 text-base font-semibold text-white">
            Enterprise
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4">

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            System
          </p>

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="mb-1 flex items-center gap-3 rounded-lg bg-[#4F46E5] px-3 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            Dashboard
          </Link>

          {/* Companies */}
          <Link
            to="/companies"
            className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Building2 className="h-[18px] w-[18px]" />

            <span>Companies</span>

            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </Link>

          {/* Company Admins */}
          <Link
            to="/company-admins"
            className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <ShieldCheck className="h-[18px] w-[18px]" />

            <span>Company Admins</span>

            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </Link>

          {/* Users */}
          <Link
            to="/users"
            className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Users className="h-[18px] w-[18px]" />

            <span>Users</span>

            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </Link>

          <div className="my-6 border-t border-white/10" />

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Management
          </p>

          {/* Settings */}
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-[18px] w-[18px]" />

            Settings
          </a>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
              {firstLetter}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.name}
              </p>

              <p className="truncate text-xs text-slate-400">
                System Administrator
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="lg:ml-64">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6 lg:px-8">

          <div>
            <h1 className="text-lg font-semibold text-[#0F172A]">
              System Admin Dashboard
            </h1>

            <p className="text-xs text-[#64748B]">
              Enterprise management overview
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[#0F172A]">
                {user?.name}
              </p>

              <p className="text-xs text-[#64748B]">
                System Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
              {firstLetter}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">

          {/* Welcome */}
          <div className="mb-8">
            <p className="text-sm font-medium text-[#64748B]">
              Overview
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Welcome back, {user?.name}
            </h2>

            <p className="mt-2 text-sm text-[#64748B]">
              Here's an overview of your enterprise management system.
            </p>
          </div>

          {/* ================= STATISTICS ================= */}
          <div className="grid gap-5 md:grid-cols-3">

            {/* Companies */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-[#64748B]">
                    Total Companies
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
                    {stats?.totalCompanies ?? 0}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <Building2 className="h-5 w-5 text-[#4F46E5]" />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#64748B]">
                Companies registered in the system
              </p>
            </div>

            {/* Admins */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-[#64748B]">
                    Company Admins
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
                    {stats?.totalCompanyAdmins ?? 0}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <ShieldCheck className="h-5 w-5 text-[#4F46E5]" />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#64748B]">
                Administrators managing companies
              </p>
            </div>

            {/* Users */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-[#64748B]">
                    Total Users
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
                    {stats?.totalUsers ?? 0}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <Users className="h-5 w-5 text-[#4F46E5]" />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#64748B]">
                Users across the platform
              </p>
            </div>
          </div>

          {/* ================= LOWER CARDS ================= */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {/* System Overview */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                  <Activity className="h-5 w-5 text-[#4F46E5]" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    System Overview
                  </h3>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Current state of the enterprise platform.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <span className="text-sm text-[#64748B]">
                    Companies
                  </span>

                  <span className="text-sm font-semibold text-[#0F172A]">
                    {stats?.totalCompanies ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <span className="text-sm text-[#64748B]">
                    Company Administrators
                  </span>

                  <span className="text-sm font-semibold text-[#0F172A]">
                    {stats?.totalCompanyAdmins ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">
                    Users
                  </span>

                  <span className="text-sm font-semibold text-[#0F172A]">
                    {stats?.totalUsers ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                  <UserRound className="h-5 w-5 text-[#4F46E5]" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    Administrator Account
                  </h3>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Your system administrator account.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#0F172A]">
                    {user?.name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#0F172A]">
                    {user?.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3A8]">
                    Role
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#4338CA]">
                    SYSTEM_ADMIN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <div className="mt-8 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                <BriefcaseBusiness className="h-5 w-5 text-[#4F46E5]" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Quick Actions
                </h3>

                <p className="mt-1 text-sm text-[#64748B]">
                  Manage your enterprise system.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              {/* Manage Companies */}
              <Link
                to="/companies"
                className="group rounded-lg border border-[#E2E8F0] p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <div className="flex items-center justify-between">

                  <Building2 className="h-5 w-5 text-[#4F46E5]" />

                  <ChevronRight className="h-4 w-4 text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#0F172A]">
                  Manage Companies
                </p>

                <p className="mt-1 text-xs text-[#64748B]">
                  View and manage all companies.
                </p>
              </Link>

              {/* Manage Admins */}
              <Link
                to="/company-admins"
                className="group rounded-lg border border-[#E2E8F0] p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <div className="flex items-center justify-between">

                  <ShieldCheck className="h-5 w-5 text-[#4F46E5]" />

                  <ChevronRight className="h-4 w-4 text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#0F172A]">
                  Manage Company Admins
                </p>

                <p className="mt-1 text-xs text-[#64748B]">
                  Manage company administrators.
                </p>
              </Link>

              {/* View Users */}
              <Link
                to="/users"
                className="group rounded-lg border border-[#E2E8F0] p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <div className="flex items-center justify-between">

                  <Users className="h-5 w-5 text-[#4F46E5]" />

                  <ChevronRight className="h-4 w-4 text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]" />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#0F172A]">
                  View Users
                </p>

                <p className="mt-1 text-xs text-[#64748B]">
                  View users across the platform.
                </p>
              </Link>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;