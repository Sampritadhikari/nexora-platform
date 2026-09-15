"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  phone?: string;
  company?: string;
  address?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("nexora_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      setToken(storedToken);
      const userData = await authApi.me();
      setUser(userData);
    } catch {
      localStorage.removeItem("nexora_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("nexora_token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    localStorage.setItem("nexora_token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await authApi.googleLogin(credential);
    localStorage.setItem("nexora_token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("nexora_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
