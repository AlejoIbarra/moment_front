import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export interface NotificationItem {
  id: number
  type: 'PURCHASE' | 'LIKE_PHOTO' | 'LIKE_EVENT' | 'COMMENT' | 'FOLLOW' | string
  message: string
  relatedId?: number | null
  isRead: boolean
  read?: boolean
  senderUsername?: string
  senderProfilePhoto?: string | null
  createdAt: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  const notifications = ref<NotificationItem[]>([])
  const unreadCount = ref<number>(0)
  const activeFilter = ref<'all' | 'unread'>('all')
  const isLoading = ref<boolean>(false)
  const isDropdownOpen = ref<boolean>(false)

  let wsSocket: WebSocket | null = null
  let pollingInterval: any = null
  let reconnectTimeout: any = null

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

  // Filtered views
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.isRead && !n.read)
  })

  const filteredNotifications = computed(() => {
    if (activeFilter.value === 'unread') {
      return unreadNotifications.value
    }
    return notifications.value
  })

  // Audio tone for new notification (Instagram/Facebook style pleasant chime)
  function playNotificationSound() {
    if (!process.client) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
        
        gain.gain.setValueAtTime(0, ctx.currentTime + start)
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + start + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime + start)
        osc.stop(ctx.currentTime + start + duration)
      }

      // Elegant two-tone bell chime (587Hz D5 -> 880Hz A5)
      playTone(587.33, 0, 0.18)
      playTone(880.00, 0.12, 0.35)
    } catch (e) {
      // Audio playback silently skipped if not allowed by browser autoplay policy
    }
  }

  // Fetch full notifications list
  async function fetchNotifications() {
    if (!authStore.isAuthenticated) return
    isLoading.value = true
    try {
      const data: any = await apiCall('/notifications')
      if (Array.isArray(data)) {
        const seenIds = new Set<number>()
        const unique: NotificationItem[] = []
        for (const item of data) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id)
            unique.push({
              ...item,
              isRead: item.isRead !== undefined ? !!item.isRead : !!item.read,
              read: item.isRead !== undefined ? !!item.isRead : !!item.read
            })
          }
        }
        notifications.value = unique
        // Recount unread
        unreadCount.value = notifications.value.filter(n => !n.isRead).length
      }
    } catch (error) {
      console.error('[NotificationsStore] Error fetching notifications:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch only unread count badge
  async function fetchUnreadCount() {
    if (!authStore.isAuthenticated) return
    try {
      const count: any = await apiCall('/notifications/unread-count')
      if (typeof count === 'number') {
        unreadCount.value = count
      }
    } catch (error) {
      console.error('[NotificationsStore] Error fetching unread count:', error)
    }
  }

  // Mark a single notification as read
  async function markAsRead(id: number) {
    // Optimistic UI update
    const target = notifications.value.find(n => n.id === id)
    const wasUnread = target && !target.isRead
    if (target) {
      target.isRead = true
      target.read = true
    }
    if (wasUnread) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }

    try {
      await apiCall(`/notifications/${id}/read`, { method: 'PUT' })
    } catch (error) {
      console.error(`[NotificationsStore] Failed to mark notification ${id} as read:`, error)
      // Revert if error
      if (target && wasUnread) {
        target.isRead = false
        target.read = false
        unreadCount.value += 1
      }
    }
  }

  // Mark all notifications as read
  async function markAllAsRead() {
    if (notifications.value.length === 0 && unreadCount.value === 0) return

    // Optimistic UI update
    const previousStates = notifications.value.map(n => ({ id: n.id, isRead: n.isRead }))
    const previousCount = unreadCount.value

    notifications.value.forEach(n => {
      n.isRead = true
      n.read = true
    })
    unreadCount.value = 0

    try {
      await apiCall('/notifications/read-all', { method: 'PUT' })
    } catch (error) {
      console.error('[NotificationsStore] Failed to mark all as read:', error)
      // Revert on error
      previousStates.forEach(ps => {
        const item = notifications.value.find(n => n.id === ps.id)
        if (item) {
          item.isRead = ps.isRead
          item.read = ps.isRead
        }
      })
      unreadCount.value = previousCount
    }
  }

  // Delete a notification
  async function deleteNotification(id: number) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index === -1) return

    const removed = notifications.value[index]
    notifications.value.splice(index, 1)
    if (!removed.isRead) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }

    try {
      await apiCall(`/notifications/${id}`, { method: 'DELETE' })
    } catch (error) {
      console.error(`[NotificationsStore] Failed to delete notification ${id}:`, error)
      notifications.value.splice(index, 0, removed)
      if (!removed.isRead) {
        unreadCount.value += 1
      }
    }
  }

  // Send a test purchase notification (useful for instant verification)
  async function sendTestPurchase() {
    if (!authStore.isAuthenticated) return
    try {
      const created: any = await apiCall('/notifications/test-purchase', { method: 'POST' })
      if (created) {
        const normalized: NotificationItem = {
          ...created,
          isRead: false,
          read: false
        }
        notifications.value.unshift(normalized)
        unreadCount.value += 1
        playNotificationSound()
      }
      return created
    } catch (error) {
      console.error('[NotificationsStore] Error creating test purchase notification:', error)
    }
  }

  // Real-time WebSocket connection
  function connectWebSocket() {
    if (!process.client || !authStore.isAuthenticated || !authStore.token) return

    if (wsSocket && (wsSocket.readyState === WebSocket.OPEN || wsSocket.readyState === WebSocket.CONNECTING)) {
      return
    }

    try {
      const base = config.public.apiBase || ''
      const wsProto = base.startsWith('https') ? 'wss' : 'ws'
      const host = base.replace(/^https?:\/\//, '').split('/')[0]
      const wsUrl = `${wsProto}://${host}/ws-notifications?token=${authStore.token}`

      wsSocket = new WebSocket(wsUrl)

      wsSocket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)
          if (parsed && parsed.type === 'CHAT_MESSAGE') {
            const chatStore = useChatStore()
            chatStore.handleIncomingWebSocketMessage(parsed.data)
            return
          }

          const normalized: NotificationItem = {
            ...parsed,
            isRead: false,
            read: false
          }
          // Avoid duplicates
          const exists = notifications.value.some(n => n.id === normalized.id)
          if (!exists) {
            notifications.value.unshift(normalized)
            unreadCount.value += 1
            playNotificationSound()
          }
        } catch (e) {
          console.error('[NotificationsStore] WebSocket message parse error:', e)
        }
      }

      wsSocket.onclose = () => {
        wsSocket = null
        if (authStore.isAuthenticated) {
          clearTimeout(reconnectTimeout)
          reconnectTimeout = setTimeout(() => {
            connectWebSocket()
          }, 8000)
        }
      }

      wsSocket.onerror = (err) => {
        // Silently caught, auto-reconnection handles it
      }
    } catch (e) {
      console.error('[NotificationsStore] Error initializing WebSocket:', e)
    }
  }

  function disconnectWebSocket() {
    clearTimeout(reconnectTimeout)
    if (wsSocket) {
      try {
        wsSocket.close()
      } catch (e) {}
      wsSocket = null
    }
  }

  // Start polling as fallback
  function startSync() {
    if (!process.client) return
    fetchUnreadCount()
    fetchNotifications()
    connectWebSocket()

    if (!pollingInterval) {
      pollingInterval = setInterval(() => {
        if (authStore.isAuthenticated) {
          fetchUnreadCount()
          if (!wsSocket || wsSocket.readyState !== WebSocket.OPEN) {
            connectWebSocket()
          }
        }
      }, 30000)
    }
  }

  function stopSync() {
    disconnectWebSocket()
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  function resetState() {
    stopSync()
    notifications.value = []
    unreadCount.value = 0
    isDropdownOpen.value = false
  }

  return {
    notifications,
    unreadCount,
    activeFilter,
    isLoading,
    isDropdownOpen,
    unreadNotifications,
    filteredNotifications,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendTestPurchase,
    playNotificationSound,
    connectWebSocket,
    disconnectWebSocket,
    startSync,
    stopSync,
    resetState
  }
})
