<template>
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">
        <div class="text-center relative">
          <img v-if="evento.logo_path" :src="evento.logo_path" alt="Event Logo"
            class="mx-auto h-32 w-32 object-cover rounded-full mb-4 absolute left-1/2 transform -translate-x-1/2 -translate-y-12" />

          <template v-if="editMode">
            <input type="text" class="text-4xl font-extrabold text-gray-900" v-model="evento.title">
            <textarea class="mt-2 text-lg text-gray-600" v-model="evento.description"
              placeholder="Descripción"></textarea>
          </template>
          <template v-else>
            <h1 class="text-4xl font-extrabold text-gray-900">{{ evento.title }}</h1>
            <p class="mt-2 text-lg text-gray-600">{{ evento.description || 'La descripción no está disponible.' }}</p>
          </template>
        </div>

        <!-- Información del Evento -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(field, key) in fields" :key="key" class="bg-white p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800">{{ field.label }}</h3>
            <template v-if="editMode">
              <input v-if="field.type === 'text'" type="text" v-model="evento[key]">
              <input v-if="field.type === 'date'" type="date" v-model="evento[key]">
              <input v-if="field.type === 'time'" type="time" v-model="evento[key]">
            </template>
            <template v-else>
              <p class="text-gray-600">{{ evento[key] || 'No disponible' }}</p>
            </template>
          </div>
        </div>

        <div class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Documentos</h3>
          <FileUploader v-if="editMode" @updateFiles="handleDocumentsUpdate" />
        </div>

        <div class="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800">Logo</h3>
          <ImageUploader v-if="editMode" type="logo" @updateFiles="handleLogoUpdate" />
        </div>

        <div v-if="!authStore.authenticated" class="mt-8 flex justify-end space-x-4">
          <button @click="abrirModal"
            class="bg-yellow-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none">
            Inscribirse al Evento
          </button>
          <button @click="irALogin"
            class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none">
            Acceder
          </button>
        </div>

        <div v-if="isResponsible" class="mt-8 flex justify-end space-x-4">
          <button @click="toggleEditMode" class="bg-yellow-600 text-white text-lg font-semibold py-3 px-6 rounded-lg">
            {{ editMode ? 'Cancelar' : 'Editar' }}
          </button>
          <button v-if="editMode" @click="update"
            class="bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg">
            Guardar cambios
          </button>
        </div>
      </div>
      <p v-else-if="error" class="text-red-500 text-center">{{ error }}</p>

      <!-- Modal -->
      <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-10 rounded-lg shadow-lg w-[600px] h-[300px] flex flex-col relative">
          <h2 class="text-2xl font-bold text-center">¿Ya tenés una cuenta de Rondas UNS?</h2>

          <div class="flex flex-col items-center space-y-4 mt-6 flex-grow">
            <button @click="irALogin" class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 w-2/3">
              Sí, iniciar sesión
            </button>
            <button @click="irARegister"
              class="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 w-2/3">
              No, crear cuenta
            </button>
          </div>

          <div class="absolute bottom-2 right-4">
            <button @click="cerrarModal" class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute, useRouter } from "vue-router";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import ImageUploader from "@/components/ImageUploader.vue";
import FileUploader from "@/components/FileUploader.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);
const route = useRoute();
const router = useRouter();
const mostrarModal = ref(false);
const authStore = useAuthStore();
const editMode = ref(false);

const fields = {
  date: { label: "Fecha del Evento", type: "date" },
  starts_at: { label: "Horario de inicio", type: "time" },
  ends_at: { label: "Horario de fin", type: "time" },
  meeting_duration: { label: "Duración de reuniones", type: "text" },
  time_between_meetings: { label: "Tiempo entre reuniones", type: "text" },
  inscription_end_date: { label: "Inscripción hasta", type: "date" },
  matching_end_date: { label: "Matching hasta", type: "date" },
  location: { label: "Ubicación", type: "text" }
};

const isResponsible = computed(() => authStore.hasRole("responsible"));

const logoFile = ref(null);
const documentFiles = ref([]);

const handleLogoUpdate = (files) => {
  logoFile.value = files.length > 0 ? files[0] : null;
};

const handleDocumentsUpdate = (files) => {
  documentFiles.value = files;
};


// Cargar evento al montar
onMounted(() => {
  eventStore.fetch(route.params.name);
  console.log(authStore.role);
});

// Métodos
const abrirModal = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const irALogin = () => {
  cerrarModal();
  router.push({ name: "login" });
};

const irARegister = () => {
  cerrarModal();
  router.push({ name: "register" });
};

const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const update = async () => {
  if (!evento.value.title) {
    alert("El título es obligatorio.");
    return;
  }

  const formData = new FormData();

  formData.append("title", evento.value.title);
  formData.append("description", evento.value.description || "");
formData.append("date", evento.value.date || "");
formData.append("starts_at",  evento.value.starts_at || "");
formData.append("ends_at",  evento.value.ends_at || "");
formData.append("meeting_duration", evento.value.meeting_duration || "");
formData.append("time_between_meetings", evento.value.time_between_meetings || "");
formData.append("inscription_end_date", evento.value.inscription_end_date ? evento.value.inscription_end_date : "");
formData.append("matching_end_date", evento.value.matching_end_date ? evento.value.matching_end_date : "");
formData.append("location", evento.value.location || "");

  // Agregar logo si hay uno nuevo
  if (logoFile.value) {
    formData.append("logo", logoFile.value);
  }

  if (documentFiles.value.length > 0) {
    documentFiles.value.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
  }

  try {
    console.log([...formData.entries()]);
    await eventStore.update(formData);
    editMode.value = false;
  } catch (error) {
    console.error("Error actualizando evento:", error);
  }
};


const formatTime = (time) => {
  if (!time) return "No disponible";
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>
