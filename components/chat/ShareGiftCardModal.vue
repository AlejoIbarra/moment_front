<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[85vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="lucide:gift" class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">Enviar Tarjeta de Regalo 🎁</h3>
              <p class="text-xs text-gray-400">Selecciona un código activo para compartirlo en el chat</p>
            </div>
          </div>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-100 bg-gray-50/50">
          <div class="relative">
            <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="search"
              type="text"
              placeholder="Buscar por código..."
              class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm font-mono uppercase"
            />
          </div>
        </div>

        <!-- Cards List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="loading" class="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs">Cargando tus tarjetas...</span>
          </div>

          <div v-else-if="filteredCards.length === 0" class="py-12 text-center text-gray-400">
            <Icon name="lucide:gift" class="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-500" />
            <p class="text-sm font-bold text-gray-700">No hay tarjetas disponibles</p>
            <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              {{ cards.length === 0 ? 'Genera un lote de tarjetas de regalo desde tu panel de fotógrafo para compartirlas.' : 'No se encontraron tarjetas que coincidan con la búsqueda.' }}
            </p>
            <NuxtLink
              v-if="cards.length === 0"
              to="/dashboard/photographer"
              class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              @click="close"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              Generar Tarjetas
            </NuxtLink>
          </div>

          <div
            v-else
            v-for="card in filteredCards"
            :key="card.id"
            @click="selectCard(card)"
            class="group p-3.5 border border-gray-100 hover:border-emerald-400 rounded-xl flex items-center justify-between hover:bg-emerald-50/40 cursor-pointer transition-all shadow-sm hover:shadow-md bg-white"
          >
            <!-- Card details -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
                <Icon name="lucide:gift" class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-black text-gray-900 text-sm tracking-wider">{{ card.code }}</span>
                  <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                    {{ card.photosRemaining ?? card.photoCount ?? 5 }} Fotos
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ card.photosRemaining ?? card.photoCount ?? 5 }} de {{ card.photoCount ?? 5 }} fotos disponibles
                </p>
              </div>
            </div>

            <!-- Send Action -->
            <button class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm">
              <Icon name="lucide:send" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const { $api } = useNuxtApp()
const cards = ref([])
const loading = ref(false)
const search = ref('')

const filteredCards = computed(() => {
  const activeOnly = cards.value.filter(c => c.active && (c.photosRemaining == null || c.photosRemaining > 0))
  if (!search.value) return activeOnly
  const q = search.value.trim().toUpperCase()
  return activeOnly.filter(c => c.code && c.code.toUpperCase().includes(q))
})

async function fetchMyCards() {
  loading.value = true
  try {
    const res = await $api('/giftcards/my-cards')
    if (Array.isArray(res)) {
      cards.value = res
    }
  } catch (e) {
    console.error('Error fetching cards for chat modal:', e)
  } finally {
    loading.value = false
  }
}

function selectCard(card) {
  emit('select', card)
  close()
}

function close() {
  emit('update:modelValue', false)
}

onMounted(() => {
  fetchMyCards()
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
