<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="lucide:check-circle" class="w-12 h-12 text-green-500" />
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Payment Received!</h1>
      <p class="text-gray-500 mb-8">Your transaction is being processed. Your wallet balance will be updated automatically in a few moments.</p>
      
      <div class="space-y-4">
        <button 
          @click="router.push('/dashboard/customer')"
          class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
        >
          Go to Dashboard
        </button>
        <button 
          @click="router.push('/marketplace')"
          class="w-full py-4 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
        >
          Back to Marketplace
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
</script>
