import { createContext, useContext, useState } from "react";
import { login as loginApi, logout as logoutApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pvf_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token, nombreUsuario, rol, expira } = res.data;
    const userData = { nombreUsuario, rol, expira };
    localStorage.setItem("pvf_token", token);
    localStorage.setItem("pvf_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const handleLogout = async () => {
    try { await logoutApi(); } catch (_) {}
    localStorage.removeItem("pvf_token");
    localStorage.removeItem("pvf_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);