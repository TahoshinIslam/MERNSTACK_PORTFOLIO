import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getUser as me, login as apiLogin, logout as apiLogout } from "@/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggingRef = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
  }, []);

  // Verify session against backend
  useEffect(() => {
    const tryMe = async () => {
      try {
        const r = await me();
        const u = r.data?.result?.[0] ?? r.data?.data ?? r.data;
        if (u) {
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
          console.log("✅ Session verified, user set:", u.email);
        }
      } catch (e) {
        // Session invalid – clear local
        console.warn("❌ Session verification failed:", e.message);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    tryMe();
  }, []);

  const login = async (credentials) => {
    if (isLoggingRef.current) return;
    isLoggingRef.current = true;
    try {
      const res = await apiLogin(credentials);
      const r = res.data;
      const u = r?.user ?? r?.result?.[0] ?? r?.data ?? r;
      setUser(u);
      if (u) {
        localStorage.setItem("user", JSON.stringify(u));
        console.log("✅ Login successful, user set:", u.email);
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      setError(msg);
      console.error("❌ Login failed:", msg);
    } finally {
      isLoggingRef.current = false;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      console.log("✅ Logout successful");
    } catch (e) {
      console.error("❌ Logout error (non-blocking):", e.message);
    }
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const updateUserCache = (next) => {
    setUser(next);
    if (next) localStorage.setItem("user", JSON.stringify(next));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        error,
        setError,
        updateUserCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
