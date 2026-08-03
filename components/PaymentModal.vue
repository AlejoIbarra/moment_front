<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="payment-modal-overlay"
        @click.self="$emit('cancel')"
      >
        <Transition name="modal-slide">
          <div v-if="modelValue" class="payment-modal-card">

            <!-- Top accent bar -->
            <div class="modal-accent-bar"></div>

            <!-- Close button -->
            <button class="modal-close-btn" @click="$emit('cancel')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            <!-- Header -->
            <div class="modal-header">
              <div class="modal-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="modal-main-icon">
                  <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                </svg>
              </div>
              <div>
                <h2 class="modal-title">{{ title }}</h2>
                <p class="modal-subtitle">Pago seguro procesado por Wompi</p>
              </div>
            </div>

            <!-- Photo preview (optional) -->
            <div v-if="photoUrl" class="photo-preview-strip">
              <img :src="photoUrl" class="photo-thumb" alt="Foto a comprar" />
              <div class="photo-info">
                <span class="photo-label">Foto seleccionada</span>
                <span class="photo-price-tag">{{ formattedPrice }}</span>
              </div>
            </div>

            <!-- Price summary (for packages or when no photo preview) -->
            <div v-else-if="price > 0" class="price-summary-box">
              <div class="price-row">
                <span class="price-label">Total a pagar</span>
                <span class="price-value">{{ formattedPrice }}</span>
              </div>
              <div v-if="photoCount > 1" class="price-subrow">
                {{ photoCount }} fotos incluidas en el paquete
              </div>
            </div>

            <!-- Subscription banner -->
            <div v-if="hasSubscription" class="subscription-banner">
              <div class="sub-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                </svg>
              </div>
              <label class="sub-label">
                <input type="checkbox" v-model="useSubscription" class="sub-checkbox" />
                <span>
                  Usar foto gratis de mi suscripción
                  <strong class="sub-remaining">({{ freeRemaining }} restante{{ freeRemaining !== 1 ? 's' : '' }})</strong>
                </span>
              </label>
            </div>

            <!-- Gift card / promo code -->
            <div class="gift-card-section">
              <label class="gift-card-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="gift-icon">
                  <path d="M9 14 4 9l5-5M15 14l5-5-5-5M12 3v18"/>
                </svg>
                Código de descuento o venta
                <span class="optional-badge">Opcional</span>
              </label>
              <div class="gift-input-wrap">
                <input
                  v-model="giftCode"
                  type="text"
                  placeholder="Ej: PROMO2024"
                  class="gift-input"
                  @keyup.enter="handleConfirm"
                />
                <span v-if="giftCode" class="gift-clear" @click="giftCode = ''">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </span>
              </div>
            </div>

            <!-- Security badges -->
            <div class="security-row">
              <div class="security-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
                </svg>
                SSL Seguro
              </div>
              <div class="security-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                </svg>
                Encriptado
              </div>
              <div class="security-badge wompi-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0Zm-6.816 4.496a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.679ZM3 10.5a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10.5Zm14.25 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H18a.75.75 0 0 1-.75-.75Z"/>
                </svg>
                Wompi
              </div>
            </div>

            <!-- Action buttons -->
            <div class="modal-actions">
              <button class="btn-cancel" @click="$emit('cancel')">
                Cancelar
              </button>
              <button
                class="btn-confirm"
                :class="{ loading: isLoading }"
                @click="handleConfirm"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="btn-spinner"></span>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="btn-icon">
                  <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/>
                </svg>
                {{ isLoading ? 'Procesando...' : 'Ir al Pago' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue:      { type: Boolean, default: false },
  title:           { type: String,  default: 'Confirmar Compra' },
  price:           { type: Number,  default: 0 },
  currency:        { type: String,  default: 'COP' },
  photoUrl:        { type: String,  default: null },
  photoCount:      { type: Number,  default: 1 },
  hasSubscription: { type: Boolean, default: false },
  freeRemaining:   { type: Number,  default: 0 },
  isLoading:       { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const useSubscription = ref(false)
const giftCode        = ref('')

const formattedPrice = computed(() =>
  `$${props.price.toLocaleString('es-CO')} ${props.currency}`
)

function handleConfirm() {
  emit('confirm', {
    useSubscription: useSubscription.value,
    giftCardCode:    giftCode.value.trim(),
  })
}

// Reset on close
watch(() => props.modelValue, (val) => {
  if (!val) {
    setTimeout(() => {
      useSubscription.value = false
      giftCode.value        = ''
    }, 300)
  }
})
</script>

<style scoped>
/* ── Overlay ────────────────────────────── */
.payment-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(10, 10, 20, 0.72);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* ── Card ─────────────────────────────── */
.payment-modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.08),
    0 24px 64px -12px rgba(0, 0, 0, 0.35),
    0 8px 24px -4px rgba(99, 102, 241, 0.15);
}

/* ── Accent bar ───────────────────────── */
.modal-accent-bar {
  height: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
}

/* ── Close button ─────────────────────── */
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: background 0.2s, color 0.2s;
  z-index: 10;
}
.modal-close-btn:hover { background: rgba(0,0,0,.12); color: #111827; }
.modal-close-btn svg   { width: 16px; height: 16px; }

/* ── Header ───────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 24px 16px;
}
.modal-icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-main-icon { width: 26px; height: 26px; color: #6366f1; }
.modal-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 2px;
  line-height: 1.2;
}
.modal-subtitle {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  margin: 0;
}

/* ── Photo preview ────────────────────── */
.photo-preview-strip {
  margin: 0 20px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #f8faff 0%, #f5f3ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 16px;
  padding: 12px;
}
.photo-thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  border: 2px solid #c7d2fe;
}
.photo-info   { display: flex; flex-direction: column; gap: 4px; }
.photo-label  { font-size: .7rem; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: .06em; }
.photo-price-tag { font-size: 1.25rem; font-weight: 800; color: #111827; }

/* ── Price summary ────────────────────── */
.price-summary-box {
  margin: 0 20px 16px;
  background: linear-gradient(135deg, #f8faff 0%, #f5f3ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 16px;
  padding: 16px;
}
.price-row   { display: flex; align-items: center; justify-content: space-between; }
.price-label { font-size: .8rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.price-value {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.price-subrow { font-size: .72rem; color: #9ca3af; margin-top: 4px; font-weight: 500; }

/* ── Subscription ─────────────────────── */
.subscription-banner {
  margin: 0 20px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 1px solid #bbf7d0;
  border-radius: 14px;
  padding: 12px 14px;
}
.sub-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
}
.sub-icon svg   { width: 16px; height: 16px; }
.sub-label      { display: flex; align-items: center; gap: 10px; font-size: .8rem; color: #065f46; font-weight: 600; cursor: pointer; user-select: none; }
.sub-checkbox   { width: 16px; height: 16px; border-radius: 4px; accent-color: #059669; cursor: pointer; flex-shrink: 0; }
.sub-remaining  { font-weight: 800; color: #047857; }

/* ── Gift card ────────────────────────── */
.gift-card-section { padding: 0 20px 16px; }
.gift-card-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: .72rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 8px;
}
.gift-icon        { width: 14px; height: 14px; color: #6366f1; }
.optional-badge   { font-size: .65rem; font-weight: 600; background: #f3f4f6; color: #9ca3af; padding: 1px 7px; border-radius: 99px; margin-left: auto; text-transform: uppercase; letter-spacing: .04em; }
.gift-input-wrap  { position: relative; }
.gift-input {
  width: 100%;
  padding: 11px 38px 11px 14px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: .85rem;
  font-weight: 500;
  color: #111827;
  outline: none;
  box-sizing: border-box;
  transition: border-color .2s, box-shadow .2s, background .2s;
  font-family: inherit;
}
.gift-input::placeholder { color: #c4c9d4; }
.gift-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, .1);
  background: #fff;
}
.gift-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .2s;
}
.gift-clear:hover  { color: #374151; }
.gift-clear svg    { width: 14px; height: 14px; }

/* ── Security badges ──────────────────── */
.security-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px 18px;
  flex-wrap: wrap;
}
.security-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: .68rem;
  font-weight: 700;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 99px;
  padding: 4px 10px;
}
.security-badge svg { width: 12px; height: 12px; }
.wompi-badge { background: linear-gradient(135deg, #fff7ed, #fef3c7); border-color: #fde68a; color: #92400e; }

/* ── Buttons ──────────────────────────── */
.modal-actions {
  display: flex;
  gap: 10px;
  padding: 4px 20px 24px;
}
.btn-cancel {
  flex: 1;
  padding: 13px;
  border-radius: 14px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  font-size: .875rem;
  font-weight: 700;
  color: #374151;
  transition: background .2s, transform .15s;
  font-family: inherit;
}
.btn-cancel:hover { background: #e5e7eb; transform: translateY(-1px); }
.btn-confirm {
  flex: 2;
  padding: 13px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  border: none;
  cursor: pointer;
  font-size: .875rem;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity .2s, transform .15s, box-shadow .2s;
  box-shadow: 0 4px 14px rgba(99, 102, 241, .4);
  font-family: inherit;
}
.btn-confirm:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99, 102, 241, .5); }
.btn-confirm:active:not(:disabled){ transform: translateY(0); }
.btn-confirm:disabled { opacity: .65; cursor: not-allowed; }
.btn-icon { width: 17px; height: 17px; }

/* Spinner */
.btn-spinner {
  width: 17px;
  height: 17px;
  border: 2.5px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Transitions ──────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .25s ease; }
.modal-fade-enter-from,  .modal-fade-leave-to      { opacity: 0; }

.modal-slide-enter-active { transition: opacity .28s ease, transform .28s cubic-bezier(0.16,1,0.3,1); }
.modal-slide-leave-active { transition: opacity .2s ease, transform .2s ease; }
.modal-slide-enter-from   { opacity: 0; transform: translateY(24px) scale(0.96); }
.modal-slide-leave-to     { opacity: 0; transform: translateY(8px) scale(0.98); }
</style>
