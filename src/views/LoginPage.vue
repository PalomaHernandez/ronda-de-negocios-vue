<template>
	<LayoutPage>
	  <template #default>
		<!-- Encabezado "Log in" -->
		<h1 class="text-2xl font-bold text-center mb-4">Iniciar sesión</h1>
  
		<!-- Mensajes de estado -->
		<div v-if="success" class="alert alert-success" @click="authStore.clearMessages()">{{ success }}</div>
		<div v-if="error" class="alert alert-danger" @click="authStore.clearMessages()">{{ error }}</div>
		<div v-if="info" class="alert alert-info" @click="authStore.clearMessages()">{{ info }}</div>
  
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
		  <RouterLink :to="{ name: 'register' }" class="font-medium text-sky-700">
			No tenés cuenta? Registrate haciendo click acá.
		  </RouterLink>
		</form>
	  </template>
	</LayoutPage>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { RouterLink } from 'vue-router'
  import LabeledObject from '@/components/LabeledObject.vue'
  import LayoutPage from '@/Layout.vue'
  
  // Estado y store
  const authStore = useAuthStore()
  const credentials = ref({
	email: '',
	password: '',
  })
  
  // Métodos
  const login = () => {
	const form = document.querySelector("form")
	if (!form.checkValidity()) {
	  form.reportValidity()
	} else {
	  authStore.login(credentials.value)
	}
  }
  
  // Computed properties
  const success = authStore.success
  const error = authStore.error
  const info = authStore.info
  </script>
  