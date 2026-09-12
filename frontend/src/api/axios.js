import axios from "axios";

// All requests go to /api/... which Vite proxies to the backend in dev
// (see vite.config.js). In production, set VITE_API_URL or serve both from
// the same origin.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("us_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
