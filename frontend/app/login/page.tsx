"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/users/login", form);

      const { token, user } = res.data;

      // store token + load profile into AuthProvider
      await login(token);

      // redirect based on role
      if (user.role === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/seeker/dashboard");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-md p-10">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
              placeholder="******"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-orange-600 font-semibold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
