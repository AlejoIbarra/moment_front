import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useWalletStore = defineStore('wallet', () => {
    const { $api } = useNuxtApp()
    const balance = ref(0)
    const error = ref('')
    const transactions = ref<any[]>([])

    async function fetchBalance() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return

        try {
            const data = await $api('/wallet/balance')
            balance.value = data
        } catch (e) {
            error.value = 'Failed to load balance'
            console.error(e)
        }
    }

    async function fetchTransactions() {
        try {
            const [purchases, topups] = await Promise.all([
                $api('/payment/my-purchases'),
                $api('/wompi/my-topups')
            ])
            
            // Map and merge
            const merged = [
                ...purchases.map((p: any) => ({ ...p, type: 'PURCHASE' })),
                ...topups.map((t: any) => ({ ...t, type: 'TOPUP', photoTitle: 'Wallet Recharge' }))
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            transactions.value = merged
        } catch (e) {
            console.error('Failed to fetch transactions', e)
        }
    }

    async function prepareWompiPayment(amount: number) {
        try {
            const data = await $api('/wompi/prepare-payment', {
                method: 'POST',
                body: { amount }
            })
            return data
        } catch (e) {
            error.value = 'Failed to initialize payment'
            throw e
        }
    }

    async function topUp(amount: number) {
        // Legacy mock topup, keep for compatibility or remove
        try {
            const data = await $api('/wallet/topup', {
                method: 'POST',
                body: {
                    amount,
                    paymentMethodId: 'mock-stripe-id'
                }
            })
            balance.value = data
            return true
        } catch (e) {
            error.value = e.response?._data || 'Failed to top up'
            return false
        }
    }

    return { balance, transactions, error, fetchBalance, fetchTransactions, prepareWompiPayment, topUp }
})
