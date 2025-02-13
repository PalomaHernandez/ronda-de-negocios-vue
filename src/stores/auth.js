import router from "@/router";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { axiosApiInstance } from "@/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: useStorage("authenticated", false),
    user: useStorage("user", null, localStorage, { serializer: { read: JSON.parse, write: JSON.stringify } }),
    role: useStorage("role", []),
    token: useStorage("token", null), // 🔹 Agregar token aquí
    loggingIn: false,
    loggingOut: false,
    error: null,
    info: null,
    registered: useStorage("registered", null),
  }),
  actions: {
    clearMessages() {
      this.error = null;
      this.info = null;
    },
    async checkEventRegistration(eventSlug) {
      try {
        const response = await axiosApiInstance.get(`/events/${eventSlug}/is-registered/${this.user.id}`);
        this.registered = response.data.registered; // Guardamos la respuesta
        return this.registered;
      } catch (error) {
        console.error("Error al verificar inscripción:", error);
        this.registered = false; // En caso de error, asumimos que no está registrado
        return false;
      }
    },
    async fetchUpdatedUserProfile () {
      try {
        const response = await axiosApiInstance.get("/user");
        this.user = response.data;  // Actualiza el estado del usuario en el store
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
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
            this.token = data.token;
          
            const eventSlug = router.currentRoute.value.params.slug;
            if (this.checkEventRegistration(eventSlug)) {
              router.push({ name: "event-detail", params: { slug: eventSlug } });
            } else {
              router.push({ name: "event-inscription", params: { slug: eventSlug } });
            }

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

        try {
          await axiosApiInstance.post("logout");

          this.authenticated = false;
          this.user = null;
          this.role = [];
          this.token = null;
          this.registered = false;

          router.push({ name: "event-detail" });
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          this.loggingOut = false;
        }
      }
    },
    async register(formData) {
      if (!this.registering) {
        this.registering = true;
        this.clearMessages();
        this.info = "Registrando tu cuenta...";
    
        try {
          const { data } = await axiosApiInstance.post("register", formData);
    
          if (data.user) {
            this.authenticated = true;
            this.user = data.user;
            this.role = data.role;
            this.token = data.token; // 🔹 Guardar token después de registrar
    
            router.push({ name: "event-inscription" }); // 🔹 Redirigir al usuario después del registro
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
    },
    async updateProfile(data) {
      try {
        const response = await axiosApiInstance.patch('/user/profile', data);
        this.user = response.data.user ?? response.data;
      } catch (error) {
        console.error("Error al actualizar perfil", error);
        throw error;
      }
    }    
    
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isRegistered: (state) => state.registered,
    hasRole: (state) => (role) => state.role.includes(role),
  },
});
