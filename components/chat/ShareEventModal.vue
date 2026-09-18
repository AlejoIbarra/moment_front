<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[85vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon name="lucide:calendar" class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">Compartir Evento</h3>
              <p class="text-xs text-gray-400">Selecciona un evento para enviarlo en el chat</p>
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
              placeholder="Buscar evento por nombre o ciudad..."
              class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <!-- Events List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="loading" class="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
            <div class="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs">Cargando eventos...</span>
          </div>

          <div v-else-if="filteredEvents.length === 0" class="py-12 text-center text-gray-400">
            <Icon name="lucide:calendar-x" class="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p class="text-sm font-medium">No se encontraron eventos</p>
          </div>

          <div
            v-else
            v-for="ev in filteredEvents"
            :key="ev.id"
            @click="selectEvent(ev)"
            class="group p-3 border border-gray-100 hover:border-indigo-300 rounded-xl flex items-center gap-3.5 hover:bg-indigo-50/30 cursor-pointer transition-all shadow-sm hover:shadow-md"
          >
            <!-- Thumbnail -->
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-100">
              <img v-if="ev.coverPhotoUrl" :src="ev.coverPhotoUrl" alt="Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <Icon name="lucide:image" class="w-6 h-6" />
              </div>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{{ ev.title }}</h4>
              <div class="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span class="flex items-center gap-1">
                  <Icon name="lucide:calendar" class="w-3 h-3 text-gray-400" />
                  {{ ev.date }}
                </span>
                <span v-if="ev.location" class="flex items-center gap-1 truncate">
                  <Icon name="lucide:map-pin" class="w-3 h-3 text-gray-400" />
                  {{ ev.location }}
                </span>
              </div>
            </div>

            <!-- Send Icon -->
            <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
              <Icon name="lucide:send" class="w-3.5 h-3.5" />
            </div>
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
const events = ref([])
const loading = ref(false)
const search = ref('')

const filteredEvents = computed(() => {
  if (!search.value) return events.value
  const q = search.value.toLowerCase()
  return events.value.filter(e => 
    (e.title && e.title.toLowerCase().includes(q)) ||
    (e.location && e.location.toLowerCase().includes(q))
  )
})

async function fetchEvents() {
  loading.value = true
  try {
    const res = await $api('/events')
    if (Array.isArray(res)) {
      events.value = res
    } else if (res && Array.isArray(res.content)) {
      events.value = res.content
    }
  } catch (e) {
    console.error('Error fetching events to share:', e)
  } finally {
    loading.value = false
  }
}

function selectEvent(ev) {
  emit('select', ev)
  close()
}

function close() {
  emit('update:modelValue', false)
}

onMounted(() => {
  fetchEvents()
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
