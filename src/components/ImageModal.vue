<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="relative">
      <img :src="imageUrl" alt="Imagen Completa" class="max-w-full max-h-screen rounded-lg shadow-lg" />
      <button @click="closeModal" class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center 
         rounded-full hover:bg-red-700 aspect-square">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:visible']);

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  }
});

const isVisible = ref(props.visible);

watch(() => props.visible, (newValue) => {
  isVisible.value = newValue;
});

const closeModal = () => {
  isVisible.value = false;
  emit('update:visible', false);
};
</script>