"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function ProviderDetailsPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { user } = useAuth();

  // Handle Book Now button
  const handleBookNow = () => {
    if (!user) {
      // Not logged in → redirect to login
      router.push(`/login?redirect=/book/${id}`);
    } else {
      // Logged in → go to booking page
      router.push(`/services/${id}/book`);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProvider = async () => {
      try {
        const res = await api.get(`/api/providers/${id}`);
        setProvider(res.data.provider);
      } catch (err) {
        console.error("Error fetching provider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        Provider not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 mt-20">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative w-40 h-40">
            <Image
              src={provider.profileImage || "/images/default-user.png"}
              alt={provider.name}
              fill
              className="rounded-2xl object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {provider.name}
            </h1>
            <p className="text-gray-600 text-lg">@{provider.username}</p>
            <p className="text-orange-600 text-lg font-semibold mt-1">
              {provider.category} Service Provider
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Contact Information
            </h2>
            <p className="text-gray-700">📧 {provider.email}</p>
            <p className="text-gray-700">📞 {provider.phone}</p>
            <p className="text-gray-700">👤 Gender: {provider.gender}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Service Category
            </h2>
            <p className="text-gray-700">{provider.category}</p>
          </div>
        </div>

        {/* Optional Description */}
        <div className="mt-6 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
          <p className="text-gray-700">
            {provider.description ||
              "This provider has not added a description yet."}
          </p>
        </div>

        {/* Book Button */}
        {/* <div className="mt-8">
          <button
            onClick={handleBookNow}
            className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg rounded-xl transition"
          >
            Book Now
          </button>
        </div> */}
      </div>
    </div>
  );
}
