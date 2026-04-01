<template>
  <div class="ig-container pt-8 px-4">
    <div v-if="pending" class="flex justify-center py-20">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-gray-400" />
    </div>
    <div v-else-if="!photographer" class="text-center py-20 text-gray-500">
        Photographer not found.
    </div>
    <div v-else>
      <!-- Profile Header -->
      <header class="flex flex-col md:flex-row items-center border-b border-[#dbdbdb] pb-12 mb-10 space-y-8 md:space-y-0 md:space-x-20 px-4 md:px-10">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div class="w-20 h-20 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[3px]">
            <div class="bg-white p-[3px] rounded-full w-full h-full">
                <div class="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                    <img v-if="photographer.profilePhotoUrl" :src="photographer.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
                    <span v-else class="text-3xl md:text-5xl font-bold text-indigo-600">{{ photographer.username.charAt(0).toUpperCase() }}</span>
                </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 text-center md:text-left">
          <div class="flex flex-col md:flex-row items-center md:space-x-6 mb-6">
            <h1 class="text-2xl md:text-[28px] font-light text-[#262626] mb-4 md:mb-0">{{ photographer.username }}</h1>
            <div class="flex space-x-2">
              <button 
                v-if="authStore.isCustomer"
                @click="toggleFollow"
                :class="[
                  photographer.isFollowing 
                    ? 'bg-white border border-[#dbdbdb] text-[#262626] hover:bg-gray-50' 
                    : 'ig-btn-primary'
                ]"
                class="px-6 py-1.5 text-sm font-semibold rounded-[4px]"
              >
                {{ photographer.isFollowing ? 'Following' : 'Follow' }}
              </button>
              <button class="bg-white border border-[#dbdbdb] p-1.5 rounded-[4px] hover:bg-gray-50">
                 <Icon name="lucide:user-plus" class="h-4 w-4" />
              </button>
              <button class="bg-white border border-[#dbdbdb] p-1.5 rounded-[4px] hover:bg-gray-50">
                 <Icon name="lucide:more-horizontal" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex justify-center md:justify-start space-x-10 mb-6">
            <span class="text-[#262626]"><strong class="font-semibold">{{ events.length }}</strong> posts</span>
            <span class="text-[#262626] cursor-pointer"><strong class="font-semibold">{{ photographer.followerCount }}</strong> followers</span>
            <span class="text-[#262626] cursor-pointer"><strong class="font-semibold">0</strong> following</span>
          </div>

          <!-- Bio -->
          <div>
            <span class="block font-semibold text-[#262626]">Photographer</span>
            <p class="text-sm text-[#262626] mt-1">{{ photographer.email }}</p>
            <p class="text-sm text-[#262626] mt-1">Professional event photographer capturing your best moments. 📸✨</p>
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <div class="flex justify-center border-t border-[#dbdbdb] mt-[-1px] uppercase tracking-widest text-[12px] font-semibold text-gray-500 space-x-14">
        <div class="flex items-center space-x-2 border-t border-[#262626] pt-4 text-[#262626] cursor-pointer">
          <Icon name="lucide:grid" class="h-3 w-3" />
          <span>Posts</span>
        </div>
        <div class="flex items-center space-x-2 pt-4 cursor-not-allowed opacity-50">
          <Icon name="lucide:clapperboard" class="h-3 w-3" />
          <span>Reels</span>
        </div>
        <div class="flex items-center space-x-2 pt-4 cursor-not-allowed opacity-50">
          <Icon name="lucide:user-square-2" class="h-3 w-3" />
          <span>Tagged</span>
        </div>
      </div>

      <!-- Events Grid -->
      <div v-if="eventsPending" class="flex justify-center py-20">
          <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin text-gray-300" />
      </div>
      <div v-else-if="events.length === 0" class="text-center py-20 text-gray-400">
          No posts yet.
      </div>
      <div v-else class="grid grid-cols-3 gap-1 md:gap-7 mt-8">
          <div 
            v-for="event in events" 
            :key="event.id" 
            class="aspect-square bg-gray-100 cursor-pointer overflow-hidden group relative"
            @click="goToEvent(event.id)"
          >
            <!-- Post Thumbnail -->
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center">
                 <img v-if="event.coverPhotoUrl" :src="event.coverPhotoUrl" alt="Event Cover" class="w-full h-full object-cover">
                 <Icon v-else name="lucide:camera" class="h-10 w-10 text-white drop-shadow-sm" />
            </div>
            
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white text-lg font-bold">
                <div class="flex items-center space-x-1">
                    <Icon name="lucide:heart" class="h-6 w-6 fill-current" />
                    <span>0</span>
                </div>
                <div class="flex items-center space-x-1">
                    <Icon name="lucide:message-circle" class="h-6 w-6 fill-current" />
                    <span>0</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const photographerId = route.params.id
const photographer = ref(null)
const events = ref([])
const pending = ref(true)
const eventsPending = ref(true)

onMounted(async () => {
    await fetchProfile()
    await fetchEvents()
})

async function fetchProfile() {
    try {
        const data = await $fetch(`${config.public.apiBase}/users/photographers/${photographerId}`, {
            headers: authStore.token ? { 'Authorization': `Bearer ${authStore.token}` } : {}
        })
        photographer.value = data
    } catch (e) {
        console.error(e)
    } finally {
        pending.value = false
    }
}

async function fetchEvents() {
    try {
        const data = await $fetch(`${config.public.apiBase}/events/photographer/${photographerId}`)
        events.value = data
    } catch (e) {
        console.error(e)
    } finally {
        eventsPending.value = false
    }
}

async function toggleFollow() {
    try {
        const method = photographer.value.isFollowing ? 'DELETE' : 'POST'
        await $fetch(`${config.public.apiBase}/users/photographers/${photographerId}/follow`, {
            method,
            headers: { 'Authorization': `Bearer ${authStore.token}` }
        })
        photographer.value.isFollowing = !photographer.value.isFollowing
        photographer.value.followerCount += photographer.value.isFollowing ? 1 : -1
    } catch (e) {
        console.error(e)
        alert('Action failed.')
    }
}

function goToEvent(id) {
    router.push(`/marketplace/events/${id}`)
}
</script>

<style scoped>
/* Standard IG grid gap is small on mobile, larger on desktop */
@media (max-width: 768px) {
  .grid {
    gap: 3px;
  }
}
</style>
