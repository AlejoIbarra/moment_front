<template>
  <div
    class="group bg-white rounded-2xl border border-gray-100/80 hover:border-indigo-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    :class="[compact ? 'p-3 gap-2.5' : 'p-4 gap-3.5']"
    @click="$emit('click', event)"
  >
    <!-- Card Header: Title & Photographer -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/60">
            <Icon name="lucide:trophy" class="w-3 h-3 text-emerald-600" />
            Partido / Álbum
          </span>
          <span v-if="event.date" class="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
            <Icon name="lucide:calendar" class="w-3 h-3 text-gray-400" />
            {{ formattedDate }}
          </span>
        </div>
        <h4 class="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-sm sm:text-base leading-snug">
          {{ event.title || 'Partido sin título' }}
        </h4>
        <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span v-if="event.location" class="flex items-center gap-1 truncate text-gray-500">
            <Icon name="lucide:map-pin" class="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span class="truncate">{{ event.location }}</span>
          </span>
          <span v-if="event.location && event.photographerUsername" class="text-gray-300">•</span>
          <span v-if="event.photographerUsername" class="flex items-center gap-1 font-medium text-gray-600">
            <Icon name="lucide:camera" class="w-3 h-3 text-indigo-500 flex-shrink-0" />
            @{{ event.photographerUsername }}
          </span>
        </div>
      </div>

      <!-- Total Photos Badge -->
      <div class="flex-shrink-0 flex flex-col items-end">
        <span class="px-2.5 py-1 rounded-xl bg-gray-900 text-white text-[11px] font-bold shadow-sm flex items-center gap-1.5 group-hover:bg-indigo-600 transition-colors">
          <Icon name="lucide:images" class="w-3.5 h-3.5" />
          {{ event.photoCount || displayPhotos.length || 0 }} fotos
        </span>
      </div>
    </div>

    <!-- Visual Mosaic Preview (Collage of match photos) -->
    <div class="relative w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-100" :class="[compact ? 'h-36 sm:h-44' : 'h-48 sm:h-60']">
      <!-- 0 photos fallback -->
      <div v-if="displayPhotos.length === 0" class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
          <Icon name="lucide:camera" class="w-6 h-6" />
        </div>
        <span class="text-xs font-semibold">Álbum sin fotos aún</span>
      </div>

      <!-- 1 photo -->
      <div v-else-if="displayPhotos.length === 1" class="w-full h-full relative overflow-hidden group/img">
        <img
          :src="displayPhotos[0]"
          :alt="event.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <!-- 2 photos split -->
      <div v-else-if="displayPhotos.length === 2" class="w-full h-full grid grid-cols-2 gap-1 bg-gray-200">
        <div v-for="(photo, idx) in displayPhotos" :key="idx" class="relative w-full h-full overflow-hidden bg-gray-100">
          <img
            :src="photo"
            :alt="event.title + ' ' + (idx + 1)"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>
      </div>

      <!-- 3 photos mosaic -->
      <div v-else-if="displayPhotos.length === 3" class="w-full h-full grid grid-cols-3 gap-1 bg-gray-200">
        <div class="col-span-2 relative w-full h-full overflow-hidden bg-gray-100">
          <img
            :src="displayPhotos[0]"
            :alt="event.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>
        <div class="col-span-1 grid grid-rows-2 gap-1 w-full h-full">
          <div v-for="(photo, idx) in displayPhotos.slice(1, 3)" :key="idx" class="relative w-full h-full overflow-hidden bg-gray-100">
            <img
              :src="photo"
              :alt="event.title + ' ' + (idx + 2)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- 4 or more photos mosaic -->
      <div v-else class="w-full h-full grid grid-cols-2 sm:grid-cols-4 gap-1 bg-gray-200">
        <div v-for="(photo, idx) in displayPhotos.slice(0, 4)" :key="idx" class="relative w-full h-full overflow-hidden bg-gray-100">
          <img
            :src="photo"
            :alt="event.title + ' ' + (idx + 1)"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <!-- "+N" overlay on 4th photo -->
          <div
            v-if="idx === 3 && (event.photoCount > 4 || displayPhotos.length > 4)"
            class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-1"
          >
            <span class="text-sm sm:text-base font-extrabold">+{{ (event.photoCount || displayPhotos.length) - 3 }}</span>
            <span class="text-[9px] uppercase tracking-wider font-semibold opacity-90">Fotos</span>
          </div>
        </div>
      </div>

      <!-- Watermark preview pill -->
      <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-medium text-white/90 flex items-center gap-1 pointer-events-none">
        <Icon name="lucide:sparkles" class="w-3 h-3 text-[#3ef4a1]" />
        <span>Fotos con marca de agua</span>
      </div>
    </div>

    <!-- Card Footer / Action Link -->
    <div class="flex items-center justify-between text-xs pt-1">
      <div class="flex items-center gap-3 text-gray-400 font-medium">
        <span v-if="event.likesCount > 0" class="flex items-center gap-1 text-red-500">
          <Icon name="lucide:heart" class="w-3.5 h-3.5 fill-current" />
          {{ event.likesCount }}
        </span>
        <span v-if="event.commentsCount > 0" class="flex items-center gap-1 text-gray-500">
          <Icon name="lucide:message-circle" class="w-3.5 h-3.5" />
          {{ event.commentsCount }}
        </span>
      </div>
      <div class="flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
        <span>Ver fotos del partido</span>
        <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

// Deduplicate and filter preview photos
const displayPhotos = computed(() => {
  const list = []
  if (props.event.coverPhotoUrl && typeof props.event.coverPhotoUrl === 'string' && props.event.coverPhotoUrl.startsWith('http')) {
    list.push(props.event.coverPhotoUrl)
  }
  if (Array.isArray(props.event.previewPhotos)) {
    for (const p of props.event.previewPhotos) {
      if (p && typeof p === 'string' && p.startsWith('http') && !list.includes(p)) {
        list.push(p)
      }
    }
  }
  return list
})

const formattedDate = computed(() => {
  if (!props.event.date) return ''
  try {
    const d = new Date(props.event.date)
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return props.event.date
  }
})
</script>
