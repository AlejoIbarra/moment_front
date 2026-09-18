<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="close">
      <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-50/60 to-rose-50/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
              <Icon name="lucide:shield-alert" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-extrabold text-gray-900">Reportar Contenido</h3>
              <p class="text-xs text-gray-500">Solicitud de revisión o retiro de fotos</p>
            </div>
          </div>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-xl hover:bg-white/80">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="submitReport" class="flex-1 overflow-y-auto p-6 space-y-5">
          <!-- Event Info Box -->
          <div v-if="event" class="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
              <img v-if="event.coverPhotoUrl || (event.previewPhotos && event.previewPhotos[0])" :src="event.coverPhotoUrl || event.previewPhotos[0]" alt="Cover" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <Icon name="lucide:image" class="w-5 h-5" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-gray-900 text-sm truncate">{{ event.title }}</h4>
              <p class="text-xs text-gray-500">Fotógrafo: @{{ event.photographerUsername || 'desconocido' }}</p>
            </div>
          </div>

          <!-- Reason Options -->
          <div>
            <label class="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5">
              ¿Cuál es el motivo del reporte?
            </label>
            <div class="space-y-2">
              <label 
                v-for="r in reportReasons" 
                :key="r.key" 
                :class="[
                  'flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none text-left',
                  selectedReason === r.key 
                    ? 'border-red-500 bg-red-50/50 shadow-sm ring-1 ring-red-500' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                ]"
              >
                <input 
                  type="radio" 
                  name="reportReason" 
                  :value="r.key" 
                  v-model="selectedReason" 
                  class="mt-1 text-red-600 focus:ring-red-500" 
                />
                <div class="flex-1">
                  <span class="block text-xs font-bold" :class="selectedReason === r.key ? 'text-red-900' : 'text-gray-900'">
                    {{ r.label }}
                  </span>
                  <span class="block text-[11px] text-gray-500 mt-0.5 leading-snug">
                    {{ r.desc }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <!-- Special Image Rights Banner -->
          <div v-if="selectedReason === 'IMAGE_RIGHTS_REMOVAL'" class="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
            <p class="font-bold flex items-center gap-1.5">
              <Icon name="lucide:user-x" class="w-4 h-4 text-rose-600" />
              Prioridad de Derecho a la Propia Imagen
            </p>
            <p class="text-[11px] leading-relaxed text-rose-700">
              Conforme a nuestra política de privacidad, si apareces en fotos sin tu consentimiento, nuestro equipo administrativo atenderá y retirará las imágenes de forma prioritaria.
            </p>
          </div>

          <!-- Details Textarea -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">
              Detalles o fotos específicas <span class="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              v-model="details"
              rows="3"
              placeholder="Indica qué fotos deseas retirar (ej: foto 2 del álbum, persona vestida de blanco, o todo el evento)..."
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
            ></textarea>
          </div>

          <!-- Contact Email -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">
              Correo de contacto <span class="text-gray-400 font-normal">(Para informarte sobre el estado)</span>
            </label>
            <input
              v-model="contactEmail"
              type="email"
              placeholder="tu@correo.com"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          <!-- Notice -->
          <div class="flex items-center gap-2 text-[11px] text-gray-400 bg-gray-50 p-3 rounded-xl">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Este reporte se escalará automáticamente a los administradores de la plataforma.</span>
          </div>

          <!-- Action Buttons -->
          <div class="pt-2 flex gap-3">
            <button 
              type="button" 
              @click="close" 
              class="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="submitting || !selectedReason"
              class="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon v-if="submitting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:send" class="w-4 h-4" />
              <span>{{ submitting ? 'Enviando...' : 'Enviar Reporte' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'submitted'])

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()

const selectedReason = ref('IMAGE_RIGHTS_REMOVAL')
const details = ref('')
const contactEmail = ref('')
const submitting = ref(false)

const reportReasons = [
  {
    key: 'IMAGE_RIGHTS_REMOVAL',
    label: '👤 Salgo en esta(s) foto(s) y deseo que se eliminen',
    desc: 'Derecho a la propia imagen, privacidad y protección de datos personales.'
  },
  {
    key: 'INAPPROPRIATE_CONTENT',
    label: '🔞 Contenido inapropiado, explícito o sensible',
    desc: 'Imágenes que contienen desnudez, violencia o contenido no apto.'
  },
  {
    key: 'COPYRIGHT_INFRINGEMENT',
    label: '⚖️ Infracción de derechos de autor',
    desc: 'Uso no autorizado de material con propiedad intelectual de terceros.'
  },
  {
    key: 'SPAM_FRAUD',
    label: '🚨 Spam, fraude o evento falso',
    desc: 'Información engañosa, publicidad fraudulenta o suplantación.'
  },
  {
    key: 'HARASSMENT',
    label: '🚫 Acoso o vulneración a la intimidad',
    desc: 'Contenido que promueve el hostigamiento o expone a personas indebidamente.'
  },
  {
    key: 'OTHER',
    label: '📝 Otro motivo',
    desc: 'Cualquier otra razón que requiera la intervención del administrador.'
  }
]

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    selectedReason.value = 'IMAGE_RIGHTS_REMOVAL'
    details.value = ''
    if (authStore.user?.email) {
      contactEmail.value = authStore.user.email
    }
  }
})

function close() {
  emit('update:modelValue', false)
}

async function submitReport() {
  if (!selectedReason.value) return

  const reasonObj = reportReasons.find(r => r.key === selectedReason.value)
  const reasonLabel = reasonObj ? reasonObj.label : selectedReason.value

  submitting.value = true
  try {
    await $api('/reports', {
      method: 'POST',
      body: {
        eventId: props.event?.id,
        eventTitle: props.event?.title,
        photographerUsername: props.event?.photographerUsername,
        reporterEmail: contactEmail.value || authStore.user?.email || '',
        reason: selectedReason.value,
        reasonLabel: reasonLabel,
        description: details.value
      }
    })

    toast.success('Reporte enviado', 'Hemos recibido tu reporte. El administrador lo revisará con máxima prioridad.')
    emit('submitted')
    close()
  } catch (err) {
    console.error('Error submitting report:', err)
    toast.error('Error', 'No se pudo enviar el reporte. Inténtalo de nuevo.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (authStore.user?.email) {
    contactEmail.value = authStore.user.email
  }
})
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
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
