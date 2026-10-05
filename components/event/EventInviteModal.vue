<template>
  <Transition name="fade">
    <div 
      v-if="modelValue && event" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="close"
    >
      <div class="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-scale-up">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white flex items-start justify-between gap-3 shrink-0">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <Icon name="lucide:user-plus" class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-lg font-black text-gray-900 tracking-tight">Invitar & Compartir Evento</h3>
                <span v-if="event.isPrivate" class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                  {{ event.accessType === 'UNLISTED' ? 'Oculto' : 'Privado' }}
                </span>
                <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Público
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate max-w-xs sm:max-w-md mt-0.5 font-medium">
                {{ event.title }}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            @click="close"
            class="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Two Types of Invitations Selector -->
        <div class="p-3 bg-gray-50/90 border-b border-gray-100 grid grid-cols-2 gap-2 shrink-0">
          <!-- Tab 1: Invitar a Subir Fotos -->
          <button
            type="button"
            @click="inviteType = 'upload'"
            :class="[
              inviteType === 'upload' 
                ? 'bg-white text-purple-700 shadow-sm border-purple-200 ring-1 ring-purple-400/30' 
                : 'bg-transparent text-gray-500 hover:text-gray-800 border-transparent hover:bg-white/60',
              'p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer select-none'
            ]"
          >
            <div 
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              :class="inviteType === 'upload' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'"
            >
              <Icon name="lucide:upload-cloud" class="w-5 h-5" />
            </div>
            <div class="overflow-hidden">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold truncate">1. Subir Fotos</span>
                <span class="px-1 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-black rounded uppercase">PRO</span>
              </div>
              <p class="text-[10px] text-gray-400 truncate">Fotógrafos / Colaboradores</p>
            </div>
          </button>

          <!-- Tab 2: Invitar a Clientes -->
          <button
            type="button"
            @click="inviteType = 'client'"
            :class="[
              inviteType === 'client' 
                ? 'bg-white text-indigo-700 shadow-sm border-indigo-200 ring-1 ring-indigo-400/30' 
                : 'bg-transparent text-gray-500 hover:text-gray-800 border-transparent hover:bg-white/60',
              'p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer select-none'
            ]"
          >
            <div 
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              :class="inviteType === 'client' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'"
            >
              <Icon name="lucide:users" class="w-5 h-5" />
            </div>
            <div class="overflow-hidden">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold truncate">2. Clientes</span>
              </div>
              <p class="text-[10px] text-gray-400 truncate">Ver, Buscarse y Comprar</p>
            </div>
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-6 overflow-y-auto space-y-5 flex-1">
          
          <!-- ═══════════════════════════════════════════════════════ -->
          <!-- OPCIÓN 1: INVITAR A SUBIR FOTOS (COLABORADORES)         -->
          <!-- ═══════════════════════════════════════════════════════ -->
          <div v-if="inviteType === 'upload'" class="space-y-4 animate-fade-in">
            <!-- PRO Banner if not PRO -->
            <div v-if="!authStore.isPro && !authStore.isAdmin" class="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-start gap-2.5">
                <Icon name="lucide:crown" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-bold text-amber-950">Función Exclusiva de Moments PRO 👑</p>
                  <p class="text-[11px] text-amber-800 mt-0.5">
                    Invitar a otros fotógrafos o usuarios a subir fotos a tus álbumes requiere Moments PRO ($5.000 COP / mes).
                  </p>
                </div>
              </div>
              <NuxtLink 
                to="/dashboard/photographer/subscription" 
                target="_blank"
                class="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm text-center">
                Activar PRO
              </NuxtLink>
            </div>

            <!-- Header Description -->
            <div class="p-3.5 bg-purple-50/70 border border-purple-200/70 rounded-2xl flex items-start gap-3">
              <Icon name="lucide:shield-check" class="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div class="text-xs text-purple-950 space-y-0.5">
                <p class="font-bold">Invitación para Colaboradores (Subida de Fotos)</p>
                <p class="text-purple-900/80 leading-relaxed text-[11px]">
                  Copia y envía este enlace a los fotógrafos o usuarios que te ayudarán a cubrir el evento. Recuerda que puedes asignarles permisos de precios, ganancia (%) y borrado.
                </p>
              </div>
            </div>

            <!-- Upload Link Input Box -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Enlace Directo para Subir Fotos</span>
                <span class="text-[10px] text-purple-600 font-semibold">Exclusivo para fotógrafos</span>
              </label>
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <input 
                    type="text" 
                    readonly 
                    :value="uploadInviteUrl" 
                    class="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 select-all outline-none font-mono"
                  />
                  <Icon name="lucide:link-2" class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <button 
                  type="button" 
                  @click="copyUploadLink"
                  class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Icon :name="copiedUpload ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                  <span>{{ copiedUpload ? '¡Copiado!' : 'Copiar' }}</span>
                </button>
              </div>
            </div>

            <!-- Quick WhatsApp Share -->
            <div class="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button 
                type="button" 
                @click="shareUploadWhatsApp"
                class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:message-circle" class="w-4 h-4" />
                <span>Invitar Fotógrafo por WhatsApp</span>
              </button>

              <button 
                type="button" 
                @click="goToGranularSettings"
                class="py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon name="lucide:sliders" class="w-4 h-4 text-purple-600" />
                <span>Gestionar Permisos Granulares</span>
              </button>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════ -->
          <!-- OPCIÓN 2: INVITAR A CLIENTES (VER Y COMPRAR)            -->
          <!-- ═══════════════════════════════════════════════════════ -->
          <div v-if="inviteType === 'client'" class="space-y-4 animate-fade-in">
            <!-- Header Description -->
            <div class="p-3.5 bg-indigo-50/70 border border-indigo-200/70 rounded-2xl flex items-start gap-3">
              <Icon name="lucide:shopping-bag" class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div class="text-xs text-indigo-950 space-y-0.5">
                <p class="font-bold">Invitación para Clientes, Invitados y Asistentes</p>
                <p class="text-indigo-900/80 leading-relaxed text-[11px]">
                  Envía este enlace a tus clientes o publícalo en redes. Aquí entrarán a buscarse por foto de su rostro o dorsal y comprar sus fotografías.
                </p>
              </div>
            </div>

            <!-- Client Link Input Box -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Enlace de la Galería para Clientes</span>
                <span class="text-[10px] text-indigo-600 font-semibold">Público / Asistentes</span>
              </label>
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <input 
                    type="text" 
                    readonly 
                    :value="clientInviteUrl" 
                    class="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 select-all outline-none font-mono"
                  />
                  <Icon name="lucide:globe" class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <button 
                  type="button" 
                  @click="copyClientLink"
                  class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Icon :name="copiedClient ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                  <span>{{ copiedClient ? '¡Copiado!' : 'Copiar' }}</span>
                </button>
              </div>
            </div>

            <!-- Password Card (if protected) -->
            <div v-if="event.hasPassword && event.accessPassword" class="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-xs text-amber-900">
                <Icon name="lucide:key" class="w-4 h-4 text-amber-600 shrink-0" />
                <span>Clave de acceso requerida: <strong class="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold">{{ event.accessPassword }}</strong></span>
              </div>
              <button 
                type="button" 
                @click="copyPassword"
                class="text-[11px] text-amber-800 font-bold hover:underline"
              >
                {{ copiedPass ? '¡Copiada!' : 'Copiar clave' }}
              </button>
            </div>

            <!-- QR Code Section -->
            <div class="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
              <div class="w-24 h-24 bg-white rounded-xl border border-gray-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                <img 
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(clientInviteUrl)}`" 
                  alt="QR Code Clientes" 
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="space-y-1 text-center sm:text-left flex-1">
                <p class="text-xs font-bold text-gray-900">Código QR para el Evento Físico</p>
                <p class="text-[11px] text-gray-500 leading-tight">
                  Muestra este QR en tu teléfono o imprímelo en el evento para que los asistentes escaneen y entren directo a comprar.
                </p>
                <a 
                  :href="`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(clientInviteUrl)}`" 
                  target="_blank" 
                  download 
                  class="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold mt-1"
                >
                  <Icon name="lucide:download" class="w-3.5 h-3.5" />
                  Descargar QR en Alta Resolución
                </a>
              </div>
            </div>

            <!-- Quick WhatsApp Share -->
            <div class="pt-2">
              <button 
                type="button" 
                @click="shareClientWhatsApp"
                class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:message-circle" class="w-4 h-4" />
                <span>Compartir Galería con Clientes por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3 shrink-0">
          <span class="text-[11px] text-gray-400">
            {{ inviteType === 'upload' ? 'Enlace exclusivo para colaboradores' : 'Enlace público de compra para clientes' }}
          </span>
          <button 
            type="button"
            @click="close"
            class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: null
  },
  initialType: {
    type: String,
    default: 'upload' // 'upload' | 'client'
  }
})

const emit = defineEmits(['update:modelValue', 'open-granular-settings'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const inviteType = ref(props.initialType || 'upload')
const copiedUpload = ref(false)
const copiedClient = ref(false)
const copiedPass = ref(false)

watch(() => props.initialType, (newVal) => {
  if (newVal) inviteType.value = newVal
})

function close() {
  emit('update:modelValue', false)
}

const originUrl = computed(() => {
  if (process.client) {
    return window.location.origin
  }
  return 'https://www.moments-gallery.com'
})

const uploadInviteUrl = computed(() => {
  if (!props.event?.id) return ''
  return `${originUrl.value}/dashboard/photographer/events/${props.event.id}?tab=collaborators`
})

const clientInviteUrl = computed(() => {
  if (!props.event?.id) return ''
  return `${originUrl.value}/marketplace/events/${props.event.id}`
})

async function copyUploadLink() {
  if (!uploadInviteUrl.value) return
  try {
    await navigator.clipboard.writeText(uploadInviteUrl.value)
    copiedUpload.value = true
    toast.success('Enlace de colaborador copiado al portapapeles')
    setTimeout(() => { copiedUpload.value = false }, 2500)
  } catch {
    toast.error('No se pudo copiar el enlace')
  }
}

async function copyClientLink() {
  if (!clientInviteUrl.value) return
  try {
    await navigator.clipboard.writeText(clientInviteUrl.value)
    copiedClient.value = true
    toast.success('Enlace para clientes copiado al portapapeles')
    setTimeout(() => { copiedClient.value = false }, 2500)
  } catch {
    toast.error('No se pudo copiar el enlace')
  }
}

async function copyPassword() {
  if (!props.event?.accessPassword) return
  try {
    await navigator.clipboard.writeText(props.event.accessPassword)
    copiedPass.value = true
    toast.success('Clave de acceso copiada')
    setTimeout(() => { copiedPass.value = false }, 2500)
  } catch {
    toast.error('No se pudo copiar la clave')
  }
}

function shareUploadWhatsApp() {
  if (!props.event) return
  const text = `¡Hola! Te invito a colaborar en el álbum "${props.event.title}" en Moments para que puedas subir tus fotos directamente:\n${uploadInviteUrl.value}`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
}

function shareClientWhatsApp() {
  if (!props.event) return
  const passInfo = (props.event.hasPassword && props.event.accessPassword) 
    ? `\n🔑 Clave de acceso: ${props.event.accessPassword}` 
    : ''
  const text = `¡Hola! Ya están disponibles las fotografías del evento "${props.event.title}" en Moments. Puedes buscarte por rostro o dorsal y adquirir tus fotos aquí:\n${clientInviteUrl.value}${passInfo}`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
}

function goToGranularSettings() {
  close()
  emit('open-granular-settings', props.event)
  if (route.path.includes(`/dashboard/photographer/events/${props.event.id}`)) {
    const el = document.getElementById('event-tabs-nav')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push(`/dashboard/photographer/events/${props.event.id}?tab=collaborators`)
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
