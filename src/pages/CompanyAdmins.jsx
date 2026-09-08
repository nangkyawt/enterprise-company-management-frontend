/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  UserRound,
  ChevronRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";

function CompanyAdmins() {
  const { user, logout } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
  });

  // =====================================================
  // FETCH ADMINS
  // =====================================================

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/company-admins");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load company admins."
        );
      }

      setAdmins(data.admins || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH COMPANIES
  // =====================================================

  const fetchCompanies = async () => {
    try {
      const response = await apiRequest("/companies");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load companies."
        );
      }

      setCompanies(data.companies || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchCompanies();
  }, []);

  // =====================================================
  // FORM
  // =====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingAdmin(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      companyId: "",
    });

    setShowPassword(false);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);

    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      companyId: admin.companyId || "",
    });

    setShowPassword(false);
    setError("");
    setSuccess("");
    setOpenMenu(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (formLoading) return;

    setShowModal(false);
    setEditingAdmin(null);
    setShowPassword(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      companyId: "",
    });
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;

      if (editingAdmin) {
        response = await apiRequest(
          `/company-admins/${editingAdmin.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              companyId: formData.companyId,
            }),
          }
        );
      } else {
        response = await apiRequest("/company-admins", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            companyId: formData.companyId,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingAdmin ? "update" : "create"
            } company admin.`
        );
      }

      setSuccess(data.message);

      await fetchAdmins();

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (admin) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${admin.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await apiRequest(
        `/company-admins/${admin.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete company admin."
        );
      }

      setSuccess(data.message);

      setAdmins((current) =>
        current.filter((item) => item.id !== admin.id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAdmins = admins.filter((admin) => {
    const searchValue = search.toLowerCase();

    return (
      admin.name?.toLowerCase().includes(searchValue) ||
      admin.email?.toLowerCase().includes(searchValue) ||
      admin.companyName?.toLowerCase().includes(searchValue)
    );
  });

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4F46E5]" />

          <p className="mt-4 text-sm text-[#64748B]">
            Loading company admins...
          </p>
        </div>
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
            className="mb-1 flex items-center gap-3 rounded-lg bg-[#4F46E5] px-3 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <ShieldCheck className="h-[18px] w-[18px]" />

            <span>Company Admins</span>
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
              Company Admins
            </h1>

            <p className="text-xs text-[#64748B]">
              Manage administrators across your companies
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

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-medium text-[#64748B]">
                Administration
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
                Company Administrators
              </h2>

              <p className="mt-2 text-sm text-[#64748B]">
                Create and manage administrators responsible for each company.
              </p>

            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4338CA]"
            >
              <Plus className="h-4 w-4" />

              Add Company Admin
            </button>

          </div>

          {/* Messages */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Main card */}

          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

            {/* Toolbar */}

            <div className="border-b border-[#E2E8F0] p-4 sm:p-5">

              <div className="relative max-w-md">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

                <input
                  type="text"
                  placeholder="Search admins..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                />

              </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Administrator
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
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredAdmins.length === 0 ? (
                    <tr>

                      <td
                        colSpan="5"
                        className="px-6 py-16 text-center"
                      >

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                          <UserRound className="h-6 w-6 text-[#4F46E5]" />
                        </div>

                        <p className="mt-4 text-sm font-medium text-[#0F172A]">
                          {search
                            ? "No company admins found"
                            : "No company admins yet"}
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
                          {search
                            ? "Try a different search term."
                            : "Create your first company administrator."}
                        </p>

                      </td>

                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50/70"
                      >

                        {/* Administrator */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-[#4F46E5]">
                              {admin.name
                                ?.charAt(0)
                                ?.toUpperCase() || "A"}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-medium text-[#0F172A]">
                                {admin.name}
                              </p>

                              <p className="truncate text-xs text-[#64748B]">
                                {admin.email}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Company */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <Building2 className="h-4 w-4 text-[#94A3B8]" />

                            <span className="text-sm text-[#334155]">
                              {admin.companyName || "No company"}
                            </span>

                          </div>

                        </td>

                        {/* Role */}

                        <td className="px-6 py-4">

                          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#4338CA]">
                            {admin.role}
                          </span>

                        </td>

                        {/* Created */}

                        <td className="px-6 py-4 text-sm text-[#64748B]">
                          {formatDate(admin.createdAt)}
                        </td>

                        {/* Actions */}

                        <td className="relative px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === admin.id
                                  ? null
                                  : admin.id
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-slate-100 hover:text-[#0F172A]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openMenu === admin.id && (
                            <div className="absolute right-6 top-12 z-20 w-36 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white py-1 text-left shadow-lg">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(admin)
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#334155] transition hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />

                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(admin)
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />

                                Delete
                              </button>

                            </div>
                          )}

                        </td>

                      </tr>
                    ))
                  )}

                </tbody>
              </table>

            </div>

            {/* Footer */}

            <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-3">

              <p className="text-xs text-[#64748B]">
                Showing{" "}
                <span className="font-medium text-[#334155]">
                  {filteredAdmins.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#334155]">
                  {admins.length}
                </span>{" "}
                company admins
              </p>

            </div>

          </div>
        </main>
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">

              <div>

                <h3 className="text-base font-semibold text-[#0F172A]">
                  {editingAdmin
                    ? "Edit Company Admin"
                    : "Add Company Admin"}
                </h3>

                <p className="mt-1 text-xs text-[#64748B]">
                  {editingAdmin
                    ? "Update administrator information."
                    : "Create an administrator for a company."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-slate-100 hover:text-[#0F172A]"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>

              <div className="space-y-5 p-6">

                {/* Name */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter admin name"
                    required
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    required
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

                {/* Password */}

                {!editingAdmin && (
                  <div>

                    <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                      Password
                    </label>

                    <div className="relative">

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Minimum 8 characters"
                        minLength="8"
                        required
                        className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 pr-10 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition hover:text-[#475569]"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                    </div>

                  </div>
                )}

                {/* Company */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Company
                  </label>

                  <select
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                  >

                    <option value="">
                      Select a company
                    </option>

                    {companies.map((company) => (
                      <option
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </option>
                    ))}

                  </select>

                  {companies.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      No companies are available. Create a company first.
                    </p>
                  )}

                </div>

                {/* Error */}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Success */}

                {success && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                    {success}
                  </div>
                )}

              </div>

              {/* Modal footer */}

              <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {formLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {editingAdmin
                    ? "Save Changes"
                    : "Create Admin"}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyAdmins;