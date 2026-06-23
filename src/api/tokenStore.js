import { AGENT_KEY, TOKEN_KEY } from "../utils/constants";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getStoredAgent() {
  try {
    const raw = localStorage.getItem(AGENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAgent(agent) {
  if (agent) localStorage.setItem(AGENT_KEY, JSON.stringify(agent));
  else localStorage.removeItem(AGENT_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AGENT_KEY);
}

export function applyAuthFromResponse(data) {
  const payload = data?.data ?? data;
  if (payload?.token) setToken(payload.token);
  if (payload?.agent) setStoredAgent(payload.agent);
  return payload;
}
