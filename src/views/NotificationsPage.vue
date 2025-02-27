<template>
  <LayoutPage>
    <template #default>
      <div v-if="auth_info" class="alert alert-info" @click="authStore.clearMessages()">{{ auth_info }}</div>
      <Loading v-if="loading" />
      <div v-else-if="evento">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900">Notificaciones</h1>
        </div>
        
        <!-- 📌 Lista de notificaciones -->
        <div class="border rounded-lg shadow p-4 mt-2 flex-grow h-[50vh] overflow-y-auto bg-white">
          <ul v-if="notifications.length > 0">
            <li v-for="notification in sortedNotifications" :key="notification.id" class="p-3 border-b">
              <p class="text-lg font-medium">
                {{ notification.message }}
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
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import Loading from "@/components/Loading.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, notifications } = storeToRefs(eventStore);
const route = useRoute();
const authStore = useAuthStore();
const { auth_info } = storeToRefs(authStore);

const sortedNotifications = computed(() => {
  return notifications.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Cambia 'created_at' por el campo de tu notificación
});

// Cargar evento y notificaciones al montar
onMounted(async () => {
  await eventStore.fetch(route.params.slug); 
  if (evento.value?.id) {
    const userId = authStore.user.id;
    await eventStore.fetchNotifications(evento.value.id, userId);
  }
});

</script>
