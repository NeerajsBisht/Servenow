"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
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
      const res = await api.post("/api/users/register", form);

      // After registration, automatically login
      const loginRes = await api.post("/api/users/login", {
        emailOrUsername: form.email,
        password: form.password,
      });

      await login(loginRes.data.token);

      // Redirect based on role
      if (form.role === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/seeker/dashboard");
      }

    } catch (error: any) {
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-gray-100">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-md p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
              placeholder="Name"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
              placeholder="Name"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
              placeholder="@example.com"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Phone</label>
            <input
              type="number"
              name="phone"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
              placeholder="9876543210"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Gender</label>
            <select
              name="gender"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 cursor-pointer"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="not-mentioned">Not Mentioned</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Register As</label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 cursor-pointer"
              required
            >
              <option value="">Select Role</option>
              <option value="seeker">I Need Help</option>
              <option value="provider">I Want to Help</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Password</label>
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
