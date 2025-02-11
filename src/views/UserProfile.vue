<template>
    <LayoutPage>
        <div v-if="parsedUser && parsedUser.name" class="p-6">
            <RouterLink :to="{ name: 'edit-profile' }" class="btn bg-blue-500 absolute top-2 right-2">
                <i class="fa-solid fa-user-edit"></i>
                Editar perfil
            </RouterLink>
            <div class="flex items-center space-x-4">
                <!-- Logo -->
                <img :src="parsedUser.logo_url" alt="User Logo" class="w-16 h-16 rounded-full" />
                <div>
                    <h2 class="text-xl font-semibold">{{ parsedUser.name }}</h2>
                    <p class="text-gray-600">{{ parsedUser.email }}</p>
                </div>
            </div>
            <!-- Ubicacion -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Ubicación</h3>
                <p class="text-gray-500">{{ parsedUser.location || 'No disponible' }}</p>
            </div>
            <!-- Activity -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Actividad</h3>
                <p class="text-gray-700">{{ parsedUser.activity || 'No disponible' }}</p>
            </div>

            <!-- Website -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Sitio web</h3>
                <p class="text-gray-700">{{ parsedUser.website || 'No disponible' }}</p>
            </div>

            <!-- Gallery -->
            <div class="mt-6">
                <h3 class="text-lg font-semibold">Galería</h3>
                <div class="grid grid-cols-3 gap-4 mt-2">
                    <img v-for="(image, index) in parsedUser.images" :key="index" :src="image.image_url"
                        alt="Gallery image" class="w-full h-52 object-cover rounded-lg cursor-pointer"
                        @click="openModal(image.image_url)" />
                </div>
            </div>
            <ImageModal :imageUrl="selectedImage" :visible="showImage" @update:visible="showImage = $event" />
        </div>

        <!-- Mensaje de carga si los datos no están disponibles -->
        <div v-else>
            <p>Loading user data...</p>
        </div>
    </LayoutPage>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";

import ImageModal from "@/components/ImageModal.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const parsedUser = user.value ? JSON.parse(user.value) : null;

const showImage = ref(false);
const selectedImage = ref("");

const openModal = (imageUrl) => {
    selectedImage.value = imageUrl;
    showImage.value = true;
};

</script>
