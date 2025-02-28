<template>
  <LayoutPage>
    <template #default>
      <div v-if="auth_info" class="alert alert-info" @click="authStore.clearMessages()">{{ auth_info }}</div>
      <Loading v-if="loading" />
      <div v-else-if="evento">
        <div class="text-center flex flex-col items-center space-y-6">
          <!-- Título del evento -->
          <div class="flex flex-col items-center">
            <h1 class="text-4xl font-extrabold text-gray-900">{{ evento.title }}</h1>
          </div>

          <textarea class="mt-2 text-lg text-gray-600" v-model="evento.description"
            placeholder="Descripción"></textarea>

            <div class="cursor-pointer" @click="$refs.logoInput.click()">
            <!--i class="fa-solid fa-camera text-4xl text-gray-500"></i-->
            <img v-if="evento.logo_url" :src="evento.logo_url" alt="Event Logo"
              class="h-64 w-full object-cover rounded-xl mb-4" />
            <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleLogoChange" @deletedFiles="deleteLogo"/>
          </div>

        </div>

        <!-- Información del Evento -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(field, key) in fields" :key="key" class="bg-gray-100 p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-800">{{ field.label }}</h3>
            <input v-if="key === 'max_participants'" type="number" v-model="evento[key]" disabled class=""/>

            <input v-else-if="key === 'starts_at' && evento.status !== 'Inscripcion'" type="time" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'starts_at'" type="time" v-model="evento[key]">

            <input v-else-if="key === 'ends_at' && evento.status !== 'Inscripcion'" type="time" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'ends_at'" type="time" v-model="evento[key]">

            <input v-else-if="key === 'inscription_end_date' && evento.status !== 'Inscripcion'" type="datetime-local" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'inscription_end_date'" type="datetime-local" v-model="evento[key]">

            <input v-else-if="key === 'matching_end_date' && evento.status === 'Terminado'" type="datetime-local" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'matching_end_date'" type="datetime-local" v-model="evento[key]">

            <input v-else-if="field.type === 'text'" type="text" v-model="evento[key]">
            <input v-else-if="field.type === 'date'" type="date" v-model="evento[key]">

            <input v-else-if="key === 'meeting_duration' && evento.status !== 'Inscripcion'" type="number" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'meeting_duration'" type="number" v-model="evento[key]">

            <input v-else-if="key === 'time_between_meetings' && evento.status !== 'Inscripcion'" type="number" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'time_between_meetings'" type="number" v-model="evento[key]">

            <input v-else-if="key === 'meetings_per_user' && evento.status !== 'Inscripcion'" type="number" v-model="evento[key]" disabled class="">
            <input v-else-if="key === 'meetings_per_user'" type="number" v-model="evento[key]" @input="evento[key] = Math.max(0, evento[key])">
          </div>
        </div>

        <div class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Documentos</h3>
          <FileUploader :uploaded-files="evento.files || []" @updateFiles="handleDocumentsUpdate"
            @deletedFiles="handleDeletedFiles" />
        </div>

        <div class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Logo</h3>
          <ImageUploader type="logo" :uploaded-files="evento.logo_url || ''" @updateFiles="handleLogoUpdate" />
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <RouterLink :to="{ name: 'event-detail', params: { slug: evento.slug } }"
            class="btn text-base">
            Cancelar
          </RouterLink>
          <button @click="update"
            class="btn text-base">
            Guardar cambios
          </button>
        </div>
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import LayoutPage from "@/Layout.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import FileUploader from "@/components/FileUploader.vue";
import Loading from "@/components/Loading.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);
const authStore = useAuthStore();
const { auth_info } = storeToRefs(authStore);
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
  max_participants: { label: "Cantidad máxima de participantes", type: "number" },
  meetings_per_user: { label: "Cantidad de reuniones por participante", type: "number" },
};

const logoFile = ref(null);
const documentFiles = ref([]);
const deletedFiles = ref([]);
const deletedLogo = ref([]);
const originalEvento = ref(null);
const props = defineProps(["slug"]);

const handleLogoUpdate = (files) => {
  logoFile.value = files.length > 0 ? files[0] : null;
};

const deleteLogo = (logo) => {
  deletedLogo.value = logo;
}

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

const update = async () => {
  const formData = new FormData();

  Object.keys(evento.value).forEach((key) => {
    if (evento.value[key] !== originalEvento.value[key]) {
      formData.append(key, evento.value[key]);
    }
  });

  if (logoFile.value) {
    formData.append("logo", logoFile.value);
  } else if (deletedLogo.value){
    formData.append("deleteLogo", true);
  }

  if (documentFiles.value.length > 0) {
    documentFiles.value.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
  }

  if (deletedFiles.value.length > 0) {
    deletedFiles.value.forEach((fileId, index) => {
      formData.append(`deleted_files[${index}]`, fileId);
    });
  }

  if (formData.entries().next().done) {
    return;
  }

  try {
    await eventStore.update(formData);
  } catch (error) {
    console.error("Error actualizando evento:", error);
  }
};

</script>