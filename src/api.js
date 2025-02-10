import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const axiosApiInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// 🔹 Interceptor para incluir el token en cada petición
axiosApiInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

export { axiosApiInstance };
