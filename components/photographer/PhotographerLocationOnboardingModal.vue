<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="relative w-full max-w-md bg-[#12131a] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 text-white overflow-hidden animate-scale-up">
          <!-- Background Glow Effect -->
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#3ef4a1]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Close button -->
          <button
            @click="close"
            class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>

          <!-- Header Icon & Title -->
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-2xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/25 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#3ef4a1]/10">
              <Icon name="lucide:map-pin" class="w-7 h-7 text-[#3ef4a1]" />
            </div>
            <h3 class="text-xl font-black text-white">¡Bienvenido a Moments!</h3>
            <p class="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Configura tu ciudad y zona de cobertura para que clientes de tu región te encuentren en el buscador y puedan contactarte directamente.
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="saveLocation" class="space-y-4">
            <!-- Ciudad Base -->
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Icon name="lucide:building-2" class="w-3.5 h-3.5 text-[#3ef4a1]" />
                Ciudad Base / Residencia *
              </label>
              <input
                v-model="form.city"
                type="text"
                required
                placeholder="Ej: Cali, Medellín, Bogotá, Barranquilla..."
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:ring-1 focus:ring-[#3ef4a1]/60 transition-all font-medium"
              />
            </div>

            <!-- Zona de Cobertura -->
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Icon name="lucide:map" class="w-3.5 h-3.5 text-indigo-400" />
                Zona o Radio de Cobertura
              </label>
              <input
                v-model="form.coverageArea"
                type="text"
                placeholder="Ej: Valle del Cauca, Jamundí, Palmira, Todo el país..."
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-medium"
              />
              <p class="text-[11px] text-gray-500 mt-1">Aparecerás cuando los clientes busquen por estos términos.</p>
            </div>

            <!-- Phone / WhatsApp -->
            <div>
              <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Icon name="lucide:phone" class="w-3.5 h-3.5 text-emerald-400" />
                Teléfono de Contacto
              </label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Ej: +57 300 123 4567"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium"
              />
            </div>

            <!-- Action buttons -->
            <div class="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                :disabled="saving || !form.city?.trim()"
                class="w-full py-3 bg-[#3ef4a1] hover:bg-[#34d389] text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-[#3ef4a1]/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else name="lucide:check-circle-2" class="w-4 h-4" />
                <span>{{ saving ? 'Guardando...' : 'Guardar y Continuar' }}</span>
              </button>

              <button
                type="button"
                @click="close"
                class="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-200 transition-colors"
              >
                Completar más tarde
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()

const isOpen = ref(false)
const saving = ref(false)

const form = reactive({
  city: '',
  coverageArea: '',
  phone: ''
})

const checkNeedsOnboarding = () => {
  if (!authStore.isPhotographer || !authStore.isAuthenticated) {
    isOpen.value = false
    return
  }

  // If photographer doesn't have city configured, open modal
  const hasCity = authStore.user?.city && authStore.user.city.trim().length > 0
  const hasDismissed = sessionStorage.getItem('location_onboarding_dismissed')

  if (!hasCity && !hasDismissed) {
    form.city = authStore.user?.city || ''
    form.coverageArea = authStore.user?.coverageArea || ''
    form.phone = authStore.user?.phone || ''
    isOpen.value = true
  }
}

onMounted(() => {
  checkNeedsOnboarding()
})

watch(() => authStore.user, () => {
  checkNeedsOnboarding()
}, { deep: true })

const close = () => {
  isOpen.value = false
  sessionStorage.setItem('location_onboarding_dismissed', 'true')
}

const saveLocation = async () => {
  if (!form.city?.trim()) {
    toast.error('Campo requerido', 'Por favor ingresa tu ciudad base.')
    return
  }
  saving.value = true
  try {
    await authStore.updateLocation(
      form.city.trim(),
      form.coverageArea?.trim() || '',
      form.phone?.trim() || ''
    )

    toast.success('¡Ubicación configurada!', 'Ahora aparecerás en el buscador cuando los clientes busquen en tu zona.')
    isOpen.value = false
    sessionStorage.removeItem('location_onboarding_dismissed')
  } catch (e: any) {
    console.error('Error al guardar ubicación:', e)
    if (e.response?.status === 401 || e.status === 401) {
      toast.error('Sesión vencida', 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.')
      authStore.logout()
      navigateTo('/login')
      return
    }
    const errorMsg = e.response?._data?.message || e.data?.message || e.message || 'No se pudo guardar la ubicación. Inténtalo de nuevo.'
    toast.error('Error', errorMsg)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
