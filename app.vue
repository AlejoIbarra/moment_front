<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-center" rich-colors close-button expand />
  </div>
</template>

<script setup>
import { Toaster } from 'vue-sonner'
</script>
