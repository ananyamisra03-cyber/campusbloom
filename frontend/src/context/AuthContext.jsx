import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("cb_token");
    setUser(null); setUserData(null);
  }, []);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("cb_token");
    if (!token) { setLoading(false); return; }
    api.get("/api/auth/me")
      .then(r => { setUser(r.data.user); return api.get("/api/data"); })
      .then(r => setUserData(r.data))
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  // Listen for auto-logout from api interceptor
  useEffect(() => {
    window.addEventListener("cb_logout", logout);
    return () => window.removeEventListener("cb_logout", logout);
  }, [logout]);

  const login = async (email, password) => {
    const r = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("cb_token", r.data.token);
    setUser(r.data.user);
    const d = await api.get("/api/data");
    setUserData(d.data);
    return r.data.user;
  };

  const signup = async (name, email, password, college) => {
    const r = await api.post("/api/auth/signup", { name, email, password, college });
    localStorage.setItem("cb_token", r.data.token);
    setUser(r.data.user);
    const d = await api.get("/api/data");
    setUserData(d.data);
    return r.data.user;
  };

  // Save a single data key
  const saveKey = useCallback(async (key, value) => {
    setUserData(prev => ({ ...prev, [key]: value }));
    try { await api.patch(`/api/data/${key}`, { value }); }
    catch (e) { console.error("saveKey failed:", key, e); }
  }, []);

  // Save user preferences (points, dark, theme, etc.)
  const savePref = useCallback(async (updates) => {
    try {
      const r = await api.patch("/api/auth/preferences", updates);
      setUser(prev => ({ ...prev, ...r.data.user }));
    } catch (e) { console.error("savePref failed", e); }
  }, []);

  return (
    <AuthCtx.Provider value={{ user, setUser, userData, setUserData, loading, login, signup, logout, saveKey, savePref }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
