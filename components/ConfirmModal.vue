<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        <div class="p-6 text-center">
          <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon :name="icon || 'lucide:alert-triangle'" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title || '¿Estás seguro?' }}</h3>
          <p class="text-gray-500 text-sm mb-6">{{ message }}</p>
          
          <div class="flex gap-3">
            <button 
              @click="cancel" 
              class="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
            >
              {{ cancelText || 'Cancelar' }}
            </button>
            <button 
              @click="confirm" 
              class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
            >
              {{ confirmText || 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  confirmText: String,
  cancelText: String,
  icon: String
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
