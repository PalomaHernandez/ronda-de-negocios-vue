<template>
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900">Notificaciones</h1>
        </div>

      </div>
      <p v-else-if="error" class="text-red-500 text-center">{{ error }}</p>

    </template>
  </LayoutPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute, useRouter } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);
const route = useRoute();
const authStore = useAuthStore();

// Cargar evento al montar
onMounted(() => {
  eventStore.fetch(route.params.name);
});




</script>
