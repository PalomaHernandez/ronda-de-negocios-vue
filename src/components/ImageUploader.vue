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
          <img :src="typeof img === 'string' ? img : img.path" alt="Vista previa" class="w-full h-full object-cover rounded-lg" />
          <button @click="removeImage(index, img)" type="button" class="remove-btn">
              <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onUnmounted, watch } from "vue";

export default {
  name: "ImageUploader",
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ["logo", "gallery"].includes(value),
    },
    uploadedFiles: {
      type: [String, Array],
      default: "",
    },
  },
  emits: ["updateFiles", "deletedFiles"],
  setup(props, { emit }) {
    const preview = ref(props.type === "logo" ? props.uploadedFiles : [...props.uploadedFiles]);
    const fileList = ref(Array.isArray(props.uploadedFiles) ? [...props.uploadedFiles] : []);
    const deletedFiles = ref([]);

    watch(
      () => props.uploadedFiles,
      (newUploadedFiles) => {
        if (props.type === "logo") {
          preview.value = newUploadedFiles;
        } else if (Array.isArray(newUploadedFiles)) {
          preview.value = [...newUploadedFiles];
          fileList.value = [...newUploadedFiles];
        }
      },
      { immediate: true }
    );

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files);

      if (props.type === "logo") {
        const file = files[0];
        if (file) {
          cleanupBlobs();
          const url = URL.createObjectURL(file);
          preview.value = url;
          fileList.value = [file];
        }
      } else if (props.type === "gallery") {
        const newUrls = files.map((file) => URL.createObjectURL(file));
        const newFiles = [...fileList.value, ...files];

        preview.value = [...preview.value, ...newUrls];
        fileList.value = newFiles;
      }

      emit("updateFiles", fileList.value);
    };

    const removeLogo = () => {
      cleanupBlobs();
      fileList.value = [];
      preview.value = null;
      emit("updateFiles", fileList.value);
    };

    const removeImage = (index, file) => {
      if (file.id) {
        // Es una URL (imagen ya subida), la agregamos a `deletedFiles`
        deletedFiles.value.push(file.id);
        emit("deletedFiles", deletedFiles.value);
      }

      // Eliminamos la imagen de la lista
      fileList.value.splice(index, 1);
      preview.value.splice(index, 1);

      emit("updateFiles", fileList.value);
    };

    const cleanupBlobs = () => {
      if (props.type === "logo" && preview.value) {
        URL.revokeObjectURL(preview.value);
      } else if (props.type === "gallery") {
        preview.value.forEach((url) => URL.revokeObjectURL(url));
      }
      preview.value = props.type === "logo" ? null : [];
    };

    onUnmounted(() => {
      cleanupBlobs();
    });

    return {
      preview,
      handleFileChange,
      deletedFiles,
      removeLogo,
      removeImage,
    };
  },
};
</script>