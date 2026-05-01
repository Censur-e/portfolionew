import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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
