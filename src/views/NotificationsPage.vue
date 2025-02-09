<template>
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900">Notificaciones</h1>
        </div>
        
        <!-- 📌 Lista de notificaciones -->
        <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[50vh] overflow-y-auto bg-white">
          <ul v-if="notifications.length > 0">
            <li v-for="notification in notifications" :key="notification.id" class="p-3 border-b">
              <p class="text-lg font-medium">
                {{ notification.data }}
              </p>
            </li>
          </ul>
          <p v-else class="text-gray-500">No hay notificaciones registradas para este evento.</p>
        </div>
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error, notifications } = storeToRefs(eventStore);
const route = useRoute();
const authStore = useAuthStore();

// Cargar evento y notificaciones al montar
onMounted(async () => {
  await eventStore.fetch(route.params.slug); // Obtener evento
  watchEffect(() => {
    if (evento.value) {
      const userId = authStore.user.id;
      eventStore.fetchNotifications(evento.value.id, userId);
    }
  });
});

// Esperar que el evento esté listo y luego cargar notificaciones

</script>
