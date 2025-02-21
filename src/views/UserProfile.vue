<template>
    <LayoutPage>
        <div v-if="user" class="p-6">
            <div v-if="success" class="alert alert-success" @click="authStore.clearMessages()">{{ success }}</div>
            <div v-if="error" class="alert alert-danger" @click="authStore.clearMessages()">{{ error }}</div>
            <RouterLink :to="{ name: 'edit-profile' }" class="btn bg-blue-500 absolute top-2 right-2 mb-5">
                <i class="fa-solid fa-user-edit"></i>
                Editar perfil
            </RouterLink>

            <div class="flex items-center space-x-4">
                <!-- Logo -->
                 <div class="w-16 h-16 flex items-center justify-center">
                    <img v-if="user.logo_url" :src="user.logo_url" alt="User Logo" class="rounded-full" />
                    <i v-else class="fa-solid fa-circle-user text-gray-400 text-6xl"></i>
                 </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ user.name }}</h2>
                    <p class="text-gray-600">{{ user.email }}</p>
                </div>
            </div>
            <!-- Ubicacion -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Ubicación</h3>
                <p class="text-gray-500">{{ user.location || 'No disponible' }}</p>
            </div>
            <!-- Activity -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Actividad</h3>
                <p class="text-gray-700">{{ user.activity || 'No disponible' }}</p>
            </div>

            <!-- Website -->
            <div class="mt-4">
                <h3 class="text-lg font-semibold">Sitio web</h3>
                <p class="text-gray-700">{{ user.website || 'No disponible' }}</p>
            </div>

            <div class="mt-6 p-4 bg-gray-100 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-2 text-gray-700">Tus intereses y ofertas en este evento
                </h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h4 class="text-md font-semibold text-gray-600">Intereses</h4>
                        <p class="text-gray-700">{{ registration.interests || 'No disponible' }}</p>
                    </div>
                    <div>
                        <h4 class="text-md font-semibold text-gray-600">Productos/Servicios</h4>
                        <p class="text-gray-700">{{ registration.products_services || 'No disponible' }}</p>
                    </div>
                </div>
            </div>

            <!-- Gallery -->
            <div v-if="user.images.length > 0" class="mt-6">
                <h3 class="text-lg font-semibold">Galería</h3>
                <div class="grid grid-cols-3 gap-4 mt-2">
                    <img v-for="(image, index) in user.images" :key="index" :src="image.url" alt="Gallery image"
                        class="w-full h-52 object-cover rounded-lg cursor-pointer transition transform hover:scale-105"
                        @click="openModal(image.url)" />
                </div>
            </div>
        </div>

        <!-- Mensaje de carga si los datos no están disponibles -->
        <Loading v-else />
    </LayoutPage>
    <ImageModal :imageUrl="selectedImage" :visible="showImage" @update:visible="showImage = $event" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import LayoutPage from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";

import ImageModal from "@/components/ImageModal.vue";
import Loading from "@/components/Loading.vue";


const authStore = useAuthStore();
const { user, success, error, registration } = storeToRefs(authStore);

const showImage = ref(false);
const selectedImage = ref("");

const openModal = (imageUrl) => {
    selectedImage.value = imageUrl;
    showImage.value = true;
};

</script>
