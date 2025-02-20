<template>
  <div class="upload-container">
    <!-- Logo Upload -->
    <div v-if="type === 'logo'" class="upload-section">
      <input type="file" accept="image/*" @change="handleFileChange" class="file-input mb-4" />
      <div v-if="preview" class="preview-container">
        <div class="relative w-28 h-28">
          <img :src="preview" alt="Vista previa del logo" class="w-28 h-28 object-cover rounded-lg" />
          <button @click="removeLogo" class="remove-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery Upload -->
    <div v-if="type === 'gallery'" class="upload-section">
      <input type="file" accept="image/*" multiple @change="handleFileChange" class="file-input mb-4" />
      <div class="preview-container flex flex-row gap-2 mt-2">
        <div v-for="(img, index) in preview" :key="index" class="relative w-28 h-28">
          <img :src="img.preview" alt="Vista previa" class="w-full h-full object-cover rounded-lg" />
          <button @click="removeImage(index, img)" type="button" class="remove-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from "vue";

export default {
  name: "ImageUploader",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ["logo", "gallery"].includes(value),
    },
    uploadedFiles: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["updateFiles", "deletedFiles"],
  setup(props, { emit }) {
    const preview = ref([]);
    const newFiles = ref([]); // Solo archivos nuevos
    const deletedFiles = ref([]);

    watch(
      () => props.uploadedFiles,
      (newUploadedFiles) => {
        preview.value = newUploadedFiles.map((file) => ({
          preview: file.path, // Mantiene la ruta de la imagen ya subida
          id: file.id,
        }));
      },
      { immediate: true }
    );

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      newFiles.value.push(...files); // Solo los archivos nuevos
      preview.value.push(...newImages); // Muestra las imágenes en la UI
      emit("updateFiles", newFiles.value);
    };

    const removeImage = (index, img) => {
      if (img.id) {
        // Si tiene ID, es una imagen ya subida y la mandamos a eliminar
        deletedFiles.value.push(img.id);
        emit("deletedFiles", deletedFiles.value);
      } else {
        // Es una imagen nueva, la eliminamos del array
        newFiles.value = newFiles.value.filter((file) => file !== img.file);
        emit("updateFiles", newFiles.value);
      }

      // Eliminamos la imagen de la UI
      preview.value.splice(index, 1);
    };

    onUnmounted(() => {
      preview.value.forEach((img) => {
        if (!img.id) URL.revokeObjectURL(img.preview);
      });
    });

    return {
      preview,
      handleFileChange,
      removeImage,
    };
  },
};
</script>
