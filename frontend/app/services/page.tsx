"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = ["all", "Medical", "Tutoring", "Vehicle", "Household", "Other"];

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/services");
      setServices(res.data.services || []);
      setFiltered(res.data.services || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // filtering logic
  useEffect(() => {
    let result = [...services];

    if (search.trim() !== "") {
      result = result.filter(
        (s: any) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter((s: any) => s.category === category);
    }

    setFiltered(result);
  }, [search, category, services]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 mt-18">
        Loading services...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-18">

      {/* Page Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Available Services
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title or location..."
          className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border rounded-xl px-4 py-3 cursor-pointer"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 text-lg">No services found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((service: any) => (
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
                Location: {service.location}
              </div>

              <div className="mt-1 text-sm text-gray-500">
                Price: ₹{service.price}
              </div>

              <Link
                href={`/services/${service._id}`}
                className="mt-4 inline-block bg-linear-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
