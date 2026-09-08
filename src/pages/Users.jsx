import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users as UsersIcon,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  UserRound,
  Eye,
  X,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";

function Users() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest("/system-users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load users."
          );
        }

        setUsers(data.users || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.companyName?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#4F46E5]" />

          <p className="mt-4 text-sm text-[#64748B]">
            Loading users...
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
              Users Error
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }

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
            className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />

            <span>Dashboard</span>

            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
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

          {/* Users - Active */}
          <Link
            to="/users"
            className="mb-1 flex items-center gap-3 rounded-lg bg-[#4F46E5] px-3 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <UsersIcon className="h-[18px] w-[18px]" />

            <span>Users</span>
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
              Users
            </h1>

            <p className="text-xs text-[#64748B]">
              View users across the enterprise
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

          {/* Page heading */}
          <div className="mb-8">
            <p className="text-sm font-medium text-[#64748B]">
              User Management
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
              All Users
            </h2>

            <p className="mt-2 text-sm text-[#64748B]">
              View users across all companies in the system.
            </p>
          </div>

          {/* ================= USERS CARD ================= */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

            {/* Card Header */}
            <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Users
                </h3>

                <p className="mt-1 text-sm text-[#64748B]">
                  {users.length} user
                  {users.length !== 1 ? "s" : ""} registered
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      User
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Email
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Company
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Role
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Created
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Access
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">

                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center"
                      >
                        <UsersIcon className="mx-auto h-8 w-8 text-[#CBD5E1]" />

                        <p className="mt-3 text-sm font-medium text-[#475569]">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8]">
                          Try changing your search.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((currentUser) => {

                      const userLetter =
                        currentUser.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U";

                      return (
                        <tr
                          key={currentUser.id}
                          className="transition hover:bg-[#F8FAFC]"
                        >

                          {/* User */}
                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-[#4F46E5]">
                                {userLetter}
                              </div>

                              <div>
                                <p className="text-sm font-medium text-[#0F172A]">
                                  {currentUser.name || "—"}
                                </p>

                                <p className="text-xs text-[#94A3B8]">
                                  User account
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-sm text-[#475569]">
                            {currentUser.email || "—"}
                          </td>

                          {/* Company */}
                          <td className="px-6 py-4">

                            <div className="flex items-center gap-2">

                              <Building2 className="h-4 w-4 text-[#94A3B8]" />

                              <span className="text-sm text-[#475569]">
                                {currentUser.companyName || "—"}
                              </span>

                            </div>

                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">

                            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#4338CA]">
                              {currentUser.role || "USER"}
                            </span>

                          </td>

                          {/* Created */}
                          <td className="px-6 py-4 text-sm text-[#64748B]">
                            {currentUser.createdAt
                              ? new Date(
                                  currentUser.createdAt
                                ).toLocaleDateString("en-US", {
                                  timeZone: "Asia/Yangon",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>

                          {/* Access */}
                          <td className="px-6 py-4 text-right">

                            <button
                              type="button"
                              onClick={() => {
                                console.log(
                                  "Selected User:",
                                  currentUser
                                );

                                console.log(
                                  "Created At:",
                                  currentUser.createdAt
                                );

                                setSelectedUser(currentUser);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#4F46E5] transition hover:bg-indigo-50"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>

              </table>

            </div>
          </div>

          {/* Information */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">

            <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[#4F46E5]" />

            <div>
              <p className="text-sm font-medium text-[#312E81]">
                System Administrator access
              </p>

              <p className="mt-1 text-xs leading-5 text-[#4338CA]">
                You can view users across all companies, but user
                accounts are managed by their respective Company
                Administrators.
              </p>
            </div>

          </div>

        </main>
      </div>

      {/* ================= USER DETAILS MODAL ================= */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">

              <div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  User Details
                </h3>

                <p className="mt-1 text-xs text-[#64748B]">
                  View user account information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F8FAFC] hover:text-[#475569]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Content */}
            <div className="p-6">

              {/* User Profile */}
              <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg font-semibold text-[#4F46E5]">
                  {selectedUser.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-base font-semibold text-[#0F172A]">
                    {selectedUser.name || "—"}
                  </h4>

                  <p className="mt-1 truncate text-sm text-[#64748B]">
                    {selectedUser.email || "—"}
                  </p>
                </div>

              </div>

              {/* Details */}
              <div className="mt-6 space-y-5">

                {/* Company */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Company
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <Building2 className="h-4 w-4 text-[#94A3B8]" />

                    <p className="text-sm font-medium text-[#334155]">
                      {selectedUser.companyName || "—"}
                    </p>

                  </div>
                </div>

                {/* Role */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Role
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#4338CA]">
                    {selectedUser.role || "USER"}
                  </span>
                </div>

                {/* Created */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-[#475569]">
                    {selectedUser.createdAt
                      ? new Date(
                          selectedUser.createdAt
                        ).toLocaleString("en-US", {
                          timeZone: "Asia/Yangon",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-[#E2E8F0] px-6 py-4">

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Users;