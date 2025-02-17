<template>
    <div class="upload-container">
        <div class="upload-section">

            <input type="file" multiple @change="handleFileChange" class="file-input mb-4" />

            <div class="file-list mt-2">
                <div v-for="(file, index) in fileList" :key="index" class="file-item">
                    <span>{{ file.name || file.original_name}}</span>
                    <button @click="removeFile(index, file)" type="button" class="rmv-file-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
    name: "FileUploader",
    emits: ["updateFiles", "deletedFiles"],
    props: {
        uploadedFiles: {
            uploadedFiles: {
            type: Array,
            default: () => [] // Asegura que sea un array si no se pasa nada
    }
        }
    },
    setup(props, { emit }) {
        const fileList = ref([...props.uploadedFiles]);
        const deletedFiles = ref([]);

        const handleFileChange = (event) => {
            const files = Array.from(event.target.files);
            fileList.value = [...fileList.value, ...files];
            emit("updateFiles", fileList.value);
        };

        const removeFile = (index, file) => {
            if (file.id) {
                deletedFiles.value.push(file.id);
            }

            fileList.value.splice(index, 1);
            emit("updateFiles", fileList.value);
            emit("deletedFiles", deletedFiles.value);
        };

        watch(() => props.uploadedFiles, (newUploadedFiles) => {
            fileList.value = [...newUploadedFiles];
        }, { immediate: true });

        return {
            fileList,
            deletedFiles,
            handleFileChange,
            removeFile,
        };
    }
};
</script>