import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cvision_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function boot() {
      const token = localStorage.getItem('cvision_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('cvision_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('cvision_token');
        localStorage.removeItem('cvision_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cvision_token', data.token);
    localStorage.setItem('cvision_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('cvision_token', data.token);
    localStorage.setItem('cvision_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('cvision_token');
    localStorage.removeItem('cvision_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
