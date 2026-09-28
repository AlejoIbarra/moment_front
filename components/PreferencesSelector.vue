<template>
  <div class="relative inline-block text-left" ref="selectorRef">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/70 transition-all shadow-sm active:scale-95"
      :title="`Idioma: ${currentLocale.toUpperCase()} • Moneda: ${currentCurrency.code}`"
    >
      <span class="text-sm leading-none">{{ currentCurrency.flag }}</span>
      <span class="font-bold text-gray-900">{{ currentCurrency.code }}</span>
      <span class="text-gray-300">|</span>
      <span class="font-bold text-indigo-600">{{ currentLocale.toUpperCase() }}</span>
      <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Panel -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-gray-100 shadow-2xl z-[150] p-4 text-gray-800 animate-scale-up"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon name="lucide:globe" class="w-4 h-4" />
            </div>
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-gray-900">Preferencias de Región</h3>
          </div>
          <button @click="isOpen = false" class="text-gray-400 hover:text-gray-600 p-1">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- 1. Language Section -->
        <div class="pt-3 pb-2">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Idioma / Language
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="loc in availableLocales"
              :key="loc.code"
              @click="changeLocale(loc.code)"
              :class="[
                'flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border',
                currentLocale === loc.code
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/60'
              ]"
            >
              <span>{{ loc.code === 'es' ? '🇪🇸 Español' : '🇺🇸 English' }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Currency Section -->
        <div class="pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Moneda de Visualización
            </label>
            <span class="text-[10px] text-gray-400">Conversión en vivo</span>
          </div>

          <div class="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              v-for="curr in currencies"
              :key="curr.code"
              @click="changeCurrency(curr.code)"
              :class="[
                'flex items-center justify-between py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-left border',
                currentCurrencyCode === curr.code
                  ? 'bg-indigo-50 border-indigo-500/40 text-indigo-900 font-bold'
                  : 'bg-white hover:bg-gray-50 border-transparent hover:border-gray-200 text-gray-700'
              ]"
            >
              <div class="flex items-center gap-1.5 overflow-hidden">
                <span class="text-sm shrink-0">{{ curr.flag }}</span>
                <span class="truncate text-[11px]">{{ curr.code }}</span>
              </div>
              <span class="text-[10px] font-bold text-gray-400 shrink-0">{{ curr.symbol }}</span>
            </button>
          </div>
        </div>

        <!-- Tip footer -->
        <div class="mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          Los precios se adaptarán automáticamente a tu moneda seleccionada.
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrency } from '~/composables/useCurrency'
import { useToast } from '~/composables/useToast'

const { locale, locales, setLocale } = useI18n()
const { currencies, currentCurrencyCode, currentCurrency, setCurrency } = useCurrency()
const toast = useToast()

const isOpen = ref(false)
const selectorRef = ref(null)

const currentLocale = computed(() => {
  return typeof locale.value === 'string' ? locale.value : 'es'
})

const availableLocales = computed(() => {
  return locales.value || [{ code: 'es', name: 'Español' }, { code: 'en', name: 'English' }]
})

function changeLocale(code) {
  setLocale(code)
  if (typeof window !== 'undefined') {
    localStorage.setItem('moment_selected_locale', code)
  }
}

function changeCurrency(code) {
  setCurrency(code)
  isOpen.value = false
  toast.success('Preferencia guardada', `Precios mostrados en ${code}`)
}

function handleClickOutside(event) {
  if (selectorRef.value && !selectorRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside)
    const savedLocale = localStorage.getItem('moment_selected_locale')
    if (savedLocale && ['es', 'en'].includes(savedLocale)) {
      setLocale(savedLocale)
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside)
  }
})
</script>
