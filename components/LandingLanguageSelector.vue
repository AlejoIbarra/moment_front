<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-stone-800 hover:text-black bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
      :title="`Idioma Landing: ${activeLocale.name}`"
    >
      <span class="text-sm leading-none">{{ activeLocale.flag }}</span>
      <span class="font-extrabold uppercase tracking-wider text-[11px]">{{ activeLocale.code }}</span>
      <Icon name="lucide:chevron-down" class="w-3.5 h-3.5 text-stone-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
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
        class="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200 shadow-xl z-[150] p-3 text-stone-800"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-100">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="lucide:languages" class="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 class="text-xs font-black text-stone-900 leading-tight">
                {{ activeLocale.code === 'pt' ? 'Idioma da Landing' : (activeLocale.code === 'en' ? 'Landing Language' : 'Idioma de la Landing') }}
              </h4>
              <p class="text-[10px] text-stone-400">
                {{ activeLocale.code === 'pt' ? 'Visualização da página inicial' : (activeLocale.code === 'en' ? 'Homepage presentation' : 'Información y presentación') }}
              </p>
            </div>
          </div>
          <button @click="isOpen = false" class="text-stone-400 hover:text-stone-600 p-1 cursor-pointer">
            <Icon name="lucide:x" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Language options -->
        <div class="space-y-1">
          <button
            v-for="item in languages"
            :key="item.code"
            @click="selectLanguage(item.code)"
            :class="[
              'w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left',
              activeLocale.code === item.code
                ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                : 'hover:bg-stone-50 text-stone-700 border border-transparent'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="text-base">{{ item.flag }}</span>
              <div>
                <div class="text-xs font-bold leading-tight">{{ item.name }}</div>
                <div class="text-[10px] text-stone-400 font-normal">{{ item.sub }}</div>
              </div>
            </div>
            <Icon v-if="activeLocale.code === item.code" name="lucide:check" class="w-4 h-4 text-emerald-600 shrink-0" />
          </button>
        </div>

        <!-- Explanatory note about platform language in Settings -->
        <div class="mt-2.5 pt-2 border-t border-stone-100 text-[10px] text-stone-400 leading-snug">
          <NuxtLink to="/dashboard/photographer/settings" class="text-emerald-700 hover:underline font-semibold flex items-center gap-1">
            <Icon name="lucide:settings-2" class="w-3 h-3 text-emerald-600 shrink-0" />
            <span>
              {{ activeLocale.code === 'pt' ? 'Idioma do painel: em Configurações' : (activeLocale.code === 'en' ? 'Platform language in Settings' : 'Idioma de la app: en Configuración') }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, setLocale } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref(null)

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸', sub: 'Latinoamérica' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', sub: 'Brasil (Pix)' },
  { code: 'en', name: 'English', flag: '🇺🇸', sub: 'International' }
]

const activeLocale = computed(() => {
  const code = (typeof locale.value === 'string' ? locale.value : 'es').toLowerCase()
  return languages.find(l => l.code === code) || languages[0]
})

function selectLanguage(code) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('moment_landing_locale', code)
  }
  if (typeof setLocale === 'function') {
    setLocale(code)
  } else {
    locale.value = code
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = code
  }
  isOpen.value = false
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside)
    const saved = localStorage.getItem('moment_landing_locale')
    if (saved && ['es', 'en', 'pt'].includes(saved)) {
      if (typeof setLocale === 'function') {
        setLocale(saved)
      } else {
        locale.value = saved
      }
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside)
  }
})
</script>
