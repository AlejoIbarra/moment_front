import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useEventsStore = defineStore('events', () => {
    const { $api } = useNuxtApp()
    const events = ref([])
    const myEvents = ref([])
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
            
            // Backend now returns PaginatedResponse: { content, totalPages, last }
            if (reset) {
                events.value = data.content
            } else {
                events.value.push(...data.content)
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

    async function createEvent(eventData) {
        try {
            const data = await $api('/events', {
                method: 'POST',
                body: eventData
            })
            myEvents.value.push(data)
            return data
        } catch (e) {
            error.value = 'Failed to create event'
            console.error(e)
            return null
        }
    }

    async function fetchEventById(id) {
        try {
            return await $api(`/events/${id}`)
        } catch (e) {
            console.error(e)
            return null
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
                body: content
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
        events, myEvents, loading, error, currentPage, hasMore, 
        fetchEvents, fetchMyEvents, createEvent, fetchEventById, toggleLike,
        fetchPhotoComments, addPhotoComment, toggleCommentLike
    }
})
