/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
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
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";

function Users() {
  const { user, logout } = useAuth();

  const isSystemAdmin = user?.roles?.includes("SYSTEM_ADMIN");
  const isCompanyAdmin = user?.roles?.includes("COMPANY_ADMIN");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  // View modal
  const [selectedUser, setSelectedUser] = useState(null);

  // Add/Edit modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Delete state
  const [deletingUserId, setDeletingUserId] = useState(null);

  // ================= FETCH USERS =================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!isCompanyAdmin) {
        setLoading(false);
        return;
      }

      const response = await apiRequest("/users");
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

  useEffect(() => {
    fetchUsers();
  }, [isCompanyAdmin]);

  // System Admin does not use the Users page
  if (isSystemAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // ================= FORM HANDLERS =================

  const openAddModal = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });

    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (currentUser) => {
    setEditingUser(currentUser);

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      password: "",
      role: currentUser.role || "USER",
    });

    setFormError("");
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (formLoading) {
      return;
    }

    setShowFormModal(false);
    setEditingUser(null);
    setFormError("");

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= CREATE / UPDATE =================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!editingUser && !formData.password) {
      setFormError("Password is required.");
      return;
    }

    if (!editingUser && formData.password.length < 8) {
      setFormError(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setFormLoading(true);

      const endpoint = editingUser
        ? `/users/${editingUser.id}`
        : "/users";

      const method = editingUser ? "PUT" : "POST";

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };

      // Password is required only when creating a user.
      if (!editingUser) {
        requestBody.password = formData.password;
      }

      const response = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingUser
              ? "Failed to update user."
              : "Failed to create user.")
        );
      }

      await fetchUsers();

      // Stop loading before closing the modal
      setFormLoading(false);
      closeFormModal();

      // Show success message for 3 seconds
      setSuccessMessage(
        editingUser
          ? "User updated successfully"
          : "User created successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (currentUser) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${currentUser.name || "this user"}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(currentUser.id);
      setError("");

      const response = await apiRequest(
        `/users/${currentUser.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete user."
        );
      }

      if (selectedUser?.id === currentUser.id) {
        setSelectedUser(null);
      }

      await fetchUsers();

      // Show success message for 3 seconds
      setSuccessMessage("User deleted successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingUserId(null);
    }
  };

  // ================= SEARCH =================

  const filteredUsers = users.filter((currentUser) => {
    const search = searchTerm.toLowerCase();

    return (
      currentUser.name?.toLowerCase().includes(search) ||
      currentUser.email?.toLowerCase().includes(search) ||
      currentUser.role?.toLowerCase().includes(search)
    );
  });

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  const displayRole = "Company Administrator";

  const pageDescription = "View users in your company";

  const pageTitle = "Company Users";

  const pageSubDescription =
    "View and manage users in your company.";

  // ================= LOADING =================

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

  // ================= ERROR =================

  if (error && users.length === 0) {
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

          {/* Companies - SYSTEM ADMIN ONLY */}
          {isSystemAdmin && (
            <Link
              to="/companies"
              className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Building2 className="h-[18px] w-[18px]" />

              <span>Companies</span>

              <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </Link>
          )}

          {/* Company Admins - SYSTEM ADMIN ONLY */}
          {isSystemAdmin && (
            <Link
              to="/company-admins"
              className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <ShieldCheck className="h-[18px] w-[18px]" />

              <span>Company Admins</span>

              <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </Link>
          )}

          {/* Users - COMPANY ADMIN ONLY */}
          {isCompanyAdmin && (
            <Link
              to="/users"
              className="mb-1 flex items-center gap-3 rounded-lg bg-[#4F46E5] px-3 py-2.5 text-sm font-medium text-white shadow-sm"
            >
              <UsersIcon className="h-[18px] w-[18px]" />

              <span>Users</span>
            </Link>
          )}

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
                {displayRole}
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
              {pageDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[#0F172A]">
                {user?.name}
              </p>

              <p className="text-xs text-[#64748B]">
                {displayRole}
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
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">
                User Management
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
                {pageTitle}
              </h2>

              <p className="mt-2 text-sm text-[#64748B]">
                {pageSubDescription}
              </p>
            </div>

            {/* Create - COMPANY ADMIN ONLY */}
            {isCompanyAdmin && (
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4338CA]"
              >
                <Plus className="h-4 w-4" />
                Add User
              </button>
            )}
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-700">
                {successMessage}
              </p>
            </div>
          )}

          {/* Error after page is loaded */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

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
                      Role
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Created
                    </th>

                    {/* Updated */}
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Updated
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
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
                      return (
                        <tr
                          key={currentUser.id}
                          className="transition hover:bg-[#F8FAFC]"
                        >
                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-[#4F46E5]">
                                {currentUser.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
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
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    timeZone:
                                      "Asia/Yangon",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </td>

                          {/* Updated */}
                          <td className="px-6 py-4 text-sm text-[#64748B]">
                            {currentUser.updatedAt
                              ? new Date(
                                  currentUser.updatedAt
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    timeZone:
                                      "Asia/Yangon",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              {/* View */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUser(
                                    currentUser
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#4F46E5] transition hover:bg-indigo-50"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    currentUser
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#475569] transition hover:bg-[#F1F5F9]"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                disabled={
                                  deletingUserId ===
                                  currentUser.id
                                }
                                onClick={() =>
                                  handleDelete(
                                    currentUser
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />

                                {deletingUserId ===
                                currentUser.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
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
                Company Administrator access
              </p>

              <p className="mt-1 text-xs leading-5 text-[#4338CA]">
                You can view and manage users in your company.
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

                {/* Updated */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                    Updated
                  </p>

                  <p className="mt-1 text-sm text-[#475569]">
                    {selectedUser.updatedAt
                      ? new Date(
                          selectedUser.updatedAt
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

      {/* ================= ADD / EDIT USER MODAL ================= */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFormModal();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  {editingUser
                    ? "Edit User"
                    : "Add User"}
                </h3>

                <p className="mt-1 text-xs text-[#64748B]">
                  {editingUser
                    ? "Update user account information"
                    : "Create a new user account"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={formLoading}
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F8FAFC] hover:text-[#475569] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">
                {/* Form Error */}
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-600">
                      {formError}
                    </p>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                    disabled={formLoading}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 disabled:bg-[#F8FAFC]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter email address"
                    disabled={formLoading}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 disabled:bg-[#F8FAFC]"
                  />
                </div>

                {/* Password - CREATE ONLY */}
                {!editingUser && (
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-[#334155]"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      placeholder="Minimum 8 characters"
                      disabled={formLoading}
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 disabled:bg-[#F8FAFC]"
                    />

                    <p className="mt-1.5 text-xs text-[#94A3B8]">
                      Password must be at least 8 characters.
                    </p>
                  </div>
                )}

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-[#334155]"
                  >
                    Role
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 disabled:bg-[#F8FAFC]"
                  >
                    <option value="USER">USER</option>
                    <option value="HR">HR</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={formLoading}
                  className="rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center justify-center rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formLoading
                    ? editingUser
                      ? "Saving..."
                      : "Creating..."
                    : editingUser
                      ? "Save Changes"
                      : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;