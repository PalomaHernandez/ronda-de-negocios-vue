<template>
  <LayoutPage>
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center mb-4">Editar Perfil</h2>

      <div class="flex flex-col items-center space-y-4">
        <!-- Imagen de perfil -->
        <div class="relative">
          <img :src="previewImage || form.logo_path" alt="User Logo" class="w-24 h-24 rounded-full border shadow-lg" />
          <label
            class="absolute bottom-0 right-0 h-8 w-8 flex items-center justify-center bg-gray-800 text-white p-1 rounded-full cursor-pointer">
            <i class="fa-solid fa-camera"></i>
            <input type="file" @change="onFileChange" class="hidden" accept="image/*" />
          </label>
        </div>

        <!-- Campos del perfil -->
        <div class="w-full space-y-3">
          <div>
            <label class="block font-semibold">Nombre:</label>
            <input v-model="form.name" type="text" class="input" />
          </div>
          <div>
            <label class="block font-semibold">Email:</label>
            <input v-model="form.email" type="email" class="input" disabled />
          </div>
          <div>
            <label class="block font-semibold">Ubicación:</label>
            <input v-model="form.location" type="text" class="input" />
          </div>
          <div>
            <label class="block font-semibold">Sitio Web:</label>
            <input v-model="form.website" type="text" class="input" />
          </div>
          <div>
            <label class="block font-semibold">Galeria:</label>
            <ImageUploader type="gallery" :uploaded-files="user.images || []" @updateFiles="handleImagesUpdate"
              @deletedFiles="handleDeletedImages" />
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <RouterLink :to="{ name: 'profile' }" class="btn">
            Cancelar
          </RouterLink>
          <button @click="guardarCambios"
            class="bg-blue-600 btn text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import LayoutPage from "@/Layout.vue";
import ImageUploader from "@/components/ImageUploader.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user ? authStore.user : {});

// Estado del formulario
const form = ref({
  name: user.value.name || "",
  email: user.value.email || "",
  location: user.value.location || "",
  website: user.value.website || "",
  logo_path: user.value.logo_path || "",
});

const previewImage = ref(null);

const gallery = ref([]);
const deleted_images = ref([]);
const selectedFile = ref(null);

// Manejar la carga de una nueva imagen de perfil
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.value = reader.result; // Muestra vista previa de la imagen
    };
    reader.readAsDataURL(file);
  }
};

const guardarCambios = async () => {
  try {
    console.log("Form values:", form.value);
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("location", form.value.location);
    formData.append("website", form.value.website);

    if (previewImage.value) {
      formData.append("logo", selectedFile.value);
    }

    if (gallery.value.length > 0) {
      gallery.value.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`gallery[${index}]`, file);
        }
      });
    }

    if (deleted_images.value.length > 0) {
      deleted_images.value.forEach((img, index) => {
        formData.append(`deleted_images[${index}]`, img);
      });
    }
    await authStore.updateProfile(formData);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
  }
};

const handleImagesUpdate = (files) => {
  gallery.value = files;
};

const handleDeletedImages = (deleted) => {
  deleted_images.value = deleted;
};

</script>