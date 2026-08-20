import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

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
                items.value = JSON.parse(stored)
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

    const subtotal = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price || 0), 0)
    })

    function addToCart(item) {
        if (item.type === 'package') {
            const pkgPhotoIds = new Set(item.photos.map(p => p.id))
            items.value = items.value.filter(existing => {
                if (!existing.type || existing.type === 'photo') {
                    return !pkgPhotoIds.has(existing.id)
                }
                return true
            })
        }

        if (!items.value.some(existing => existing.id === item.id)) {
            items.value.push(item)
        }
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
            error.value = e.response?._data || 'Error al procesar el pago'
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
        addToCart,
        removeFromCart,
        clearCart,
        checkout
    }
})
