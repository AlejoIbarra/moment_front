<template>
  <Transition name="modal-fade">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="emit('update:modelValue', false)"
    >
      <div class="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-scale-up">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
              <Icon name="lucide:sliders" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-extrabold text-gray-900 tracking-tight">Configuración del Álbum</h3>
              <p class="text-xs text-gray-500">Gestiona la privacidad, permisos y detalles en caliente</p>
            </div>
          </div>
          <button 
            type="button"
            @click="emit('update:modelValue', false)"
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5 overflow-y-auto">
          <!-- Título, Fecha, Ubicación -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="text-xs font-bold text-gray-700 block mb-1">Título del Evento *</label>
              <input 
                v-model="editSettingsData.title" 
                type="text" 
                required
                placeholder="Ej: Boda Alejandra y Carlos" 
                class="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Fecha</label>
              <input 
                v-model="editSettingsData.date" 
                type="date" 
                class="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Ubicación</label>
              <input 
                v-model="editSettingsData.location" 
                type="text" 
                placeholder="Ej: Medellín, Colombia" 
                class="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="text-xs font-bold text-gray-700 block mb-1">Descripción</label>
              <textarea 
                v-model="editSettingsData.description" 
                rows="2"
                placeholder="Detalles sobre este evento..." 
                class="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <!-- VISIBILIDAD DEL ÁLBUM (PÚBLICO VS PRIVADO) -->
          <div class="pt-2 border-t border-gray-100">
            <label class="text-xs font-bold text-gray-900 block mb-2">Visibilidad del Álbum</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Tarjeta Público -->
              <button
                type="button"
                @click="editSettingsData.isPrivate = false; editSettingsData.accessType = 'PUBLIC'"
                :class="[!editSettingsData.isPrivate ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 text-indigo-950' : 'border-gray-200 hover:bg-gray-50 text-gray-600', 'p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between']"
              >
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="lucide:globe" class="w-4 h-4 text-indigo-600" />
                    <span class="text-xs font-bold">Público</span>
                  </div>
                  <p class="text-[11px] text-gray-500 leading-tight">
                    Visible en el feed, buscador y en tu perfil de fotógrafo.
                  </p>
                </div>
              </button>

              <!-- Tarjeta Privado -->
              <button
                type="button"
                @click="editSettingsData.isPrivate = true; if (editSettingsData.accessType === 'PUBLIC') editSettingsData.accessType = 'UNLISTED'"
                :class="[editSettingsData.isPrivate ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 text-indigo-950' : 'border-gray-200 hover:bg-gray-50 text-gray-600', 'p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between']"
              >
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="lucide:lock" class="w-4 h-4 text-indigo-600" />
                    <span class="text-xs font-bold">Privado</span>
                  </div>
                  <p class="text-[11px] text-gray-500 leading-tight">
                    Oculto de búsquedas y del feed. Tú defines quién entra.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <!-- OPCIONES AVANZADAS DE PRIVACIDAD (Solo si es Privado) -->
          <div v-if="editSettingsData.isPrivate" class="p-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-4">
            <!-- Tipo de Acceso -->
            <div>
              <label class="text-xs font-bold text-gray-800 block mb-2">Permisos de acceso</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  @click="editSettingsData.accessType = 'UNLISTED'"
                  :class="[editSettingsData.accessType === 'UNLISTED' ? 'bg-white text-indigo-900 border-indigo-500 shadow-xs ring-1 ring-indigo-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100/60', 'p-3 rounded-xl border text-left text-xs transition-all cursor-pointer']"
                >
                  <div class="font-bold flex items-center gap-1.5 mb-0.5">
                    <Icon name="lucide:link" class="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cualquiera con el enlace</span>
                  </div>
                  <span class="text-[11px] text-gray-500 block leading-tight">Solo entra quien tenga el link privado.</span>
                </button>

                <button
                  type="button"
                  @click="editSettingsData.accessType = 'RESTRICTED'"
                  :class="[editSettingsData.accessType === 'RESTRICTED' ? 'bg-white text-indigo-900 border-indigo-500 shadow-xs ring-1 ring-indigo-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100/60', 'p-3 rounded-xl border text-left text-xs transition-all cursor-pointer']"
                >
                  <div class="font-bold flex items-center gap-1.5 mb-0.5">
                    <Icon name="lucide:mail-check" class="w-3.5 h-3.5 text-indigo-600" />
                    <span>Solo autorizados</span>
                  </div>
                  <span class="text-[11px] text-gray-500 block leading-tight">Restringido a los correos o usuarios de la lista.</span>
                </button>
              </div>
            </div>

            <!-- Lista de autorizados (Chips Input interactivo con sugerencias) -->
            <div v-if="editSettingsData.accessType === 'RESTRICTED'" class="pt-1">
              <label class="text-xs font-bold text-gray-800 block mb-1">
                Correos o nombres de usuario autorizados
              </label>
              <EmailChipsInput 
                v-model="editSettingsData.allowedEmails"
                placeholder="Escribe un correo o @usuario y presiona Enter..."
              />
            </div>

            <!-- Protección con Contraseña -->
            <div class="pt-2 border-t border-gray-200/60">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-gray-800">Proteger con Contraseña</p>
                  <p class="text-[11px] text-gray-500">Exige una clave para ver las fotos del álbum</p>
                </div>
                <input 
                  type="checkbox" 
                  v-model="editSettingsData.hasPassword" 
                  class="w-4 h-4 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <div v-if="editSettingsData.hasPassword" class="mt-2.5">
                <input 
                  type="text" 
                  v-model="editSettingsData.accessPassword"
                  placeholder="PIN o Clave de acceso"
                  class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <!-- Modo de Fotos: Venta vs Descarga Libre -->
            <div class="pt-2 border-t border-gray-200/60">
              <label class="text-xs font-bold text-gray-800 block mb-2">Modo de fotos para autorizados</label>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  @click="editSettingsData.allowFreeDownloads = false"
                  :class="[!editSettingsData.allowFreeDownloads ? 'bg-white text-indigo-900 border-indigo-500 shadow-xs ring-1 ring-indigo-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100/60', 'p-2.5 rounded-xl border text-left transition-all cursor-pointer']"
                >
                  <p class="font-bold text-gray-900">Vender fotos</p>
                  <p class="text-[11px] text-gray-500 leading-tight mt-0.5">Con marca de agua. Deben comprarlas.</p>
                </button>
                <button
                  type="button"
                  @click="editSettingsData.allowFreeDownloads = true"
                  :class="[editSettingsData.allowFreeDownloads ? 'bg-white text-indigo-900 border-indigo-500 shadow-xs ring-1 ring-indigo-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100/60', 'p-2.5 rounded-xl border text-left transition-all cursor-pointer']"
                >
                  <p class="font-bold text-gray-900">Descarga libre</p>
                  <p class="text-[11px] text-gray-500 leading-tight mt-0.5">Sin marca de agua. Descarga directa gratis.</p>
                </button>
              </div>
            </div>
          </div>

          <!-- COLABORADORES CON PERMISOS DE SUBIDA (Fotógrafos y Usuarios) -->
          <div class="pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Icon name="lucide:user-plus" class="w-4 h-4" />
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-900 block">
                    Permisos para Subir Fotos (Colaboradores)
                  </label>
                  <p class="text-[11px] text-gray-500 leading-tight">
                    Autoriza a otros fotógrafos o usuarios a subir fotografías a este álbum.
                  </p>
                </div>
              </div>
              <span v-if="!authStore.isPro && !authStore.isAdmin" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                <Icon name="lucide:crown" class="w-3 h-3 text-amber-600" /> PRO
              </span>
            </div>

            <div v-if="!authStore.isPro && !authStore.isAdmin" class="mb-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3">
              <p class="text-[11px] text-amber-900 leading-tight">
                La asignación de colaboradores es exclusiva para miembros <strong>Moments PRO</strong> ($5.000 COP / mes).
              </p>
              <NuxtLink to="/dashboard/photographer/subscription" target="_blank" class="shrink-0 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition-all">
                Activar PRO
              </NuxtLink>
            </div>

            <EmailChipsInput 
              v-model="editSettingsData.allowedUploaders"
              label=""
              placeholder="Escribe un correo o @usuario para darle permiso de subida..."
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
          <button 
            type="button"
            @click="emit('update:modelValue', false)"
            class="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-white text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="button"
            @click="saveSettings"
            :disabled="isSavingSettings || !editSettingsData.title.trim()"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Icon v-if="isSavingSettings" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:check" class="w-4 h-4" />
            <span>{{ isSavingSettings ? 'Guardando en caliente...' : 'Guardar Cambios' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import EmailChipsInput from '~/components/EmailChipsInput.vue'
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

const emit = defineEmits(['update:modelValue', 'saved'])

const authStore = useAuthStore()
const { $api } = useNuxtApp()
const toast = useToast()
const swal = useSwal()

const isSavingSettings = ref(false)
const editSettingsData = ref({
  title: '',
  date: '',
  location: '',
  description: '',
  isPrivate: false,
  accessType: 'PUBLIC',
  allowedEmails: '',
  allowedUploaders: '',
  hasPassword: false,
  accessPassword: '',
  allowFreeDownloads: false
})

function initData() {
  if (!props.event) return
  const isPriv = !!props.event.isPrivate || !!props.event.private || props.event.accessType === 'UNLISTED' || props.event.accessType === 'RESTRICTED'
  editSettingsData.value = {
    title: props.event.title || '',
    date: props.event.date || '',
    location: props.event.location || '',
    description: props.event.description || '',
    isPrivate: isPriv,
    accessType: props.event.accessType || (isPriv ? 'UNLISTED' : 'PUBLIC'),
    allowedEmails: props.event.allowedEmails || (Array.isArray(props.event.allowedEmailsList) ? props.event.allowedEmailsList.join(', ') : ''),
    allowedUploaders: props.event.allowedUploaders || (Array.isArray(props.event.allowedUploadersList) ? props.event.allowedUploadersList.join(', ') : ''),
    hasPassword: !!props.event.hasPassword,
    accessPassword: props.event.accessPassword || '',
    allowFreeDownloads: !!props.event.allowFreeDownloads
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    initData()
  }
})

async function saveSettings() {
  if (!editSettingsData.value.title.trim() || !props.event) return

  const currentIsPrivate = !!props.event.isPrivate || !!props.event.private || props.event.accessType === 'UNLISTED' || props.event.accessType === 'RESTRICTED'
  const newIsPrivate = editSettingsData.value.isPrivate

  // Diálogo de confirmación interactivo si cambia de visibilidad
  if (currentIsPrivate !== newIsPrivate) {
    const confirmRes = await swal.fire({
      icon: 'question',
      title: newIsPrivate ? '¿Cambiar a Álbum Privado?' : '¿Hacer Álbum Público?',
      html: newIsPrivate
        ? 'Al cambiarlo a <b>Privado</b>:<br>• El evento <b>se ocultará del feed público y de las búsquedas</b>.<br>• Solo podrán acceder las personas que tengan el enlace o estén en la lista de autorizados.<br><br>¿Deseas continuar?'
        : 'Al cambiarlo a <b>Público</b>:<br>• El evento <b>aparecerá en el marketplace, feed global y en tu perfil</b>.<br>• Cualquier usuario podrá explorarlo y comprar fotografías.<br><br>¿Deseas hacerlo público?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar visibilidad',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5'
    })
    if (!confirmRes.isConfirmed) return
  }

  const hasCollaborators = Boolean(editSettingsData.value.allowedUploaders && editSettingsData.value.allowedUploaders.trim())
  if (hasCollaborators && !authStore.isPro && !authStore.isAdmin) {
    toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para asignar colaboradores.')
    return
  }

  isSavingSettings.value = true
  try {
    const targetId = props.event.id || props.event.uuid
    const payload = {
      title: editSettingsData.value.title.trim(),
      date: editSettingsData.value.date,
      location: editSettingsData.value.location?.trim() || '',
      description: editSettingsData.value.description?.trim() || '',
      isPrivate: editSettingsData.value.isPrivate,
      accessType: editSettingsData.value.isPrivate ? (editSettingsData.value.accessType || 'UNLISTED') : 'PUBLIC',
      allowedEmails: editSettingsData.value.isPrivate && editSettingsData.value.accessType === 'RESTRICTED' 
        ? editSettingsData.value.allowedEmails 
        : '',
      allowedUploaders: editSettingsData.value.allowedUploaders?.trim() || '',
      hasPassword: editSettingsData.value.isPrivate && editSettingsData.value.hasPassword,
      accessPassword: editSettingsData.value.isPrivate && editSettingsData.value.hasPassword 
        ? editSettingsData.value.accessPassword?.trim() 
        : '',
      allowFreeDownloads: editSettingsData.value.isPrivate && editSettingsData.value.allowFreeDownloads
    }

    const updated = await $api(`/events/${targetId}`, {
      method: 'PUT',
      body: payload
    })

    if (updated) {
      toast.success('¡Configuración actualizada!', 'Los cambios se han aplicado en caliente al evento.')
      emit('saved', {
        ...props.event,
        ...updated,
        isPrivate: updated.isPrivate ?? updated.private ?? editSettingsData.value.isPrivate,
        private: updated.isPrivate ?? updated.private ?? editSettingsData.value.isPrivate,
        accessType: updated.accessType ?? payload.accessType,
        allowedEmails: updated.allowedEmails ?? payload.allowedEmails,
        allowedUploaders: updated.allowedUploaders ?? payload.allowedUploaders,
        hasPassword: updated.hasPassword ?? payload.hasPassword,
        accessPassword: updated.accessPassword ?? payload.accessPassword,
        allowFreeDownloads: updated.allowFreeDownloads ?? payload.allowFreeDownloads,
        title: payload.title,
        date: payload.date,
        location: payload.location,
        description: payload.description
      })
      emit('update:modelValue', false)
    }
  } catch (err) {
    console.error('Error saving event settings:', err)
    toast.error('Error al actualizar', err?.data?.message || err?.message || 'No se pudieron guardar los cambios.')
  } finally {
    isSavingSettings.value = false
  }
}
</script>
