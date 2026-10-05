<template>
  <Transition name="modal-fade">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-scale-up">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-white shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Icon name="lucide:upload-cloud" class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-extrabold text-gray-900 tracking-tight">Subir Fotos como Colaborador</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Permiso Autorizado
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate max-w-[320px] sm:max-w-md">
                Álbum: <strong>{{ event?.title }}</strong> • Organizado por @{{ event?.photographerUsername }}
              </p>
            </div>
          </div>
          <button 
            type="button"
            @click="handleClose"
            :disabled="isUploading"
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-40"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5 overflow-y-auto">
          <!-- Banner explicativo -->
          <div class="p-3.5 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
            <Icon name="lucide:info" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p class="text-xs text-emerald-900 leading-relaxed">
              Tus fotos se subirán directamente a la galería de este álbum. Tendrás la opción de gestionar y eliminar las fotografías que tú mismo hayas subido.
            </p>
          </div>

          <!-- DROPZONE -->
          <div 
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="openFilePicker"
            :class="[
              'border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer relative overflow-hidden',
              isDragging 
                ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]' 
                : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50/60 bg-gray-50/30'
            ]"
          >
            <input 
              ref="fileInputRef"
              type="file" 
              multiple 
              accept="image/*,.cr2,.cr3,.nef,.arw,.dng" 
              class="hidden" 
              @change="handleFileSelect"
            />

            <div class="flex flex-col items-center justify-center pointer-events-none">
              <div class="w-14 h-14 rounded-3xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                <Icon name="lucide:images" class="w-7 h-7" />
              </div>
              <p class="text-sm font-bold text-gray-800 mb-1">
                Arrastra y suelta tus fotografías aquí o haz clic para seleccionarlas
              </p>
              <p class="text-xs text-gray-400">
                Formatos compatibles: JPG, PNG, WEBP y RAW (CR2, CR3, NEF, ARW, DNG)
              </p>
            </div>
          </div>

          <!-- PREVIEWS DE ARCHIVOS SELECCIONADOS -->
          <div v-if="selectedFiles.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-emerald-600" />
                <span class="text-xs font-bold text-gray-900">
                  {{ selectedFiles.length }} {{ selectedFiles.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas' }}
                </span>
                <span class="text-[11px] text-gray-400">({{ formattedTotalSize }})</span>
              </div>
              <button 
                type="button" 
                @click="clearFiles"
                :disabled="isUploading"
                class="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer disabled:opacity-40"
              >
                Quitar todas
              </button>
            </div>

            <!-- Miniaturas grid -->
            <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100">
              <div 
                v-for="(item, idx) in selectedFiles" 
                :key="idx" 
                class="relative aspect-square rounded-xl overflow-hidden bg-gray-200 border border-gray-200 group"
              >
                <img 
                  v-if="item.preview" 
                  :src="item.preview" 
                  class="w-full h-full object-cover" 
                  :alt="item.file.name"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-gray-100 text-gray-500">
                  <Icon name="lucide:camera" class="w-4 h-4 mb-0.5 text-gray-400" />
                  <span class="text-[9px] font-mono truncate w-full px-1">{{ item.file.name }}</span>
                </div>

                <!-- Botón eliminar miniatura individual -->
                <button 
                  v-if="!isUploading"
                  type="button"
                  @click.stop="removeFile(idx)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Eliminar"
                >
                  <Icon name="lucide:x" class="w-3 h-3" />
                </button>

                <!-- Estado individual durante la subida -->
                <div 
                  v-if="uploadStatus[idx]" 
                  class="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center text-white"
                >
                  <Icon v-if="uploadStatus[idx] === 'uploading'" name="lucide:loader-2" class="w-5 h-5 animate-spin text-emerald-400" />
                  <Icon v-else-if="uploadStatus[idx] === 'done'" name="lucide:check-circle" class="w-5 h-5 text-emerald-400" />
                  <Icon v-else-if="uploadStatus[idx] === 'error'" name="lucide:alert-circle" class="w-5 h-5 text-rose-400" />
                </div>
              </div>
            </div>
          </div>

          <!-- OPCIONES DE SUBIDA: PRECIO, DORSALES E IA -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <!-- Precio de la foto -->
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">
                Precio por fotografía (COP)
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                <input 
                  type="number"
                  v-model.number="uploadPrice"
                  min="0"
                  max="100000"
                  step="500"
                  :disabled="isUploading || event?.allowFreeDownloads"
                  class="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium transition-all disabled:opacity-60"
                />
              </div>
              <p v-if="event?.allowFreeDownloads" class="text-[10px] text-emerald-600 font-semibold mt-1">
                ✨ Este álbum tiene descarga libre gratuita configurada por el organizador.
              </p>
              <p v-else class="text-[10px] text-gray-400 mt-1">
                Coloca 0 si deseas que sean fotos libres/gratuitas.
              </p>
            </div>

            <!-- Dorsal o etiquetas iniciales -->
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">
                Dorsal / Número de corredor (Opcional)
              </label>
              <input 
                type="text"
                v-model="bibNumbersInput"
                placeholder="Ej: 1042 o varios separados por coma"
                :disabled="isUploading"
                class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all disabled:opacity-60"
              />
              <p class="text-[10px] text-gray-400 mt-1">
                Facilita la búsqueda a los participantes del evento.
              </p>
            </div>

            <!-- Toggle Run AI -->
            <div class="sm:col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icon name="lucide:sparkles" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">Indexación con Inteligencia Artificial</p>
                  <p class="text-[11px] text-gray-500">Reconoce rostros y detecta dorsales automáticamente.</p>
                </div>
              </div>
              <input 
                type="checkbox"
                v-model="runAI"
                :disabled="isUploading"
                class="w-4 h-4 text-emerald-600 rounded-md border-gray-300 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          <!-- BARRA DE PROGRESO DURANTE SUBIDA -->
          <div v-if="isUploading" class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-emerald-900">
              <div class="flex items-center gap-2">
                <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin text-emerald-600" />
                <span>Subiendo foto {{ currentUploadIndex + 1 }} de {{ selectedFiles.length }}...</span>
              </div>
              <span>{{ progressPercentage }}%</span>
            </div>
            <div class="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div 
                class="bg-emerald-600 h-full rounded-full transition-all duration-300"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <p class="text-[11px] text-emerald-700">Por favor, mantén esta ventana abierta mientras se procesan tus fotografías.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3 shrink-0">
          <button 
            type="button" 
            @click="handleClose"
            :disabled="isUploading"
            class="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-white text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
          >
            {{ isUploading ? 'Subiendo...' : 'Cancelar' }}
          </button>

          <button 
            type="button" 
            @click="startUpload"
            :disabled="isUploading || selectedFiles.length === 0"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Icon v-if="isUploading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:upload-cloud" class="w-4 h-4" />
            <span>{{ isUploading ? 'Procesando...' : `Subir ${selectedFiles.length > 0 ? selectedFiles.length : ''} Fotografías` }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePhotosStore } from '~/stores/photos'
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'uploaded'])

const photosStore = usePhotosStore()
const authStore = useAuthStore()
const toast = useToast()

const fileInputRef = ref(null)
const isDragging = ref(false)
const selectedFiles = ref([])
const uploadPrice = ref(props.event?.allowFreeDownloads ? 0 : 5000)
const bibNumbersInput = ref('')
const runAI = ref(true)

const isUploading = ref(false)
const currentUploadIndex = ref(0)
const uploadStatus = ref([])

const formattedTotalSize = computed(() => {
  const bytes = selectedFiles.value.reduce((acc, curr) => acc + curr.file.size, 0)
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

const progressPercentage = computed(() => {
  if (selectedFiles.value.length === 0) return 0
  return Math.round(((currentUploadIndex.value) / selectedFiles.value.length) * 100)
})

function openFilePicker() {
  if (isUploading.value) return
  fileInputRef.value?.click()
}

function handleFileSelect(event) {
  const files = Array.from(event.target?.files || [])
  processNewFiles(files)
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function handleDrop(event) {
  isDragging.value = false
  if (isUploading.value) return
  const files = Array.from(event.dataTransfer?.files || [])
  processNewFiles(files)
}

function processNewFiles(files) {
  for (const file of files) {
    const isImage = file.type.startsWith('image/') || /\.(cr2|cr3|nef|arw|dng|jpg|jpeg|png|webp)$/i.test(file.name)
    if (!isImage) continue

    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    selectedFiles.value.push({ file, preview })
  }
}

function removeFile(index) {
  if (selectedFiles.value[index]?.preview) {
    URL.revokeObjectURL(selectedFiles.value[index].preview)
  }
  selectedFiles.value.splice(index, 1)
}

function clearFiles() {
  for (const item of selectedFiles.value) {
    if (item.preview) URL.revokeObjectURL(item.preview)
  }
  selectedFiles.value = []
  uploadStatus.value = []
}

function handleClose() {
  if (isUploading.value) return
  clearFiles()
  emit('update:modelValue', false)
}

async function startUpload() {
  if (selectedFiles.value.length === 0 || !props.event?.id || isUploading.value) return

  isUploading.value = true
  currentUploadIndex.value = 0
  uploadStatus.value = new Array(selectedFiles.value.length).fill('pending')

  let successCount = 0
  let errorCount = 0

  const priceToSend = props.event?.allowFreeDownloads ? 0 : (uploadPrice.value || 0)

  for (let i = 0; i < selectedFiles.value.length; i++) {
    currentUploadIndex.value = i
    uploadStatus.value[i] = 'uploading'

    const item = selectedFiles.value[i]
    try {
      const res = await photosStore.uploadPhoto(
        props.event.id,
        item.file,
        priceToSend,
        bibNumbersInput.value.trim(),
        runAI.value
      )

      if (res) {
        uploadStatus.value[i] = 'done'
        successCount++
      } else {
        uploadStatus.value[i] = 'error'
        errorCount++
      }
    } catch (err) {
      console.error('Error subiendo foto:', err)
      uploadStatus.value[i] = 'error'
      errorCount++
    }
  }

  isUploading.value = false

  if (successCount > 0) {
    toast.success(
      '¡Fotografías subidas con éxito!',
      `Se han agregado ${successCount} fotos a la galería.`
    )
    emit('uploaded')
    handleClose()
  } else {
    toast.error('Error al subir fotos', 'No se pudo subir ninguna de las imágenes seleccionadas.')
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
