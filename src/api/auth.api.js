import api, { unwrapResponse } from "./client";

export async function login(credentials) {
  const res = await api.post("/auth/login", credentials);
  return unwrapResponse(res);
}

export async function register(payload) {
  const res = await api.post("/auth/register", payload);
  return unwrapResponse(res);
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return unwrapResponse(res);
}
