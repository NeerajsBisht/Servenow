"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoutes";
import api from "@/utils/api";
import useAuth from "@/app/hooks/useAuth";
import Link from "next/link";

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch provider services + bookings
  const fetchData = async () => {
    try {
      const servicesRes = await api.get("/api/services/provider");
      const bookingsRes = await api.get("/api/bookings/provider");

      setServices(servicesRes.data.services || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.log("Error loading dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <ProtectedRoute>
        <div className="p-10 text-center text-gray-500">Loading dashboard...</div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-orange-600">{user?.name}</span>
          </h1>

          <button
            onClick={logout}
            className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Service Button */}
        <div className="flex justify-end mb-6">
          <Link
            href="/provider/add-service"
            className="bg-linear-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            + Add New Service
          </Link>
        </div>

        {/* Your Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Services</h2>

          {services.length === 0 ? (
            <p className="text-gray-600">You haven't added any services yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <div
                  key={service._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{service.description}</p>

                  <div className="mt-3 text-sm text-gray-500">
                    Category: {service.category}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Price: ₹{service.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking Requests */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Booking Requests
          </h2>

          {bookings.length === 0 ? (
            <p className="text-gray-600">No new booking requests.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div
                  key={booking._id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.service?.title}
                  </h3>

                  <p className="text-gray-600">
                    Seeker: <b>{booking.seeker?.name}</b>
                  </p>

                  <p className="text-gray-600">
                    Status:{" "}
                    <span
                      className={
                        booking.status === "pending"
                          ? "text-orange-600"
                          : booking.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {booking.status}
                    </span>
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={async () => {
                        await api.put(`/api/bookings/${booking._id}/status`, {
                          status: "accepted",
                        });
                        fetchData();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={async () => {
                        await api.put(`/api/bookings/${booking._id}/status`, {
                          status: "rejected",
                        });
                        fetchData();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
