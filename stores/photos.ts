import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const usePhotosStore = defineStore('photos', () => {
    const { $api } = useNuxtApp()
    const eventPhotos = ref([])
    const loading = ref(false)
    const error = ref('')
    const currentPage = ref(0)
    const hasMore = ref(true)

    function resetPagination() {
        eventPhotos.value = []
        currentPage.value = 0
        hasMore.value = true
    }

    async function fetchPhotosByEvent(eventId, page = 0, size = 15) {
        if (page === 0) {
            resetPagination()
        }
        if (!hasMore.value && page > 0) return

        loading.value = true
        try {
            const data = await $api(`/photos/event/${eventId}?page=${page}&size=${size}`)
            if (page === 0) {
                eventPhotos.value = data.content
            } else {
                eventPhotos.value.push(...data.content)
            }
            currentPage.value = data.pageNumber
            hasMore.value = !data.last
        } catch (e) {
            error.value = 'Failed to load photos'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function uploadPhoto(eventId, file, price) {
        const { compressImage } = useImageActions()
        const optimizedFile = await compressImage(file)

        const formData = new FormData()
        formData.append('file', optimizedFile)
        formData.append('price', price)

        try {
            const data = await $api(`/photos/upload/${eventId}`, {
                method: 'POST',
                body: formData
            })
            return data
        } catch (e) {
            error.value = 'Failed to upload photo'
            console.error(e)
            return null
        }
    }

    async function deletePhoto(id) {
        try {
            await $api(`/photos/${id}`, {
                method: 'DELETE'
            })
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }

    async function getDownloadUrl(id) {
        try {
            const data = await $api(`/photos/${id}/download`)
            return data
        } catch (e) {
            console.error(e)
            return null
        }
    }

    async function toggleLike(photoId) {
        try {
            const data = await $api(`/photos/${photoId}/like`, {
                method: 'POST'
            })
            // Update local state
            const photo = eventPhotos.value.find(p => p.id === photoId)
            if (photo) {
                photo.isLiked = data.liked
                photo.likesCount = data.likesCount
            }
            return data
        } catch (e) {
            console.error('Failed to toggle like:', e)
            return null
        }
    }

    return { 
        eventPhotos, loading, error, currentPage, hasMore,
        fetchPhotosByEvent, uploadPhoto, deletePhoto, getDownloadUrl, toggleLike, resetPagination
    }
})
