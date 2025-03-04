import router from "@/router";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { axiosApiInstance } from "@/api";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: useStorage("authenticated", false, sessionStorage),
    user: useStorage("user", null, sessionStorage, { serializer: { read: JSON.parse, write: JSON.stringify } }),
    token: useStorage("token", null, sessionStorage),
    responsible: useStorage("responsible", false, sessionStorage),
    currentEventSlug: useStorage("currentEventSlug", null, sessionStorage),
    loggingIn: false,
    loggingOut: false,
    loading: false,
    error: null,
    auth_info: null,
    success: null,
    registered: useStorage("registered", false, sessionStorage),
    registration: useStorage("registration", null, sessionStorage, { serializer: { read: JSON.parse, write: JSON.stringify } }),
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

            this.clearMessages();
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
            this.error = error.data.message;
          }
        } catch (error) {
          console.error("Login error:", error);
          this.clearMessages();
          this.auth_info = error.response.data.message;
        } finally {
          this.loggingIn = false;
        }
      }
    },
    async logout() {
      if (!this.loggingOut) {
        this.loggingOut = true;
        this.clearMessages();
        this.auth_info = "Cerrando sesión...";
        const eventStore = useEventStore();
    
        try {
          await axiosApiInstance.post("logout");

          this.authenticated = false;
          this.user = null;
          this.token = null;
          this.responsible = false;
          this.registered = false;
          this.registration = null;
          this.currentEventSlug = null;

          router.push({ name: "event-detail" , params: { slug: eventStore.evento.slug }});
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          this.loggingOut = false;
          this.clearMessages();
        }
      }
    },
    async register(formData) {
      this.loading = true;
      const eventStore = useEventStore();
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
              this.currentEventSlug = eventStore.eventSlug;
  
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
          this.loading = false;
          this.clearMessages();
        }
      }
    },
    async updateProfile(data) {
      this.loading = true;
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
      } finally {
        this.loading = false;
      }
    }    
    
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isRegistered: (state) => state.registered,
    isResponsible: (state) => state.responsible,
  },
});
