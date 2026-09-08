/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users as UsersIcon,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";

function Companies() {
  const { user } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  // =====================================================
  // FETCH COMPANIES
  // =====================================================

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCompanies();
    }
  }, [user]);

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const handleAddCompany = () => {
    setEditingCompany(null);
    setCompanyName("");
    setFormError("");
    setShowModal(true);
    setOpenMenu(null);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setCompanyName(company.name);
    setFormError("");
    setShowModal(true);
    setOpenMenu(null);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCompany(null);
    setCompanyName("");
    setFormError("");
  };

  // =====================================================
  // CREATE / UPDATE COMPANY
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    const trimmedName = companyName.trim();

    if (!trimmedName) {
      setFormError("Company name is required.");
      return;
    }

    try {
      setSaving(true);

      let response;

      if (editingCompany) {
        response = await apiRequest(
          `/companies/${editingCompany.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: trimmedName,
            }),
          }
        );
      } else {
        response = await apiRequest("/companies", {
          method: "POST",
          body: JSON.stringify({
            name: trimmedName,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingCompany ? "update" : "create"
            } company.`
        );
      }

      await fetchCompanies();

      handleCloseModal();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE COMPANY
  // =====================================================

  const handleDeleteCompany = async (company) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${company.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiRequest(
        `/companies/${company.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete company."
        );
      }

      await fetchCompanies();
    } catch (error) {
      setError(error.message);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCompanies = companies.filter((company) =>
    company.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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

            <span className="ml-auto">
              <span className="block h-4 w-4 opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </span>
          </Link>

          {/* Companies - Active */}
          <Link
            to="/companies"
            className="mb-1 flex items-center gap-3 rounded-lg bg-[#4F46E5] px-3 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <Building2 className="h-[18px] w-[18px]" />

            <span>Companies</span>
          </Link>

          {/* Company Admins */}
          <Link
            to="/company-admins"
            className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <ShieldCheck className="h-[18px] w-[18px]" />

            <span>Company Admins</span>

            <span className="ml-auto">
              <span className="block h-4 w-4 opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </span>
          </Link>

          {/* Users */}
          <Link
            to="/users"
            className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <UsersIcon className="h-[18px] w-[18px]" />

            <span>Users</span>

            <span className="ml-auto">
              <span className="block h-4 w-4 opacity-0 transition group-hover:opacity-100">
                →
              </span>
            </span>
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
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="lg:ml-64">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6 lg:px-8">

          <div>
            <h1 className="text-lg font-semibold text-[#0F172A]">
              Companies
            </h1>

            <p className="text-xs text-[#64748B]">
              Manage companies registered in the system
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">

          {/* Page heading */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-medium text-[#64748B]">
                System Management
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
                All Companies
              </h2>

              <p className="mt-2 text-sm text-[#64748B]">
                View and manage all organizations on the platform.
              </p>

            </div>

            <button
              type="button"
              onClick={handleAddCompany}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA] focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            >
              <Plus className="h-4 w-4" />
              Add Company
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* =====================================================
              TABLE CARD
          ===================================================== */}

          <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

            {/* Toolbar */}
            <div className="flex flex-col gap-4 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Companies
                </h3>

                <p className="mt-1 text-xs text-[#64748B]">
                  {companies.length}{" "}
                  {companies.length === 1
                    ? "company"
                    : "companies"}{" "}
                  registered
                </p>

              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search companies..."
                  className="h-10 w-full rounded-lg border border-[#CBD5E1] bg-white pl-9 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#94A3B8] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-500/10"
                />

              </div>

            </div>

            {/* =====================================================
                LOADING
            ===================================================== */}

            {loading && (
              <div className="flex min-h-64 items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#4F46E5]" />

                  <p className="mt-3 text-sm text-[#64748B]">
                    Loading companies...
                  </p>

                </div>

              </div>
            )}

            {/* =====================================================
                EMPTY
            ===================================================== */}

            {!loading &&
              !error &&
              filteredCompanies.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <Building2 className="h-6 w-6 text-[#4F46E5]" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
                    No companies found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-[#64748B]">
                    {search
                      ? "Try adjusting your search."
                      : "There are no companies registered yet."}
                  </p>

                </div>
              )}

            {/* =====================================================
                TABLE
            ===================================================== */}

            {!loading &&
              !error &&
              filteredCompanies.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[650px] text-left">

                    <thead className="bg-[#F8FAFC]">

                      <tr className="border-b border-[#E2E8F0]">

                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                          Company
                        </th>

                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                          Created
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-[#E2E8F0]">

                      {filteredCompanies.map((company) => (

                        <tr
                          key={company.id}
                          className="transition hover:bg-[#F8FAFC]"
                        >

                          {/* Company */}
                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                <Building2 className="h-4 w-4 text-[#4F46E5]" />
                              </div>

                              <div>

                                <p className="text-sm font-semibold text-[#0F172A]">
                                  {company.name}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Created */}
                          <td className="px-6 py-4 text-sm text-[#64748B]">
                            {formatDate(company.created_at)}
                          </td>

                          {/* Actions */}
                          <td className="relative px-6 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === company.id
                                    ? null
                                    : company.id
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-slate-100 hover:text-[#0F172A]"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>

                            {openMenu === company.id && (
                              <div className="absolute right-6 top-12 z-20 w-40 rounded-lg border border-[#E2E8F0] bg-white p-1 text-left shadow-lg">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditCompany(company)
                                  }
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#334155] transition hover:bg-[#F8FAFC]"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteCompany(company)
                                  }
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>

                              </div>
                            )}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

          </div>
        </main>
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">

              <div>

                <h3 className="text-base font-semibold text-[#0F172A]">
                  {editingCompany
                    ? "Edit Company"
                    : "Add Company"}
                </h3>

                <p className="mt-1 text-xs text-[#64748B]">
                  {editingCompany
                    ? "Update the company information."
                    : "Create a new company in the system."}
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-slate-100 hover:text-[#0F172A] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="p-6">

                {formError && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">
                      {formError}
                    </p>
                  </div>
                )}

                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Company name
                </label>

                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(e.target.value)
                  }
                  placeholder="Enter company name"
                  disabled={saving}
                  autoFocus
                  className="h-11 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#94A3B8] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                />

              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="h-10 rounded-lg border border-[#CBD5E1] px-4 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white transition hover:bg-[#4338CA] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {saving
                    ? editingCompany
                      ? "Saving..."
                      : "Creating..."
                    : editingCompany
                    ? "Save changes"
                    : "Create company"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;