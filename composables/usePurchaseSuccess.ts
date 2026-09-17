import { ref } from 'vue'
import confetti from 'canvas-confetti'

export interface PurchasedPhoto {
  id?: number | string
  watermarkedUrl?: string
  watermarkedR2Url?: string
  originalUrl?: string
  presignedUrl?: string
  title?: string
}

export interface PurchaseSuccessData {
  title?: string
  subtitle?: string
  photos?: PurchasedPhoto[]
  presignedUrls?: string[]
  presignedUrl?: string
  totalPaid?: number
  currency?: string
  isPackage?: boolean
  packageName?: string
  message?: string
}

const isOpen = ref(false)
const purchaseData = ref<PurchaseSuccessData | null>(null)

export function usePurchaseSuccess() {
  function playSuccessSound() {
    if (typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      const playTone = (freq: number, startTime: number, duration: number, gainVal: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + duration)
      }

      const now = ctx.currentTime
      // Upbeat cheerful arpeggio (C5 -> E5 -> G5 -> C6)
      playTone(523.25, now, 0.25, 0.15)
      playTone(659.25, now + 0.08, 0.25, 0.15)
      playTone(783.99, now + 0.16, 0.28, 0.18)
      playTone(1046.50, now + 0.24, 0.45, 0.22)
    } catch (e) {
      // Audio autoplay policies or unsupported browser
    }
  }

  function launchCelebrationConfetti() {
    if (typeof window === 'undefined') return

    // Central primary blast
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3ef4a1', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#ffffff']
    })

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#3ef4a1', '#10b981', '#38bdf8', '#fbbf24']
      })
    }, 150)

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#3ef4a1']
      })
    }, 300)

    // Star sparkles
    setTimeout(() => {
      confetti({
        particleCount: 35,
        spread: 100,
        startVelocity: 45,
        origin: { y: 0.5 },
        shapes: ['star', 'circle'],
        colors: ['#fbbf24', '#f59e0b', '#3ef4a1', '#ffffff']
      })
    }, 450)
  }

  function triggerSuccess(data: PurchaseSuccessData = {}) {
    purchaseData.value = {
      title: data.title || '¡Compra Exitosa!',
      subtitle: data.subtitle || 'Tus fotos han sido desbloqueadas en máxima resolución y sin marcas de agua.',
      photos: data.photos || [],
      presignedUrls: data.presignedUrls || (data.presignedUrl ? [data.presignedUrl] : []),
      presignedUrl: data.presignedUrl,
      totalPaid: data.totalPaid,
      currency: data.currency || 'COP',
      isPackage: data.isPackage || false,
      packageName: data.packageName,
      message: data.message
    }
    isOpen.value = true
    playSuccessSound()
    launchCelebrationConfetti()
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    purchaseData,
    triggerSuccess,
    launchCelebrationConfetti,
    playSuccessSound,
    close
  }
}
