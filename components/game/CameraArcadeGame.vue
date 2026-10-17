<template>
  <div class="space-y-6">

    <!-- CAMERA ARCADE CONTAINER -->
    <div class="relative bg-slate-900 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 text-white max-w-xl mx-auto select-none">
      
      <!-- Retro DSLR Top Plate / Status Display -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span class="font-black text-amber-400 tracking-wider">MOMENTS CAM-2D</span>
          <span class="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300">ISO 400</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 text-slate-300">
            <Icon name="lucide:timer" class="w-3.5 h-3.5 text-amber-400" />
            <span class="font-bold text-white">{{ timeLeft }}s</span>
          </div>
          <div class="flex items-center gap-1 text-slate-300">
            <Icon name="lucide:film" class="w-3.5 h-3.5 text-yellow-400" />
            <span class="font-bold text-white">{{ shotsLeft }} ROLL</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 uppercase">SCORE</span>
            <span class="font-black text-amber-400 block text-sm">{{ score }}</span>
          </div>
        </div>
      </div>

      <!-- CAMERA VIEWFINDER (2D CANVAS STAGE) -->
      <div 
        ref="stageContainer"
        class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-black cursor-crosshair border-2 border-white/20 shadow-inner"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
      >
        <!-- Canvas Stage for 2D Objects -->
        <canvas ref="gameCanvas" class="w-full h-full block"></canvas>

        <!-- Viewfinder Reticle / Focus Crosshairs overlay -->
        <div
          class="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          :style="{ left: `${reticleX}px`, top: `${reticleY}px` }"
        >
          <!-- Focus Circle -->
          <div 
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed flex items-center justify-center transition-colors duration-150 relative"
            :class="isInFocus ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]' : 'border-rose-400/70'"
          >
            <!-- Center Crosshair Pip -->
            <div 
              class="w-2 h-2 rounded-full transition-colors"
              :class="isInFocus ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'"
            ></div>

            <!-- Focus Status Label -->
            <span 
              class="absolute -bottom-5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
              :class="isInFocus ? 'bg-emerald-500 text-slate-950' : 'bg-rose-950/80 text-rose-300'"
            >
              {{ isInFocus ? 'FOCUS LOCK' : 'SEEKING' }}
            </span>
          </div>
        </div>

        <!-- Camera Lens Rule-of-Thirds Grid Overlay -->
        <div class="absolute inset-0 pointer-events-none opacity-20 grid grid-cols-3 grid-rows-3">
          <div class="border-r border-b border-white"></div>
          <div class="border-r border-b border-white"></div>
          <div class="border-b border-white"></div>
          <div class="border-r border-b border-white"></div>
          <div class="border-r border-b border-white"></div>
          <div class="border-b border-white"></div>
          <div class="border-r border-white"></div>
          <div class="border-r border-white"></div>
          <div></div>
        </div>

        <!-- Camera Flash Visual Effect -->
        <div 
          v-if="isFlashing" 
          class="absolute inset-0 bg-white pointer-events-none transition-opacity duration-100 z-30"
        ></div>

        <!-- Combo Notification Floating Pill -->
        <div 
          v-if="combo >= 2" 
          class="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg animate-bounce pointer-events-none z-20"
        >
          🔥 COMBO x{{ combo }}!
        </div>

        <!-- Float Popups (+200 PERFECT!) -->
        <div
          v-for="popup in popups"
          :key="popup.id"
          class="absolute pointer-events-none font-black text-xs sm:text-sm animate-fade-up z-20"
          :style="{ left: `${popup.x}px`, top: `${popup.y}px`, color: popup.color }"
        >
          {{ popup.text }}
        </div>

        <!-- START GAME SCREEN OVERLAY -->
        <div 
          v-if="gameState === 'READY'" 
          class="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-40"
        >
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg animate-bounce">
            <Icon name="lucide:camera" class="w-8 h-8" />
          </div>

          <div>
            <h3 class="text-xl sm:text-2xl font-black text-white">Reto Paparazzi 2D</h3>
            <p class="text-xs text-amber-300 font-bold mt-0.5">Enfoque Perfecto</p>
            <p class="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">
              Mueve el visor de la cámara sobre los invitados y novios. Cuando el círculo se vuelva <strong class="text-emerald-400">VERDE</strong>, presiona disparar para capturar la foto perfecta. ¡Evita las bombas!
            </p>
          </div>

          <button
            type="button"
            @click="startGame"
            class="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Icon name="lucide:play" class="w-4 h-4 fill-slate-950" />
            <span>¡Iniciar Sesión de Fotos!</span>
          </button>
        </div>

        <!-- GAME OVER / POLAROID PRINT OUT OVERLAY -->
        <div 
          v-if="gameState === 'GAME_OVER'" 
          class="absolute inset-0 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-4 z-40 overflow-y-auto"
        >
          <!-- Virtual Polaroid Card that Ejected from Camera -->
          <div class="bg-white text-slate-900 rounded-2xl p-4 pb-6 shadow-2xl max-w-xs w-full animate-scale-up space-y-3">
            <div class="aspect-square bg-slate-900 rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-4 text-white">
              <Icon name="lucide:trophy" class="w-12 h-12 text-yellow-400 animate-bounce mb-2" />
              <span class="text-2xl font-black text-yellow-300">{{ score }} PTS</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Puntuación Final</span>
              
              <div class="mt-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-slate-950">
                {{ ratingBadge }}
              </div>
            </div>

            <!-- Polaroid Bottom Note -->
            <div class="text-center space-y-1">
              <p class="font-serif italic text-xs font-bold text-slate-800">"Paparazzi Oficial • {{ eventTitle }}"</p>
              <div class="flex justify-between text-[10px] text-slate-500 font-mono px-2 pt-1 border-t border-slate-100">
                <span>🎯 Precisión: {{ accuracy }}%</span>
                <span>⭐ Perfectos: {{ perfectShots }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-2 max-w-xs w-full">
            <button
              v-if="authStore.isAuthenticated && !scoreSaved"
              type="button"
              @click="submitScore"
              :disabled="savingScore"
              class="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Icon v-if="savingScore" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:save" class="w-4 h-4" />
              <span>Guardar en el Ranking Oficial</span>
            </button>

            <NuxtLink
              v-else-if="!authStore.isAuthenticated"
              :to="`/login?redirect=/game/${gameUuid}`"
              class="w-full py-2.5 bg-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 block cursor-pointer"
            >
              <Icon name="lucide:log-in" class="w-3.5 h-3.5" />
              <span>Inicia sesión para registrar tu récord</span>
            </NuxtLink>

            <span v-if="scoreSaved" class="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
              <Icon name="lucide:check-circle" class="w-4 h-4" />
              ¡Récord guardado en el ranking!
            </span>

            <button
              type="button"
              @click="startGame"
              class="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:rotate-ccw" class="w-3.5 h-3.5" />
              <span>Jugar Otra Vez</span>
            </button>
          </div>
        </div>

      </div>

      <!-- CAMERA CONTROLS BOTTOM BAR (Big Shutter Button) -->
      <div class="pt-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="toggleAudio"
            class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            :title="audioEnabled ? 'Silenciar sonidos de cámara' : 'Activar sonidos de cámara'"
          >
            <Icon :name="audioEnabled ? 'lucide:volume-2' : 'lucide:volume-x'" class="w-4 h-4 text-amber-400" />
          </button>
          <span class="text-[11px] text-slate-400 hidden sm:inline">Toca en la pantalla o presiona el botón rojo para disparar</span>
        </div>

        <!-- Big Red Shutter Button -->
        <button
          type="button"
          @click="takeSnapshot"
          :disabled="gameState !== 'PLAYING'"
          class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-700 shadow-xl shadow-red-600/40 border-4 border-slate-700 active:scale-90 active:brightness-90 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none group"
        >
          <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-red-300/40 flex items-center justify-center">
            <Icon name="lucide:camera" class="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow group-active:scale-95 transition-transform" />
          </div>
        </button>
      </div>

    </div>

    <!-- ARCADE LEADERBOARD -->
    <div class="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 max-w-xl mx-auto">
      <div class="flex items-center justify-between pb-3 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center border border-yellow-400/30">
            <Icon name="lucide:award" class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-sm font-black text-white uppercase tracking-wider">Top Paparazzis del Evento</h4>
            <p class="text-[11px] text-slate-400">Puntuaciones más altas en la cámara 2D</p>
          </div>
        </div>

        <button
          type="button"
          @click="loadLeaderboard"
          class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <Icon name="lucide:refresh-cw" class="w-3 h-3" />
        </button>
      </div>

      <div v-if="loadingLeaderboard" class="py-8 text-center text-slate-500 text-xs">
        Cargando ranking...
      </div>

      <div v-else-if="!leaderboard?.topScores?.length" class="py-8 text-center text-slate-500 text-xs">
        Aún no hay puntuaciones registradas. ¡Sé el primero en jugar!
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="(item, idx) in leaderboard.topScores"
          :key="item.id"
          class="flex items-center justify-between p-3 rounded-2xl transition-all"
          :class="idx === 0 
            ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-400/30' 
            : (idx === 1 ? 'bg-slate-800/80 border border-slate-600/30' : (idx === 2 ? 'bg-amber-950/30 border border-amber-600/30' : 'bg-white/5 border border-white/5'))"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
              :class="idx === 0 ? 'bg-yellow-400 text-slate-950' : (idx === 1 ? 'bg-slate-300 text-slate-950' : (idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'))"
            >
              {{ idx + 1 }}
            </span>
            <div>
              <span class="text-xs font-bold text-white block">@{{ item.username }}</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ item.accuracy }}% precisión</span>
            </div>
          </div>

          <div class="text-right">
            <span class="text-sm font-black text-amber-400">{{ item.score }} pts</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import confetti from 'canvas-confetti'

const props = defineProps<{
  gameUuid: string
  eventTitle: string
}>()

const authStore = useAuthStore()
const toast = useToast()

const stageContainer = ref<HTMLElement | null>(null)
const gameCanvas = ref<HTMLCanvasElement | null>(null)

// Game State
type GameState = 'READY' | 'PLAYING' | 'GAME_OVER'
const gameState = ref<GameState>('READY')
const score = ref(0)
const timeLeft = ref(45)
const shotsLeft = ref(15)
const perfectShots = ref(0)
const shotsTaken = ref(0)
const combo = ref(0)
const isFlashing = ref(false)
const audioEnabled = ref(true)

// Reticle coordinates
const reticleX = ref(150)
const reticleY = ref(150)
const isInFocus = ref(false)

// Floating popups
interface Popup {
  id: number
  x: number
  y: number
  text: string
  color: string
}
const popups = ref<Popup[]>([])
let popupId = 0

// Game loop targets
interface Target {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  type: 'VIP' | 'DANCER' | 'TOAST' | 'CAKE' | 'STAR' | 'BOMBER'
  label: string
  points: number
  color: string
  emoji: string
  scale: number
  wobble: number
}
let targets: Target[] = []
let animationFrameId: number | null = null
let timerInterval: any = null

// Audio Context (Web Audio API)
let audioCtx: AudioContext | null = null

// Leaderboard state
const leaderboard = ref<any>(null)
const loadingLeaderboard = ref(false)
const savingScore = ref(false)
const scoreSaved = ref(false)

const accuracy = computed(() => {
  if (shotsTaken.value === 0) return 0
  return Math.min(100, Math.round((perfectShots.value / shotsTaken.value) * 100))
})

const ratingBadge = computed(() => {
  if (score.value >= 2000) return '⭐ PAPARAZZI LEGENDARIO'
  if (score.value >= 1200) return '📸 FOTÓGRAFO PRO'
  if (score.value >= 600) return '✨ AFICIONADO CON OJO'
  return '🔍 EN BUSCA DE ENFOQUE'
})

function initAudio() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
}

function playShutterSound() {
  if (!audioEnabled.value) return
  initAudio()
  if (!audioCtx) return

  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const now = audioCtx.currentTime
    // Click sound (high frequency burst)
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.06)

    // Mirror slap / mechanical shutter clack
    const slap = audioCtx.createOscillator()
    const slapGain = audioCtx.createGain()
    slap.type = 'square'
    slap.frequency.setValueAtTime(160, now + 0.04)
    slap.frequency.exponentialRampToValueAtTime(40, now + 0.12)
    slapGain.gain.setValueAtTime(0.2, now + 0.04)
    slapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
    slap.connect(slapGain)
    slapGain.connect(audioCtx.destination)
    slap.start(now + 0.04)
    slap.stop(now + 0.13)
  } catch (_) {}
}

function playChimeSound(success: boolean) {
  if (!audioEnabled.value) return
  initAudio()
  if (!audioCtx) return

  try {
    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(success ? 587.33 : 220, now) // D5 or A3
    if (success) {
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5
    }
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  } catch (_) {}
}

function toggleAudio() {
  audioEnabled.value = !audioEnabled.value
}

function startGame() {
  score.value = 0
  timeLeft.value = 45
  shotsLeft.value = 15
  perfectShots.value = 0
  shotsTaken.value = 0
  combo.value = 0
  popups.value = []
  scoreSaved.value = false
  gameState.value = 'PLAYING'

  initAudio()
  setupCanvas()
  spawnInitialTargets()

  // Start Countdown
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      endGame()
    }
  }, 1000)

  // Start Animation loop
  cancelAnimationFrame(animationFrameId || 0)
  loop()
}

function endGame() {
  gameState.value = 'GAME_OVER'
  if (timerInterval) clearInterval(timerInterval)
  cancelAnimationFrame(animationFrameId || 0)

  if (score.value >= 1000) {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      })
    } catch (_) {}
  }
}

function setupCanvas() {
  if (!gameCanvas.value || !stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  gameCanvas.value.width = rect.width
  gameCanvas.value.height = rect.height

  reticleX.value = rect.width / 2
  reticleY.value = rect.height / 2
}

function spawnInitialTargets() {
  targets = []
  const types: Target['type'][] = ['VIP', 'DANCER', 'TOAST', 'CAKE', 'STAR', 'BOMBER']
  for (let i = 0; i < 7; i++) {
    const t = types[Math.floor(Math.random() * types.length)]
    targets.push(createTarget(t))
  }
}

function createTarget(type: Target['type']): Target {
  const width = gameCanvas.value?.width || 400
  const height = gameCanvas.value?.height || 300

  let label = 'Invitado'
  let points = 100
  let emoji = '💃'
  let color = '#38bdf8'
  let radius = 28

  if (type === 'VIP') {
    label = 'Novios VIP'
    points = 200
    emoji = '👰🤵'
    color = '#facc15'
    radius = 34
  } else if (type === 'DANCER') {
    label = 'Pista de Baile'
    points = 120
    emoji = '🕺'
    color = '#c084fc'
    radius = 30
  } else if (type === 'TOAST') {
    label = 'Brindis'
    points = 80
    emoji = '🍾'
    color = '#fbbf24'
    radius = 26
  } else if (type === 'CAKE') {
    label = 'Pastel'
    points = 150
    emoji = '🎂'
    color = '#f472b6'
    radius = 30
  } else if (type === 'STAR') {
    label = 'Estrella'
    points = 250
    emoji = '⭐'
    color = '#fef08a'
    radius = 24
  } else if (type === 'BOMBER') {
    label = 'Foto-Bomber'
    points = -50
    emoji = '💣'
    color = '#f43f5e'
    radius = 28
  }

  const speed = type === 'STAR' ? 3.5 : 1.8

  return {
    x: Math.random() * (width - 80) + 40,
    y: Math.random() * (height - 80) + 40,
    vx: (Math.random() - 0.5) * speed * 2,
    vy: (Math.random() - 0.5) * speed * 2,
    radius,
    type,
    label,
    points,
    color,
    emoji,
    scale: 1,
    wobble: Math.random() * Math.PI * 2
  }
}

function handlePointerMove(e: PointerEvent) {
  if (!stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  reticleX.value = e.clientX - rect.left
  reticleY.value = e.clientY - rect.top
}

function handlePointerDown(e: PointerEvent) {
  if (!stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  reticleX.value = e.clientX - rect.left
  reticleY.value = e.clientY - rect.top

  if (gameState.value === 'PLAYING') {
    takeSnapshot()
  }
}

function takeSnapshot() {
  if (shotsLeft.value <= 0 || gameState.value !== 'PLAYING') return

  shotsLeft.value--
  shotsTaken.value++

  // Flash and shutter sound
  isFlashing.value = true
  setTimeout(() => {
    isFlashing.value = false
  }, 75)
  playShutterSound()

  // Check target in focus
  const reticleRadius = 45
  let hitTargetIndex = -1

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i]
    const dist = Math.hypot(t.x - reticleX.value, t.y - reticleY.value)
    if (dist < reticleRadius + t.radius * 0.7) {
      hitTargetIndex = i
      break
    }
  }

  if (hitTargetIndex !== -1) {
    const hit = targets[hitTargetIndex]

    if (hit.type === 'BOMBER') {
      // Penalty
      combo.value = 0
      score.value = Math.max(0, score.value - 50)
      addPopup(reticleX.value, reticleY.value, 'FOTO-BOMBER! -50', '#f43f5e')
      playChimeSound(false)
    } else {
      combo.value++
      perfectShots.value++
      const multiplier = combo.value >= 4 ? 3 : (combo.value >= 2 ? 2 : 1)
      const earned = hit.points * multiplier
      score.value += earned

      const comboText = multiplier > 1 ? ` (x${multiplier})` : ''
      addPopup(reticleX.value, reticleY.value, `+${earned} ${hit.label}!${comboText}`, hit.color)
      playChimeSound(true)
    }

    // Replace target
    targets.splice(hitTargetIndex, 1)
    const types: Target['type'][] = ['VIP', 'DANCER', 'TOAST', 'CAKE', 'STAR', 'BOMBER']
    targets.push(createTarget(types[Math.floor(Math.random() * types.length)]))
  } else {
    combo.value = 0
    addPopup(reticleX.value, reticleY.value, 'DESENFOCADO! 0 pts', '#94a3b8')
  }

  if (shotsLeft.value <= 0) {
    setTimeout(() => {
      endGame()
    }, 400)
  }
}

function addPopup(x: number, y: number, text: string, color: string) {
  const id = ++popupId
  popups.value.push({ id, x: Math.max(20, x - 30), y: Math.max(20, y - 20), text, color })
  setTimeout(() => {
    popups.value = popups.value.filter((p) => p.id !== id)
  }, 900)
}

function loop() {
  if (gameState.value !== 'PLAYING') return

  updatePhysics()
  renderCanvas()

  animationFrameId = requestAnimationFrame(loop)
}

function updatePhysics() {
  const width = gameCanvas.value?.width || 400
  const height = gameCanvas.value?.height || 300
  let focused = false

  for (const t of targets) {
    t.x += t.vx
    t.y += t.vy
    t.wobble += 0.05

    // Bounce off walls
    if (t.x - t.radius < 0) {
      t.x = t.radius
      t.vx *= -1
    }
    if (t.x + t.radius > width) {
      t.x = width - t.radius
      t.vx *= -1
    }
    if (t.y - t.radius < 0) {
      t.y = t.radius
      t.vy *= -1
    }
    if (t.y + t.radius > height) {
      t.y = height - t.radius
      t.vy *= -1
    }

    // Check if under reticle
    const dist = Math.hypot(t.x - reticleX.value, t.y - reticleY.value)
    if (dist < 45 + t.radius * 0.7 && t.type !== 'BOMBER') {
      focused = true
    }
  }

  isInFocus.value = focused
}

function renderCanvas() {
  const canvas = gameCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw 2D floating elements
  for (const t of targets) {
    ctx.save()
    ctx.translate(t.x, t.y + Math.sin(t.wobble) * 4)

    // Outer Glow / Ring
    ctx.beginPath()
    ctx.arc(0, 0, t.radius, 0, Math.PI * 2)
    ctx.fillStyle = `${t.color}22`
    ctx.fill()
    ctx.strokeStyle = t.color
    ctx.lineWidth = 2
    ctx.stroke()

    // Emoji icon in 2D
    ctx.font = `${t.radius * 1.1}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(t.emoji, 0, 1)

    ctx.restore()
  }
}

async function submitScore() {
  if (!authStore.isAuthenticated) return
  savingScore.value = true

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'https://moment-back.onrender.com/api'

    await $fetch(`${apiBase}/games/${props.gameUuid}/arcade/scores`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: {
        score: score.value,
        accuracy: accuracy.value,
        perfectShots: perfectShots.value,
        shotsTaken: shotsTaken.value
      }
    })

    scoreSaved.value = true
    toast.success('¡Puntuación Guardada!', 'Tu récord ya figura en el salón de la fama del evento.')
    loadLeaderboard()
  } catch (err: any) {
    toast.error('Error al guardar', err.response?._data?.message || 'No se pudo guardar la puntuación.')
  } finally {
    savingScore.value = false
  }
}

async function loadLeaderboard() {
  loadingLeaderboard.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'https://moment-back.onrender.com/api'
    const headers: Record<string, string> = {}
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    const res: any = await $fetch(`${apiBase}/games/${props.gameUuid}/arcade/leaderboard`, { headers })
    leaderboard.value = res
  } catch (err) {
    console.error('Error loading arcade leaderboard:', err)
  } finally {
    loadingLeaderboard.value = false
  }
}

function handleResize() {
  setupCanvas()
}

onMounted(() => {
  setupCanvas()
  loadLeaderboard()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  cancelAnimationFrame(animationFrameId || 0)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@keyframes fadeUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(1.2);
  }
}
.animate-fade-up {
  animation: fadeUp 0.8s ease-out forwards;
}
</style>
