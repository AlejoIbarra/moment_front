<template>
  <div class="space-y-1.5">
    <!-- Header with label & quick stats -->
    <div class="flex items-center justify-between">
      <label v-if="label" class="text-xs font-bold text-gray-700 flex items-center gap-1.5">
        <Icon name="lucide:users" class="w-3.5 h-3.5 text-indigo-600" />
        <span>{{ label }}</span>
      </label>
      <div v-if="chips.length > 0" class="flex items-center gap-2">
        <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
          {{ chips.length }} {{ chips.length === 1 ? 'autorizado' : 'autorizados' }}
        </span>
        <button 
          type="button" 
          @click="clearAll"
          class="text-[10px] text-gray-400 hover:text-rose-600 font-medium transition-colors"
        >
          Limpiar todos
        </button>
      </div>
    </div>

    <!-- Interactive Chips Box -->
    <div 
      @click="focusInput"
      :class="[
        'w-full min-h-[46px] p-2 bg-white border rounded-xl flex flex-wrap items-center gap-1.5 transition-all cursor-text',
        isFocused ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
      ]"
    >
      <!-- Transition Group for Chips -->
      <TransitionGroup name="chip">
        <div 
          v-for="(chip, index) in chips" 
          :key="chip"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs group animate-in"
        >
          <Icon 
            :name="isEmail(chip) ? 'lucide:mail' : 'lucide:at-sign'" 
            class="w-3 h-3 text-indigo-500 shrink-0" 
          />
          <span class="max-w-[200px] truncate" :title="chip">{{ chip }}</span>
          <button 
            type="button" 
            @click.stop="removeChip(index)"
            class="w-4 h-4 ml-0.5 rounded-full flex items-center justify-center text-indigo-400 hover:text-rose-600 hover:bg-rose-100/70 transition-colors"
            title="Eliminar"
          >
            <Icon name="lucide:x" class="w-3 h-3" />
          </button>
        </div>
      </TransitionGroup>

      <!-- Input Field inside box -->
      <div class="flex-1 min-w-[160px] flex items-center gap-1">
        <input 
          ref="inputRef"
          v-model="inputValue"
          type="text"
          :placeholder="chips.length === 0 ? placeholder : 'Agregar otro correo (Enter)...'"
          class="w-full text-xs bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 py-1 px-1"
          @focus="isFocused = true"
          @blur="handleBlur"
          @keydown.enter.prevent="addChip"
          @keydown.comma.prevent="addChip"
          @keydown.space.prevent="handleSpace"
          @keydown.backspace="handleBackspace"
          @paste="handlePaste"
        />
        <button 
          v-if="inputValue.trim().length > 0"
          type="button" 
          @mousedown.prevent="addChip"
          class="px-2 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shrink-0 shadow-xs transition-all active:scale-95 flex items-center gap-0.5"
        >
          <Icon name="lucide:plus" class="w-3 h-3" />
          <span>Agregar</span>
        </button>
      </div>
    </div>

    <!-- Suggestions Dropdown (Registered Users) -->
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      class="relative z-40"
    >
      <div class="absolute left-0 right-0 top-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-56 overflow-y-auto animate-in">
        <div class="px-3 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Usuarios en Moments</span>
          <span class="text-indigo-600">Clic para agregar</span>
        </div>
        <button
          v-for="user in suggestions"
          :key="user.id || user.username"
          type="button"
          @mousedown.prevent="selectUser(user)"
          class="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-indigo-50/80 transition-colors group cursor-pointer"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden border border-indigo-200/60">
              <img v-if="user.profilePhotoUrl" :src="user.profilePhotoUrl" :alt="user.username" class="w-full h-full object-cover" />
              <span v-else class="text-xs font-bold text-indigo-600">{{ user.username?.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-gray-900 group-hover:text-indigo-700 truncate">@{{ user.username }}</span>
                <span v-if="user.role === 'PHOTOGRAPHER'" class="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold">Fotógrafo</span>
              </div>
              <p v-if="user.email" class="text-[11px] text-gray-500 truncate">{{ user.email }}</p>
            </div>
          </div>
          <Icon name="lucide:plus-circle" class="w-4 h-4 text-gray-300 group-hover:text-indigo-600 shrink-0 ml-2" />
        </button>
      </div>
    </div>

    <!-- Error/Duplicate Alert -->
    <p v-if="duplicateError" class="text-[11px] text-amber-600 font-medium flex items-center gap-1 animate-shake">
      <Icon name="lucide:alert-circle" class="w-3 h-3 shrink-0" />
      <span>Este correo o usuario ya está en la lista.</span>
    </p>

    <!-- Helper Text -->
    <div class="flex items-center justify-between text-[10px] text-gray-400 px-0.5">
      <p class="flex items-center gap-1">
        <Icon name="lucide:corner-down-left" class="w-2.5 h-2.5 text-gray-400" />
        <span>Escribe y presiona <strong>Enter</strong> o <strong>coma</strong> para agregar. Puedes pegar varios a la vez.</span>
      </p>
      <span class="text-indigo-600 font-medium hidden sm:inline-block">Tú (fotógrafo) siempre tienes acceso</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Correos o usuarios autorizados'
  },
  placeholder: {
    type: String,
    default: 'cliente@gmail.com, invitado@hotmail.com, @carlos'
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const inputValue = ref('')
const isFocused = ref(false)
const duplicateError = ref(false)
const chips = ref([])

const suggestions = ref([])
const showSuggestions = ref(false)
let searchTimeout = null

watch(inputValue, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  const query = newVal ? newVal.trim().replace(/^@/, '') : ''
  if (query.length < 1) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()
      const headers = authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
      const res = await $fetch(`${config.public.apiBase}/users/search?query=${encodeURIComponent(query)}`, {
        headers
      })
      if (Array.isArray(res)) {
        suggestions.value = res.filter(u => {
          const uName = `@${u.username?.toLowerCase()}`
          const uEmail = u.email?.toLowerCase()
          return !chips.value.some(c => {
            const low = c.toLowerCase()
            return low === uName || (uEmail && low === uEmail)
          })
        }).slice(0, 6)
        showSuggestions.value = suggestions.value.length > 0
      }
    } catch (err) {
      suggestions.value = []
      showSuggestions.value = false
    }
  }, 200)
})

function selectUser(user) {
  const val = (user.email && user.email.includes('@')) ? user.email.toLowerCase() : `@${user.username.toLowerCase()}`
  if (!chips.value.map(c => c.toLowerCase()).includes(val)) {
    chips.value.push(val)
    emitUpdate()
  } else {
    showDuplicateNotice()
  }
  inputValue.value = ''
  suggestions.value = []
  showSuggestions.value = false
  nextTick(() => focusInput())
}

// Synchronize incoming modelValue with chips
watch(
  () => props.modelValue,
  (newVal) => {
    if (typeof newVal !== 'string') return
    const parsed = newVal
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    
    // Only update if chips differ to avoid feedback loops
    if (parsed.join(',') !== chips.value.join(',')) {
      chips.value = parsed
    }
  },
  { immediate: true }
)

function emitUpdate() {
  emit('update:modelValue', chips.value.join(', '))
}

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

function focusInput() {
  inputRef.value?.focus()
}

function handleSpace() {
  // If user typed an email or username and hit space, add it as a chip
  if (inputValue.value.trim().length > 0) {
    addChip()
  }
}

function addChip() {
  const raw = inputValue.value.trim()
  if (!raw) return

  // In case the user pasted or typed multiple values with comma or whitespace
  const items = raw.split(/[\s,]+/).filter(Boolean)
  let addedAny = false

  for (const item of items) {
    const cleanItem = item.toLowerCase()
    if (!chips.value.map(c => c.toLowerCase()).includes(cleanItem)) {
      chips.value.push(cleanItem)
      addedAny = true
    } else {
      showDuplicateNotice()
    }
  }

  if (addedAny) {
    inputValue.value = ''
    emitUpdate()
  } else {
    inputValue.value = ''
  }
}

function removeChip(index) {
  chips.value.splice(index, 1)
  emitUpdate()
  nextTick(() => focusInput())
}

function handleBackspace() {
  if (inputValue.value === '' && chips.value.length > 0) {
    removeChip(chips.value.length - 1)
  }
}

function handlePaste(e) {
  e.preventDefault()
  const pastedText = e.clipboardData?.getData('text') || ''
  if (!pastedText) return

  const items = pastedText
    .split(/[\s,;]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)

  let addedAny = false
  for (const item of items) {
    if (!chips.value.includes(item)) {
      chips.value.push(item)
      addedAny = true
    }
  }

  if (addedAny) {
    emitUpdate()
  }
  inputValue.value = ''
}

function handleBlur() {
  isFocused.value = false
  setTimeout(() => {
    showSuggestions.value = false
    if (inputValue.value.trim().length > 0) {
      addChip()
    }
  }, 250)
}

function clearAll() {
  chips.value = []
  inputValue.value = ''
  emitUpdate()
  focusInput()
}

function showDuplicateNotice() {
  duplicateError.value = true
  setTimeout(() => {
    duplicateError.value = false
  }, 2500)
}
</script>

<style scoped>
.chip-enter-active,
.chip-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.chip-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(2px);
}

.chip-leave-to {
  opacity: 0;
  transform: scale(0.75);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-3px); }
  40%, 80% { transform: translateX(3px); }
}

.animate-shake {
  animation: shake 0.35s ease-in-out;
}
</style>
