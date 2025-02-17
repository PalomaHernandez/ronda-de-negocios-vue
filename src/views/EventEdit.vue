<template>
  <router-view :key="$route.fullPath" />
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">
        <div class="text-center flex flex-col items-center space-y-6">
          <div class="cursor-pointer" @click="$refs.logoInput.click()">
            <!--i class="fa-solid fa-camera text-4xl text-gray-500"></i-->
            <img v-if="evento.logo_path" :src="evento.logo_path" alt="Event Logo"
              class="h-64 w-full object-cover rounded-xl mb-4" />
            <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoChange" />
          </div>

          <!-- Título del evento -->
          <div class="flex flex-col items-center">
            <h1 class="text-4xl font-extrabold text-gray-900">{{ evento.title }}</h1>
          </div>

          <textarea class="mt-2 text-lg text-gray-600" v-model="evento.description"
            placeholder="Descripción"></textarea>

        </div>

        <!-- Información del Evento -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(field, key) in fields" :key="key" class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">{{ field.label }}</h3>
            <input v-if="field.type === 'number'" type="number" v-model="evento[key]"
              @input="evento[key] = Math.max(0, evento[key])">
            <input v-if="field.type === 'text'" type="text" v-model="evento[key]">
            <input v-if="field.type === 'date'" type="date" v-model="formatDate[key]">
            <input v-if="field.type === 'datetime-local'" type="datetime-local" v-model="evento[key]">
            <input v-if="field.type === 'time'" type="time" v-model="formatTime[key]">
          </div>
        </div>

        <div class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Documentos</h3>
          <FileUploader :uploaded-files="evento.files || []" @updateFiles="handleDocumentsUpdate"
            @deletedFiles="handleDeletedFiles" />
        </div>

        <div class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Logo</h3>
          <ImageUploader type="logo" :uploaded-files="evento.logo_path || ''" @updateFiles="handleLogoUpdate" />
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <RouterLink :to="{ name: 'event-detail', params: { slug: evento.slug } }"
            class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-blue-700">
            Cancelar
          </RouterLink>
          <button @click="update"
            class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-blue-700">
            Guardar cambios
          </button>
        </div>
      </div>
      <p v-else-if="error" class="text-red-500 text-center">{{ error }}</p>

    </template>
  </LayoutPage>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import FileUploader from "@/components/FileUploader.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);
const route = useRoute();

const fields = {
  date: { label: "Fecha del Evento", type: "date" },
  starts_at: { label: "Horario de inicio", type: "time" },
  ends_at: { label: "Horario de fin", type: "time" },
  inscription_end_date: { label: "Inscripción hasta", type: "datetime-local" },
  matching_end_date: { label: "Matching hasta", type: "datetime-local" },
  location: { label: "Ubicación", type: "text" },
  meeting_duration: { label: "Duración de reuniones (en minutos)", type: "number" },
  time_between_meetings: { label: "Tiempo entre reuniones (en minutos)", type: "number" },
};

const logoFile = ref(null);
const documentFiles = ref([]);
const deletedFiles = ref([]);
const originalEvento = ref(null);
const props = defineProps(["slug"]);

const handleLogoUpdate = (files) => {
  logoFile.value = files.length > 0 ? files[0] : null;
};

const handleDocumentsUpdate = (files) => {
  documentFiles.value = files;
};

const handleDeletedFiles = (deleted) => {
  deletedFiles.value = deleted;
};

onMounted(async () => {
  if (!evento.value) {
    await eventStore.fetch(route.params.slug);
  }
  originalEvento.value = { ...evento.value };
});

// Función de actualización
const update = async () => {
  const formData = new FormData();

  // Compara cada campo con el original y solo agrega los que cambiaron
  Object.keys(evento.value).forEach((key) => {
    if (evento.value[key] !== originalEvento.value[key]) {
      console.log(`Cambio detectado en ${key}`);
      formData.append(key, evento.value[key]);
    }
  });

  // Agregar archivo de logo si se cambió
  if (logoFile.value) {
    formData.append("logo", logoFile.value);
  }

  // Agregar documentos si se cambiaron
  if (documentFiles.value.length > 0) {
    documentFiles.value.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
  }

  // Agregar archivos eliminados si se eliminó alguno
  if (deletedFiles.value.length > 0) {
    deletedFiles.value.forEach((fileId, index) => {
      formData.append(`deleted_files[${index}]`, fileId);
    });
  }

  if (formData.entries().next().done) {
    return;
  }

  try {
    console.log([...formData.entries()]);
    await eventStore.update(formData);
  } catch (error) {
    console.error("Error actualizando evento:", error);
  }
};

const formatDate = computed(() => {
  let dates = {};
  Object.keys(fields).forEach((key) => {
    if (fields[key].type === "date" && evento.value[key]) {
      dates[key] = evento.value[key].split("T")[0];
    } else if (fields[key].type === "datetime-local" && evento.value[key]) {
      dates[key] = evento.value[key].substring(0, 16);
    }
  });
  return dates;
});

const formatTime = computed(() => {
  let times = {};
  ["starts_at", "ends_at"].forEach((key) => {
    if (evento.value[key]) {
      times[key] = evento.value[key].substring(0, 5); // Extrae solo HH:MM
    }
  });
  return times;
});
</script>