<template>
    <LayoutPage>
        <!-- Verifica si los datos de usuario existen antes de intentar renderizar -->
        <div v-if="parsedUser && parsedUser.name" class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <!-- User Info -->
            <div class="flex items-center space-x-4">
                <!-- Logo -->
                <img @click="abrirModal" :src="parsedUser.logo_url" alt="User Logo" class="w-16 h-16 rounded-full cursor-pointer" />
                <div>
                    <h2 class="text-xl font-semibold">{{ parsedUser.name }}</h2>
                    <p class="text-gray-600">{{ parsedUser.email }}</p>
                    <p class="text-gray-500">{{ parsedUser.location || 'Location not available' }}</p>
                </div>
            </div>

            <!-- Activity -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Activity</h3>
                <p class="text-gray-700">{{ parsedUser.activity || 'No activity available' }}</p>
            </div>

            <!-- Website -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Website</h3>
                <p class="text-gray-700">{{ parsedUser.website || 'No website provided' }}</p>
            </div>

            <!-- Gallery -->
            <div class="mt-6">
                <h3 class="text-lg font-semibold">Gallery</h3>
                <div class="grid grid-cols-3 gap-4 mt-2">
                    <img v-for="(image, index) in parsedUser.images" :key="index" :src="image.image_url" alt="Gallery image"
                        class="w-full h-32 object-cover rounded-lg" />
                </div>
            </div>
            <ImageModal 
                :imageUrl="parsedUser.logo_url" 
                :visible="mostrarImagen" 
                @update:visible="mostrarImagen = $event" 
                />
        </div>

        <!-- Mensaje de carga si los datos no están disponibles -->
        <div v-else>
            <p>Loading user data...</p>
        </div>
    </LayoutPage>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { watch, ref } from "vue";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";

import ImageModal from "@/components/ImageModal.vue";
import { parse } from "vue/compiler-sfc";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const parsedUser = user.value ? JSON.parse(user.value) : null;
console.log("User data:", parsedUser);

const mostrarImagen = ref(false);

const abrirModal = () => {
  mostrarImagen.value = true;
};

</script>
