import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getUser()
      .then(r => setUser(r.data?.data || r.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (creds) => {
    setError('');
    const r = await apiLogin(creds);
    const u = r.data?.data || r.data;
    setUser(u);
    return u;
  };

  const register = async (creds) => {
    setError('');
    const r = await apiRegister(creds);
    const u = r.data?.data || r.data;
    setUser(u);
    return u;
  };

  const logout = async () => {
    await apiLogout().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
