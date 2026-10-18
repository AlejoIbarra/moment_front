import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useNotificationsStore } from '~/stores/notifications'

export interface GameEventPayload {
  type: 'GAME_EVENT'
  action: 'QUEST_PHOTO_SUBMITTED' | 'CONTEST_PHOTO_ADDED' | 'CONTEST_LIKE_TOGGLED' | 'CONTEST_WINNER_DECLARED' | 'CONTEST_STATUS_CHANGED' | 'CONTEST_PHOTO_DELETED' | 'ARCADE_SCORE_SUBMITTED'
  eventId?: number
  gameUuid?: string
  timestamp: number
  data?: any
}

export interface UseGameLiveSyncOptions {
  eventId?: any // Ref<number | null> | number | null
  gameUuid?: any // Ref<string | null> | string | null
  onEvent?: (event: GameEventPayload) => void
  onFallbackSync?: () => void
}

export function useGameLiveSync(options: UseGameLiveSyncOptions = {}) {
  const isConnected = ref(false)
  const lastEventReceived = ref<number | null>(null)
  const authStore = useAuthStore()
  const notifStore = useNotificationsStore()
  const config = useRuntimeConfig()

  let standaloneSocket: WebSocket | null = null
  let reconnectTimer: any = null
  let fallbackTimer: any = null

  function getTargetEventId(): number | null {
    if (!options.eventId) return null
    const val = typeof options.eventId === 'object' && 'value' in options.eventId ? options.eventId.value : options.eventId
    return val ? Number(val) : null
  }

  function getTargetGameUuid(): string | null {
    if (!options.gameUuid) return null
    const val = typeof options.gameUuid === 'object' && 'value' in options.gameUuid ? options.gameUuid.value : options.gameUuid
    return val ? String(val) : null
  }

  function handleIncomingEvent(eventPayload: GameEventPayload) {
    if (!eventPayload || eventPayload.type !== 'GAME_EVENT') return

    const targetEventId = getTargetEventId()
    const targetGameUuid = getTargetGameUuid()

    // If filtered by eventId and doesn't match, ignore
    if (targetEventId && eventPayload.eventId && Number(eventPayload.eventId) !== targetEventId) {
      return
    }

    // If filtered by gameUuid and doesn't match, ignore
    if (targetGameUuid && eventPayload.gameUuid && eventPayload.gameUuid !== targetGameUuid) {
      return
    }

    lastEventReceived.value = Date.now()
    if (options.onEvent) {
      options.onEvent(eventPayload)
    }
  }

  function onWindowGameEvent(e: Event) {
    const customEv = e as CustomEvent<GameEventPayload>
    if (customEv.detail) {
      isConnected.value = true
      handleIncomingEvent(customEv.detail)
    }
  }

  function connectStandalone() {
    if (!process.client) return
    if (standaloneSocket && (standaloneSocket.readyState === WebSocket.OPEN || standaloneSocket.readyState === WebSocket.CONNECTING)) {
      return
    }

    try {
      const base = config.public.apiBase || ''
      const wsProto = base.startsWith('https') ? 'wss' : 'ws'
      const host = base.replace(/^https?:\/\//, '').split('/')[0]
      const tokenParam = authStore.token ? `?token=${authStore.token}` : ''
      const wsUrl = `${wsProto}://${host}/ws-notifications${tokenParam}`

      standaloneSocket = new WebSocket(wsUrl)

      standaloneSocket.onopen = () => {
        isConnected.value = true
      }

      standaloneSocket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)
          if (parsed && parsed.type === 'GAME_EVENT') {
            handleIncomingEvent(parsed)
          }
        } catch (err) {
          console.error('[GameLiveSync] Error parsing message:', err)
        }
      }

      standaloneSocket.onclose = () => {
        isConnected.value = false
        standaloneSocket = null
        clearTimeout(reconnectTimer)
        reconnectTimer = setTimeout(connectStandalone, 5000)
      }

      standaloneSocket.onerror = () => {
        isConnected.value = false
      }
    } catch (err) {
      console.error('[GameLiveSync] Connection error:', err)
    }
  }

  onMounted(() => {
    if (!process.client) return

    // 1. Listen for global events dispatched by notificationsStore / Navbar
    window.addEventListener('moment:game_event', onWindowGameEvent)

    // 2. Ensure WebSocket is connected
    if (authStore.isAuthenticated) {
      notifStore.connectWebSocket()
      isConnected.value = true
    } else {
      // Connect anonymous/guest standalone socket
      connectStandalone()
    }

    // 3. Fallback heartbeat: every 60s, if page is visible and fallback provided
    if (options.onFallbackSync) {
      fallbackTimer = setInterval(() => {
        if (typeof document !== 'undefined' && !document.hidden) {
          options.onFallbackSync?.()
        }
      }, 60000)
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('moment:game_event', onWindowGameEvent)
    }
    clearTimeout(reconnectTimer)
    if (fallbackTimer) {
      clearInterval(fallbackTimer)
    }
    if (standaloneSocket) {
      try {
        standaloneSocket.close()
      } catch (e) {}
      standaloneSocket = null
    }
  })

  return {
    isConnected,
    lastEventReceived
  }
}
