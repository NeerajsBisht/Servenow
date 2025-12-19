"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoutes";
import api from "@/utils/api";

export default function BookService() {
  const { id }: any = useParams();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    time: "",
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchService = async () => {
    try {
      const res = await api.get(`/api/services/${id}`);
      setService(res.data.service);
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please select date and time.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/bookings/book", {
        serviceId: id,
        date: form.date,
        time: form.time,
        note: form.note,
      });

      alert("Booking request sent successfully!");
      router.push("/seeker/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading booking page...
      </div>
    );

  if (!service)
    return (
      <div className="text-center mt-10 text-gray-600">
        Service not found.
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 py-10 mt-18">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-6"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white p-10 rounded-3xl shadow-lg">

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Book: {service.title}
          </h1>

          <p className="text-gray-600 mb-8">
            Provider:{" "}
            <span className="font-semibold text-gray-800">
              {service.provider?.name}
            </span>
          </p>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Date */}
            <div>
              <label className="block font-semibold mb-1">Select Date</label>
              <input
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block font-semibold mb-1">Select Time</label>
              <input
                type="time"
                name="time"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="block font-semibold mb-1">Additional Note (Optional)</label>
              <textarea
                name="note"
                className="w-full border rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-orange-500"
                placeholder="Describe your requirement..."
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-linear-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>

          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
