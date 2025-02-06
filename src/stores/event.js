import { defineStore } from 'pinia';
import { axiosApiInstance } from '@/api';

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    evento: null,
    participants: [], 
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

    async update(formData) {
      this.error = null;
  
      try {
          // 🔹 Asegúrate de agregar `_method: PATCH`
          formData.append('_method', 'PATCH');
  
          console.log(Array.from(formData.entries()));  // 👀 Verifica qué se está enviando
  
          const response = await axiosApiInstance.post(`/events/${this.evento.id}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
  
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
