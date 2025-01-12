import { defineStore } from 'pinia';
import { axiosApiInstance } from '@/api';

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    evento: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchEvento(name) {
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
  },
});
