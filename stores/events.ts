import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useEventsStore = defineStore('events', () => {
    const { $api } = useNuxtApp()
    const events = ref([])
    const myEvents = ref([])
    const myCollaborations = ref([])
    const loading = ref(false)
    const error = ref('')
    
    // Pagination state
    const currentPage = ref(0)
    const hasMore = ref(true)

    async function fetchEvents(options: { query?: string, page?: number, reset?: boolean } = {}) {
        const { query = '', page = 0, reset = false } = options
        
        if (reset) {
            events.value = []
            currentPage.value = 0
            hasMore.value = true
        }

        if (!hasMore.value && !reset) return

        loading.value = true
        try {
            const url = query 
                ? `/events?query=${encodeURIComponent(query)}&page=${page}&size=10`
                : `/events?page=${page}&size=10`
            
            const data = await $api(url)
            
            // Backend returns PaginatedResponse: { content, totalPages, last }
            const rawContent = data?.content || []
            const publicOnly = rawContent.filter((e: any) => 
                !e.isPrivate && 
                !e.private && 
                e.accessType !== 'UNLISTED' && 
                e.accessType !== 'RESTRICTED' &&
                !e.hasPassword
            )
            
            if (reset) {
                events.value = publicOnly
            } else {
                events.value.push(...publicOnly)
            }
            
            currentPage.value = data.pageNumber
            hasMore.value = !data.last
        } catch (e) {
            error.value = 'Failed to load events'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function fetchMyEvents() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return

        loading.value = true
        try {
            const data = await $api('/events/my-events')
            myEvents.value = data
        } catch (e) {
            error.value = 'Failed to load your events'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function fetchMyCollaborations() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return []

        loading.value = true
        try {
            const data = await $api('/events/my-collaborations')
            myCollaborations.value = data || []
            return data
        } catch (e) {
            console.error('Failed to load collaborations:', e)
            return []
        } finally {
            loading.value = false
        }
    }

    async function createEvent(eventData) {
        try {
            const data = await $api('/events', {
                method: 'POST',
                body: eventData
            })
            myEvents.value.push(data)
            return data
        } catch (e: any) {
            error.value = e?.data?.message || e?.message || 'Error al crear evento'
            console.error(e)
            return null
        }
    }

    async function updateEvent(id, eventData) {
        try {
            const data = await $api(`/events/${id}`, {
                method: 'PUT',
                body: eventData
            })
            const idx = myEvents.value.findIndex(e => e.id === id)
            if (idx !== -1) {
                myEvents.value[idx] = data
            }
            return data
        } catch (e: any) {
            error.value = e?.data?.message || e?.message || 'Error al actualizar evento'
            console.error(e)
            return null
        }
    }

    async function fetchEventById(id, password?: string) {
        loading.value = true
        try {
            const effectivePw = password || (process.client ? sessionStorage.getItem(`event_pw_${id}`) : null)
            const headers: Record<string, string> = {}
            if (effectivePw) {
                headers['X-Event-Password'] = effectivePw
            }
            return await $api(`/events/${id}`, { headers })
        } catch (e) {
            console.error(e)
            return null
        } finally {
            loading.value = false
        }
    }

    async function toggleLike(eventId) {
        try {
            const data = await $api(`/events/${eventId}/like`, {
                method: 'POST'
            })
            // Update local state
            const event = events.value.find(e => e.id === eventId)
            if (event) {
                event.isLiked = data.liked
                event.likesCount = data.likesCount
            }
            return data
        } catch (e) {
            console.error('Failed to toggle like:', e)
            return null
        }
    }

    async function fetchPhotoComments(photoId) {
        try {
            return await $api(`/comments/photo/${photoId}`)
        } catch (e) {
            console.error('Failed to fetch comments:', e)
            return []
        }
    }

    async function addPhotoComment(photoId, content) {
        try {
            return await $api(`/comments/photo/${photoId}`, {
                method: 'POST',
                body: { content }
            })
        } catch (e) {
            console.error('Failed to add comment:', e)
            return null
        }
    }

    async function toggleCommentLike(commentId) {
        try {
            return await $api(`/comments/${commentId}/like`, {
                method: 'POST'
            })
        } catch (e) {
            console.error('Failed to toggle comment like:', e)
            return null
        }
    }

    return { 
        events, myEvents, myCollaborations, loading, error, currentPage, hasMore, 
        fetchEvents, fetchMyEvents, fetchMyCollaborations, createEvent, updateEvent, fetchEventById, toggleLike,
        fetchPhotoComments, addPhotoComment, toggleCommentLike
    }
})
