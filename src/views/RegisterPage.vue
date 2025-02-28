<template>
  <LayoutPage>
    <template #default>
      <Loading v-if="loading" />
      <div v-else>
        <div v-if="success" class="alert alert-success" @click="authStore.clearMessages()">{{ success }}</div>
        <div v-if="error" class="alert alert-danger" @click="authStore.clearMessages()">{{ error }}</div>
        <div v-if="auth_info" class="alert alert-info" @click="authStore.clearMessages()">{{ auth_info }}</div>
        <h1 class="event-title text-center mb-4">Creación de cuenta </h1>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4" ref="form" @submit.prevent="register">
          <div class="flex flex-col gap-3">
            <LabeledObject required>
              <template #label>Nombre de la empresa/entidad</template>
              <input type="text" v-model="account.name" required>
            </LabeledObject>

            <LabeledObject required>
              <template #label>Email</template>
              <input type="email" v-model="account.email" required>
            </LabeledObject>
            <LabeledObject required>
              <template #label>Contraseña</template>
              <input type="password" v-model="account.password" required>
            </LabeledObject>
            <LabeledObject required>
              <template #label>Confirmación de contraseña</template>
              <input type="password" v-model="account.password_confirmation" required>
            </LabeledObject>
            <LabeledObject>
              <template #label>Sitio web</template>
              <input type="url" v-model="account.website" placeholder="https://">
            </LabeledObject>
          </div>

          <div class="flex flex-col gap-3">
            <LabeledObject required>
              <template #label>Actividad/Sector</template>
              <input type="text" v-model="account.activity" required>
            </LabeledObject>
            <LabeledObject required>
              <template #label>Ubicación</template>
              <input type="text" v-model="account.location" required>
            </LabeledObject>
            <LabeledObject>
              <template #label>Logo</template>
              <ImageUploader type="logo" @updateFiles="updateLogo" />
            </LabeledObject>
            <LabeledObject>
              <template #label>Imágenes de servicios/productos</template>
              <ImageUploader type="gallery" @updateFiles="updateGallery" />
            </LabeledObject>
          </div>
          <p class="text-sm font-medium text-neutral-600">Los campos marcados con * son obligatorios.</p>
          <div class="col-span-1 md:col-span-2 flex justify-center">
            <button type="submit" class="btn w-full max-w-2xl py-3 text-lg">
              <i class="fa-solid fa-key"></i> Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </template>
  </LayoutPage>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import LabeledObject from "@/components/LabeledObject.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import LayoutPage from "@/Layout.vue";
import { storeToRefs } from "pinia";
import Loading from "@/components/Loading.vue";

const authStore = useAuthStore();
const { success, error, auth_info, loading } = storeToRefs(authStore);

const account = ref({
  name: "",
  activity: "",
  location: "",
  website: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const logo = ref(null);
const gallery = ref([]);

const updateLogo = (files) => {
  logo.value = files[0] || null;
};

const updateGallery = (files) => {
  gallery.value = files;
};

const register = async () => {
  const form = document.querySelector("form");
  if (!form.checkValidity()) {
    form.reportValidity();
  } else {
    const formData = new FormData();
    Object.keys(account.value).forEach((key) => {
      formData.append(key, account.value[key]);
    });

    if (logo.value) {
      formData.append("logo", logo.value);
    }

    if (gallery.value && gallery.value.length > 0) {
      gallery.value.forEach((file) => {
        formData.append("gallery[]", file);
      });
    }

    try {
      await authStore.register(formData);
    } catch (error) {
      authStore.showError("Algo salió mal, por favor intenta de nuevo.");
    }
  }
};

</script>
