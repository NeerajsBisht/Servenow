"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data.user || res.data);
    } catch (err) {
      console.log("Profile fetch failed, clearing token.");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login → save token → load profile
  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchProfile();
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export a hook to use Auth
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
