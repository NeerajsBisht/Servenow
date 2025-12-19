"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ServiceDetails() {
  const { id }: any = useParams();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchService = async () =>
    {
    try {
      const res =await api.get(`/api/services/${id}`);
      setService(res.data.service);
    } catch (err) {
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchService();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading service details...
      </div>
    );

  if (!service)
    return (
      <div className="text-center text-gray-600 mt-10">
        Service not found.
      </div>
    );

  const provider = service.provider || {};

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 mt-18">

      {/* Go Back */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 mb-6 hover:underline"
      >
        ← Back
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow p-10">

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {service.title}
        </h1>

        {/* Category & Price */}
        <div className="flex flex-wrap gap-6 items-center mb-6">
          <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold text-sm">
            {service.category}
          </span>

          <span className="text-xl font-bold text-gray-800">
            ₹{service.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-8 text-lg">
          {service.description}
        </p>

        {/* Location */}
        <div className="mb-8">
          <p className="text-gray-600 text-sm">Location</p>
          <p className="text-gray-800 font-semibold text-lg">{service.location}</p>
        </div>

        {/* Provider Information */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Service Provider
          </h2>

          <p className="text-lg text-gray-700">
            <b>{provider.name}</b>
          </p>

          <p className="text-gray-600">Email: {provider.email}</p>

          <p className="text-gray-600">Username: {provider.username}</p>

          {/* You may hide phone for privacy */}
          {/* <p className="text-gray-600">Phone: {provider.phone}</p> */}
        </div>

        {/* Book Now Button */}
        <div className="mt-10">
          <Link
            href={`/services/${id}/book`}
            className="inline-block bg-linear-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
