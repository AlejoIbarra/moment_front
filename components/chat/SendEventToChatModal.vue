<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-scale-up"
      >
        <!-- Modal Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/70 to-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-xs">
              <Icon name="lucide:send" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-extrabold text-gray-900 tracking-tight">Compartir Evento</h3>
              <p class="text-xs text-gray-500">Por WhatsApp, enlace o chat interno de Moments</p>
            </div>
          </div>
          <button
            @click="close"
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Event Mini Card Preview -->
        <div class="p-3.5 sm:p-4 bg-slate-50 border-b border-gray-100">
          <div class="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-100">
              <img
                v-if="event?.coverPhotoUrl"
                :src="event.coverPhotoUrl"
                :alt="event?.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <Icon name="lucide:image" class="w-6 h-6" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Evento</span>
                <span v-if="photographerUser" class="text-[10px] text-gray-400 truncate">
                  • por @{{ photographerUser }}
                </span>
              </div>
              <h4 class="text-sm font-bold text-gray-900 truncate">{{ event?.title || 'Evento en Moments' }}</h4>
              <p class="text-xs text-gray-500 truncate mt-0.5">
                {{ event?.location }} <span v-if="event?.location && event?.date">•</span> {{ event?.date }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick External Share Row (WhatsApp, Copiar Enlace, Más) -->
        <div class="px-5 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between gap-3">
          <!-- WhatsApp -->
          <button
            @click="shareWhatsApp"
            class="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 transition-all border border-emerald-100 group active:scale-95"
            title="Compartir por WhatsApp"
          >
            <div class="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Icon name="lucide:message-circle" class="w-5 h-5" />
            </div>
            <span class="text-[11px] font-bold text-emerald-800">WhatsApp</span>
          </button>

          <!-- Copiar enlace -->
          <button
            @click="copyLink"
            class="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all border border-slate-200/70 group active:scale-95"
            title="Copiar enlace"
          >
            <div :class="[
              'w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-all',
              copied ? 'bg-emerald-600 text-white' : 'bg-slate-200/80 text-slate-700'
            ]">
              <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="w-5 h-5" />
            </div>
            <span class="text-[11px] font-bold text-slate-700">
              {{ copied ? '¡Copiado!' : 'Copiar link' }}
            </span>
          </button>

          <!-- Más opciones (Web Share API) -->
          <button
            @click="shareSystem"
            class="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-900 transition-all border border-indigo-100 group active:scale-95"
            title="Más opciones de compartir"
          >
            <div class="w-11 h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Icon name="lucide:share-2" class="w-5 h-5" />
            </div>
            <span class="text-[11px] font-bold text-indigo-800">Más</span>
          </button>
        </div>

        <!-- Section Title: Chat Interno -->
        <div class="px-5 py-2 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="lucide:message-square" class="w-3.5 h-3.5 text-emerald-600" />
            Enviar por Chat de Moments
          </span>
          <span v-if="authStore.isAuthenticated" class="text-[10px] text-slate-400">
            Un clic para enviar
          </span>
        </div>

        <!-- If user not logged in: Banner encouraging login -->
        <div v-if="!authStore.isAuthenticated" class="p-6 text-center bg-white flex-1 flex flex-col items-center justify-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Icon name="lucide:user" class="w-6 h-6" />
          </div>
          <h4 class="text-sm font-bold text-slate-900 mb-1">Inicia sesión para enviar por Chat</h4>
          <p class="text-xs text-slate-500 max-w-xs mb-4">
            Comparte eventos al instante con fotógrafos y amigos dentro de Moments.
          </p>
          <button
            @click="goToLogin"
            class="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            Iniciar sesión
          </button>
        </div>

        <!-- If user is authenticated: Search & Users list -->
        <template v-else>
          <!-- Optional custom message input -->
          <div class="p-3 bg-white border-b border-gray-100">
            <input
              v-model="customMessage"
              type="text"
              placeholder="Mensaje opcional (ej: ¡Hola! Te comparto este evento)..."
              class="w-full px-3.5 py-2 text-xs bg-slate-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          <!-- Search Bar -->
          <div class="px-4 py-2.5 border-b border-gray-100 bg-white">
            <div class="relative">
              <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                v-model="searchQuery"
                @input="onSearchInput"
                type="text"
                placeholder="Buscar por @usuario o nombre..."
                class="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <Icon name="lucide:x" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Users / Contacts List -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            <!-- Loading Search -->
            <div v-if="chatStore.isSearching" class="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
              <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-medium">Buscando usuarios...</span>
            </div>

            <!-- Search Results -->
            <div v-else-if="searchQuery.trim().length >= 2">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Resultados de búsqueda</p>
              <div v-if="chatStore.searchResults.length === 0" class="py-6 text-center text-gray-400">
                <Icon name="lucide:user-x" class="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                <p class="text-xs font-medium">No se encontraron usuarios con "{{ searchQuery }}"</p>
              </div>
              <div v-else class="space-y-1.5">
                <div
                  v-for="user in chatStore.searchResults"
                  :key="user.id || user.username"
                  class="flex items-center justify-between p-2.5 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                      <img
                        v-if="user.profilePhotoUrl"
                        :src="user.profilePhotoUrl"
                        :alt="user.username"
                        class="w-full h-full object-cover"
                      />
                      <Icon v-else name="lucide:user" class="w-4 h-4 text-gray-400" />
                    </div>
                    <div class="min-w-0">
                      <h5 class="text-xs font-bold text-gray-900 truncate">
                        {{ (user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username }}
                      </h5>
                      <p class="text-[10px] text-gray-500 truncate">@{{ user.username }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button
                      v-if="sentToUsernames.has(user.username)"
                      @click="goToChat(user.username)"
                      class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                    >
                      <Icon name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ver chat</span>
                    </button>
                    <button
                      v-else
                      @click="sendToUser(user.username)"
                      :disabled="sendingUsername === user.username"
                      class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all disabled:opacity-60"
                    >
                      <Icon v-if="sendingUsername === user.username" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                      <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
                      <span>{{ sendingUsername === user.username ? 'Enviando...' : 'Enviar' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Default: Photographer & Recent Conversations -->
            <div v-else class="space-y-3.5">
              <!-- Event Photographer suggestion (if not current user) -->
              <div v-if="photographerUser && photographerUser !== authStore.user?.username">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 px-1">Fotógrafo del evento</p>
                <div class="flex items-center justify-between p-2.5 rounded-2xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="relative w-9 h-9 rounded-xl overflow-hidden bg-indigo-100 flex items-center justify-center border border-indigo-200 flex-shrink-0">
                      <img
                        v-if="event?.photographer?.profilePhotoUrl || event?.photographerProfilePhoto"
                        :src="event?.photographer?.profilePhotoUrl || event?.photographerProfilePhoto"
                        :alt="photographerUser"
                        class="w-full h-full object-cover"
                      />
                      <Icon v-else name="lucide:camera" class="w-4 h-4 text-indigo-600" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <h5 class="text-xs font-bold text-gray-900 truncate">
                          {{ event?.photographerName || event?.photographer?.name || photographerUser }}
                        </h5>
                        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">Autor</span>
                      </div>
                      <p class="text-[10px] text-gray-500 truncate">@{{ photographerUser }}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      v-if="sentToUsernames.has(photographerUser)"
                      @click="goToChat(photographerUser)"
                      class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                    >
                      <Icon name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ver chat</span>
                    </button>
                    <button
                      v-else
                      @click="sendToUser(photographerUser)"
                      :disabled="sendingUsername === photographerUser"
                      class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all disabled:opacity-60"
                    >
                      <Icon v-if="sendingUsername === photographerUser" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                      <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
                      <span>{{ sendingUsername === photographerUser ? 'Enviando...' : 'Enviar' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Recent Conversations -->
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 px-1">Conversaciones recientes</p>
                
                <div v-if="loadingConversations" class="py-5 flex justify-center">
                  <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>

                <div v-else-if="chatStore.conversations.length === 0" class="py-5 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                  <Icon name="lucide:users" class="w-6 h-6 mx-auto mb-1 opacity-40" />
                  <p class="text-xs font-medium">Aún no tienes chats previos</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Usa la barra superior para buscar cualquier usuario por @username</p>
                </div>

                <div v-else class="space-y-1.5">
                  <div
                    v-for="conv in chatStore.conversations"
                    :key="conv.id"
                    class="flex items-center justify-between p-2.5 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="relative w-9 h-9 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <img
                          v-if="conv.otherProfilePhoto || conv.otherUserPhoto"
                          :src="conv.otherProfilePhoto || conv.otherUserPhoto"
                          :alt="conv.otherUsername || conv.otherUserUsername"
                          class="w-full h-full object-cover"
                        />
                        <span v-else class="text-xs font-bold text-gray-700">
                          {{ (conv.otherUsername || conv.otherUserUsername || '?').charAt(0).toUpperCase() }}
                        </span>
                        <span v-if="conv.otherIsOnline" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>
                      <div class="min-w-0">
                        <h5 class="text-xs font-bold text-gray-900 truncate">
                          {{ conv.otherDisplayName || conv.otherUserName || conv.otherUsername || conv.otherUserUsername }}
                        </h5>
                        <p class="text-[10px] text-gray-500 truncate flex items-center gap-1">
                          <span>@{{ conv.otherUsername || conv.otherUserUsername }}</span>
                          <span v-if="conv.otherIsOnline" class="text-emerald-600 font-medium">· en línea</span>
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <button
                        v-if="sentToUsernames.has(conv.otherUsername || conv.otherUserUsername)"
                        @click="goToChat(conv.otherUsername || conv.otherUserUsername)"
                        class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                      >
                        <Icon name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ver chat</span>
                      </button>
                      <button
                        v-else
                        @click="sendToUser(conv.otherUsername || conv.otherUserUsername)"
                        :disabled="sendingUsername === (conv.otherUsername || conv.otherUserUsername)"
                        class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all disabled:opacity-60"
                      >
                        <Icon v-if="sendingUsername === (conv.otherUsername || conv.otherUserUsername)" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                        <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
                        <span>{{ sendingUsername === (conv.otherUsername || conv.otherUserUsername) ? 'Enviando...' : 'Enviar' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            v-if="authStore.isAuthenticated"
            @click="goToGeneralChat"
            class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 hover:underline"
          >
            <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
            <span>Abrir ventana de Chat</span>
          </button>
          <span v-else class="text-xs text-gray-400">Moments Gallery</span>

          <button
            @click="close"
            class="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: null
  },
  eventId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'sent'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const chatStore = useChatStore()
const toast = useToast()

const searchQuery = ref('')
const customMessage = ref('')
const sendingUsername = ref(null)
const sentToUsernames = ref(new Set())
const loadingConversations = ref(false)
const copied = ref(false)
let searchDebounce = null

const photographerUser = computed(() => {
  return props.event?.photographerUsername || props.event?.photographer?.username || ''
})

const targetEventId = computed(() => {
  return props.event?.id || props.event?.uuid || props.eventId
})

watch(() => props.modelValue, async (val) => {
  if (val) {
    if (!customMessage.value && props.event?.title) {
      customMessage.value = `¡Hola! Te comparto este evento: ${props.event.title}`
    }
    if (authStore.isAuthenticated) {
      loadingConversations.value = true
      try {
        await chatStore.fetchConversations()
      } catch (e) {
        // Ignore
      } finally {
        loadingConversations.value = false
      }
    }
  }
})

function close() {
  emit('update:modelValue', false)
  clearSearch()
}

function clearSearch() {
  searchQuery.value = ''
  chatStore.searchResults = []
}

function onSearchInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    if (searchQuery.value.trim().length >= 2) {
      chatStore.searchUsers(searchQuery.value)
    } else {
      chatStore.searchResults = []
    }
  }, 250)
}

function getEventUrl() {
  const evId = targetEventId.value
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.moments-gallery.com'
  return `${origin}/marketplace/events/${evId}`
}

function shareWhatsApp() {
  const url = getEventUrl()
  const title = props.event?.title || 'este evento'
  const author = photographerUser.value ? ` de @${photographerUser.value}` : ''
  const text = `¡Mira las fotos del evento "${title}"${author} en Moments Gallery! 📸✨\n\n${url}`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(waUrl, '_blank')
}

async function copyLink() {
  const url = getEventUrl()
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
    }
    copied.value = true
    toast.success('¡Enlace copiado!', 'El enlace del evento se ha copiado al portapapeles.')
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.error('Error copying link:', err)
    toast.error('Error', 'No se pudo copiar el enlace.')
  }
}

async function shareSystem() {
  const url = getEventUrl()
  const title = props.event?.title || 'Evento en Moments Gallery'
  const shareData = {
    title: `${title} | Moments`,
    text: `¡Mira este evento en Moments Gallery! 📸`,
    url
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        copyLink()
      }
    }
  } else {
    copyLink()
  }
}

async function sendToUser(username) {
  if (!authStore.isAuthenticated) {
    toast.warning('Inicia sesión', 'Debes iniciar sesión para enviar mensajes.')
    goToLogin()
    return
  }

  sendingUsername.value = username
  try {
    const msg = customMessage.value.trim() || (props.event?.title ? `Te comparto este evento: ${props.event.title}` : 'Te comparto un evento')
    await chatStore.startConversation(username, targetEventId.value, msg)
    sentToUsernames.value.add(username)
    toast.success('¡Evento enviado!', `Has compartido el evento con @${username}`)
    emit('sent', { username, eventId: targetEventId.value })
  } catch (err) {
    console.error('Error sending event to user:', err)
    toast.error('Error al enviar', 'No se pudo enviar el evento. Intenta de nuevo.')
  } finally {
    sendingUsername.value = null
  }
}

function goToChat(username) {
  close()
  router.push(`/chat?user=${encodeURIComponent(username)}`)
}

function goToGeneralChat() {
  close()
  if (targetEventId.value) {
    router.push(`/chat?event=${targetEventId.value}`)
  } else {
    router.push('/chat')
  }
}

function goToLogin() {
  close()
  router.push('/login?redirect=' + encodeURIComponent(route.fullPath || '/marketplace'))
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

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
