<template>
  <div>
    <NuxtErrorBoundary>
      <template #error="{ error }">
        <div class="p-8 text-slate-800 bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-sm">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-black text-slate-900">Ocurrió un error al cargar la vista</h1>
          <p class="mt-2 text-sm text-slate-600 max-w-md">{{ error.message }}</p>
          <div class="mt-6 flex items-center gap-3">
            <button @click="reloadApp" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer">
              Recargar Página
            </button>
            <NuxtLink to="/marketplace" class="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer">
              Volver al Feed
            </NuxtLink>
          </div>
        </div>
      </template>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </NuxtErrorBoundary>
    <PurchaseSuccessModal />
    <Toaster position="top-center" close-button :duration="4000" />
  </div>
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import PurchaseSuccessModal from '~/components/PurchaseSuccessModal.vue'

function reloadApp() {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
</script>
