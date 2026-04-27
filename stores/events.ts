import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useEventsStore = defineStore('events', () => {
    const { $api } = useNuxtApp()
    const events = ref([])
    const myEvents = ref([])
    const loading = ref(false)
    const error = ref('')

    async function fetchEvents(query = '') {
        loading.value = true
        try {
            const url = query 
                ? `/events?query=${encodeURIComponent(query)}`
                : `/events`
            
            const data = await $api(url)
            events.value = data
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

    return { events, myEvents, loading, error, fetchEvents, fetchMyEvents, createEvent, fetchEventById, toggleLike }
})
