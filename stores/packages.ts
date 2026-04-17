import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePackagesStore = defineStore('packages', () => {
    const { $api } = useNuxtApp()
    const packages = ref([])
    const myPackages = ref([])
    const eventPackages = ref([])
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

    async function fetchMyPackages() {
        loading.value = true
        try {
            const data = await $api('/packages/my-packages')
            myPackages.value = data
        } catch (e) {
            error.value = 'Failed to load your packages'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function fetchPackagesForEvent(eventId) {
        loading.value = true
        try {
            const data = await $api(`/packages/event/${eventId}`)
            eventPackages.value = data
        } catch (e) {
            error.value = 'Failed to load event packages'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function createPackage(packageData) {
        try {
            const data = await $api('/packages/create', {
                method: 'POST',
                body: packageData
            })
            myPackages.value.push(data)
            return data
        } catch (e) {
            error.value = 'Failed to create package'
            console.error(e)
            return null
        }
    }

    async function updatePackage(id, packageData) {
        try {
            const data = await $api(`/packages/${id}`, {
                method: 'PUT',
                body: packageData
            })
            const index = myPackages.value.findIndex(p => p.id === id)
            if (index !== -1) myPackages.value[index] = data
            return data
        } catch (e) {
            error.value = 'Failed to update package'
            console.error(e)
            return null
        }
    }

    async function deletePackage(id) {
        try {
            await $api(`/packages/${id}`, {
                method: 'DELETE'
            })
            myPackages.value = myPackages.value.filter(p => p.id !== id)
            return true
        } catch (e) {
            error.value = 'Failed to delete package'
            console.error(e)
            return false
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

    return { 
        packages, myPackages, eventPackages, loading, error, 
        fetchPackages, fetchMyPackages, fetchPackagesForEvent,
        createPackage, updatePackage, deletePackage, buyPackage 
    }
})
