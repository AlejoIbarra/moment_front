<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-scale-up"
      >
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/70 to-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-sm">
              <Icon name="lucide:message-circle" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 tracking-tight">Enviar por Chat</h3>
              <p class="text-xs text-gray-500">Comparte este evento con un usuario de la app</p>
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
        <div class="p-4 bg-slate-50 border-b border-gray-100">
          <div class="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-100">
              <img
                v-if="event?.coverPhotoUrl"
                :src="event.coverPhotoUrl"
                :alt="event.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <Icon name="lucide:image" class="w-6 h-6" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Evento</span>
              </div>
              <h4 class="text-sm font-bold text-gray-900 truncate">{{ event?.title || 'Evento en Moments' }}</h4>
              <p class="text-xs text-gray-500 truncate mt-0.5">
                {{ event?.location }} <span v-if="event?.location && event?.date">•</span> {{ event?.date }}
              </p>
            </div>
          </div>

          <!-- Message input -->
          <div class="mt-3">
            <label class="block text-xs font-semibold text-gray-600 mb-1">Mensaje opcional</label>
            <input
              v-model="customMessage"
              type="text"
              placeholder="Ej: ¡Hola! Te comparto este evento para que lo veas..."
              class="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-100 bg-white">
          <div class="relative">
            <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="Buscar por @usuario o nombre..."
              class="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <Icon name="lucide:x" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Users / Contacts List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-[220px]">
          <!-- Loading Search -->
          <div v-if="chatStore.isSearching" class="py-10 flex flex-col items-center justify-center gap-2 text-gray-400">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs font-medium">Buscando usuarios...</span>
          </div>

          <!-- Search Results -->
          <div v-else-if="searchQuery.trim().length >= 2">
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Resultados de búsqueda</p>
            <div v-if="chatStore.searchResults.length === 0" class="py-8 text-center text-gray-400">
              <Icon name="lucide:user-x" class="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p class="text-xs font-medium">No se encontraron usuarios con "{{ searchQuery }}"</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="user in chatStore.searchResults"
                :key="user.id || user.username"
                class="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                    <img
                      v-if="user.profilePhotoUrl"
                      :src="user.profilePhotoUrl"
                      :alt="user.username"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="lucide:user" class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="min-w-0">
                    <h5 class="text-xs font-bold text-gray-900 truncate">
                      {{ (user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username }}
                    </h5>
                    <p class="text-[11px] text-gray-500 truncate">@{{ user.username }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
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
                    class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-60"
                  >
                    <Icon v-if="sendingUsername === user.username" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                    <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
                    <span>{{ sendingUsername === user.username ? 'Enviando...' : 'Enviar' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Default: Suggested Contacts & Recent Conversations -->
          <div v-else class="space-y-4">
            <!-- Event Photographer suggestion (if not current user) -->
            <div v-if="photographerUser && photographerUser !== authStore.user?.username">
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Fotógrafo del evento</p>
              <div class="flex items-center justify-between p-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center border border-indigo-200 flex-shrink-0">
                    <img
                      v-if="event?.photographer?.profilePhotoUrl || event?.photographerProfilePhoto"
                      :src="event?.photographer?.profilePhotoUrl || event?.photographerProfilePhoto"
                      :alt="photographerUser"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="lucide:camera" class="w-5 h-5 text-indigo-600" />
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <h5 class="text-xs font-bold text-gray-900 truncate">
                        {{ event?.photographerName || event?.photographer?.name || photographerUser }}
                      </h5>
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">Autor</span>
                    </div>
                    <p class="text-[11px] text-gray-500 truncate">@{{ photographerUser }}</p>
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
                    class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-60"
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
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">Conversaciones recientes</p>
              
              <div v-if="loadingConversations" class="py-6 flex justify-center">
                <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div v-else-if="chatStore.conversations.length === 0" class="py-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                <Icon name="lucide:users" class="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                <p class="text-xs font-medium">Aún no tienes chats iniciados</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Usa la barra superior para buscar cualquier usuario por su @username</p>
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="conv in chatStore.conversations"
                  :key="conv.id"
                  class="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                      <img
                        v-if="conv.otherUserPhoto"
                        :src="conv.otherUserPhoto"
                        :alt="conv.otherUserUsername"
                        class="w-full h-full object-cover"
                      />
                      <Icon v-else name="lucide:user" class="w-5 h-5 text-gray-400" />
                    </div>
                    <div class="min-w-0">
                      <h5 class="text-xs font-bold text-gray-900 truncate">
                        {{ conv.otherUserName || conv.otherUserUsername }}
                      </h5>
                      <p class="text-[11px] text-gray-500 truncate">@{{ conv.otherUserUsername }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      v-if="sentToUsernames.has(conv.otherUserUsername)"
                      @click="goToChat(conv.otherUserUsername)"
                      class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                    >
                      <Icon name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ver chat</span>
                    </button>
                    <button
                      v-else
                      @click="sendToUser(conv.otherUserUsername)"
                      :disabled="sendingUsername === conv.otherUserUsername"
                      class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-60"
                    >
                      <Icon v-if="sendingUsername === conv.otherUserUsername" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                      <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
                      <span>{{ sendingUsername === conv.otherUserUsername ? 'Enviando...' : 'Enviar' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            @click="goToGeneralChat"
            class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 hover:underline"
          >
            <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
            <span>Abrir ventana de Chat</span>
          </button>
          <button
            @click="close"
            class="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
const authStore = useAuthStore()
const chatStore = useChatStore()
const toast = useToast()

const searchQuery = ref('')
const customMessage = ref('')
const sendingUsername = ref(null)
const sentToUsernames = ref(new Set())
const loadingConversations = ref(false)
let searchDebounce = null

const photographerUser = computed(() => {
  return props.event?.photographerUsername || props.event?.photographer?.username || ''
})

const targetEventId = computed(() => {
  return props.event?.id || props.event?.uuid || props.eventId
})

watch(() => props.modelValue, async (val) => {
  if (val && authStore.isAuthenticated) {
    if (!customMessage.value && props.event?.title) {
      customMessage.value = `¡Hola! Te comparto este evento: ${props.event.title}`
    }
    loadingConversations.value = true
    try {
      await chatStore.fetchConversations()
    } catch (e) {
      // Ignore
    } finally {
      loadingConversations.value = false
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

async function sendToUser(username) {
  if (!authStore.isAuthenticated) {
    toast.warning('Inicia sesión', 'Debes iniciar sesión para enviar mensajes.')
    router.push('/login')
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
