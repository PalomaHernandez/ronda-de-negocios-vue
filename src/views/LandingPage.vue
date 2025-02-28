<template>
  <LayoutPage>
    <template #default>
      <div class="container mx-auto py-12 px-6">
        <!-- Título de bienvenida -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-extrabold text-sky-700 mb-4">¡Bienvenido a Rondas UNS!</h1>
          <p class="text-xl text-gray-600">Explorá los eventos disponibles.</p>
        </div>

        <!-- Listado de eventos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(event, index) in eventos" :key="index" class="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
            <div class="flex flex-col items-center">
              <div class="mb-4">
                <!-- Logo del evento, con ícono si no tiene logo -->
                <img v-if="event.logo_url" :src="event.logo_url" class="w-20 h-20 rounded-full object-cover" alt="Logo del evento" />
                <i v-else class="fa-solid fa-image text-gray-400 text-7xl"></i>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4 text-center">{{ event.title }}</h2>
              <RouterLink
                :to="{ name: 'event-detail', params: { slug: event.slug } }"
                class="btn btn-primary py-2 px-6 rounded-full text-white bg-gradient-to-br from-sky-500 to-sky-700 hover:bg-sky-800 transition-all"
              >
                Ir al evento
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const eventStore = useEventStore();
const { eventos } = storeToRefs(eventStore);
const router = useRouter();

onMounted(async () => {

  await eventStore.fetchAllEvents();
});
</script>