<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="relative w-full max-w-lg bg-[#12131a] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-7 text-white overflow-hidden animate-scale-up">
          <!-- Background Glow Effect -->
          <div class="absolute -top-24 -right-24 w-52 h-52 bg-[#3ef4a1]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Close button -->
          <button
            @click="close"
            type="button"
            class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>

          <!-- Header Icon & Title -->
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-2xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/25 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#3ef4a1]/10">
              <Icon name="lucide:map-pin" class="w-7 h-7 text-[#3ef4a1]" />
            </div>
            <h3 class="text-xl font-black text-white">¡Bienvenido a Moments!</h3>
            <p class="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-md mx-auto">
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
                placeholder="Ej: Pasto, Cali, Medellín, Bogotá..."
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:ring-1 focus:ring-[#3ef4a1]/60 transition-all font-medium"
              />
            </div>

            <!-- Zona de Cobertura con Múltiples Municipios -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="lucide:map" class="w-3.5 h-3.5 text-indigo-400" />
                  Zona o Radio de Cobertura
                </label>
                <span class="text-[10px] text-gray-400 font-medium">
                  {{ coverageMunicipalities.length }} municipio(s) agregado(s)
                </span>
              </div>

              <!-- Chips / Tags de Municipios -->
              <div v-if="coverageMunicipalities.length > 0" class="flex flex-wrap gap-1.5 mb-2.5 max-h-32 overflow-y-auto p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                <span
                  v-for="(mun, idx) in coverageMunicipalities"
                  :key="idx"
                  class="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <Icon name="lucide:map-pin" class="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span>{{ mun }}</span>
                  <button
                    type="button"
                    @click="removeMunicipality(idx)"
                    class="p-0.5 hover:bg-white/20 text-indigo-300 hover:text-white rounded-md transition-colors cursor-pointer"
                    title="Eliminar municipio"
                  >
                    <Icon name="lucide:x" class="w-3 h-3" />
                  </button>
                </span>
              </div>

              <!-- Input para agregar municipios con Enter -->
              <div class="relative">
                <input
                  ref="municipalityInputRef"
                  v-model="newMunicipalityInput"
                  type="text"
                  @keydown.enter.prevent="addMunicipality"
                  @keydown.comma.prevent="addMunicipality"
                  @paste="handlePaste"
                  placeholder="Escribe un municipio y presiona Enter..."
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-medium pr-20"
                />
                <button
                  type="button"
                  v-if="newMunicipalityInput.trim()"
                  @click="addMunicipality"
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Icon name="lucide:plus" class="w-3 h-3" />
                  <span>Agregar</span>
                </button>
              </div>

              <div class="flex items-center justify-between gap-2 mt-1.5">
                <p class="text-[11px] text-gray-400 flex items-center gap-1">
                  <Icon name="lucide:corner-down-left" class="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span>Presiona <strong class="text-white">Enter</strong> o <strong class="text-white">coma</strong> para agregar cada municipio.</span>
                </p>

                <!-- Shortcut para agregar ciudad base si no está -->
                <button
                  v-if="form.city?.trim() && !coverageMunicipalities.some(m => m.toLowerCase() === form.city.trim().toLowerCase())"
                  type="button"
                  @click="addCityToCoverage"
                  class="text-[11px] text-[#3ef4a1] hover:underline font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  <Icon name="lucide:plus-circle" class="w-3 h-3" />
                  <span>+ Agregar {{ form.city.trim() }}</span>
                </button>
              </div>
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
                placeholder="Ej: +573138066800"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium"
              />
            </div>

            <!-- Action buttons -->
            <div class="pt-3 flex flex-col gap-2.5">
              <button
                type="submit"
                :disabled="saving || !form.city?.trim()"
                class="w-full py-3 bg-[#3ef4a1] hover:bg-[#34d389] text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-[#3ef4a1]/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else name="lucide:check-circle-2" class="w-4 h-4" />
                <span>{{ saving ? 'Guardando ubicación...' : 'Guardar y Continuar' }}</span>
              </button>

              <button
                type="button"
                @click="close"
                class="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
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
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()
const config = useRuntimeConfig()

const isOpen = ref(false)
const saving = ref(false)
const newMunicipalityInput = ref('')
const municipalityInputRef = ref(null)
const coverageMunicipalities = ref([])

const form = reactive({
  city: '',
  coverageArea: '',
  phone: ''
})

// Extrae municipios separados por coma en array
const parseMunicipalities = (text) => {
  if (!text) return []
  return text
    .split(/[,;\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

// Agrega un municipio desde el input
const addMunicipality = () => {
  const val = newMunicipalityInput.value.trim()
  if (!val) return

  // Permitir ingresar varios pegados o separados por coma
  const parts = parseMunicipalities(val)
  for (const part of parts) {
    if (!coverageMunicipalities.value.some(m => m.toLowerCase() === part.toLowerCase())) {
      coverageMunicipalities.value.push(part)
    }
  }

  newMunicipalityInput.value = ''
}

// Remover municipio
const removeMunicipality = (index) => {
  coverageMunicipalities.value.splice(index, 1)
}

// Agregar la ciudad base seleccionada
const addCityToCoverage = () => {
  const c = form.city?.trim()
  if (c && !coverageMunicipalities.value.some(m => m.toLowerCase() === c.toLowerCase())) {
    coverageMunicipalities.value.push(c)
  }
}

// Manejar pegado de texto con múltiples municipios
const handlePaste = (e) => {
  const text = e.clipboardData?.getData('text')
  if (text && (text.includes(',') || text.includes('\n') || text.includes(';'))) {
    e.preventDefault()
    const parts = parseMunicipalities(text)
    for (const part of parts) {
      if (!coverageMunicipalities.value.some(m => m.toLowerCase() === part.toLowerCase())) {
        coverageMunicipalities.value.push(part)
      }
    }
  }
}

const checkNeedsOnboarding = () => {
  if (!authStore.isPhotographer || !authStore.isAuthenticated) {
    isOpen.value = false
    return
  }

  // Si ya tiene ciudad configurada en su perfil
  const hasCity = authStore.user?.city && authStore.user.city.trim().length > 0
  const isCompleted = typeof window !== 'undefined' && localStorage.getItem('location_onboarding_completed') === 'true'
  const isDismissed = typeof window !== 'undefined' && sessionStorage.getItem('location_onboarding_dismissed') === 'true'

  if (!hasCity && !isCompleted && !isDismissed) {
    form.city = authStore.user?.city || ''
    form.phone = authStore.user?.phone || ''
    
    // Cargar municipios existentes
    const existingCoverage = authStore.user?.coverageArea || ''
    coverageMunicipalities.value = parseMunicipalities(existingCoverage)

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
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('location_onboarding_dismissed', 'true')
  }
}

const saveLocation = async () => {
  if (!form.city?.trim()) {
    toast.error('Campo requerido', 'Por favor ingresa tu ciudad base.')
    return
  }

  // Si hay algo pendiente por agregar en el input de municipios, agregarlo automáticamente
  if (newMunicipalityInput.value.trim()) {
    addMunicipality()
  }

  // Si la lista de municipios está vacía pero el usuario colocó una ciudad base, sugerir incluirla
  if (coverageMunicipalities.value.length === 0 && form.city.trim()) {
    coverageMunicipalities.value.push(form.city.trim())
  }

  const finalCoverage = coverageMunicipalities.value.join(', ')
  saving.value = true

  try {
    const cityVal = form.city.trim()
    const phoneVal = form.phone?.trim() || ''

    // 1. Intentar actualizar a través de authStore
    let updated = null
    if (typeof authStore.updateLocation === 'function') {
      updated = await authStore.updateLocation(cityVal, finalCoverage, phoneVal)
    } else {
      // Fallback directo con $fetch para máxima confiabilidad
      const activeToken = authStore.token || (process.client ? localStorage.getItem('token') : null)
      updated = await $fetch(`${config.public.apiBase}/users/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
        },
        body: {
          city: cityVal,
          coverageArea: finalCoverage,
          phone: phoneVal
        }
      })
      if (typeof authStore.updateUserData === 'function') {
        authStore.updateUserData({
          city: cityVal,
          coverageArea: finalCoverage,
          phone: phoneVal
        })
      }
    }

    toast.success('¡Ubicación configurada!', 'Tu información ha sido guardada. Ahora aparecerás en el buscador de fotógrafos.')
    isOpen.value = false
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('location_onboarding_completed', 'true')
      sessionStorage.setItem('location_onboarding_dismissed', 'true')
    }
  } catch (e) {
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
