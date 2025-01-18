<template>
  <Layout>
    <template #title>Registrarse en Ronda de Negocios</template>
    <template #status>
      <div v-if="success" class="alert alert-success" @click="authStore.clearMessages()">{{ success }}</div>
      <div v-if="error" class="alert alert-danger" @click="authStore.clearMessages()">{{ error }}</div>
      <div v-if="info" class="alert alert-info" @click="authStore.clearMessages()">{{ info }}</div>
    </template>
    <template #tools></template>
    <form class="flex flex-col gap-3 p-4" ref="form" @submit.prevent="register">
      <LabeledObject>
        <template #label>Nombre de la empresa/entidad</template>
        <input type="text" v-model="account.name" required>
      </LabeledObject>
      <LabeledObject>
        <template #label>Actividad/Sector</template>
        <input type="text" v-model="account.activity" required>
      </LabeledObject>
      <LabeledObject>
        <template #label>Ubicación</template>
        <input type="text" v-model="account.location" required>
      </LabeledObject>
      <LabeledObject>
        <template #label>Sitio web</template>
        <input type="url" v-model="account.website" required>
      </LabeledObject>
      <LabeledObject>
        <template #label>Email</template>
        <input type="email" v-model="account.email" required>
      </LabeledObject>
      <LabeledObject>
        <template #label>Contraseña</template>
        <input type="password" v-model="account.password" required>
      </LabeledObject>
      <LabeledObject>
        <template #label>Confirmación de contraseña</template>
        <input type="password" id="password_confirmation" name="password_confirmation"
          v-model="account.password_confirmation" required>
      </LabeledObject>
      <!-- Logo Uploader -->
      <LabeledObject>
        <template #label>Logo</template> 
        <ImageUploader type="logo" @updateFiles="updateLogo" />
      </LabeledObject>

      <!-- Gallery Uploader -->
      <LabeledObject>
        <template #label>Imágenes de servicios/productos</template> 
        <ImageUploader type="gallery" @updateFiles="updateGallery" />
      </LabeledObject>
      <button type="submit" class="btn btn-primary">
        <i class="fa-solid fa-key"></i>
        Crear cuenta
      </button>
    </form>
  </Layout>
</template>

<script lang="js">
import { ref } from "vue";
import router from "@/router";
import Layout from "@/Layout.vue";
import { useAuthStore } from "@/stores/auth";
import LabeledObject from "@/components/LabeledObject.vue";
import ImageUploader from "@/components/ImageUploader.vue";

export default {
  name: "RegisterPage",
  components: {
    Layout,
    LabeledObject,
    ImageUploader,
  },
  computed: {
    success() {
      return this.authStore.success;
    },
    error() {
      return this.authStore.error;
    },
    info() {
      return this.authStore.info;
    },
    isAuthenticated() {
      return this.authStore.authenticated;
    },
    registering() {
      return this.authStore.registering;
    },
  },
  setup() {
    const logo = ref(null); 
    const gallery = ref([]); 
    const authStore = useAuthStore();
    const account = ref({
      id: 0,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      activity: "",
      location: "",
      website: "",
    });

    const updateLogo = (files) => {
      logo.value = files[0] || null;
    };

    const updateGallery = (files) => {
      gallery.value = files; 
    };

    return {
      logo,
      gallery,
      updateLogo,
      updateGallery,
      account,
      authStore,
    };
  },
  methods: {
    async register() {
      if (this.$refs && this.$refs.form) {
        const form = this.$refs.form;
        const formData = new FormData();

        formData.append("name", this.account.name);
        formData.append("activity", this.account.activity);
        formData.append("location", this.account.location);
        formData.append("website", this.account.website);
        formData.append("email", this.account.email);
        formData.append("password", this.account.password);
        formData.append("password_confirmation", this.account.password_confirmation);

        if (this.logo && this.logo !== null) {
          formData.append("logo", this.logo);
        }

        if (this.gallery && this.gallery.length > 0) {
          this.gallery.forEach((file) => {
            formData.append("gallery[]", file);
          });
        }
        if (!form.checkValidity()) {
          form.reportValidity();
        } else {
          try {
            await this.authStore.register(formData);
          } catch (error) {
            this.authStore.showError("Algo salió mal, por favor intenta de nuevo.");
          }
        }
      }
    },
    mounted(){/*
      if(this.isAuthenticated){
        router.push({name: 'LandingPage'})
      }*/
	  }
  },
};
</script>
