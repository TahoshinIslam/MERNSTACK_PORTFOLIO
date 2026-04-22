import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getUser as me, login as apiLogin, logout as apiLogout, register as apiRegister } from "@/api";


const AuthContext = createContext();

// ✅ Hook
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ADD THESE
  const [error, setError] = useState(""); 
  const isLoggingRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    let retries = 3;
    const tryMe = async () => {
      try {
        const r = await me();
        const user = r.data?.result?.[0] ?? r.data?.data ?? r.data;
        setUser(user);
        if (user) localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('Session restore failed:', e);
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
      const user = r?.user ?? r?.result?.[0] ?? r?.data ?? r;
      setUser(user);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    } finally {
      isLoggingRef.current = false;
    }
  };

  // ✅ ADD THIS (you were missing it)
  const register = async (credentials) => {
    if (isLoggingRef.current) return;
    isLoggingRef.current = true;
    try {
      const res = await apiRegister(credentials);
      const r = res.data;
      const user = r?.result ?? r?.data ?? r;
      setUser(user);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    } finally {
      isLoggingRef.current = false;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,   // ✅ now exists
        logout,
        error,      // ✅ now exists
        setError    // ✅ now exists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}