import { defineStore } from 'pinia';
import { axiosApiInstance } from '@/api';

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    evento: null,
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
    async update(name) {
      this.error = null;

      try {
        const response = await axiosApiInstance.patch(`/events/${this.evento.id}`);
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
