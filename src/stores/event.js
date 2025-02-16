import { defineStore } from 'pinia';
import { axiosApiInstance } from '@/api';
import router from '@/router';
import { useAuthStore } from "@/stores/auth";

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    evento: null,
    participants: [], 
    meetings: [], 
    notifications: [], 
    loading: false,
    error: null,
    info: null,
    success: null,
  }),
  persist: true,
  actions: {
    clearMessages() {
      this.error = null;
      this.info = null;
      this.success = null;
    },
    async fetch(slug) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosApiInstance.get(`/events/${slug}`);
        this.evento = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al cargar el evento.';
        console.error("Error fetching event:", this.error);
      } finally {
        this.loading = false;
      }
    },

    async fetchParticipants(eventId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosApiInstance.get(`/events/${eventId}/participants`);
        if(response.data){
          this.participants = response.data;
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener los participantes.';
        console.error("Error fetching participants:", this.error);
      } finally {
        this.loading = false;
      }
    },
    async inscription(eventId, formData){
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosApiInstance.post(`/events/${eventId}/registration`, formData);
        this.success = response.data;
        const authStore = useAuthStore();
        authStore.checkEventRegistration(this.evento.slug);
        authStore.fetchUpdatedUserProfile();
        router.push({ name: 'event-detail', params: { slug: this.evento.slug }});
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener las reuniones.';
        console.error("Error creating registration:", this.error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserMeetings(eventId, userId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosApiInstance.get(`/events/${eventId}/meetings/${userId}`);
        this.meetings = response.data; // Guardamos las reuniones en el store
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener las reuniones.';
        console.error("Error fetching meetings:", this.error);
      } finally {
        this.loading = false;
      }
    },


    async fetchNotifications(eventId, userId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosApiInstance.get(`/events/${eventId}/notifications/${userId}`);
        this.notifications = response.data; // Guardamos las reuniones en el store
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener las reuniones.';
        console.error("Error fetching notifications:", this.error);
      } finally {
        this.loading = false;
      }
    },

    async createMeeting(meetingData) {
      this.loading = true;
      this.error = null;
    
      try {

        const response = await axiosApiInstance.post("/meetings", meetingData);
        if (!Array.isArray(this.meetings)) {
          this.meetings = [];
        }
    
        this.meetings.push(response.data);

      } catch (err) {
        this.error = err.response?.data?.message || "Error al crear la reunión.";

        console.error("Error completo:", err.response?.data);
      } finally {
        this.loading = false;
      }
    },

    async acceptMeeting(meetingId) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await axiosApiInstance.patch(`/meetings/${meetingId}`, { status: "Aceptada" });
        const updatedMeeting = response.data;
    
        // Actualizamos el estado local
        const index = this.meetings.findIndex(m => m.id === meetingId);
        if (index !== -1) {
          this.meetings[index] = updatedMeeting;
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Error al aceptar la reunión.";
        console.error("Error:", this.error);
      } finally {
        this.loading = false;
      }
    },
    
    async rejectMeeting(meetingId) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await axiosApiInstance.patch(`/meetings/${meetingId}`, { status: "Rechazada" });
        const updatedMeeting = response.data;
    
        // Actualizamos el estado local
        const index = this.meetings.findIndex(m => m.id === meetingId);
        if (index !== -1) {
          this.meetings[index] = updatedMeeting;
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Error al rechazar la reunión.";
        console.error("Error:", this.error);
      } finally {
        this.loading = false;
      }
    },    

    async deleteMeeting(meetingId) {
      try {
        const response = await axiosApiInstance.delete(`/meetings/${meetingId}`);
        
        if (response.status === 200) {
          // Filtramos la reunión eliminada del estado global
          this.meetings = this.meetings.filter((meeting) => meeting.id !== meetingId);
        } else {
          throw new Error("Error al eliminar la reunión.");
        }
      } catch (error) {
        console.error("Error eliminando la reunión:", error);
        throw error;
      }
    },
    

    async update(formData) {
      this.error = null;

      try {
        formData.append('_method', 'PATCH');
        const response = await axiosApiInstance.post(`/events/${this.evento.id}`, formData);
        router.push({ name: 'event-detail', params: { slug: this.evento.slug }});
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al editar el evento.';
        console.error("Error updating event:", this.error);
      } finally {
        this.loading = false;
      }
    },

    async removeParticipant(user_id) {
      this.error = null;

      try {
        const response = await axiosApiInstance.delete(`/events/${this.evento.id}/participants/${user_id}`);
        this.success = response.data.message;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al eliminar el participante.';
        console.error("Error deleting participant:", this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});