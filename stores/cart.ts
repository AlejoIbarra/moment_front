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

    const subtotal = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price || 0), 0)
    })

    const proDiscount = computed(() => {
        if (!authStore.isPro) return 0
        return Math.round(subtotal.value * 0.15)
    })

    const total = computed(() => {
        return Math.max(0, subtotal.value - proDiscount.value)
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

    function clearCart() {
        items.value = []
        giftCardCode.value = ''
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
