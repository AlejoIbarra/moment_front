<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="isOpen = false"
      >
        <div class="bg-white dark:bg-[#12161f] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-scale-up text-gray-900 dark:text-gray-100">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Icon name="lucide:accessibility" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-black text-lg">Ajustes de Accesibilidad</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Personaliza la interfaz según tus necesidades visuales</p>
              </div>
            </div>
            <button 
              @click="isOpen = false"
              class="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Options List -->
          <div class="space-y-4">
            
            <!-- High Contrast -->
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Icon name="lucide:contrast" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">Modo Alto Contraste</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Aumenta la legibilidad con bordes y fondos más contrastados</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="highContrast" @change="savePreferences" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- Large Text -->
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Icon name="lucide:type" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">Texto Aumentado</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Incrementa el tamaño tipográfico general para lectura fácil</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="largeText" @change="savePreferences" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- Dyslexia Friendly -->
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Icon name="lucide:book-open" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">Fuente Adaptada para Dislexia</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Espaciado y curvatura optimizada para prevenir confusión de letras</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="dyslexicFont" @change="savePreferences" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- Reduced Motion -->
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Icon name="lucide:sparkles" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">Reducción de Movimiento</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Minimiza animaciones y transiciones (ideal para sensibilidad vestibular)</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="reducedMotion" @change="savePreferences" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <!-- Highlight Links -->
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <Icon name="lucide:link" class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold">Resaltar Enlaces y Foco</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Subraya y bordea elementos clickeables para navegación clara</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="highlightLinks" @change="savePreferences" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
            <button 
              @click="resetPreferences"
              class="text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Restablecer valores
            </button>
            <button 
              @click="isOpen = false"
              class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Listo
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAccessibility } from '~/composables/useAccessibility'

const {
  highContrast,
  largeText,
  dyslexicFont,
  reducedMotion,
  highlightLinks,
  isOpen,
  savePreferences,
  loadPreferences,
  resetPreferences
} = useAccessibility()

onMounted(() => {
  loadPreferences()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
