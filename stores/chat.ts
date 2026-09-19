import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export interface ChatMessageItem {
  id: number
  conversationId: number
  senderId: number
  senderUsername: string
  senderProfilePhoto?: string | null
  recipientId: number
  recipientUsername: string
  type: 'TEXT' | 'EVENT' | 'PHOTO'
  content: string
  attachmentId?: number | null
  attachmentMeta?: string | null
  parsedMeta?: any
  isRead: boolean
  createdAt: string
}

export interface ChatConversationItem {
  id: number
  otherUserId: number
  otherUsername: string
  otherDisplayName: string
  otherProfilePhoto?: string | null
  otherRole?: string | null
  lastMessageContent?: string | null
  lastMessageTimestamp?: string | null
  lastMessageType?: 'TEXT' | 'EVENT' | 'PHOTO' | null
  unreadCount: number
  otherIsOnline?: boolean
  otherLastSeen?: string | null
  createdAt: string
}

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  const conversations = ref<ChatConversationItem[]>([])
  const activeConversation = ref<ChatConversationItem | null>(null)
  const messages = ref<ChatMessageItem[]>([])
  const unreadCount = ref<number>(0)
  const isLoadingConversations = ref<boolean>(false)
  const isLoadingMessages = ref<boolean>(false)
  const isSending = ref<boolean>(false)
  const searchQuery = ref<string>('')
  const searchResults = ref<any[]>([])
  const isSearching = ref<boolean>(false)

  let pollingInterval: any = null

  // Helpers to safely call api
  const apiCall = (url: string, opts: any = {}) => {
    if (nuxtApp.$api) {
      return (nuxtApp.$api as any)(url, opts)
    }
    return $fetch(`${config.public.apiBase}${url}`, {
      ...opts,
      headers: {
        ...(opts.headers || {}),
        Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  // Pleasant pop notification sound for incoming chat (WhatsApp style)
  function playChatSound() {
    if (!process.client) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (e) {
      // Audio autoplay policy may prevent playback before user interaction
    }
  }

  function parseMessage(m: any): ChatMessageItem {
    let meta = null
    if (m.attachmentMeta) {
      try {
        meta = typeof m.attachmentMeta === 'string' ? JSON.parse(m.attachmentMeta) : m.attachmentMeta
      } catch (e) {}
    }
    return {
      ...m,
      parsedMeta: meta
    }
  }

  async function fetchConversations() {
    if (!authStore.isAuthenticated) return
    isLoadingConversations.value = true
    try {
      const res: any = await apiCall('/chat/conversations')
      if (Array.isArray(res)) {
        conversations.value = res
        // Sync active conversation online status if selected
        if (activeConversation.value) {
          const fresh = res.find(c => c.id === activeConversation.value?.id)
          if (fresh) {
            activeConversation.value.otherIsOnline = fresh.otherIsOnline
            activeConversation.value.otherLastSeen = fresh.otherLastSeen
          }
        }
        // Recalculate total unread
        unreadCount.value = res.reduce((acc, c) => acc + (c.unreadCount || 0), 0)
      }
    } catch (e) {
      console.error('[ChatStore] Error fetching conversations:', e)
    } finally {
      isLoadingConversations.value = false
    }
  }

  async function fetchUserStatus(username: string) {
    if (!authStore.isAuthenticated || !username) return null
    try {
      const res: any = await apiCall(`/chat/users/${encodeURIComponent(username)}/status`)
      if (res && activeConversation.value && activeConversation.value.otherUsername === username) {
        activeConversation.value.otherIsOnline = !!res.isOnline
        activeConversation.value.otherLastSeen = res.lastSeen || null
      }
      return res
    } catch (e) {
      return null
    }
  }

  async function fetchUnreadCount() {
    if (!authStore.isAuthenticated) return
    try {
      const res: any = await apiCall('/chat/unread-count')
      if (typeof res === 'number') {
        unreadCount.value = res
      }
    } catch (e) {
      // Ignore
    }
  }

  async function selectConversation(conv: ChatConversationItem) {
    activeConversation.value = conv
    isLoadingMessages.value = true
    try {
      const res: any = await apiCall(`/chat/conversations/${conv.id}/messages`)
      if (Array.isArray(res)) {
        messages.value = res.map(parseMessage)
      }

      // Mark as read locally and in conversation item
      if (conv.unreadCount > 0) {
        unreadCount.value = Math.max(0, unreadCount.value - conv.unreadCount)
        conv.unreadCount = 0
      }
    } catch (e) {
      console.error('[ChatStore] Error loading messages:', e)
    } finally {
      isLoadingMessages.value = false
    }
  }

  async function startConversation(username: string, eventId?: string | number | null, initialMessage?: string) {
    if (!authStore.isAuthenticated) return null
    try {
      const payload: any = { recipientUsername: username }
      if (eventId) payload.eventId = String(eventId)
      if (initialMessage) payload.initialMessage = initialMessage

      const conv: any = await apiCall('/chat/conversations/start', {
        method: 'POST',
        body: payload
      })

      if (conv && conv.id) {
        const existingIdx = conversations.value.findIndex(c => c.id === conv.id)
        if (existingIdx !== -1) {
          conversations.value[existingIdx] = conv
        } else {
          conversations.value.unshift(conv)
        }
        await selectConversation(conv)
        return conv
      }
    } catch (e) {
      console.error('[ChatStore] Error starting conversation:', e)
      throw e
    }
    return null
  }

  async function sendMessage(content: string, type: 'TEXT' | 'EVENT' | 'PHOTO' | 'GIFT_CARD' = 'TEXT', attachmentId?: string | number | null) {
    if (!activeConversation.value || !authStore.isAuthenticated) return
    isSending.value = true

    try {
      const payload = {
        conversationId: activeConversation.value.id,
        recipientUsername: activeConversation.value.otherUsername,
        content: content.trim(),
        type,
        attachmentId
      }

      const res: any = await apiCall('/chat/messages', {
        method: 'POST',
        body: payload
      })

      if (res && res.id) {
        const parsed = parseMessage(res)
        // Avoid duplicate if socket delivered it earlier
        if (!messages.value.some(m => m.id === parsed.id)) {
          messages.value.push(parsed)
        }

        // Update active conversation preview
        activeConversation.value.lastMessageContent = parsed.content
        activeConversation.value.lastMessageTimestamp = parsed.createdAt
        activeConversation.value.lastMessageType = parsed.type

        // Move to top of conversations list
        const cIdx = conversations.value.findIndex(c => c.id === activeConversation.value?.id)
        if (cIdx !== -1) {
          const [c] = conversations.value.splice(cIdx, 1)
          c.lastMessageContent = parsed.content
          c.lastMessageTimestamp = parsed.createdAt
          c.lastMessageType = parsed.type
          conversations.value.unshift(c)
        }
      }
      return res
    } catch (e) {
      console.error('[ChatStore] Error sending message:', e)
      throw e
    } finally {
      isSending.value = false
    }
  }

  async function searchUsers(q: string) {
    if (!q || q.trim().length < 2) {
      searchResults.value = []
      return
    }
    isSearching.value = true
    try {
      const res: any = await apiCall(`/chat/search-users?q=${encodeURIComponent(q.trim())}`)
      if (Array.isArray(res)) {
        searchResults.value = res
      }
    } catch (e) {
      console.error('[ChatStore] Error searching users:', e)
    } finally {
      isSearching.value = false
    }
  }

  function handleIncomingWebSocketMessage(rawMsg: any) {
    if (!rawMsg || !rawMsg.id) return
    const msg = parseMessage(rawMsg)

    // Check if it belongs to currently active conversation
    if (activeConversation.value && activeConversation.value.id === msg.conversationId) {
      if (!messages.value.some(m => m.id === msg.id)) {
        messages.value.push(msg)
      }
      // If message is from other user, mark it as read immediately
      if (msg.senderUsername !== authStore.user?.username) {
        apiCall(`/chat/conversations/${msg.conversationId}/read`, { method: 'PUT' }).catch(() => {})
        playChatSound()
      }
    } else {
      // Message in another conversation -> increment unread count & play sound
      if (msg.senderUsername !== authStore.user?.username) {
        unreadCount.value += 1
        playChatSound()
      }
    }

    // Update conversation in sidebar list
    const cIdx = conversations.value.findIndex(c => c.id === msg.conversationId)
    if (cIdx !== -1) {
      const conv = conversations.value[cIdx]
      conv.lastMessageContent = msg.content
      conv.lastMessageTimestamp = msg.createdAt
      conv.lastMessageType = msg.type
      if (!activeConversation.value || activeConversation.value.id !== msg.conversationId) {
        if (msg.senderUsername !== authStore.user?.username) {
          conv.unreadCount = (conv.unreadCount || 0) + 1
        }
      }
      // Re-order to top
      conversations.value.splice(cIdx, 1)
      conversations.value.unshift(conv)
    } else {
      // New conversation created from outside -> fetch conversations list
      fetchConversations()
    }
  }

  function startPolling() {
    if (pollingInterval) return
    pollingInterval = setInterval(async () => {
      if (authStore.isAuthenticated) {
        // Fetch conversations to discover new chats or update unread counts
        try {
          const res: any = await apiCall('/chat/conversations')
          if (Array.isArray(res)) {
            conversations.value = res
            if (activeConversation.value) {
              const fresh = res.find((c: any) => c.id === activeConversation.value?.id)
              if (fresh) {
                activeConversation.value.otherIsOnline = fresh.otherIsOnline
                activeConversation.value.otherLastSeen = fresh.otherLastSeen
              }
            }
            unreadCount.value = res.reduce((acc: number, c: any) => acc + (c.unreadCount || 0), 0)
          }
        } catch (e) {}

        if (activeConversation.value) {
          // Refresh messages for currently open conversation
          apiCall(`/chat/conversations/${activeConversation.value.id}/messages`).then((res: any) => {
            if (Array.isArray(res)) {
              const currentLen = messages.value.length
              messages.value = res.map(parseMessage)
              if (res.length > currentLen) {
                const last = res[res.length - 1]
                if (last && last.senderUsername !== authStore.user?.username) {
                  playChatSound()
                }
              }
            }
          }).catch(() => {})
        }
      }
    }, 4000)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  function resetState() {
    stopPolling()
    conversations.value = []
    activeConversation.value = null
    messages.value = []
    unreadCount.value = 0
    searchResults.value = []
  }

  return {
    conversations,
    activeConversation,
    messages,
    unreadCount,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    searchQuery,
    searchResults,
    isSearching,
    fetchConversations,
    fetchUnreadCount,
    fetchUserStatus,
    selectConversation,
    startConversation,
    sendMessage,
    searchUsers,
    handleIncomingWebSocketMessage,
    startPolling,
    stopPolling,
    resetState
  }
})
