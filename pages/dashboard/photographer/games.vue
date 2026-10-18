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

        <!-- Showcase of Album Photos with Quick Upload & Contest Import -->
        <div v-if="selectedEvent" class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <Icon name="lucide:images" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900 flex items-center gap-2 flex-wrap">
                  Fotos del Álbum: {{ selectedEvent.title }}
                  <span class="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    {{ albumTotalPhotos }} fotos disponibles
                  </span>
                </h3>
                <p class="text-xs text-slate-400">Fotografías del evento que puedes activar para juegos, dinámicas o concursos de likes.</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <!-- Cargar al concurso -->
              <button
                v-if="albumPhotos.length > 0"
                type="button"
                @click="importAlbumPhotosIntoContest"
                :disabled="importingAlbumToContest"
                class="px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Icon :name="importingAlbumToContest ? 'lucide:loader-2' : 'lucide:trophy'" class="w-4 h-4" :class="{ 'animate-spin': importingAlbumToContest }" />
                <span>{{ importingAlbumToContest ? 'Cargando fotos...' : 'Cargar Fotos al Concurso' }}</span>
              </button>

              <!-- Subir fotos al álbum -->
              <label class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95">
                <Icon :name="uploadingToAlbum ? 'lucide:loader-2' : 'lucide:upload-cloud'" class="w-4 h-4" :class="{ 'animate-spin': uploadingToAlbum }" />
                <span>{{ uploadingToAlbum ? 'Subiendo...' : 'Subir Fotos al Álbum' }}</span>
                <input type="file" multiple accept="image/*" class="hidden" :disabled="uploadingToAlbum" @change="handleQuickUploadToAlbum" />
              </label>

              <!-- Toggle photos preview -->
              <button
                type="button"
                @click="showAlbumGallery = !showAlbumGallery"
                class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                :title="showAlbumGallery ? 'Ocultar fotos' : 'Ver fotos del álbum'"
              >
                <Icon :name="showAlbumGallery ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4" />
                <span>{{ showAlbumGallery ? 'Ocultar' : 'Ver Fotos' }}</span>
              </button>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loadingAlbumPhotos" class="py-8 flex items-center justify-center text-slate-400 gap-2">
            <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin text-indigo-500" />
            <span class="text-xs font-semibold text-slate-600">Cargando fotos de "{{ selectedEvent.title }}"...</span>
          </div>

          <!-- Empty Album state -->
          <div v-else-if="albumPhotos.length === 0" class="py-10 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
              <Icon name="lucide:image-plus" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-sm font-black text-slate-800">Este álbum aún no tiene fotos cargadas</h4>
              <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Sube las primeras fotos de "{{ selectedEvent.title }}" con el botón superior o comparte los códigos QR para que los invitados suban fotos en vivo durante la fiesta.
              </p>
            </div>
            <label class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer active:scale-95">
              <Icon name="lucide:upload" class="w-4 h-4" />
              <span>Subir Fotos Ahora</span>
              <input type="file" multiple accept="image/*" class="hidden" @change="handleQuickUploadToAlbum" />
            </label>
          </div>

          <!-- Grid of Photos -->
          <div v-else-if="showAlbumGallery" class="space-y-2 pt-1">
            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              <div
                v-for="photo in albumPhotos"
                :key="photo.id"
                class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all hover:scale-105"
              >
                <img :src="photo.watermarkedUrl || photo.url" class="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            <div class="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
              <span>Mostrando las primeras {{ albumPhotos.length }} de {{ albumTotalPhotos }} fotos del álbum</span>
              <NuxtLink :to="`/dashboard/photographer/events/${selectedEvent.id}`" class="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                <span>Ver álbum completo y gestionar descargas</span>
                <Icon name="lucide:arrow-right" class="w-3 h-3" />
              </NuxtLink>
            </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '~/stores/events'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const eventsStore = useEventsStore()
const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()

const loadingEvents = ref(true)
const selectedEventId = ref<number | null>(null)

const albumPhotos = ref<any[]>([])
const loadingAlbumPhotos = ref(false)
const albumTotalPhotos = ref(0)
const importingAlbumToContest = ref(false)
const uploadingToAlbum = ref(false)
const showAlbumGallery = ref(true)

const events = computed(() => {
  return eventsStore.myEvents.filter((e: any) => e.isOwner !== false)
})

const selectedEvent = computed(() => {
  if (!selectedEventId.value) return null
  return events.value.find((e: any) => Number(e.id) === Number(selectedEventId.value)) || null
})

watch(selectedEventId, async (newId) => {
  if (newId) {
    fetchAlbumPhotos(Number(newId))
  } else {
    albumPhotos.value = []
    albumTotalPhotos.value = 0
  }
}, { immediate: true })

async function fetchAlbumPhotos(eventId: number) {
  loadingAlbumPhotos.value = true
  try {
    const data: any = await $api(`/photos/event/${eventId}?page=0&size=20`)
    albumPhotos.value = data?.content || []
    albumTotalPhotos.value = data?.totalElements || albumPhotos.value.length
  } catch (err) {
    console.error('Error fetching album photos:', err)
    albumPhotos.value = []
    albumTotalPhotos.value = 0
  } finally {
    loadingAlbumPhotos.value = false
  }
}

async function handleQuickUploadToAlbum(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || !files.length || !selectedEvent.value) return

  uploadingToAlbum.value = true
  let successCount = 0
  try {
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      formData.append('price', '0')
      formData.append('runAI', 'false')
      await $api(`/photos/upload/${selectedEvent.value.id}`, {
        method: 'POST',
        body: formData
      })
      successCount++
    }
    toast.success('Fotos subidas con éxito', `Se han cargado ${successCount} fotos a "${selectedEvent.value.title}".`)
    await fetchAlbumPhotos(Number(selectedEvent.value.id))
    await eventsStore.fetchMyEvents()
  } catch (err: any) {
    toast.error('Error al subir fotos', err.message || 'Error en la subida')
  } finally {
    uploadingToAlbum.value = false
    target.value = ''
  }
}

async function importAlbumPhotosIntoContest() {
  if (!selectedEvent.value) return
  importingAlbumToContest.value = true
  try {
    const gamesRes: any = await $api(`/events/${selectedEvent.value.id}/games`)
    let contest = Array.isArray(gamesRes) ? gamesRes.find((g: any) => g.gameType === 'PHOTO_CONTEST') : null
    
    if (!contest) {
      contest = await $api(`/events/${selectedEvent.value.id}/games`, {
        method: 'POST',
        body: {
          title: '🏆 Concurso: La Mejor Foto de la Noche',
          description: '¡Sube tus fotos o vota por las mejores del evento!',
          gameType: 'PHOTO_CONTEST',
          challengesPerUser: 1,
          active: true,
          challenges: []
        }
      })
    }

    if (contest?.uuid) {
      await $api(`/games/${contest.uuid}/contest/import-album-photos`, {
        method: 'POST'
      })
      toast.success('¡Fotos cargadas al concurso!', `Las fotografías del álbum fueron cargadas al torneo de votos.`)
      
      // Dispatch game event so EventGameManager updates live
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('moment:game_event', {
          detail: {
            type: 'GAME_EVENT',
            action: 'CONTEST_STATUS_CHANGED',
            eventId: Number(selectedEvent.value.id),
            gameUuid: contest.uuid,
            timestamp: Date.now()
          }
        }))
      }
    }
  } catch (err: any) {
    toast.error('Error al cargar al concurso', err.message || 'No se pudieron importar las fotos.')
  } finally {
    importingAlbumToContest.value = false
  }
}

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
