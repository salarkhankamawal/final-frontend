import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { clearAuth, getToken } from "./tokenStore";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_SKIP_PATHS = ["/auth/login", "/auth/register"];

function isAuthSkipPath(url = "") {
  return AUTH_SKIP_PATHS.some((path) => url.includes(path));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isAuthSkipPath(error.config?.url)) {
      clearAuth();
      const params = new URLSearchParams({ expired: "1" });
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?${params}`;
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error) {
  return error.response?.data?.message || error.message || "Something went wrong";
}

export function unwrapResponse(response) {
  const body = response.data;
  if (body?.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body?.data ?? body;
}

export { clearAuth };
export default api;
