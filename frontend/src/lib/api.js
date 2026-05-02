import axios from "axios";

// Support both CRA-style and Vite-style env vars for backward compat
const BACKEND_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.REACT_APP_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_BACKEND_URL) ||
  "";

const API = `${BACKEND_URL}/api`;

export const apiClient = axios.create({ baseURL: API });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("censure_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (username, password) => apiClient.post("/auth/login", { username, password }),
  me: () => apiClient.get("/auth/me"),
};

export const contentApi = {
  get: () => apiClient.get("/content"),
  update: (data) => apiClient.put("/content", data),
  reset: () => apiClient.post("/content/reset"),
};
