<template>
	<div :class="classes">
	  <p class="text-base font-medium text-neutral-600" :class="{ 'required': required }">
		<slot name="label"/>
	  </p>
	  <slot/>
	</div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
	full: Boolean,
	required: Boolean,
  });
  
  // Calcula las clases dinámicamente
  const classes = computed(() => 
	props.full ? 'flex-grow flex flex-col items-stretch gap-1' : 'flex-grow flex flex-col gap-1'
  );
  </script>