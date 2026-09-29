<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 py-12 relative overflow-hidden font-sans">
    <!-- Ambient Background Glows -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-lg w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-slate-700/60 relative z-10 animate-fade-in">
      
      <!-- Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 rounded-t-3xl"></div>

      <!-- Icon -->
      <div class="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div class="w-20 h-20 bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/10">
          <Icon name="lucide:clock" class="w-10 h-10 text-sky-400 animate-pulse" />
        </div>
      </div>

      <!-- Pill Tag -->
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
        <span>Transacción en Proceso</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
        Tu pago está siendo verificado
      </h1>
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
        Si pagaste por PSE, transferencia o corresponsal bancario, la acreditación puede tomar unos momentos. En cuanto sea confirmado, tus fotos se activarán automáticamente.
      </p>

      <!-- Details Card -->
      <div v-if="reference" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6 text-left text-xs text-gray-400 space-y-2">
        <div class="flex items-center justify-between">
          <span>Referencia:</span>
          <span class="font-mono text-gray-200 font-semibold truncate max-w-[200px]">{{ reference }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Estado:</span>
          <span class="text-sky-400 font-semibold">Pendiente de Acreditación</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <NuxtLink 
          to="/dashboard/customer"
          class="w-full py-4 px-6 bg-gradient-to-r from-sky-500 via-indigo-600 to-violet-600 hover:from-sky-400 hover:to-violet-500 text-white font-extrabold rounded-2xl transition-all duration-200 shadow-xl shadow-sky-600/25 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
        >
          <Icon name="lucide:shopping-bag" class="w-5 h-5" />
          <span>Ver Mis Fotos Compradas</span>
        </NuxtLink>

        <NuxtLink 
          to="/marketplace"
          class="w-full py-3.5 px-6 bg-slate-800/80 text-slate-200 font-bold rounded-2xl border border-slate-700/80 hover:bg-slate-700/80 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          <Icon name="lucide:compass" class="w-4 h-4" />
          <span>Volver al Marketplace</span>
        </NuxtLink>

        <NuxtLink 
          to="/"
          class="block text-xs text-slate-400 hover:text-white transition-colors pt-2"
        >
          ← Volver al Inicio de Moments
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const reference = computed(() => {
  return String(route.query.ref || route.query.external_reference || '')
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
