<template>
    <div>
      <h1>Test API Connection</h1>
      <button @click="fetchMessage" :disabled="loading">Test Connection</button>
  
      <p v-if="loading">Loading...</p>
      <p v-else-if="message">{{ message }}</p>
      <p v-else-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup lang="js">
  import { useTestStore } from '@/stores/test';
  
  const testStore = useTestStore();
  
  const fetchMessage = () => {
    testStore.fetchMessage();
  };

  
  const message = testStore.message;
  const loading = testStore.loading;
  const error = testStore.error;
  </script>
  
  <style>
  .error {
    color: red;
  }
  </style>
  