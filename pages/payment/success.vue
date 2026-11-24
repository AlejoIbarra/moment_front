<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 py-12 relative overflow-hidden">
    <!-- Ambient Background Glows -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-lg w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-slate-700/60 relative z-10 animate-fade-in">
      
      <!-- Top Accent Line -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 rounded-t-3xl"></div>

      <!-- Animated Success Checkmark Ring -->
      <div class="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-40 animate-ping"></div>
        <div class="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-scale-up">
          <svg class="w-10 h-10 text-slate-950 checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>

      <!-- Pill Tag -->
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
        <span>✨ Transacción Aprobada</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
        <template v-if="isGiftCardBatch">¡Lote de Tarjetas Generado! 🎁</template>
        <template v-else-if="isSubscription">¡Suscripción Moments PRO Activada! 👑</template>
        <template v-else>¡Pago y Compra Exitosa!</template>
      </h1>
      <p class="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
        <template v-if="isGiftCardBatch">
          Tu lote de tarjetas de regalo ha sido generado y activado correctamente. Ya puedes compartir los códigos con tus clientes o descargarlos en Excel.
        </template>
        <template v-else-if="isSubscription">
          Tu suscripción Moments PRO ya está activa. Disfruta de la creación de álbumes privados exclusivos y beneficios adicionales.
        </template>
        <template v-else>
          Tu transacción fue confirmada correctamente. Tus fotos originales en máxima resolución y sin marcas de agua ya están listas para descargar.
        </template>
      </p>

      <!-- Photos Strip Preview if available -->
      <div v-if="hasPurchasedPhotos" class="mb-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left">
        <div class="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span class="font-bold text-slate-200">Tus Fotos Desbloqueadas ({{ purchasedPhotos.length }})</span>
          <span class="text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Máxima Resolución HD</span>
        </div>
        <div class="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          <div 
            v-for="(photo, idx) in purchasedPhotos" 
            :key="photo.id || idx"
            class="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-slate-800"
          >
            <img 
              :src="photo.previewUrl || photo.watermarkedR2Url || photo.watermarkedUrl" 
              :alt="photo.filename || 'Foto Moments'" 
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="w-2.5 h-2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="space-y-3.5">
        <!-- Direct Download ZIP Button for multiple photos -->
        <button
          v-if="hasPurchasedPhotos && purchasedPhotos.length > 1"
          @click="handleDownloadZip"
          :disabled="isDownloadingZip"
          class="w-full py-4 px-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black rounded-2xl hover:brightness-110 transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2.5 text-base disabled:opacity-60"
        >
          <svg v-if="!isDownloadingZip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" class="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <svg v-else class="animate-spin w-5 h-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ isDownloadingZip ? (downloadStatusText || 'Preparando archivo ZIP...') : `Descargar Todas las Fotos (.ZIP)` }}</span>
        </button>

        <!-- Direct Download Button for single photo -->
        <button
          v-else-if="hasPurchasedPhotos && purchasedPhotos.length === 1"
          @click="handleDownloadSingle"
          class="w-full py-4 px-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black rounded-2xl hover:brightness-110 transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2.5 text-base"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" class="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>Descargar Foto Original en HD</span>
        </button>

        <!-- Download One by One option for multiple photos -->
        <button
          v-if="hasPurchasedPhotos && purchasedPhotos.length > 1"
          @click="handleDownloadSequential"
          :disabled="isDownloadingZip"
          class="w-full py-3 px-6 bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-700 hover:bg-slate-700/80 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-emerald-400">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>Descargar Fotos Una a Una</span>
        </button>

        <button 
          v-if="isGiftCardBatch"
          @click="router.push('/dashboard/photographer')"
          class="w-full py-4 px-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black rounded-2xl hover:brightness-110 transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-5 h-5">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>
          Ver Mis Tarjetas de Regalo
        </button>

        <button 
          v-else-if="isSubscription"
          @click="router.push('/dashboard/photographer')"
          class="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black rounded-2xl hover:brightness-110 transition-all duration-200 shadow-lg shadow-amber-500/25 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-5 h-5">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
          </svg>
          Ir a Mi Panel de Fotógrafo
        </button>

        <button 
          v-else
          @click="router.push('/dashboard/customer')"
          class="w-full py-4 px-6 bg-slate-800/90 text-white font-bold rounded-2xl border border-slate-700/80 hover:bg-slate-700/90 transition-all duration-200 shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 text-base"
          :class="{ '!bg-gradient-to-r !from-emerald-400 !to-teal-400 !text-slate-950 !font-black !border-none': !hasPurchasedPhotos }"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-5 h-5">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Ver Mis Fotos Compradas
        </button>

        <button 
          @click="router.push(isGiftCardBatch || isSubscription ? '/dashboard/photographer' : '/marketplace')"
          class="w-full py-3.5 px-6 bg-slate-800/80 text-slate-200 font-bold rounded-2xl border border-slate-700/80 hover:bg-slate-700/80 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ isGiftCardBatch || isSubscription ? 'Volver al Dashboard' : 'Volver a la Galería de Eventos' }}
        </button>
      </div>

      <!-- Retrigger Confetti Button -->
      <div class="mt-6">
        <button 
          @click="launchCelebrationConfetti" 
          class="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-semibold flex items-center justify-center gap-1.5 mx-auto"
        >
          <span>🎉</span> ¿Celebrar de nuevo?
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePurchaseSuccess } from '~/composables/usePurchaseSuccess'
import { useCartStore } from '~/stores/cart'
import { triggerDirectDownload, triggerBlobDownload } from '~/utils/download'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const { launchCelebrationConfetti, playSuccessSound } = usePurchaseSuccess()
const { $api } = useNuxtApp()

const rawRef = route.query.reference || route.query.ref || route.query.external_reference
const reference = ref(rawRef ? String(rawRef) : '')
const isGiftCardBatch = computed(() => reference.value.startsWith('PHOTO-BATCH-'))
const isSubscription = computed(() => reference.value.startsWith('SUB-'))

const purchaseDetails = ref(null)
const isDownloadingZip = ref(false)
const downloadStatusText = ref('')

const purchasedPhotos = computed(() => {
  return purchaseDetails.value?.photos || []
})

const hasPurchasedPhotos = computed(() => {
  return purchasedPhotos.value.length > 0
})

async function fetchPurchaseDetails(refStr) {
  if (!refStr) return
  if (!refStr.startsWith('CART-') && !refStr.startsWith('PKG-') && !refStr.startsWith('PHO-')) return
  try {
    const data = await $api(`/payment/reference/${encodeURIComponent(refStr)}/details`)
    if (data && data.photos) {
      purchaseDetails.value = data
    }
  } catch (err) {
    console.warn('[PaymentSuccess] Could not fetch purchase details:', err)
  }
}

async function handleDownloadZip() {
  const photoIds = purchasedPhotos.value.map(p => p.id).filter(Boolean)
  const currentRef = reference.value

  isDownloadingZip.value = true
  downloadStatusText.value = 'Comprimiendo tus fotos en HD...'

  try {
    const blob = await $api('/photos/download-zip', {
      method: 'POST',
      body: { photoIds, reference: currentRef },
      responseType: 'blob'
    })
    triggerBlobDownload(blob, 'Moments_Fotos.zip')
    downloadStatusText.value = '¡Descarga iniciada!'
    setTimeout(() => {
      downloadStatusText.value = ''
    }, 3000)
  } catch (err) {
    console.warn('ZIP download failed, falling back to sequential download:', err)
    handleDownloadSequential()
  } finally {
    isDownloadingZip.value = false
  }
}

function handleDownloadSingle() {
  const photo = purchasedPhotos.value[0]
  if (photo) {
    const url = photo.downloadUrl
    const filename = photo.filename || 'Moments_Foto_Original.jpg'
    if (url) {
      triggerDirectDownload(url, filename)
      return
    }
    if (photo.id) {
      router.push(`/download/${photo.id}`)
    }
  }
}

function handleDownloadSequential() {
  const photos = purchasedPhotos.value
  if (!photos.length) return

  photos.forEach((photo, i) => {
    setTimeout(() => {
      const url = photo.downloadUrl
      const filename = photo.filename || `Moments_Foto_${i + 1}.jpg`
      if (url) {
        triggerDirectDownload(url, filename)
      }
    }, i * 600)
  })
}

onMounted(async () => {
  launchCelebrationConfetti()
  playSuccessSound()

  // Clear cart upon successful transaction
  if (reference.value.startsWith('CART-') || (!reference.value.startsWith('SUB-') && !reference.value.startsWith('PHOTO-BATCH-'))) {
    cartStore.clearCart()
  }

  const rawId = route.query.id || route.query.payment_id || route.query.collection_id
  const id = (rawId && String(rawId) !== 'null') ? String(rawId) : ''
  const ref = reference.value
  console.log('[PaymentSuccess] Transaction mounted: id=' + id + ', ref=' + ref)

  if (ref || id) {
    try {
      const confirmRes = await $api('/mercadopago/confirm-transaction', {
        method: 'POST',
        body: { paymentId: id || 'MP-AUTO-CONFIRM', reference: ref, status: 'approved' }
      })
      if (confirmRes?.reference && !reference.value) {
        reference.value = confirmRes.reference
      }
      if (ref.startsWith('SUB-')) {
        try {
          const authStore = useAuthStore()
          await authStore.fetchUserProfile()
        } catch (_) {}
      }
    } catch (mpErr) {
      console.warn('[PaymentSuccess] Mercado Pago confirm fallback error:', mpErr)
    }

    const currentRef = reference.value
    if (currentRef && currentRef.startsWith('PHOTO-BATCH-')) {
      try {
        console.log('[PaymentSuccess] Activating batch directly:', currentRef)
        await $api(`/giftcards/batch/${currentRef}/activate`, { method: 'POST' })
        console.log('[PaymentSuccess] Batch successfully activated:', currentRef)
      } catch (e) {
        console.warn('[PaymentSuccess] Batch activation fallback response:', e)
      }
    }
  }

  // Load purchased photos details for direct download
  if (reference.value) {
    await fetchPurchaseDetails(reference.value)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  0% { transform: scale(0.6) rotate(-15deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.checkmark-icon polyline {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: dash 0.4s 0.3s ease-in-out forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
