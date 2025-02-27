<template>
	<LayoutPage>
	  <template #default>
		<!-- Encabezado "Log in" -->
		<h1 class="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
		<div v-if="error" class="alert alert-danger" @click="authStore.clearMessages()">{{ error }}</div>
		<div v-if="auth_info" class="alert alert-info" @click="authStore.clearMessages()">{{ auth_info }}</div>
  
		<!-- Formulario de login -->
		<form class="flex flex-col gap-3 p-4" ref="form" @submit.prevent="login">
		  <LabeledObject>
			<template #label>Email</template>
			<input type="email" v-model="credentials.email" required>
		  </LabeledObject>
		  <LabeledObject>
			<template #label>Contraseña</template>
			<input type="password" v-model="credentials.password" required>
		  </LabeledObject>
		  <button type="submit" class="btn">
			Iniciar sesión
		  </button>
		  <RouterLink v-if="inscriptionStatus" :to="{ name: 'register' }" class="font-medium text-sky-700">
			No tenés cuenta? Registrate haciendo click acá.
		  </RouterLink>
		</form>
	  </template>
	</LayoutPage>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useEventStore } from '@/stores/event'
  import { RouterLink } from 'vue-router'
  import LabeledObject from '@/components/LabeledObject.vue'
  import LayoutPage from '@/Layout.vue'
  import { useRoute } from 'vue-router'
  
  // Estado y store
  const authStore = useAuthStore()
  const eventStore = useEventStore()
  const { error, auth_info } = storeToRefs(authStore);
  const credentials = ref({
	email: '',
	password: '',
  })

  const route = useRoute();

  const inscriptionStatus = computed(() => eventStore.evento.status === "Inscripcion");
  
  // Métodos
  const login = () => {
	const form = document.querySelector("form")
	if (!form.checkValidity()) {
	  form.reportValidity()
	} else {
	  authStore.login(credentials.value, route.params.slug)
	}
  }
  
  </script>
  