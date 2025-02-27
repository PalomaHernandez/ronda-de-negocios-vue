import router from "@/router";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { axiosApiInstance } from "@/api";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: useStorage("authenticated", false),
    user: useStorage("user", null, localStorage, { serializer: { read: JSON.parse, write: JSON.stringify } }),
    token: useStorage("token", null),
    responsible: useStorage("responsible", false),
    currentEventSlug: useStorage("currentEventSlug", null),
    loggingIn: false,
    loggingOut: false,
    error: null,
    auth_info: null,
    success: null,
    registered: useStorage("registered", false),
    registration: useStorage("registration", null, localStorage, { serializer: { read: JSON.parse, write: JSON.stringify } }),
  }),
  actions: {
    clearMessages() {
      this.error = null;
      this.auth_info = null;
      this.success = null;
    },
    async fetchUpdatedUserProfile () {
      try {
        const response = await axiosApiInstance.get("/user");
        this.user = response.data; 
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    },   
    async checkResponsibleUser() {
      const eventStore =  useEventStore();
      return this.responsible = eventStore.evento?.responsible_id === this.user.id;
    },
    async login(credentials, eventSlug) {
      if (!this.loggingIn) {
        this.loggingIn = true;
        this.clearMessages();
        this.auth_info = "Iniciando sesión...";

        try {
          const { data } = await axiosApiInstance.post("login", {
            email: credentials.email, 
            password: credentials.password, 
            eventSlug: eventSlug
          });
          const eventStore =  useEventStore();
          if (data.user) {
            this.user = data.user;
            this.token = data.token;
            this.responsible = data.isResponsible;
            this.registered = data.isRegistered;
            this.registration = data.registration;
            this.authenticated = true;
            this.currentEventSlug = eventSlug;

            if(this.registered || this.responsible){
              router.push({ name: "event-detail" });
            }
            else if(eventStore.evento.status === "Inscripcion"){
              router.push({ name: "event-inscription" });
            }
            else{
              await this.logout();
              router.push({ name: "event-detail" });
              this.auth_info = "Lo lamentamos, el periodo de inscripción para este evento ya ha finalizado."
            }
          } else {
            this.error = data.text;
          }
        } catch (error) {
          console.error("Login error:", error);
          this.auth_info = "El email o la contraseña son incorrectos.";
        } finally {
          this.loggingIn = false;
          this.clearMessages();
        }
      }
    },
    async logout(eventSlug) {
      if (!this.loggingOut) {
        this.loggingOut = true;
        this.clearMessages();
        this.auth_info = "Cerrando sesión...";
    
        try {
          await axiosApiInstance.post("logout");

          this.authenticated = false;
          this.user = null;
          this.token = null;
          this.responsible = false;
          this.registered = false;
          this.registration = null;
          this.currentEventSlug = null;

          router.push({ name: "event-detail" , params: { slug: eventSlug }});
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          this.loggingOut = false;
          this.clearMessages();
        }
      }
    },
    async register(formData) {
      if (!this.registering) {
        this.registering = true;
        this.clearMessages();
        this.auth_info = "Registrando tu cuenta...";
        try {
          if(eventStore.evento.status === "Inscripcion"){
            const { data } = await axiosApiInstance.post("register", formData);
            if (data.user) {
              this.authenticated = true;
              this.user = data.user;
              this.token = data.token; 
              this.currentEventSlug = eventSlug;
  
              router.push({ name: "event-inscription" });
            } else {
              this.error = "No se pudo registrar.";
            }
          } else {
            this.auth_info = "Lo lamentamos, el periodo de inscripción para este evento ya ha finalizado."
            router.push({ name: "event-inscription" });
          }
        } catch (error) {
          console.error("Error en el registro:", error);
          this.error = "Hubo un problema con el registro.";
        } finally {
          this.registering = false;
          this.clearMessages();
        }
      }
    },
    async updateProfile(data) {
      try {
        data.append('_method', 'PATCH');
        const response = await axiosApiInstance.post(`/user/profile/${this.registration.id}`, data);
        this.user = response.data.user;
        this.registration = response.data.registration;
        
        this.success = response.data.message;
        router.push({ name: 'profile' });
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data.message; 
        } else {
          this.error = "Ocurrió un error inesperado.";
          console.error("Error desconocido:", error);
        }
      }
    }    
    
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isRegistered: (state) => state.registered,
    isResponsible: (state) => state.responsible,
  },
});
