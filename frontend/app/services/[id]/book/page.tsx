"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoutes";
import api from "@/utils/api";

export default function BookService() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    time: "",
    note: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    phone: "",
    serviceMode: "home",
    urgency: "normal",
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch Service
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
    if (id) {
      fetchService();
    }
  }, [id]);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please select date and time.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/bookings/book", {
        serviceId: id,
        ...form,
      });

      alert("Booking request sent successfully!");

      router.push("/seeker/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading booking page...
      </div>
    );
  }

  // Service Not Found
  if (!service) {
    return (
      <div className="text-center mt-30 text-gray-700">
        Service not found.
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-6 py-10 mt-18">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-6"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Book: {service.title}
          </h1>

          <p className="text-gray-600 mb-8">
            Provider:{" "}
            <span className="font-semibold text-gray-800">
              {service.provider?.name}
            </span>
          </p>

          {/* Booking Summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Booking Summary
            </h2>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {service.title}
              </p>

              <p>
                <span className="font-semibold">Provider:</span>{" "}
                {service.provider?.name}
              </p>

              <p>
                <span className="font-semibold">Category:</span>{" "}
                {service.category}
              </p>

              <p>
                <span className="font-semibold">Location:</span>{" "}
                {service.location}
              </p>

              <p>
                <span className="font-semibold">Price:</span> ₹
                {service.price}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Schedule Section */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Schedule Booking
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label className="block font-semibold mb-2">
                    Select Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block font-semibold mb-2">
                    Select Time
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Contact Information
              </h2>

              <div>
                <label className="block font-semibold mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Service Mode */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Service Preference
              </h2>

              <div>
                <label className="block font-semibold mb-2">
                  Service Mode
                </label>

                <select
                  name="serviceMode"
                  value={form.serviceMode}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="home">Home Visit</option>
                  <option value="provider">
                    Visit Provider Location
                  </option>
                  <option value="online">Online Service</option>
                </select>
              </div>
            </div>

            {/* Address Section */}
            <div className="border rounded-2xl p-6 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Service Address
              </h2>

              <div className="space-y-5">
                {/* Full Address */}
                <div>
                  <label className="block font-semibold mb-2">
                    Full Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House No, Street, Area"
                    className="w-full border rounded-xl px-4 py-3"
                    required
                  />
                </div>

                {/* City + State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-semibold mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full border rounded-xl px-4 py-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      className="w-full border rounded-xl px-4 py-3"
                      required
                    />
                  </div>
                </div>

                {/* Pincode + Landmark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-semibold mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className="w-full border rounded-xl px-4 py-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Landmark
                    </label>

                    <input
                      type="text"
                      name="landmark"
                      value={form.landmark}
                      onChange={handleChange}
                      placeholder="Nearby landmark"
                      className="w-full border rounded-xl px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Priority */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Booking Priority
              </h2>

              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value="normal"
                    checked={form.urgency === "normal"}
                    onChange={handleChange}
                  />

                  <span>Normal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={form.urgency === "urgent"}
                    onChange={handleChange}
                  />

                  <span>Urgent</span>
                </label>
              </div>
            </div>

            {/* Additional Note */}
            <div className="border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Additional Instructions
              </h2>

              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Describe your requirements or any important information..."
                className="w-full border rounded-xl px-4 py-3 min-h-[140px] focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}