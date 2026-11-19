<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="support-modal-fade">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
          @click.self="closeModal"
        >
          <div
            class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-support-pop"
          >
            <!-- Top Gradient Header -->
            <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-5 sm:px-6 sm:py-6 text-white flex-shrink-0">
              <button
                @click="closeModal"
                class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>

              <div class="flex items-center gap-3.5 pr-8">
                <div class="w-12 h-12 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-[#3ef4a1] shadow-inner flex-shrink-0">
                  <Icon name="lucide:headset" class="w-6 h-6" />
                </div>
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[#3ef4a1] text-[10px] font-black uppercase tracking-wider mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#3ef4a1] animate-pulse"></span>
                    Soporte Oficial Moments
                  </div>
                  <h3 class="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                    ¿Cómo podemos ayudarte?
                  </h3>
                  <p class="text-xs text-slate-300 mt-0.5">
                    Comunícate por WhatsApp, con <span class="text-[#3ef4a1] font-bold">@mastermoments</span> o al correo de soporte
                  </p>
                </div>
              </div>

              <!-- Quick Channels Strip -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-white/10">
                <!-- Direct WhatsApp Channel (Full Width Featured) -->
                <a
                  href="https://wa.me/573245124346?text=Hola%20Moments,%20necesito%20ayuda%20con%20soporte"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sm:col-span-2 flex items-center gap-3 p-2.5 rounded-2xl bg-[#3ef4a1]/15 hover:bg-[#3ef4a1]/25 border border-[#3ef4a1]/35 transition-all text-left group"
                >
                  <div class="w-9 h-9 rounded-xl bg-[#3ef4a1] text-slate-950 flex items-center justify-center font-black flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    <Icon name="lucide:phone-call" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-extrabold text-white flex items-center gap-1.5">
                      WhatsApp Oficial Moments
                      <Icon name="lucide:external-link" class="w-3 h-3 text-[#3ef4a1]" />
                    </p>
                    <p class="text-[11px] text-[#3ef4a1] font-bold truncate">
                      +57 324 512 4346 · Respuesta rápida
                    </p>
                  </div>
                </a>

                <!-- Direct Chat with @mastermoments -->
                <button
                  type="button"
                  @click="openMasterMomentsChat"
                  class="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-left group cursor-pointer"
                >
                  <div class="w-9 h-9 rounded-xl bg-white/15 border border-white/20 text-[#3ef4a1] flex items-center justify-center font-black flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    <Icon name="lucide:message-circle" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-extrabold text-white flex items-center gap-1">
                      Chat con @mastermoments
                      <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5 text-[#3ef4a1]" />
                    </p>
                    <p class="text-[10px] text-slate-300 truncate">
                      Atención directa en la plataforma
                    </p>
                  </div>
                </button>

                <!-- Direct Email Channel -->
                <a
                  href="mailto:alejandroibarrab0532@gmail.com?subject=Soporte%20Moments%20Gallery"
                  class="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-left group"
                >
                  <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-[#3ef4a1] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon name="lucide:mail" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-extrabold text-white flex items-center gap-1">
                      Correo de Soporte
                      <Icon name="lucide:external-link" class="w-3 h-3 text-[#3ef4a1]" />
                    </p>
                    <p class="text-[10px] text-slate-300 truncate" title="alejandroibarrab0532@gmail.com">
                      alejandroibarrab0532@gmail.com
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <!-- Body Content -->
            <div class="p-5 sm:p-6 overflow-y-auto flex-1">
              <!-- Success State -->
              <div v-if="submitted" class="py-6 text-center space-y-4">
                <div class="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Icon name="lucide:check-circle-2" class="w-9 h-9" />
                </div>
                <div class="space-y-1.5">
                  <h4 class="text-lg font-black text-gray-900">
                    ¡Mensaje enviado a Soporte!
                  </h4>
                  <p class="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Tu solicitud fue enviada al correo oficial de soporte (<span class="font-bold text-gray-900">alejandroibarrab0532@gmail.com</span>) y a la bandeja de <span class="font-bold text-emerald-700">@mastermoments</span>.
                  </p>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                  <button
                    v-if="authStore.isAuthenticated"
                    type="button"
                    @click="openMasterMomentsChat"
                    class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Icon name="lucide:message-circle" class="w-4 h-4 text-[#3ef4a1]" />
                    Ver conversación con @mastermoments
                  </button>
                  <button
                    type="button"
                    @click="resetForm"
                    class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>

              <!-- Support Form -->
              <form v-else @submit.prevent="submitSupportTicket" class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Envíanos un mensaje directo
                  </p>
                  <span class="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    Llega a Correo + @mastermoments
                  </span>
                </div>

                <!-- Categoría -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1.5">
                    ¿Sobre qué necesitas ayuda?
                  </label>
                  <select
                    v-model="form.category"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option value="Compra y Descarga de Fotos">📸 Problema con compra o descarga de fotos</option>
                    <option value="Planes PRO y Membresías">👑 Planes PRO y Suscripciones</option>
                    <option value="Soporte para Fotógrafos">🎥 Soporte para Fotógrafos / Álbumes</option>
                    <option value="Pagos y Mercado Pago">💳 Pagos, Reembolsos o Mercado Pago</option>
                    <option value="Consulta General">💬 Consulta General / Otro</option>
                  </select>
                </div>

                <!-- Nombre y Correo -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">
                      Tu nombre <span class="text-rose-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      placeholder="Ej. Carlos Delgado"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">
                      Correo electrónico <span class="text-rose-500">*</span>
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="tucorreo@ejemplo.com"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <!-- Teléfono y Asunto -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">
                      WhatsApp / Teléfono <span class="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      placeholder="+57 300 000 0000"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">
                      Asunto breve
                    </label>
                    <input
                      v-model="form.subject"
                      type="text"
                      placeholder="Ej. Ayuda con mi evento o pago"
                      class="w-full rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <!-- Mensaje -->
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">
                    Describe cómo podemos ayudarte <span class="text-rose-500">*</span>
                  </label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    required
                    placeholder="Cuéntanos los detalles (nombre del álbum, correo de compra o duda)..."
                    class="w-full rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  ></textarea>
                </div>

                <p v-if="errorMsg" class="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {{ errorMsg }}
                </p>

                <!-- Submit Actions -->
                <div class="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-slate-950/15 transition-all active:scale-95 cursor-pointer"
                  >
                    <Icon v-if="submitting" name="lucide:loader-2" class="w-4 h-4 animate-spin text-[#3ef4a1]" />
                    <Icon v-else name="lucide:send" class="w-4 h-4 text-[#3ef4a1]" />
                    <span>{{ submitting ? 'Enviando...' : 'Enviar a Soporte' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const authStore = useAuthStore()
const router = useRouter()
const { $api } = useNuxtApp()
const toast = useToast()

const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

const form = reactive({
  category: 'Compra y Descarga de Fotos',
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const prefillFromAuth = () => {
  if (authStore.user) {
    const full = [authStore.user.firstName, authStore.user.lastName].filter(Boolean).join(' ').trim()
    if (!form.name) form.name = full || authStore.user.username || ''
    if (!form.email) form.email = authStore.user.email || ''
    if (!form.phone && (authStore.user as any).phone) form.phone = (authStore.user as any).phone
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      errorMsg.value = ''
      prefillFromAuth()
    }
  },
  { immediate: true }
)

const closeModal = () => {
  emit('update:modelValue', false)
}

const resetForm = () => {
  submitted.value = false
  errorMsg.value = ''
  form.subject = ''
  form.message = ''
  prefillFromAuth()
}

const openMasterMomentsChat = () => {
  closeModal()
  if (authStore.isAuthenticated) {
    router.push('/chat?user=mastermoments')
  } else {
    router.push('/login?redirect=/chat?user=mastermoments')
  }
}

const submitSupportTicket = async () => {
  if (!form.message.trim()) {
    errorMsg.value = 'Por favor escribe tu mensaje para poder ayudarte.'
    return
  }
  errorMsg.value = ''
  submitting.value = true

  try {
    await $api('/contact/support', {
      method: 'POST',
      body: {
        category: form.category,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim() || `${form.category} - Soporte Moments`,
        message: form.message.trim(),
        username: authStore.user?.username || null,
        role: authStore.user?.role || null
      }
    })
    submitted.value = true
    toast.success('Solicitud enviada a soporte y a @mastermoments')
  } catch (err: any) {
    errorMsg.value = err?.data?.error || 'No se pudo enviar el mensaje. Intenta nuevamente o escríbenos a alejandroibarrab0532@gmail.com.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.support-modal-fade-enter-active,
.support-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.support-modal-fade-enter-from,
.support-modal-fade-leave-to {
  opacity: 0;
}
@keyframes supportPop {
  0% {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-support-pop {
  animation: supportPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
