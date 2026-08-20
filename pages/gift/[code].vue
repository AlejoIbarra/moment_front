<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
      <!-- Loading State -->
      <div v-if="loading" class="p-12 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500 font-medium">Buscando tarjeta de regalo...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-12 text-center">
        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="lucide:x-circle" class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-2">Código Inválido</h2>
        <p class="text-gray-500 mb-8">{{ error }}</p>
        <button @click="router.push('/')" class="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl w-full transition-all active:scale-95">
          Ir al Inicio
        </button>
      </div>

      <!-- Gift Card Details -->
      <div v-else class="relative">
        <!-- Card Header -->
        <div class="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <Icon name="lucide:gift" class="w-16 h-16 text-[#3ef4a1] mx-auto mb-4 animate-bounce-slight relative z-10" />
          <h1 class="text-4xl font-black text-white mb-1 relative z-10">${{ Number(giftCard.amount).toLocaleString('es-CO') }}</h1>
          <p class="text-indigo-200 font-medium relative z-10 uppercase tracking-widest text-xs mb-3">Bono Disponible</p>
          <div class="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 relative z-10">
            <p class="text-white font-mono font-bold tracking-widest text-sm">{{ giftCard.code }}</p>
          </div>
        </div>
        
        <!-- Card Body -->
        <div class="p-8">
          <div class="flex items-center justify-center gap-3 mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0">
              <img v-if="giftCard.photographer?.profilePhotoUrl" :src="giftCard.photographer.profilePhotoUrl" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:camera" class="w-5 h-5 text-gray-400 mx-auto mt-2.5" />
            </div>
            <div class="text-left">
              <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Regalo de</p>
              <p class="font-bold text-gray-900">{{ giftCard.photographer?.username || 'Fotógrafo' }}</p>
            </div>
          </div>

          <p class="text-center text-gray-600 text-sm mb-8">
            Puedes usar este saldo para comprar las fotos de tus eventos favoritos en Moment.
          </p>

          <button @click="claimGiftCard" :disabled="claiming || !giftCard.active" class="w-full py-4 bg-[#3ef4a1] hover:bg-[#3ef4a1]/90 text-slate-900 font-black rounded-xl text-lg shadow-xl shadow-[#3ef4a1]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
            <Icon v-if="claiming" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <Icon v-else-if="!giftCard.active" name="lucide:x-circle" class="w-5 h-5" />
            <Icon v-else name="lucide:check-circle" class="w-5 h-5" />
            {{ claiming ? 'Guardando...' : (!giftCard.active ? 'Tarjeta inactiva o ya redimida' : 'Añadir a mi cuenta') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const code = route.params.code
const loading = ref(true)
const giftCard = ref(null)
const error = ref('')
const claiming = ref(false)

onMounted(async () => {
  if (!code) {
    error.value = 'No se proporcionó ningún código de regalo.'
    loading.value = false
    return
  }

  try {
    const response = await $api(`/giftcards/check/${code}`)
    giftCard.value = response
  } catch (e) {
    error.value = e.message || 'La tarjeta de regalo no existe, ha expirado o ya fue reclamada.'
  } finally {
    loading.value = false
  }
})

async function claimGiftCard() {
  claiming.value = true
  
  cartStore.giftCardCode = code
  toast.success('¡Tarjeta añadida!', `Tienes un saldo de $${Number(giftCard.value.amount).toLocaleString('es-CO')} disponible en tu carrito.`)
  
  setTimeout(() => {
    if (giftCard.value.photographer?.username) {
      router.push(`/profile/${giftCard.value.photographer.username}`)
    } else {
      router.push('/')
    }
  }, 1500)
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-bounce-slight {
  animation: bounceSlight 3s ease-in-out infinite;
}

@keyframes bounceSlight {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
