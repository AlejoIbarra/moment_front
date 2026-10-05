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
    const totalPhotos = ref(0)

    function resetPagination() {
        eventPhotos.value = []
        currentPage.value = 0
        hasMore.value = true
        totalPhotos.value = 0
    }

    async function fetchPhotosByEvent(eventId, page = 0, size = 15, password?: string) {
        if (page === 0) {
            resetPagination()
        }
        if (!hasMore.value && page > 0) return

        loading.value = true
        try {
            const effectivePw = password || (process.client ? sessionStorage.getItem(`event_pw_${eventId}`) : null)
            const headers: Record<string, string> = {}
            if (effectivePw) {
                headers['X-Event-Password'] = effectivePw
            }
            const data = await $api(`/photos/event/${eventId}?page=${page}&size=${size}`, { headers })
            if (page === 0) {
                eventPhotos.value = data.content
            } else {
                eventPhotos.value.push(...data.content)
            }
            currentPage.value = data.pageNumber
            hasMore.value = !data.last
            totalPhotos.value = data.totalElements || 0
        } catch (e) {
            error.value = 'Failed to load photos'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function uploadPhoto(eventId, file, price, bibNumbers = '', runAI = true, inviteToken = '') {
        const { compressImage } = useImageActions()
        const optimizedFile = await compressImage(file)

        const formData = new FormData()
        formData.append('file', optimizedFile)
        formData.append('price', price)
        formData.append('runAI', runAI.toString())
        if (bibNumbers) {
            formData.append('bibNumbers', bibNumbers)
        }

        const effectiveInviteToken = inviteToken || (process.client ? (sessionStorage.getItem(`event_invite_${eventId}`) || '') : '')
        const queryParams = effectiveInviteToken ? `?inviteToken=${encodeURIComponent(effectiveInviteToken)}` : ''
        const customHeaders: Record<string, string> = {}
        if (effectiveInviteToken) {
            customHeaders['X-Invite-Token'] = effectiveInviteToken
        }

        try {
            const data = await $api(`/photos/upload/${eventId}${queryParams}`, {
                method: 'POST',
                body: formData,
                headers: Object.keys(customHeaders).length ? customHeaders : undefined
            })
            return data
        } catch (e: any) {
            const serverMsg = e?.response?._data?.message || e?.data?.message || e?.data?.error || e?.message || 'Error al subir la foto'
            error.value = serverMsg
            console.error('Failed to upload photo:', serverMsg, e)
            throw new Error(serverMsg)
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

    async function getDownloadInfo(id) {
        try {
            const data = await $api(`/photos/${id}/download-info`)
            return data
        } catch (e) {
            console.error('Failed to get download info:', e)
            throw e
        }
    }

    async function resolveDownload(target) {
        try {
            const data = await $api(`/photos/resolve-download`, {
                params: { target }
            })
            return data
        } catch (e) {
            console.error('Failed to resolve download target:', e)
            throw e
        }
    }

    return { 
        eventPhotos, loading, error, currentPage, hasMore, totalPhotos,
        fetchPhotosByEvent, uploadPhoto, deletePhoto, getDownloadUrl, getDownloadInfo, resolveDownload, toggleLike, resetPagination
    }
})
