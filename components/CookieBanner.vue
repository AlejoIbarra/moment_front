<template>
  <Transition name="cookie-slide">
    <div 
      v-if="showBanner"
      class="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl bg-[#0d0f15]/95 backdrop-blur-xl border border-white/10 shadow-2xl text-white shadow-black/50 flex flex-col gap-3.5"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center flex-shrink-0">
            <Icon name="lucide:cookie" class="w-4 h-4" />
          </div>
          <h3 class="font-extrabold text-sm text-white tracking-tight">Privacidad y Cookies</h3>
        </div>
        <button 
          @click="acceptNecessary"
          class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          title="Cerrar"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <p class="text-xs text-gray-300 leading-relaxed">
        Utilizamos cookies esenciales para mantener tu sesión segura y cookies de análisis para mejorar la velocidad y calidad del servicio conforme a la <strong>Ley 1581 de 2012</strong> de Colombia.
      </p>

      <div class="flex items-center gap-2 text-[11px] text-gray-400">
        <NuxtLink to="/cookies" class="text-[#3ef4a1] hover:underline font-semibold">Política de Cookies</NuxtLink>
        <span>•</span>
        <NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacidad</NuxtLink>
        <span>•</span>
        <NuxtLink to="/refunds" class="hover:text-white transition-colors">Reembolsos</NuxtLink>
      </div>

      <div class="flex items-center gap-2 pt-1">
        <button 
          @click="acceptNecessary"
          class="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-gray-200 transition-all text-center"
        >
          Solo Necesarias
        </button>
        <button 
          @click="acceptAll"
          class="flex-1 py-2 px-3 rounded-xl bg-[#3ef4a1] hover:bg-[#3ef4a1]/90 text-slate-950 text-xs font-black transition-all shadow-md shadow-[#3ef4a1]/20 text-center active:scale-95"
        >
          Aceptar Todas
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(false)

onMounted(() => {
  // Check if consent has already been given
  const consent = localStorage.getItem('moments_cookie_consent')
  if (!consent) {
    // Show banner after brief delay for smooth entrance
    setTimeout(() => {
      showBanner.value = true
    }, 1200)
  }
})

function acceptAll() {
  localStorage.setItem('moments_cookie_consent', JSON.stringify({
    necessary: true,
    analytics: true,
    preferences: true,
    timestamp: new Date().toISOString()
  }))
  showBanner.value = false
}

function acceptNecessary() {
  localStorage.setItem('moments_cookie_consent', JSON.stringify({
    necessary: true,
    analytics: false,
    preferences: false,
    timestamp: new Date().toISOString()
  }))
  showBanner.value = false
}
</script>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
</style>
