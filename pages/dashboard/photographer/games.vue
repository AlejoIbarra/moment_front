<template>
  <div class="min-h-screen bg-slate-50/60 pb-20 pt-6 sm:pt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      <!-- Top Breadcrumb & Navigation -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/dashboard/photographer"
            class="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-black flex items-center justify-center shadow-2xs transition-all hover:scale-105 active:scale-95"
            title="Volver al Panel"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
          </NuxtLink>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-50 border border-pink-200/80 px-2.5 py-0.5 rounded-full">
                Dinámicas Interactivas
              </span>
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                QR en Mesas
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Juegos Rompehielos & Retos para Eventos 🎮
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <NuxtLink
            to="/dashboard/photographer"
            class="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Icon name="lucide:layout-dashboard" class="w-4 h-4 text-slate-400" />
            <span>Panel de Control</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/photographer?tab=events"
            class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Icon name="lucide:calendar" class="w-4 h-4 text-indigo-600" />
            <span>Mis Eventos</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingEvents" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-pink-500 mb-3" />
        <p class="text-sm font-semibold text-slate-600">Cargando tus eventos para configurar juegos...</p>
      </div>

      <!-- Empty State: No events created yet -->
      <div v-else-if="events.length === 0" class="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/80 shadow-sm text-center max-w-xl mx-auto space-y-5">
        <div class="w-16 h-16 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto shadow-inner">
          <Icon name="lucide:gamepad-2" class="w-8 h-8" />
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900">Aún no tienes álbumes creados</h3>
          <p class="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Los juegos rompehielos funcionan vinculados a tus eventos (bodas, fiestas, cumpleaños o corporativos). Crea tu primer evento para activar retos y códigos QR para las mesas.
          </p>
        </div>
        <NuxtLink
          to="/dashboard/photographer?tab=events"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
          <span>Crear Mi Primer Evento</span>
        </NuxtLink>
      </div>

      <!-- Active Content: Event Selector + EventGameManager -->
      <div v-else class="space-y-6">

        <!-- Event Selection Card -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20">
              <Icon name="lucide:sparkles" class="w-6 h-6" />
            </div>
            <div>
              <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Seleccionar Álbum / Fiesta
              </label>
              <div class="relative mt-1">
                <select
                  v-model="selectedEventId"
                  class="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 text-slate-900 text-sm font-extrabold rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-500/30 cursor-pointer appearance-none transition-colors"
                >
                  <option v-for="ev in events" :key="ev.id" :value="ev.id">
                    {{ ev.title }} ({{ ev.date || 'Sin fecha' }})
                  </option>
                </select>
                <Icon name="lucide:chevron-down" class="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- Quick Stats / Actions for current event -->
          <div v-if="selectedEvent" class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              <Icon name="lucide:calendar" class="w-3.5 h-3.5 text-slate-500" />
              {{ selectedEvent.date }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold">
              <Icon name="lucide:image" class="w-3.5 h-3.5 text-indigo-500" />
              {{ selectedEvent.photoCount || 0 }} fotos
            </span>
            <NuxtLink
              :to="`/dashboard/photographer/events/${selectedEvent.id}`"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-all shadow-2xs"
            >
              <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-slate-400" />
              <span>Ver Álbum Completo</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Render the full interactive EventGameManager -->
        <div v-if="selectedEvent" :key="selectedEvent.id" class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <EventGameManager
            :event-id="Number(selectedEvent.id)"
            :event-title="selectedEvent.title || ''"
          />
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '~/stores/events'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const eventsStore = useEventsStore()
const authStore = useAuthStore()

const loadingEvents = ref(true)
const selectedEventId = ref<number | null>(null)

const events = computed(() => {
  return eventsStore.myEvents.filter((e: any) => e.isOwner !== false)
})

const selectedEvent = computed(() => {
  if (!selectedEventId.value) return null
  return events.value.find((e: any) => Number(e.id) === Number(selectedEventId.value)) || null
})

onMounted(async () => {
  loadingEvents.value = true
  try {
    await eventsStore.fetchMyEvents()
    
    // Auto-select event from query or first event
    const queryId = route.query.eventId ? Number(route.query.eventId) : null
    if (queryId && events.value.some((e: any) => Number(e.id) === queryId)) {
      selectedEventId.value = queryId
    } else if (events.value.length > 0) {
      selectedEventId.value = Number(events.value[0].id)
    }
  } catch (err) {
    console.error('Error fetching events for games:', err)
  } finally {
    loadingEvents.value = false
  }
})
</script>
