import { defineStore } from 'pinia';
import { axiosApiInstance } from '@/api';

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    evento: null,
    participants: [], 
    meetings: [], 
    loading: false,
    error: null,
  }),
  persist: true,
  actions: {
    async fetch(name) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosApiInstance.get(`/events/${name}`);
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
        this.participants = response.data; // 🔹 Guardamos los participantes en el store
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener los participantes.';
        console.error("Error fetching participants:", this.error);
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

    async update(formData) {
      this.error = null;

      try {

        formData.append('_method', 'PATCH');
        const response = await axiosApiInstance.post(`/events/${this.evento.id}`, formData);
        console.log(response);
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al editar el evento.';
        console.error("Error updating event:", this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});