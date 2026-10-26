import { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSession, createUser, findByEmail, findById, getSessionId, setSessionId, updateUser
} from '../services/userService';

const AuthContext = createContext(null);

function restoreSession() {
  const id = getSessionId();
  const saved = id && findById(id);
  if (saved && !saved.bloqueado) return saved;
  clearSession();
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession);

  useEffect(() => {
    const syncSession = () => setUser(restoreSession());
    window.addEventListener('tablon:auth-changed', syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener('tablon:auth-changed', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const login = (email, password) => {
    const found = findByEmail(email);
    if (!found || found.password !== password) {
      return { ok: false, message: 'No pudimos ingresar. El correo o la contraseña no coinciden.' };
    }
    if (found.bloqueado) {
      return { ok: false, message: 'Tu cuenta está bloqueada. Escribe a tablon@ulima.edu.pe.' };
    }
    setSessionId(found.id);
    setUser(found);
    return { ok: true, user: found };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const register = data => createUser(data);

  // patch: campos a modificar del usuario en sesión (datos personales, foto, etc.)
  const updateProfile = patch => {
    const next = { ...user, ...patch };
    updateUser(next);
    setUser(next);
  };

  const changePassword = (current, nueva) => {
    if (current !== user.password) return { ok: false, field: 'current', message: 'La contraseña actual no es correcta.' };
    if (nueva === user.password) return { ok: false, field: 'nueva', message: 'La nueva contraseña debe ser distinta de la actual.' };
    updateProfile({ password: nueva });
    return { ok: true };
  };

  // Recuperación: mensaje neutro, no revela si la cuenta existe
  const resetPassword = (email, nueva) => {
    const found = findByEmail(email);
    if (found) updateUser({ ...found, password: nueva });
  };

  const value = { user, isAuthenticated: !!user, login, logout, register, updateProfile, changePassword, resetPassword };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
