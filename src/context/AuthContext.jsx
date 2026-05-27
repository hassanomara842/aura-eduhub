import { createContext, useContext, useState } from 'react';

const AUTH_SERVER = import.meta.env.VITE_AUTH_API || 'http://localhost:5001';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('baura_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ── Login: calls backend → gets JWT token ──────────────────
  const login = async (username, password) => {
    try {
      const res = await fetch(`${AUTH_SERVER}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const userData = {
        username: data.username,
        role: data.role,
        token: data.token,          // JWT token — يُرفق مع كل طلب محمي
      };
      sessionStorage.setItem('baura_admin', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('baura_admin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
