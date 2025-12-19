"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoutes";

export default function AddService() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/services", form);

      alert("Service added successfully!");
      router.push("/provider/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-16 mt-18">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg p-10">

          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Add New Service
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block font-semibold mb-1">Service Title</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Biology Tutor, Car Mechanic"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                name="category"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                <option value="Medical">medical</option>
                <option value="Tutoring">tutoring</option>
                <option value="Vehicle">vehicle</option>
                <option value="Household">household</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-orange-500"
                placeholder="Describe the service you offer..."
                required
              ></textarea>
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Delhi, Mumbai"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block font-semibold mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {loading ? "Adding..." : "Add Service"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
