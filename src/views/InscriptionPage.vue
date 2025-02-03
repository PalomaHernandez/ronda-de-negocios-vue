<template>
  <LayoutPage>
    <template #default>
      <p v-if="loading">Cargando...</p>
      <div v-else-if="evento">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-center mb-4">{{ 'Inscripcion al evento: '+evento.title }}</h1>
          <p class="mt-2 text-lg text-gray-600">{{ 'El dia '+new Date(evento.date).toLocaleDateString()+' a las '+evento.location || 'Informacion no disponible.' }}</p>
        </div>
        <div v-if="success" class="alert alert-success" @click="authStore.clearMessages()">{{ success }}</div>
        <div v-if="error" class="alert alert-danger" @click="authStore.clearMessages()">{{ error }}</div>
        <div v-if="info" class="alert alert-info" @click="authStore.clearMessages()">{{ info }}</div>
       
        <!-- Formulario -->
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4" ref="form" @submit.prevent="submitInscription">
          <!-- Primera columna -->
          <div class="flex flex-col gap-3">
            <LabeledObject>
              <template #label>Intereses</template>
              <textarea
                v-model="inscription.interests"
                rows="2"
                placeholder="Ingrese sus intereses"
                class="resize-none border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              ></textarea>
            </LabeledObject>

            <LabeledObject>
              <template #label>Servicios/productos que ofrece</template>
              <textarea
                v-model="inscription.products"
                rows="2"
                placeholder="Ingrese los servicios o productos que ofrece"
                class="resize-none border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              ></textarea>
            </LabeledObject>

          </div>

          <!-- Segunda columna -->
          <div class="flex flex-col gap-3">
            <LabeledObject>
              <template #label>Imágenes de servicios/productos</template> 
              <ImageUploader type="gallery" @updateFiles="updateGallery" />
            </LabeledObject>
          </div>

          <!-- Botón de envío -->
          <div class="col-span-1 md:col-span-2 flex justify-center">
            <button type="submit" class="btn btn-primary w-full max-w-2xl py-3 text-lg">
              Inscribirse
            </button>
          </div>
        </form>
        
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventStore } from "@/stores/event";
import { useRoute, useRouter } from "vue-router";
import LayoutPage from "@/Layout.vue";
import LabeledObject from "@/components/LabeledObject.vue";
import ImageUploader from "@/components/ImageUploader.vue";

// Estado y store
const eventStore = useEventStore();
const { evento, loading, error } = storeToRefs(eventStore);
const route = useRoute();
const router = useRouter();

// Cargar evento al montar
onMounted(() => {
  eventStore.fetch(route.params.name);
});

// Estado local del formulario
const inscription = ref({
  interests: "",
  products: "",
});
const gallery = ref([]);

// Métodos
const updateGallery = (files) => {
      gallery.value = files; 
    };

const submitInscription = async () => {
  if (!inscription.value.interests || !inscription.value.products) {
    alert("Por favor, complete todos los campos requeridos.");
    return;
  }

  // Crear FormData para enviar con las imágenes
  const formData = new FormData();
  formData.append("interests", inscription.value.interests);
  formData.append("products", inscription.value.products);
  images.value.forEach((image, index) => {
    formData.append(`image_${index}`, image);
  });

  try {
    // Aquí puedes agregar el método para enviar los datos al backend
    alert("Formulario enviado con éxito.");
  } catch (err) {
    alert("Ocurrió un error al enviar el formulario.");
  }
};

</script>
