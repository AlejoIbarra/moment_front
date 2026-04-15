import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePackagesStore = defineStore('packages', () => {
    const { $api } = useNuxtApp()
    const packages = ref([])
    const loading = ref(false)
    const error = ref('')

    async function fetchPackages() {
        loading.value = true
        try {
            const data = await $api('/packages')
            packages.value = data
        } catch (e) {
            error.value = 'Failed to load packages'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function buyPackage(packageId, eventId, photoIds) {
        try {
            const data = await $api('/packages/buy', {
                method: 'POST',
                body: { packageId, eventId, photoIds }
            })
            return data
        } catch (e) {
            error.value = e.response?._data || 'Failed to purchase package'
            console.error(e)
            throw e
        }
    }

    return { packages, loading, error, fetchPackages, buyPackage }
})
