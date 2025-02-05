<template>
    <div class="upload-section">
      <input 
        type="file" 
        multiple 
        @change="handleFileChange" 
        class="file-input mb-4"
      />
      
      <div class="file-list mt-2">
        <div v-for="(file, index) in fileList" :key="index" class="file-item">
          <span>{{ file.name }}</span>
          <button @click="removeFile(index)" type="button" class="remove-btn">
            &times;
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "FileUploader",
    emits: ["updateFiles"],
    setup(_, { emit }) {
      const fileList = ref([]);
  
      const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        fileList.value = [...fileList.value, ...files];
        emit("updateFiles", fileList.value);
      };
  
      const removeFile = (index) => {
        fileList.value.splice(index, 1);
        emit("updateFiles", fileList.value);
      };
  
      return {
        fileList,
        handleFileChange,
        removeFile,
      };
    },
  };
  </script>
  
 