import router from "@/router";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { axiosApiInstance } from "@/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: useStorage("authenticated", false),
    user: useStorage("user", null),
    role: useStorage("role", []),
    token: useStorage("token", null), // 🔹 Agregar token aquí
    loggingIn: false,
    loggingOut: false,
    error: null,
    info: null,
  }),
  actions: {
    clearMessages() {
      this.error = null;
      this.info = null;
    },
    async login(credentials) {
      if (!this.loggingIn) {
        this.loggingIn = true;
        this.clearMessages();
        this.info = "Logging in...";

        try {
          const { data } = await axiosApiInstance.post("login", credentials);
          
          if (data.user) {
            this.authenticated = true;
            this.user = data.user;
            this.role = data.role;
            this.token = data.token; // 🔹 Guardar token
            
            router.push({ name: "event-detail" });
          } else {
            this.error = data.text;
          }
        } catch (error) {
          console.error("Login error:", error);
          this.error = "Invalid credentials.";
        } finally {
          this.loggingIn = false;
        }
      }
    },
    async logout() {
      if (!this.loggingOut) {
        this.loggingOut = true;
        this.clearMessages();
        this.info = "Logging out...";

        try {
          await axiosApiInstance.post("logout");

          this.authenticated = false;
          this.user = null;
          this.role = [];
          this.token = null; // 🔹 Eliminar token

          router.push({ name: "event-detail" });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          this.loggingOut = false;
        }
      }
    },
    async register(account) {
      if (!this.registering) {
        this.registering = true;
        this.clearMessages();
        this.info = "Registrando tu cuenta...";
    
        try {
          const { data } = await axiosApiInstance.post("register", account);
    
          if (data.user) {
            this.authenticated = true;
            this.user = data.user;
            this.role = data.role;
            this.token = data.token; // 🔹 Guardar token después de registrar
    
            router.push({ name: "event-detail" }); // 🔹 Redirigir al usuario después del registro
          } else {
            this.error = "No se pudo registrar.";
          }
        } catch (error) {
          console.error("Error en el registro:", error);
          this.error = "Hubo un problema con el registro.";
        } finally {
          this.registering = false;
        }
      }
    }
    
  },
  getters: {
    isAuthenticated: (state) => !!state.token, // 🔹 Cambiar a token
    hasRole: (state) => (role) => state.role?.includes(role),
  },
});
