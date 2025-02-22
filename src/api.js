import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const axiosApiInstance = axios.create({
  baseURL: "https://rondas-uns.vercel.app/api",
  withCredentials: true,
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
