<template>
  <div class="marketplace">
    <!-- Stories/Featured Photographers -->
    <div v-if="photographers.length > 0" class="stories-bar">
      <div v-for="p in photographers" :key="p.id" class="story-item" @click="router.push(`/photographers/${p.username}`)">
        <div class="story-ring">
           <div class="story-avatar">
              <img v-if="p.profilePhotoUrl" :src="p.profilePhotoUrl" alt="Photographer" class="story-avatar__img">
              <span v-else class="story-avatar__letter">{{ p.username.charAt(0) }}</span>
           </div>
        </div>
        <span class="story-name">{{ p.username }}</span>
      </div>
    </div>


    <!-- Feed -->
    <div class="feed">
      <div v-if="pending" class="feed-loader">
        <div class="spinner"></div>
        <span>Cargando...</span>
      </div>

      <div v-else-if="events.length === 0" class="feed-empty">
        <Icon name="lucide:image-off" class="feed-empty__icon" />
        <p>No se encontraron eventos.</p>
      </div>

      <!-- Event Post Card -->
      <div v-for="event in events" :key="event.id" class="post-card">
        <!-- Card Header -->
        <div class="post-header">
          <div class="post-author" @click="router.push(`/photographers/${event.photographerUsername}`)">
            <div class="post-author__avatar">
               <img v-if="event.photographerProfilePhotoUrl" :src="event.photographerProfilePhotoUrl" alt="Photographer">
               <span v-else class="text-sm font-bold text-indigo-600">{{ event.photographerUsername?.charAt(0).toUpperCase() || 'P' }}</span>
            </div>
            <div class="post-author__info">
              <span class="post-author__name">{{ event.photographerUsername || 'photographer' }}</span>
              <span class="post-author__location">{{ event.location }}</span>
            </div>
          </div>
          <Icon name="lucide:more-horizontal" class="post-header__more" />
        </div>

        <!-- Photo Grid -->
        <div class="post-photos" @click="goToEvent(event.id)">
          <!-- Has watermarked photos -->
          <template v-if="event.previewPhotos && event.previewPhotos.length > 0">
            <!-- 1 photo -->
            <div v-if="event.previewPhotos.length === 1" class="photo-grid photo-grid--1">
              <div class="photo-cell">
                <img :src="event.previewPhotos[0]" alt="Photo" class="photo-cell__img" />
              </div>
            </div>

            <!-- 2 photos -->
            <div v-else-if="event.previewPhotos.length === 2" class="photo-grid photo-grid--2">
              <div v-for="(url, i) in event.previewPhotos.slice(0, 2)" :key="i" class="photo-cell">
                <img :src="url" alt="Photo" class="photo-cell__img" />
              </div>
            </div>

            <!-- 3 photos -->
            <div v-else-if="event.previewPhotos.length === 3 && event.photoCount <= 3" class="photo-grid photo-grid--3">
              <div class="photo-cell photo-cell--main">
                <img :src="event.previewPhotos[0]" alt="Photo" class="photo-cell__img" />
              </div>
              <div class="photo-grid__side">
                <div class="photo-cell">
                  <img :src="event.previewPhotos[1]" alt="Photo" class="photo-cell__img" />
                </div>
                <div class="photo-cell">
                  <img :src="event.previewPhotos[2]" alt="Photo" class="photo-cell__img" />
                </div>
              </div>
            </div>

            <!-- 3+ photos (show grid + "+N" badge) -->
            <div v-else class="photo-grid photo-grid--3">
              <div class="photo-cell photo-cell--main">
                <img :src="event.previewPhotos[0]" alt="Photo" class="photo-cell__img" />
              </div>
              <div class="photo-grid__side">
                <div class="photo-cell">
                  <img :src="event.previewPhotos[1]" alt="Photo" class="photo-cell__img" />
                </div>
                <div class="photo-cell photo-cell--more">
                  <img :src="event.previewPhotos[2]" alt="Photo" class="photo-cell__img" />
                  <div class="photo-cell__overlay">
                    <span class="photo-cell__count">+{{ event.photoCount - 2 }}</span>
                    <span class="photo-cell__count-label">Fotos</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Fallback: No photos at all -->
          <template v-else>
            <div class="photo-grid photo-grid--1">
              <div class="photo-cell">
                <div class="photo-cell__placeholder">
                  <Icon name="lucide:camera" class="w-12 h-12" />
                  <span>Sin fotos aún</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Event Info Overlay -->
          <div class="post-photos__overlay">
            <h3 class="post-photos__title">{{ event.title }}</h3>
            <div class="post-photos__meta">
              <span class="post-photos__date">
                <Icon name="lucide:calendar" class="w-3 h-3" />
                {{ event.date }}
              </span>
              <span class="post-photos__photo-count">
                <Icon name="lucide:image" class="w-3 h-3" />
                {{ event.photoCount || 0 }} fotos
              </span>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="post-actions">
          <div class="post-actions__left">
            <button class="post-action-btn" @click="handleToggleLike(event)">
              <Icon 
                :name="event.isLiked ? 'lucide:heart' : 'lucide:heart'" 
                :class="['w-6 h-6', event.isLiked ? 'text-red-500 fill-current' : 'text-gray-900']" 
              />
            </button>
            <button class="post-action-btn" @click="goToEvent(event.id)"><Icon name="lucide:message-circle" class="w-6 h-6" /></button>
            <button class="post-action-btn"><Icon name="lucide:send" class="w-6 h-6" /></button>
          </div>
          <button class="post-action-btn"><Icon name="lucide:bookmark" class="w-6 h-6" /></button>
        </div>

        <!-- Card Description -->
        <div class="post-caption">
          <p class="post-caption__likes">{{ event.likesCount || 0 }} Me gusta</p>
          <p class="post-caption__text">
            <span class="post-caption__author">{{ event.photographerUsername }}</span>
            {{ event.description || '¡Mira las fotos de este increíble evento!' }}
          </p>
          <button @click="goToEvent(event.id)" class="post-caption__view-all">Ver todas las fotos →</button>
          <div v-if="event.commentsCount > 0" class="mt-1">
            <button @click="goToEvent(event.id)" class="text-xs text-gray-400 hover:text-gray-600">
              Ver los {{ event.commentsCount }} comentarios
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '~/stores/events'

const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()

const photographers = ref([])

onMounted(async () => {
    if (authStore.isAuthenticated) {
        await walletStore.fetchBalance()
    }
    await eventsStore.fetchEvents()
    await fetchPhotographers()
})

async function fetchPhotographers() {
    try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/users/photographers`)
        photographers.value = data.slice(0, 10)
    } catch (e) {
        console.error(e)
    }
}

const events = computed(() => eventsStore.events)
const pending = computed(() => eventsStore.loading)

function goToEvent(id) {
    router.push(`/marketplace/events/${id}`)
}

async function handleToggleLike(event) {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    await eventsStore.toggleLike(event.id)
}
</script>

<style scoped>
/* ── Design Tokens ────────────────────────────────────── */
.marketplace {
  max-width: 470px;
  margin: 0 auto;
  padding: 0 0 80px;
  min-height: 100vh;
}

/* ── Stories Bar ──────────────────────────────────────── */
.stories-bar {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 16px 12px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.stories-bar::-webkit-scrollbar { display: none; }
.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
}
.story-ring {
  padding: 2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6);
}
.story-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.story-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.story-avatar__letter {
  font-size: 14px;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
}
.story-name {
  font-size: 11px;
  color: #6b7280;
  width: 64px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Search ──────────────────────────────────────────── */
.search-bar {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 24px;
}
.search-field {
  flex: 1;
  position: relative;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9ca3af;
}
.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background: #fafafa;
  font-size: 13px;
  color: #262626;
  outline: none;
  transition: all 0.2s;
}
.search-input:focus {
  border-color: #dbdbdb;
  background: #fff;
}
.search-input::placeholder { color: #9ca3af; }

/* ── Feed ────────────────────────────────────────────── */
.feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.feed-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 80px 0;
  color: #9ca3af;
  font-size: 13px;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #262626;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.feed-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 80px 0;
  color: #9ca3af;
  text-align: center;
}
.feed-empty__icon {
  width: 48px;
  height: 48px;
  color: #d1d5db;
}

/* ── Post Card ──────────────────────────────────────── */
.post-card {
  background: white;
  border: 1px solid #efefef;
  border-radius: 8px;
  overflow: hidden;
}

/* Header */
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}
.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.post-author__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eef2ff;
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.post-author__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-author__avatar span {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
}
.post-author__info {
  display: flex;
  flex-direction: column;
}
.post-author__name {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}
.post-author__location {
  font-size: 11px;
  color: #9ca3af;
}
.post-header__more {
  width: 20px;
  height: 20px;
  color: #6b7280;
  cursor: pointer;
}

/* ── Photo Grid ─────────────────────────────────────── */
.post-photos {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
}

.photo-grid {
  display: grid;
  gap: 2px;
}
.photo-grid--1 {
  grid-template-columns: 1fr;
  aspect-ratio: 1;
}
.photo-grid--2 {
  grid-template-columns: 1fr 1fr;
  aspect-ratio: 1;
}
.photo-grid--3 {
  grid-template-columns: 1fr 1fr;
  aspect-ratio: 1;
}
.photo-grid__side {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
}

.photo-cell {
  position: relative;
  overflow: hidden;
  background: #f3f4f6;
}
.photo-cell--main {
  grid-row: 1;
}
.photo-cell__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.post-photos:hover .photo-cell__img {
  transform: scale(1.03);
}

/* +N Overlay */
.photo-cell--more {
  position: relative;
}
.photo-cell__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(1px);
}
.photo-cell__count {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}
.photo-cell__count-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 2px;
  opacity: 0.8;
}

/* Placeholder */
.photo-cell__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #d1d5db;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

/* Event Overlay */
.post-photos__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 16px 14px;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
  pointer-events: none;
}
.post-photos__title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.post-photos__meta {
  display: flex;
  align-items: center;
  gap: 14px;
}
.post-photos__date,
.post-photos__photo-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}

/* ── Actions ─────────────────────────────────────────── */
.post-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 4px;
}
.post-actions__left {
  display: flex;
  gap: 14px;
}
.post-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #262626;
  padding: 0;
  display: flex;
  transition: all 0.15s ease;
}
.post-action-btn:hover { color: #6b7280; transform: scale(1.1); }
.post-action-btn:active { transform: scale(0.9); }

/* ── Caption ─────────────────────────────────────────── */
.post-caption {
  padding: 6px 14px 14px;
}
.post-caption__likes {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}
.post-caption__text {
  font-size: 13px;
  color: #262626;
  line-height: 1.4;
}
.post-caption__author {
  font-weight: 600;
  margin-right: 6px;
}
.post-caption__view-all {
  background: none;
  border: none;
  padding: 0;
  margin-top: 6px;
  font-size: 13px;
  color: #8e8e8e;
  cursor: pointer;
  transition: color 0.2s;
}
.post-caption__view-all:hover { color: #262626; }

/* ── Animation ───────────────────────────────────────── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 500px) {
  .search-bar {
    flex-direction: column;
    gap: 8px;
  }
  .photo-cell__count {
    font-size: 22px;
  }
}
</style>
