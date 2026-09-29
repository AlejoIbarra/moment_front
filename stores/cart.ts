import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
    const { $api } = useNuxtApp()
    const items = ref([])
    const giftCardCode = ref('')
    const loading = ref(false)
    const error = ref('')
    const showCart = ref(false)

    // Initialize from localStorage client-side
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cart_items')
        if (stored) {
            try {
                let parsed = JSON.parse(stored)
                
                // Cleanup: remove individual photos that are already included in any package
                const packagePhotoIds = new Set(
                    parsed
                        .filter(item => item.type === 'package')
                        .flatMap(pkg => pkg.photos?.map(p => p.id) || [])
                )
                
                items.value = parsed.filter(item => {
                    if (!item.type || item.type === 'photo') {
                        return !packagePhotoIds.has(item.id)
                    }
                    return true
                })
            } catch (e) {
                console.error('Failed to parse cart items', e)
            }
        }
    }

    // Persist to localStorage
    watch(items, (newItems) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart_items', JSON.stringify(newItems))
        }
    }, { deep: true })

    const authStore = useAuthStore()
    const appliedGiftCard = ref(null)
    const giftCardError = ref('')
    const isValidatingGiftCard = ref(false)

    const subtotal = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price || 0), 0)
    })

    const proDiscount = computed(() => {
        if (!authStore.isPro) return 0
        return Math.round(subtotal.value * 0.15)
    })

    const couponDiscount = computed(() => {
        if (!appliedGiftCard.value) return 0
        const card = appliedGiftCard.value

        if (card.cardType === 'PHOTOS' || (card.photoCount && card.photoCount > 0)) {
            const remaining = Number(card.photosRemaining ?? card.photoCount ?? 0)

            // Find eligible individual photos
            const eligiblePhotos = items.value.filter(item => {
                if (item.type === 'package') return false
                if (card.photographer?.username) {
                    const itemPhotog = item.event?.photographer?.username || item.photographerUsername || item.photographer
                    if (itemPhotog && itemPhotog !== card.photographer.username) {
                        return false
                    }
                }
                if (card.event?.id) {
                    const itemEvId = item.event?.id || item.eventId
                    if (itemEvId && Number(itemEvId) !== Number(card.event.id)) {
                        return false
                    }
                }
                return true
            })

            const countToDiscount = Math.min(remaining, eligiblePhotos.length)
            return eligiblePhotos.slice(0, countToDiscount).reduce((sum, p) => sum + (p.price || 0), 0)
        } else {
            // Amount-based coupon
            const cardAmount = Number(card.amount || 0)
            const remainingSubtotal = Math.max(0, subtotal.value - proDiscount.value)
            return Math.min(cardAmount, remainingSubtotal)
        }
    })

    const total = computed(() => {
        const afterPro = Math.max(0, subtotal.value - proDiscount.value)
        return Math.max(0, afterPro - couponDiscount.value)
    })

    const totalPhotosCount = computed(() => {
        return items.value.reduce((sum, item) => {
            if (item.type === 'package' && item.photos) {
                return sum + item.photos.length
            }
            return sum + 1
        }, 0)
    })

    function addToCart(item) {
        const itemPhotosCount = item.type === 'package' ? (item.photos?.length || item.package?.photoCount || 1) : 1

        if (items.value.some(existing => existing.id === item.id)) {
            return { success: false, reason: 'ALREADY_EXISTS' }
        }

        if (item.type === 'package') {
            const pkgPhotoIds = new Set(item.photos.map(p => p.id))
            const itemsToKeep = items.value.filter(existing => {
                if (!existing.type || existing.type === 'photo') {
                    return !pkgPhotoIds.has(existing.id)
                }
                return true
            })
            const currentCountAfterRemoval = itemsToKeep.reduce((sum, it) => {
                return sum + (it.type === 'package' && it.photos ? it.photos.length : 1)
            }, 0)

            if (currentCountAfterRemoval + itemPhotosCount > 20) {
                return { success: false, reason: 'LIMIT_EXCEEDED', message: 'El límite máximo por compra es de 20 fotos.' }
            }
            items.value = itemsToKeep
        } else {
            // Check if this individual photo is already in any package
            const isInPackage = items.value.some(existing => {
                if (existing.type === 'package') {
                    return existing.photos?.some(p => p.id === item.id)
                }
                return false
            })
            if (isInPackage) return { success: false, reason: 'IN_PACKAGE' }

            if (totalPhotosCount.value + 1 > 20) {
                return { success: false, reason: 'LIMIT_EXCEEDED', message: 'El límite máximo por compra es de 20 fotos.' }
            }
        }

        items.value.push(item)
        return { success: true }
    }

    function removeFromCart(id) {
        items.value = items.value.filter(item => item.id !== id)
    }

    async function validateGiftCard(codeToValidate?: string) {
        const code = (codeToValidate !== undefined ? codeToValidate : giftCardCode.value || '').trim()
        if (!code) {
            appliedGiftCard.value = null
            giftCardError.value = ''
            return { success: false }
        }
        isValidatingGiftCard.value = true
        giftCardError.value = ''
        try {
            const data = await $api(`/giftcards/check/${encodeURIComponent(code)}`)
            if (data && data.active) {
                appliedGiftCard.value = data
                giftCardCode.value = data.code
                return { success: true, data }
            } else {
                appliedGiftCard.value = null
                giftCardError.value = 'El cupón no está activo o ya fue utilizado.'
                return { success: false, message: giftCardError.value }
            }
        } catch (e: any) {
            appliedGiftCard.value = null
            giftCardError.value = e.response?._data?.error || 'Cupón o código no válido.'
            return { success: false, message: giftCardError.value }
        } finally {
            isValidatingGiftCard.value = false
        }
    }

    function removeGiftCard() {
        appliedGiftCard.value = null
        giftCardCode.value = ''
        giftCardError.value = ''
    }

    function clearCart() {
        items.value = []
        removeGiftCard()
    }

    async function checkout() {
        loading.value = true
        error.value = ''
        try {
            if (totalPhotosCount.value > 20) {
                const msg = 'El límite máximo por compra es de 20 fotos.'
                error.value = msg
                throw new Error(msg)
            }

            const packages = items.value
                .filter(item => item.type === 'package')
                .map(item => ({
                    packageId: item.package.id,
                    photoIds: item.photos.map(p => p.id)
                }))

            const packagePhotoIds = new Set(
                packages.flatMap(pkg => pkg.photoIds)
            )

            const photoIds = items.value
                .filter(item => !item.type || item.type === 'photo')
                .map(item => item.id)
                .filter(id => !packagePhotoIds.has(id))

            const data = await $api('/payment/checkout-cart', {
                method: 'POST',
                body: {
                    photoIds,
                    packages,
                    giftCardCode: giftCardCode.value
                }
            })
            return data
        } catch (e) {
            error.value = e.response?._data || e.message || 'Error al procesar el pago'
            console.error('Checkout error:', e)
            throw e;
        } finally {
            loading.value = false
        }
    }

    return {
        items,
        giftCardCode,
        appliedGiftCard,
        giftCardError,
        isValidatingGiftCard,
        couponDiscount,
        validateGiftCard,
        removeGiftCard,
        loading,
        error,
        showCart,
        subtotal,
        proDiscount,
        total,
        totalPhotosCount,
        addToCart,
        removeFromCart,
        clearCart,
        checkout
    }
})
