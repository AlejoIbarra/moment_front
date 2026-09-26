<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-[#009ee3]/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3ef4a1]/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10 text-center">
      
      <!-- Processing State -->
      <div v-if="loading" class="py-8 space-y-6">
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-4 border-[#009ee3]/20 animate-ping"></div>
          <div class="w-16 h-16 rounded-full border-4 border-[#009ee3] border-t-transparent animate-spin"></div>
          <Icon name="lucide:handshake" class="w-8 h-8 text-[#009ee3] absolute" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-white tracking-tight">Vinculando tu cuenta...</h2>
          <p class="text-sm text-slate-400">
            Estamos comunicándonos con Mercado Pago para activar los pagos divididos instantáneos en tu perfil de fotógrafo.
          </p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="py-6 space-y-6">
        <div class="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Icon name="lucide:check-circle-2" class="w-10 h-10 animate-bounce" />
        </div>
        <div class="space-y-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#009ee3]/10 text-[#009ee3] border border-[#009ee3]/20">
            <Icon name="lucide:zap" class="w-3.5 h-3.5" /> Split Automático Activado
          </span>
          <h2 class="text-2xl font-black text-white">¡Conexión Exitosa!</h2>
          <p class="text-sm text-slate-300 leading-relaxed">
            Tu cuenta de <strong>Mercado Pago</strong> ha sido vinculada correctamente. A partir de ahora, cada vez que un cliente compre tus fotos, tus ganancias ($42.500 COP de cada $50.000 COP) se transferirán de inmediato a tu Mercado Pago.
          </p>
        </div>

        <div class="pt-4">
          <NuxtLink 
            to="/dashboard/photographer/settings"
            class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-[#009ee3] text-white font-bold hover:bg-[#0089c7] transition-all shadow-lg shadow-[#009ee3]/20"
          >
            <span>Volver a Configuración</span>
            <Icon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="py-6 space-y-6">
        <div class="w-20 h-20 mx-auto rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-400">
          <Icon name="lucide:alert-circle" class="w-10 h-10" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-white">No pudimos conectar tu cuenta</h2>
          <p class="text-sm text-rose-300/90 leading-relaxed">
            {{ errorMessage || 'Ocurrió un error al procesar la autorización con Mercado Pago.' }}
          </p>
        </div>

        <div class="pt-4 space-y-3">
          <NuxtLink 
            to="/dashboard/photographer/settings"
            class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 transition-all border border-slate-700"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            <span>Regresar a Configuración</span>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { $api } = useNuxtApp()
const toast = useToast()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')

definePageMeta({
  layout: false
})

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state
  const error = route.query.error
  const errorDescription = route.query.error_description

  if (error) {
    loading.value = false
    errorMessage.value = errorDescription || error || 'La autorización fue denegada o cancelada en Mercado Pago.'
    return
  }

  if (!code) {
    loading.value = false
    errorMessage.value = 'No se recibió el código de autorización de Mercado Pago.'
    return
  }

  try {
    const res = await $api('/mercadopago/callback', {
      method: 'POST',
      body: {
        code: String(code),
        state: state ? String(state) : undefined
      }
    })

    if (res && res.success) {
      success.value = true
      toast.success('Mercado Pago conectado', 'Tu cuenta de Mercado Pago Marketplace está lista para recibir pagos divididos al instante.')
      
      // Auto redirect after 2.5s
      setTimeout(() => {
        router.push('/dashboard/photographer/settings?mp=connected')
      }, 2500)
    } else {
      errorMessage.value = res?.error || 'No se pudo vincular la cuenta.'
    }
  } catch (err) {
    console.error('Error connecting Mercado Pago:', err)
    errorMessage.value = err.response?._data?.error || err.message || 'Error de comunicación con el servidor.'
  } finally {
    loading.value = false
  }
})
</script>
