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

    async function refreshProcessingPhotos(eventId, size = 30, password?: string) {
        try {
            const effectivePw = password || (process.client ? sessionStorage.getItem(`event_pw_${eventId}`) : null)
            const headers: Record<string, string> = {}
            if (effectivePw) {
                headers['X-Event-Password'] = effectivePw
            }
            const data = await $api(`/photos/event/${eventId}?page=0&size=${size}`, { headers })
            const freshList = data?.content || []
            if (!freshList.length) return

            const freshById = new Map(freshList.map((p: any) => [p.id, p]))
            eventPhotos.value = eventPhotos.value.map((existing: any) => {
                const updated = freshById.get(existing.id)
                return updated ? { ...existing, ...updated } : existing
            })
            const existingIds = new Set(eventPhotos.value.map((p: any) => p.id))
            const newPhotos = freshList.filter((p: any) => !existingIds.has(p.id))
            if (newPhotos.length > 0) {
                eventPhotos.value = [...newPhotos, ...eventPhotos.value]
            }
            totalPhotos.value = data.totalElements || totalPhotos.value
        } catch (e) {
            // Silent background refresh
        }
    }

    async function uploadPhoto(eventId, file, price, bibNumbers = '', runAI: boolean | string = true, inviteToken = '', aiMode?: string) {
        const { compressImage } = useImageActions()
        const optimizedFile = await compressImage(file)

        let effectiveAiMode = aiMode
        let effectiveRunAI = true
        if (typeof runAI === 'string') {
            effectiveAiMode = runAI
            effectiveRunAI = runAI !== 'NONE'
        } else {
            effectiveRunAI = Boolean(runAI)
            if (!effectiveAiMode) {
                effectiveAiMode = effectiveRunAI ? 'BOTH' : 'NONE'
            }
        }

        const formData = new FormData()
        formData.append('file', optimizedFile)
        formData.append('price', price)
        formData.append('runAI', effectiveRunAI.toString())
        formData.append('aiMode', effectiveAiMode)
        if (bibNumbers) {
            formData.append('bibNumbers', bibNumbers)
        }

        const effectiveInviteToken = inviteToken || (process.client ? (sessionStorage.getItem(`event_invite_${eventId}`) || '') : '')
        const queryParams = effectiveInviteToken ? `?inviteToken=${encodeURIComponent(effectiveInviteToken)}` : ''
        const customHeaders: Record<string, string> = {}
        if (effectiveInviteToken) {
            customHeaders['X-Invite-Token'] = effectiveInviteToken
        }

        const maxAttempts = 4
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const data = await $api(`/photos/upload/${eventId}${queryParams}`, {
                    method: 'POST',
                    body: formData,
                    headers: Object.keys(customHeaders).length ? customHeaders : undefined
                })
                return data
            } catch (e: any) {
                const status = e?.response?.status || e?.statusCode || 0
                const isBackpressureOrTransient = status === 429 || status === 503 || status === 502 || status === 504 || status === 0
                if (isBackpressureOrTransient && attempt < maxAttempts) {
                    const retryAfterSec = Number(e?.response?._data?.retryAfterSeconds || e?.response?.headers?.get?.('retry-after') || 0)
                    const baseDelayMs = retryAfterSec > 0 ? retryAfterSec * 1000 : (2000 * Math.pow(2, attempt - 1))
                    // Add random jitter (300ms - 1500ms) to prevent thundering herd when many photographers retry simultaneously
                    const jitterMs = 300 + Math.floor(Math.random() * 1200)
                    await new Promise((resolve) => setTimeout(resolve, baseDelayMs + jitterMs))
                    continue
                }
                const serverMsg = e?.response?._data?.message || e?.data?.message || e?.data?.error || e?.message || 'Error al subir la foto'
                error.value = serverMsg
                console.error('Failed to upload photo:', serverMsg, e)
                throw new Error(serverMsg)
            }
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

    async function updatePhotoPricing(photoId: number, price: number | null, isFreeDownload: boolean) {
        try {
            const data: any = await $api(`/photos/${photoId}/pricing`, {
                method: 'PUT',
                body: { price, isFreeDownload }
            })
            const idx = eventPhotos.value.findIndex((p: any) => p.id === photoId)
            if (idx !== -1 && data) {
                eventPhotos.value[idx] = { ...eventPhotos.value[idx], ...data }
            }
            return data
        } catch (e: any) {
            console.error('Error updating photo pricing:', e)
            throw e
        }
    }

    async function toggleFreeDownload(photoId: number) {
        try {
            const data: any = await $api(`/photos/${photoId}/toggle-free`, {
                method: 'POST'
            })
            const idx = eventPhotos.value.findIndex((p: any) => p.id === photoId)
            if (idx !== -1 && data) {
                eventPhotos.value[idx] = { ...eventPhotos.value[idx], ...data }
            }
            return data
        } catch (e: any) {
            console.error('Error toggling free download:', e)
            throw e
        }
    }

    return {
        eventPhotos, loading, error, currentPage, hasMore, totalPhotos,
        fetchPhotosByEvent, refreshProcessingPhotos, uploadPhoto, deletePhoto, getDownloadUrl, getDownloadInfo, resolveDownload, toggleLike, resetPagination,
        updatePhotoPricing, toggleFreeDownload
    }
})
