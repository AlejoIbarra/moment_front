<template>
  <div>
    <NuxtErrorBoundary>
      <template #error="{ error }">
        <div class="p-8 text-red-500 bg-white min-h-screen">
          <h1 class="text-3xl font-bold">Error Fatal!</h1>
          <p class="mt-4 font-mono whitespace-pre-wrap">{{ error.message }}</p>
          <pre class="mt-2 text-sm text-gray-800">{{ error.stack }}</pre>
        </div>
      </template>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </NuxtErrorBoundary>
    <Toaster position="top-center" rich-colors close-button expand />
  </div>
</template>

<script setup>
import { Toaster } from 'vue-sonner'
</script>
