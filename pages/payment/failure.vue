<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 py-12 relative overflow-hidden font-sans">
    <!-- Ambient Background Glows -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-[350px] h-[350px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-lg w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-slate-700/60 relative z-10 animate-fade-in">
      
      <!-- Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 rounded-t-3xl"></div>

      <!-- Icon -->
      <div class="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div class="w-20 h-20 bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Icon name="lucide:alert-circle" class="w-10 h-10 text-amber-400" />
        </div>
      </div>

      <!-- Pill Tag -->
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
        <span>Transacción No Completada</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
        El proceso de pago fue cancelado
      </h1>
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
        No te preocupes: <strong>no se ha realizado ningún cobro</strong> a tu tarjeta ni cuenta bancaria. Tus artículos siguen a salvo.
      </p>

      <!-- Details Card -->
      <div v-if="reference" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6 text-left text-xs text-gray-400 space-y-2">
        <div class="flex items-center justify-between">
          <span>Referencia de orden:</span>
          <span class="font-mono text-gray-200 font-semibold truncate max-w-[200px]">{{ reference }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Estado reportado:</span>
          <span class="text-amber-400 font-medium capitalize">{{ paymentStatus || 'Cancelado por el usuario' }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <!-- Re-attempt Button -->
        <button 
          @click="retryCheckout"
          class="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-extrabold rounded-2xl transition-all duration-200 shadow-xl shadow-indigo-600/25 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
        >
          <Icon name="lucide:refresh-cw" class="w-5 h-5" />
          <span>{{ retryButtonText }}</span>
        </button>

        <!-- Marketplace / Gallery -->
        <NuxtLink 
          to="/marketplace"
          class="w-full py-3.5 px-6 bg-slate-800/80 text-slate-200 font-bold rounded-2xl border border-slate-700/80 hover:bg-slate-700/80 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          <Icon name="lucide:compass" class="w-4 h-4" />
          <span>Explorar el Marketplace</span>
        </NuxtLink>

        <!-- Home -->
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
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const reference = computed(() => {
  return String(route.query.ref || route.query.external_reference || '')
})

const paymentStatus = computed(() => {
  const status = route.query.status || route.query.collection_status
  if (status && status !== 'null') {
    return String(status)
  }
  return null
})

const isCart = computed(() => reference.value.startsWith('CART-'))
const isSubscription = computed(() => reference.value.startsWith('SUB-'))
const isPackage = computed(() => reference.value.startsWith('PKG-'))

const retryButtonText = computed(() => {
  if (isCart.value) return 'Volver al Carrito y Reintentar'
  if (isSubscription.value) return 'Reintentar Suscripción PRO'
  if (isPackage.value) return 'Reintentar Compra de Paquete'
  return 'Reintentar Pago'
})

function retryCheckout() {
  if (isCart.value) {
    cartStore.showCart = true
    router.push('/marketplace')
    return
  }
  if (isSubscription.value) {
    router.push('/subscription')
    return
  }
  router.push('/marketplace')
}
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
