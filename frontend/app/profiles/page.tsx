"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import Image from "next/image";

// Provider Type
interface Provider {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: number;
  gender: string;
  role: string;
  category: string;         
  profileImage?: string;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  // categories that match your seed file
  const categories = ["Tutoring", "Household", "Medical", "Vehicle", "Other"];

  // Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/api/providers/list");
        setProviders(res.data.providers || []);
      } catch (err) {
        console.error("Error fetching providers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading providers...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-18">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
        Meet Our Service Providers
      </h1>

      {/* Section For Each Category */}
      {categories.map((category) => {
        const filtered = providers.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );

        if (filtered.length === 0) return null;

        return (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 capitalize">
              {category} Services
            </h2>

            {/* Provider Cards Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filtered.map((provider) => (
                <div
                  key={provider._id}
                  className="bg-white rounded-2xl border shadow hover:shadow-lg transition p-5"
                >
                  {/* Image */}
                  <div className="relative w-full h-40 mb-4">
                    <Image
                      src={provider.profileImage ?? "/images/default-user.png"}
                      alt={provider.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">
                    {provider.name}
                  </h3>

                  <p className="text-gray-500 text-sm">@{provider.username}</p>

                  <p className="text-orange-600 text-sm mt-2 font-semibold capitalize">
                    {provider.category} expert
                  </p>

                  <Link
                    href={`/profiles/${provider._id}`}
                    className="mt-4 block text-center bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
