import { defineStore } from 'pinia';
import { axiosApiInstance } from '@/api';
import { ref } from 'vue';

export const useTestStore = defineStore('testStore', {
  state: () => ({
    message: ref(''),
    loading: ref(false),
    error: ref(null),
  }),
  actions: {
    async fetchMessage() {
      this.loading = true;
      this.error = null;

      try {
        console.log("Fetching message from API...");
        const response = await axiosApiInstance.get('/test-connection');
        console.log("API response:", response);
        this.loading = false;
        this.message = response.data.message;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to connect to backend';
        console.error("Error:", this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
