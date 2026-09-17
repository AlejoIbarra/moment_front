<template>
  <Teleport to="body">
    <Transition name="celebrate-fade">
      <div
        v-if="isOpen"
        class="celebrate-overlay"
        @click.self="closeModal"
      >
        <Transition name="celebrate-pop">
          <div v-if="isOpen" class="celebrate-modal-card">
            
            <!-- Close Button -->
            <button
              class="celebrate-close-btn"
              @click="closeModal"
              aria-label="Cerrar modal de éxito"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            <!-- Decorative Glow Background Orbs -->
            <div class="glow-orb top-left"></div>
            <div class="glow-orb bottom-right"></div>

            <div class="celebrate-content">
              
              <!-- Animated Success Checkmark Ring -->
              <div class="checkmark-wrapper">
                <div class="pulse-ring ring-1"></div>
                <div class="pulse-ring ring-2"></div>
                <div class="checkmark-circle">
                  <svg class="checkmark-svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle-bg" cx="26" cy="26" r="24" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
              </div>

              <!-- Pill Tag -->
              <div class="celebrate-pill">
                <span class="sparkle-icon">✨</span>
                <span>¡Transacción Confirmada!</span>
              </div>

              <!-- Title & Subtitle -->
              <h2 class="celebrate-title">
                {{ purchaseData?.title || '¡Compra Exitosa!' }}
              </h2>
              <p class="celebrate-subtitle">
                {{ purchaseData?.subtitle || 'Tus fotos ya están listas en tu cuenta sin marcas de agua y en máxima resolución.' }}
              </p>

              <!-- Optional custom message -->
              <div v-if="purchaseData?.message" class="celebrate-info-alert">
                <span class="text-emerald-500 font-bold">ℹ️</span>
                <span>{{ purchaseData.message }}</span>
              </div>

              <!-- Bought Photos Preview Grid / Strip -->
              <div v-if="purchaseData?.photos && purchaseData.photos.length > 0" class="photos-preview-container">
                <div class="preview-header">
                  <span class="preview-count">
                    {{ purchaseData.photos.length === 1 ? 'Foto Adquirida' : `${purchaseData.photos.length} Fotos Incluidas` }}
                  </span>
                  <span class="badge-hd">💎 Máxima Calidad HD</span>
                </div>
                
                <div class="photos-scroll-strip" :class="{ 'single-item': purchaseData.photos.length === 1 }">
                  <div
                    v-for="(photo, idx) in purchaseData.photos"
                    :key="photo.id || idx"
                    class="photo-thumb-card"
                  >
                    <img
                      :src="photo.watermarkedR2Url || photo.watermarkedUrl || photo.originalUrl"
                      alt="Foto comprada"
                      class="thumb-img"
                    />
                    <div class="thumb-check-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="celebrate-actions">
                <!-- Direct download button if URLs are available -->
                <button
                  v-if="hasDownloadUrls"
                  @click="handleDownloadAll"
                  class="btn-primary-action download-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-5 h-5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>{{ (purchaseData?.presignedUrls?.length || 0) > 1 ? 'Descargar Todas las Fotos' : 'Descargar Original en HD' }}</span>
                </button>

                <!-- Go to customer dashboard / gallery -->
                <button
                  @click="goToCustomerDashboard"
                  class="btn-primary-action view-photos-btn"
                  :class="{ 'btn-secondary-look': hasDownloadUrls }"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-5 h-5">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Ir a Mis Fotos Compradas</span>
                </button>

                <!-- Keep browsing -->
                <button
                  @click="closeModal"
                  class="btn-text-action"
                >
                  Seguir Explorando Eventos
                </button>
              </div>

              <!-- Re-trigger Confetti Button (Fun micro-interaction) -->
              <div class="confetti-retrigger-wrap">
                <button @click="launchCelebrationConfetti" class="btn-more-confetti" title="¡Celebrar de nuevo!">
                  🎉 ¡Celebrar!
                </button>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchaseSuccess } from '~/composables/usePurchaseSuccess'

const router = useRouter()
const { isOpen, purchaseData, close, launchCelebrationConfetti } = usePurchaseSuccess()

const hasDownloadUrls = computed(() => {
  return (purchaseData.value?.presignedUrls && purchaseData.value.presignedUrls.length > 0) || !!purchaseData.value?.presignedUrl
})

function closeModal() {
  close()
}

function handleDownloadAll() {
  const urls = purchaseData.value?.presignedUrls || []
  if (purchaseData.value?.presignedUrl && !urls.includes(purchaseData.value.presignedUrl)) {
    urls.push(purchaseData.value.presignedUrl)
  }

  if (urls.length > 0) {
    urls.forEach((url, i) => {
      setTimeout(() => {
        window.open(url, '_blank')
      }, i * 200)
    })
  }
}

function goToCustomerDashboard() {
  close()
  router.push('/dashboard/customer')
}
</script>

<style scoped>
/* ── Overlay ────────────────────────────── */
.celebrate-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(10, 15, 29, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

/* ── Modal Card ─────────────────────────── */
.celebrate-modal-card {
  position: relative;
  background: radial-gradient(130% 120% at 50% 0%, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(62, 244, 161, 0.2),
    0 25px 60px -15px rgba(0, 0, 0, 0.7),
    0 0 50px rgba(62, 244, 161, 0.15);
  color: #f8fafc;
  text-align: center;
}

/* ── Glow Orbs ──────────────────────────── */
.glow-orb {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.25;
}
.glow-orb.top-left {
  top: -60px;
  left: -60px;
  background: #3ef4a1;
}
.glow-orb.bottom-right {
  bottom: -60px;
  right: -60px;
  background: #6366f1;
}

/* ── Close Button ───────────────────────── */
.celebrate-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 20;
}
.celebrate-close-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  transform: scale(1.08);
}
.celebrate-close-btn svg {
  width: 16px;
  height: 16px;
}

/* ── Content Box ────────────────────────── */
.celebrate-content {
  position: relative;
  z-index: 10;
  padding: 36px 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Animated Checkmark Ring ────────────── */
.checkmark-wrapper {
  position: relative;
  width: 88px;
  height: 88px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid #3ef4a1;
  opacity: 0;
  animation: ripple 2.4s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
}
.pulse-ring.ring-2 {
  animation-delay: 0.8s;
}

@keyframes ripple {
  0% {
    transform: scale(0.85);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.checkmark-circle {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 25px rgba(16, 185, 129, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  animation: scaleInCheck 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.checkmark-svg {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: block;
}

.checkmark-circle-bg {
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke: #ffffff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: strokeDraw 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
}

@keyframes scaleInCheck {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@keyframes strokeDraw {
  100% {
    stroke-dashoffset: 0;
  }
}

/* ── Pill Tag ───────────────────────────── */
.celebrate-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(62, 244, 161, 0.12);
  border: 1px solid rgba(62, 244, 161, 0.3);
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #3ef4a1;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}
.sparkle-icon {
  font-size: 0.85rem;
}

/* ── Titles ─────────────────────────────── */
.celebrate-title {
  font-size: 1.65rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 8px;
  line-height: 1.2;
}

.celebrate-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 20px;
  max-width: 380px;
}

.celebrate-info-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 0.8rem;
  color: #a7f3d0;
  margin-bottom: 16px;
  text-align: left;
}

/* ── Photo Preview Strip ────────────────── */
.photos-preview-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 14px;
  margin-bottom: 24px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.75rem;
}
.preview-count {
  font-weight: 700;
  color: #cbd5e1;
}
.badge-hd {
  font-weight: 700;
  color: #3ef4a1;
  background: rgba(62, 244, 161, 0.12);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
}

.photos-scroll-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  justify-content: flex-start;
}
.photos-scroll-strip.single-item {
  justify-content: center;
}

.photo-thumb-card {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(62, 244, 161, 0.4);
  background: #1e293b;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-check-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background: #10b981;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.4);
}
.thumb-check-badge svg {
  width: 10px;
  height: 10px;
}

/* ── Actions ────────────────────────────── */
.celebrate-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.btn-primary-action {
  width: 100%;
  padding: 13px 20px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
}

.download-btn {
  background: linear-gradient(135deg, #3ef4a1 0%, #10b981 100%);
  color: #042f1f;
  box-shadow: 0 4px 18px rgba(62, 244, 161, 0.4);
}
.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(62, 244, 161, 0.55);
}
.download-btn:active {
  transform: translateY(0);
}

.view-photos-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
}
.view-photos-btn.btn-secondary-look {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: none;
  color: #f1f5f9;
}
.view-photos-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
.view-photos-btn.btn-secondary-look:hover {
  background: rgba(255, 255, 255, 0.14);
}

.btn-text-action {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
  transition: color 0.15s;
}
.btn-text-action:hover {
  color: #ffffff;
  text-decoration: underline;
}

.confetti-retrigger-wrap {
  margin-top: 10px;
}
.btn-more-confetti {
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-more-confetti:hover {
  border-color: #3ef4a1;
  color: #3ef4a1;
  transform: scale(1.05);
}

/* ── Transitions ────────────────────────── */
.celebrate-fade-enter-active, .celebrate-fade-leave-active {
  transition: opacity 0.3s ease;
}
.celebrate-fade-enter-from, .celebrate-fade-leave-to {
  opacity: 0;
}

.celebrate-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.celebrate-pop-leave-active {
  transition: all 0.25s ease;
}
.celebrate-pop-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}
.celebrate-pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
