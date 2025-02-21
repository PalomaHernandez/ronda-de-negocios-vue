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
          <img :src="typeof img === 'string' ? img : img.preview" alt="Vista previa" class="w-full h-full object-cover rounded-lg" />
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
      type: [String, Array],
      default: "",
    },
  },
  emits: ["updateFiles", "deletedFiles"],
  setup(props, { emit }) {
    const preview = ref(props.type === "logo" ? props.uploadedFiles || null : []);
    const newFiles = ref([]); 
    const deletedFiles = ref([]); 

    watch(
      () => props.uploadedFiles,
      (newUploadedFiles) => {
        if (props.type === "logo") {
          preview.value = newUploadedFiles || null; 
        } else if (Array.isArray(newUploadedFiles)) {
          preview.value = newUploadedFiles.map((file) => ({
            preview: typeof file === "string" ? file : file.url,
            id: file.id ?? null,
          }));
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
          newFiles.value = [file];
        }
      } else {
        const newImages = files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

        newFiles.value.push(...files);
        preview.value.push(...newImages);
      }

      emit("updateFiles", newFiles.value);
    };

    const removeLogo = () => {
      if (preview.value && typeof preview.value === "string") {
        URL.revokeObjectURL(preview.value);
        emit("deletedFiles", preview.value);
        console.log("se elimino", preview.value)
      }
      preview.value = null;
      newFiles.value = [];
    };

    const removeImage = (index, img) => {
      if (img.id) {
        deletedFiles.value.push(img.id);
        emit("deletedFiles", deletedFiles.value);
      } else {
        newFiles.value = newFiles.value.filter((file) => file !== img.file);
      }
      preview.value.splice(index, 1);
      emit("updateFiles", newFiles.value);
    };

    const cleanupBlobs = () => {
      if (props.type === "gallery") {
        preview.value.forEach((img) => {
          if (typeof img !== "string") URL.revokeObjectURL(img.preview);
        });
      } else if (props.type === "logo" && preview.value && typeof preview.value === "string") {
        URL.revokeObjectURL(preview.value);
      }
    };

    onUnmounted(() => {
      cleanupBlobs();
    });

    return {
      preview,
      handleFileChange,
      removeLogo,
      removeImage,
    };
  },
};
</script>
