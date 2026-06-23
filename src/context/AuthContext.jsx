import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.api";
import { getApiErrorMessage } from "../api/client";
import {
  applyAuthFromResponse,
  clearAuth,
  getStoredAgent,
  getToken,
  setStoredAgent,
} from "../api/tokenStore";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [agent, setAgent] = useState(() => getStoredAgent());
  const [loading, setLoading] = useState(true);

  const loadAgent = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setAgent(null);
      return null;
    }
    try {
      const me = await authApi.getMe();
      setAgent(me);
      setStoredAgent(me);
      return me;
    } catch {
      clearAuth();
      setAgent(null);
      return null;
    }
  }, []);

  useEffect(() => {
    loadAgent().finally(() => setLoading(false));
  }, [loadAgent]);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    applyAuthFromResponse({ data });
    const loggedIn = data.agent ?? (await authApi.getMe());
    setAgent(loggedIn);
    setStoredAgent(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    applyAuthFromResponse({ data });
    const loggedIn = data.agent ?? (await authApi.getMe());
    setAgent(loggedIn);
    setStoredAgent(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAgent(null);
  }, []);

  const value = useMemo(
    () => ({
      agent,
      loading,
      isAuthenticated: Boolean(agent && getToken()),
      login,
      register,
      logout,
      loadAgent,
      getApiErrorMessage,
    }),
    [agent, loading, login, register, logout, loadAgent]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
