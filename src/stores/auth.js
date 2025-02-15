import router from "@/router";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { axiosApiInstance } from "@/api";
import { useEventStore } from "@/stores/event";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: useStorage("authenticated", false),
    user: useStorage("user", null, localStorage, { serializer: { read: JSON.parse, write: JSON.stringify } }),
    token: useStorage("token", null),
    responsible: useStorage("responsible", false),
    loggingIn: false,
    loggingOut: false,
    error: null,
    info: null,
    success: null,
    registered: useStorage("registered", null),
  }),
  actions: {
    clearMessages() {
      this.error = null;
      this.info = null;
      this.success = null;
    },
    async checkEventRegistration(eventSlug) {
      try {
        const response = await axiosApiInstance.get(`/events/${eventSlug}/is-registered/${this.user.id}`);
        this.registered = response.data.registered;
        return this.registered;
      } catch (error) {
        console.error("Error al verificar inscripción:", error);
        this.registered = false;
        return false;
      }
    },
    async fetchUpdatedUserProfile () {
      try {
        const response = await axiosApiInstance.get("/user");
        this.user = response.data; 
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
            this.token = data.token;

            const eventStore = useEventStore();

            if(data.role.includes('responsible')) {
              eventStore.fetch(eventStore.evento.slug);
              this.responsible = eventStore.evento?.responsible_id === this.user.id;
            }

            this.registered = this.checkEventRegistration(eventStore.evento.slug);
            
            router.push({ name: "event-detail" });

          } else {
            this.error = data.text;
          }
        } catch (error) {
          console.error("Login error:", error);
          this.error = "El email o la contraseña son incorrectos.";
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
          this.token = null;
          this.responsible = false;
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
            this.token = data.token; 
            router.push({ name: "event-detail" });
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
        data.append('_method', 'PATCH');
        const response = await axiosApiInstance.post('/user/profile', data);
        this.user = response.data.user;
        this.success = response.data.message;
        router.push({ name: 'profile' });
      } catch (error) {
        console.error("Error al actualizar perfil", error);
        throw error;
      }
    }    
    
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isRegistered: (state) => state.registered,
    isResponsible: (state) => state.responsible,
  },
});
