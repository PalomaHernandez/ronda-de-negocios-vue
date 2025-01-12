<template>
  <div>
    <h1>Detalles del Evento</h1>

    <p v-if="loading">Cargando...</p>
    <div v-else-if="evento">
      <h2>{{ evento.title }}</h2>
      <p>{{ evento.description }}</p>
      <p><strong>Fecha:</strong> {{ evento.date }}</p>
      <p><strong>Hora de Inicio:</strong> {{ evento.starts_at }}</p>
      <p><strong>Hora de Fin:</strong> {{ evento.ends_at }}</p>
    </div>
    <p v-else-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="js">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEventStore } from '@/stores/event';
import { useRoute } from 'vue-router';

// Accedemos al store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);

// Obtenemos el nombre del evento desde la URL
const route = useRoute();
const eventName = route.params.name;

// Cargamos el evento al montar el componente
onMounted(() => {
  eventStore.fetchEvento(eventName);
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
