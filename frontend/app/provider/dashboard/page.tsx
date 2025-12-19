"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoutes";
import useAuth from "@/app/hooks/useAuth";
import api from "@/utils/api";
import Link from "next/link";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ProviderDashboard() {
  const { user, logout } = useAuth();

  // Data
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // UI state
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceCategory, setServiceCategory] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Fetch all data
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        api.get("/api/services/provider"),
        api.get("/api/bookings/provider"),
      ]);

      setServices(sRes.data.services ?? []);
      setBookings(bRes.data.bookings ?? []);
    } catch (error) {
      console.error("Dashboard load error:", error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Categories
  const categories = [
    "all",
    "medical",
    "tutoring",
    "vehicle",
    "household",
    "other",
  ];

  // Filter services
  const filteredServices = useMemo(() => {
    let result = [...services];

    if (serviceCategory !== "all") {
      result = result.filter(
        (s) => s.category?.toLowerCase() === serviceCategory.toLowerCase()
      );
    }

    if (serviceSearch.trim()) {
      const q = serviceSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [services, serviceSearch, serviceCategory]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageServices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, page]);

  // Stats
  const stats = {
    totalServices: services.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    acceptedBookings: bookings.filter((b) => b.status === "accepted").length,
  };

  // Actions
  const handleAccept = async (id: string) => {
    setActionLoading(true);
    try {
      await api.put(`/api/bookings/${id}/status`, { status: "accepted" });
      await fetchAll();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await api.put(`/api/bookings/${id}/status`, { status: "rejected" });
      await fetchAll();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Do you want to delete this service?")) return;

    setActionLoading(true);
    try {
      await api.delete(`/api/services/${id}`);
      await fetchAll();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-10 mt-18">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Hello, <span className="text-orange-600">{user?.name}</span>
            </h1>
            <p className="text-gray-600">Manage your services and bookings</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/provider/add-service"
              className="bg-linear-to-r from-orange-500 to-red-600 text-white px-5 py-2 rounded-xl shadow"
            >
              + Add Service
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <DashStat label="Your Services" value={stats.totalServices} />
          <DashStat label="Total Bookings" value={stats.totalBookings} />
          <DashStat label="Pending" value={stats.pendingBookings} highlight />
        </section>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* SERVICES SECTION */}
          <ServicesSection
            services={pageServices}
            filteredServices={filteredServices}
            serviceSearch={serviceSearch}
            setServiceSearch={setServiceSearch}
            serviceCategory={serviceCategory}
            setServiceCategory={setServiceCategory}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            onDeleteService={handleDeleteService}
          />

          {/* BOOKINGS SECTION */}
          <BookingsSection
            bookings={bookings}
            onAccept={handleAccept}
            onReject={handleReject}
            actionLoading={actionLoading}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ------------------ SMALL COMPONENTS ------------------ */

function DashStat({ label, value, highlight = false }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className={`text-2xl font-bold ${highlight ? "text-orange-600" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

/* Services list, pagination, filters */
function ServicesSection(props: any) {
  const {
    services,
    filteredServices,
    serviceSearch,
    setServiceSearch,
    serviceCategory,
    setServiceCategory,
    totalPages,
    page,
    setPage,
    pageSize,
    onDeleteService,
  } = props;

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold">Your Services</h2>

          <div className="flex gap-3">
            <input
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              placeholder="Search..."
              className="border px-4 py-2 rounded-xl"
            />

            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="border px-4 py-2 rounded-xl"
            >
              <option value="all">All</option>
              <option value="Medical">Medical</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Household">Household</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {services.length === 0 ? (
          <p className="text-gray-600 text-center py-10">No services found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((s: any) => (
              <div key={s._id} className="bg-gray-50 p-5 rounded-xl border">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {s.description}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  {s.category} • {s.location} • ₹{s.price}
                </div>

                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/services/${s._id}`}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    View
                  </Link>

                  <Link
                    href={`/provider/services/${s._id}/edit`}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => onDeleteService(s._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {filteredServicesSummary(filteredServices, page, pageSize)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded-md"
            >
              Prev
            </button>

            <span className="px-3 py-1">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Booking requests */
function BookingsSection({ bookings, onAccept, onReject, actionLoading }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-600">No booking requests.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b._id} className="border p-4 rounded-xl">
                <h3 className="font-semibold">{b.service?.title}</h3>
                <p className="text-sm text-gray-600">
                  Seeker: {b.seeker?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {b.date} at {b.time}
                </p>

                {b.note && (
                  <p className="text-sm text-gray-700 mt-2">Note: {b.note}</p>
                )}

                <div className="flex gap-2 mt-3">
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => onAccept(b._id)}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-green-600 text-white rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onReject(b._id)}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-red-600 text-white rounded-md"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Helper */
function filteredServicesSummary(list: any[], page: number, size: number) {
  const total = list.length;
  if (total === 0) return "0 results";

  const start = (page - 1) * size + 1;
  const end = Math.min(total, page * size);
  return `${start}-${end} of ${total}`;
}
