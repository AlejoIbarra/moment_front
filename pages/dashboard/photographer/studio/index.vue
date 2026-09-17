<template>
  <div class="fixed inset-0 z-40 bg-[#09090b] text-gray-200 flex flex-col overflow-hidden font-sans select-none">
    <!-- ═══════════════════════════════════════════ -->
    <!-- TOP TOOLBAR (Lightroom Studio Bar)         -->
    <!-- ═══════════════════════════════════════════ -->
    <header class="h-14 bg-[#121214] border-b border-[#27272a] px-4 flex items-center justify-between flex-shrink-0 z-20">
      <!-- Left: Brand & Back -->
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#323238] text-gray-300 hover:text-white transition-colors text-xs font-bold"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          <span>Salir</span>
        </button>

        <div class="flex items-center gap-2 border-l border-[#27272a] pl-4">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3ef4a1] to-indigo-500 flex items-center justify-center text-black font-black text-xs shadow-sm">
            Lr
          </div>
          <div>
            <h1 class="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
              Moments Studio Pro
              <span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#3ef4a1]/10 text-[#3ef4a1] border border-[#3ef4a1]/20">BETA</span>
            </h1>
            <p class="text-[10px] text-gray-400 truncate max-w-[200px] sm:max-w-xs">
              {{ activePhoto ? activePhoto.name : 'Sin fotos cargadas' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Center: Quick Tool Actions (Undo, Redo, Compare, Copy/Paste) -->
      <div class="hidden md:flex items-center gap-2">
        <!-- Undo / Redo -->
        <div class="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl p-0.5">
          <button
            @click="undo"
            :disabled="!canUndo"
            class="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 rounded-lg transition-colors"
            title="Deshacer (Ctrl+Z)"
          >
            <Icon name="lucide:undo-2" class="w-4 h-4" />
          </button>
          <button
            @click="redo"
            :disabled="!canRedo"
            class="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 rounded-lg transition-colors"
            title="Rehacer (Ctrl+Y)"
          >
            <Icon name="lucide:redo-2" class="w-4 h-4" />
          </button>
        </div>

        <!-- Before / After Compare Toggle -->
        <button
          @click="toggleCompare"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all',
            isComparing
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-[#18181b] border-[#27272a] text-gray-300 hover:text-white hover:border-gray-600'
          ]"
          title="Comparar Antes / Después"
        >
          <Icon name="lucide:split-square-vertical" class="w-3.5 h-3.5" />
          <span>{{ isComparing ? 'Original' : 'Antes / Después' }}</span>
        </button>

        <!-- Grid Overlay Toggle -->
        <button
          @click="showGrid = !showGrid"
          :class="[
            'p-2 rounded-xl border text-xs font-bold transition-all',
            showGrid
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
              : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-gray-600'
          ]"
          title="Cuadrícula regla de tercios"
        >
          <Icon name="lucide:grid" class="w-4 h-4" />
        </button>

        <!-- Copy / Paste Settings -->
        <div class="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl p-0.5">
          <button
            @click="handleCopy"
            class="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1 hover:bg-[#27272a] rounded-lg transition-colors"
            title="Copiar ajustes de la foto activa"
          >
            <Icon name="lucide:copy" class="w-3.5 h-3.5" />
            <span>Copiar</span>
          </button>
          <button
            @click="handlePaste"
            :disabled="!copiedSettings"
            class="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-30 flex items-center gap-1 hover:bg-[#27272a] rounded-lg transition-colors"
            title="Pegar ajustes"
          >
            <Icon name="lucide:clipboard-paste" class="w-3.5 h-3.5" />
            <span>Pegar</span>
          </button>
        </div>
      </div>

      <!-- Right: Batch Actions & Export -->
      <div class="flex items-center gap-2.5">
        <!-- Sync Batch Button (Highlight when multi-selected) -->
        <button
          v-if="isBatchMode"
          @click="handleSyncBatch"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all animate-pulse"
        >
          <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5" />
          <span>Sincronizar ({{ selectedCount }})</span>
        </button>

        <!-- Export / Save Button -->
        <button
          @click="showExportModal = true"
          :disabled="photos.length === 0"
          class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#3ef4a1] hover:bg-[#34d38c] text-black font-black text-xs shadow-lg shadow-[#3ef4a1]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name="lucide:download" class="w-3.5 h-3.5" />
          <span>Exportar Lote</span>
        </button>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MAIN WORKSPACE: CANVAS + RIGHT DEVELOP BAR -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- CENTER: Central Photo Viewport -->
      <main class="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden bg-[#09090b]">
        <!-- Top Photo Navigation Overlay -->
        <div
          v-if="photos.length > 1"
          class="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#18181b]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#27272a] text-xs"
        >
          <button @click="prevPhoto" class="p-1 hover:text-white text-gray-400">
            <Icon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="font-mono font-bold text-gray-200">
            {{ activePhotoIndex + 1 }} / {{ photos.length }}
          </span>
          <button @click="nextPhoto" class="p-1 hover:text-white text-gray-400">
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <!-- Zoom Controls Overlay -->
        <div
          v-if="activePhoto"
          class="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-[#18181b]/80 backdrop-blur-md p-1 rounded-xl border border-[#27272a] text-xs"
        >
          <button
            @click="zoom = Math.max(0.2, zoom - 0.15)"
            class="p-1.5 hover:bg-[#27272a] text-gray-300 rounded-lg"
            title="Reducir zoom"
          >
            <Icon name="lucide:zoom-out" class="w-4 h-4" />
          </button>
          <button
            @click="zoom = 1"
            class="px-2 py-1 hover:bg-[#27272a] text-gray-300 rounded-lg font-mono text-[11px] font-bold"
            title="Ajustar a pantalla"
          >
            {{ Math.round(zoom * 100) }}%
          </button>
          <button
            @click="zoom = Math.min(3, zoom + 0.15)"
            class="p-1.5 hover:bg-[#27272a] text-gray-300 rounded-lg"
            title="Aumentar zoom"
          >
            <Icon name="lucide:zoom-in" class="w-4 h-4" />
          </button>
        </div>

        <!-- Empty State (No Photos) -->
        <div
          v-if="photos.length === 0"
          class="max-w-md w-full p-8 border-2 border-dashed border-[#27272a] rounded-3xl text-center space-y-4 hover:border-indigo-500/50 transition-all cursor-pointer bg-[#121214]/50"
          @click="$refs.mainFileInput.click()"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div class="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <Icon name="lucide:image-plus" class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-base font-bold text-white mb-1">Importar Fotos al Estudio</h3>
            <p class="text-xs text-gray-400">
              Arrastra tus fotos aquí o haz clic para seleccionarlas desde tu ordenador (JPG, PNG, WebP).
            </p>
          </div>
          <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all">
            Seleccionar Fotos
          </button>
          <input
            type="file"
            ref="mainFileInput"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- Canvas Active Photo Rendering -->
        <div
          v-else
          class="relative max-w-full max-h-full flex items-center justify-center overflow-hidden transition-transform duration-75 ease-out shadow-2xl rounded-lg"
          :style="{ transform: `scale(${zoom})` }"
        >
          <!-- Processed Canvas -->
          <canvas
            ref="mainCanvasRef"
            class="max-w-full max-h-[calc(100vh-230px)] object-contain rounded-lg shadow-2xl transition-all"
            :class="{ 'opacity-0': isComparing }"
          ></canvas>

          <!-- Original Preview (Shown during Compare) -->
          <img
            v-if="isComparing && activePhoto"
            :src="activePhoto.originalSrc"
            class="absolute inset-0 max-w-full max-h-[calc(100vh-230px)] object-contain rounded-lg shadow-2xl m-auto"
            alt="Original"
          />

          <!-- Rule of Thirds Grid Overlay -->
          <div
            v-if="showGrid"
            class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20"
          >
            <div class="border-r border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-b border-white/20"></div>
            <div class="border-r border-white/20"></div>
            <div class="border-r border-white/20"></div>
            <div></div>
          </div>
        </div>
      </main>

      <!-- RIGHT: Develop Panel (Lightroom Inspector) -->
      <aside class="w-80 sm:w-88 bg-[#121214] border-l border-[#27272a] flex flex-col flex-shrink-0 z-10 overflow-hidden">
        <!-- Inspector Tabs Header -->
        <div class="flex border-b border-[#27272a] bg-[#18181b] p-1 gap-1 flex-shrink-0 text-xs">
          <button
            @click="rightTab = 'develop'"
            :class="[
              'flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5',
              rightTab === 'develop'
                ? 'bg-[#27272a] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            <Icon name="lucide:sliders" class="w-3.5 h-3.5 text-indigo-400" />
            <span>Revelado</span>
          </button>
          <button
            @click="rightTab = 'presets'"
            :class="[
              'flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5',
              rightTab === 'presets'
                ? 'bg-[#27272a] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#3ef4a1]" />
            <span>Presets</span>
          </button>
        </div>

        <!-- Inspector Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <!-- Batch Mode Active Banner in Inspector -->
          <div
            v-if="isBatchMode"
            class="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-3 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <div>
                <p class="text-xs font-bold text-indigo-200">Editando Lote ({{ selectedCount }} fotos)</p>
                <p class="text-[10px] text-indigo-400">Los cambios se aplicarán al grupo</p>
              </div>
            </div>
            <button
              @click="applyBatchChanges = !applyBatchChanges"
              :class="[
                'px-2 py-1 rounded-lg text-[10px] font-bold transition-colors',
                applyBatchChanges
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#27272a] text-gray-400'
              ]"
            >
              {{ applyBatchChanges ? 'Lote Activo' : 'Solo Actual' }}
            </button>
          </div>

          <!-- Live Histogram -->
          <LightroomHistogram :histogram="histogramData" />

          <!-- Tab 1: Develop Sliders -->
          <div v-show="rightTab === 'develop'">
            <div v-if="activePhoto">
              <LightroomSliders
                :settings="activePhoto.settings"
                :applyToBatch="applyBatchChanges"
                @update="handleSliderUpdate"
                @commit="handleSliderCommit"
              />
            </div>
            <div v-else class="text-center py-12 text-gray-500 text-xs">
              Selecciona una foto para comenzar a ajustar.
            </div>
          </div>

          <!-- Tab 2: Presets -->
          <div v-show="rightTab === 'presets'">
            <LightroomPresets
              :activePresetName="activePhoto?.appliedPresetName"
              @apply="handleApplyPreset"
            />
          </div>
        </div>
      </aside>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- BOTTOM FILMSTRIP                            -->
    <!-- ═══════════════════════════════════════════ -->
    <LightroomFilmstrip
      v-if="photos.length > 0"
      :photos="photos"
      :activePhotoId="activePhotoId"
      :selectedPhotoIds="selectedPhotoIds"
      :hasCopiedSettings="!!copiedSettings"
      @select-photo="handleFilmstripSelect"
      @toggle-select="toggleSelectPhoto"
      @select-all="selectAll"
      @deselect-all="deselectAll"
      @sync-batch="handleSyncBatch"
      @paste-batch="handlePaste"
      @reset-batch="handleResetBatch"
      @add-files="loadPhotosFromFiles"
    />

    <!-- ═══════════════════════════════════════════ -->
    <!-- BATCH EXPORT MODAL                          -->
    <!-- ═══════════════════════════════════════════ -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div class="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-[#3ef4a1]/10 text-[#3ef4a1] flex items-center justify-center font-bold">
              <Icon name="lucide:download-cloud" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Exportar Lote de Fotos</h3>
              <p class="text-xs text-gray-400">Procesar y descargar imágenes reveladas</p>
            </div>
          </div>
          <button v-if="!isExporting" @click="showExportModal = false" class="text-gray-400 hover:text-white">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Export Progress if running -->
        <div v-if="isExporting" class="space-y-3 py-4">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-gray-300">Procesando {{ exportCurrent }} de {{ exportTotal }} fotos...</span>
            <span class="font-mono text-[#3ef4a1]">{{ Math.round((exportCurrent / exportTotal) * 100) }}%</span>
          </div>
          <div class="w-full h-2.5 bg-[#27272a] rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-[#3ef4a1] to-indigo-500 transition-all duration-200"
              :style="{ width: `${(exportCurrent / exportTotal) * 100}%` }"
            ></div>
          </div>
          <p class="text-[11px] text-gray-500 text-center animate-pulse">
            Renderizando filtros y curvas de color en alta resolución...
          </p>
        </div>

        <!-- Export Options Form -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Ámbito de Exportación</label>
            <div class="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                @click="exportScope = 'all'"
                :class="[
                  'py-2 px-3 rounded-xl border transition-all text-center',
                  exportScope === 'all'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#27272a] border-[#323238] text-gray-300 hover:text-white'
                ]"
              >
                Todas las fotos ({{ photos.length }})
              </button>
              <button
                @click="exportScope = 'selected'"
                :disabled="selectedCount === 0"
                :class="[
                  'py-2 px-3 rounded-xl border transition-all text-center disabled:opacity-40',
                  exportScope === 'selected'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#27272a] border-[#323238] text-gray-300 hover:text-white'
                ]"
              >
                Solo seleccionadas ({{ selectedCount }})
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Calidad de Imagen JPEG</label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="70"
                max="100"
                v-model.number="exportQuality"
                class="flex-1 slider-lightroom"
              />
              <span class="font-mono text-xs font-bold text-gray-300">{{ exportQuality }}%</span>
            </div>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              @click="showExportModal = false"
              class="flex-1 py-2.5 px-4 text-xs font-bold text-gray-400 hover:text-white rounded-xl bg-[#27272a] hover:bg-[#323238] transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="startExport"
              class="flex-1 py-2.5 px-4 text-xs font-black text-black bg-[#3ef4a1] hover:bg-[#34d38c] rounded-xl transition-all shadow-lg shadow-[#3ef4a1]/20 flex items-center justify-center gap-1.5"
            >
              <Icon name="lucide:download" class="w-4 h-4" />
              <span>Iniciar Descarga</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  useLightroomStudio,
  type StudioPhoto
} from '~/composables/useLightroomStudio';
import {
  applyAdjustmentsToCanvas,
  exportProcessedImageBlob,
  type HistogramData,
  type Preset,
  type PhotoAdjustments
} from '~/utils/imageGradingEngine';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const {
  photos,
  activePhoto,
  activePhotoId,
  activePhotoIndex,
  selectedPhotoIds,
  selectedCount,
  isBatchMode,
  copiedSettings,
  canUndo,
  canRedo,
  loadPhotosFromFiles,
  loadPhotosFromUrls,
  setActivePhoto,
  toggleSelectPhoto,
  selectAll,
  deselectAll,
  updateAdjustment,
  commitAdjustmentChange,
  applyPreset,
  copySettings,
  pasteSettings,
  syncActiveToSelected,
  resetPhotos,
  undo,
  redo,
  nextPhoto,
  prevPhoto
} = useLightroomStudio();

// ── UI States ──────────────────────────────────────────
const rightTab = ref<'develop' | 'presets'>('develop');
const zoom = ref(1);
const isComparing = ref(false);
const showGrid = ref(false);
const applyBatchChanges = ref(true);

const mainCanvasRef = ref<HTMLCanvasElement | null>(null);
const histogramData = ref<HistogramData | null>(null);

// ── Export States ──────────────────────────────────────
const showExportModal = ref(false);
const isExporting = ref(false);
const exportScope = ref<'all' | 'selected'>('all');
const exportQuality = ref(92);
const exportCurrent = ref(0);
const exportTotal = ref(0);

// Active loaded image element cache
let activeImageElement: HTMLImageElement | null = null;

// ── Render Active Canvas ───────────────────────────────
function renderCanvas() {
  if (!activePhoto.value || !mainCanvasRef.value) return;

  const currentPhoto = activePhoto.value;

  if (!activeImageElement || activeImageElement.src !== currentPhoto.originalSrc) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      activeImageElement = img;
      executeCanvasDraw();
    };
    img.src = currentPhoto.originalSrc;
  } else {
    executeCanvasDraw();
  }
}

function executeCanvasDraw() {
  if (!activeImageElement || !mainCanvasRef.value || !activePhoto.value) return;
  const canvas = mainCanvasRef.value;
  const hist = applyAdjustmentsToCanvas(
    activeImageElement,
    canvas,
    activePhoto.value.settings,
    true
  );
  if (hist) {
    histogramData.value = hist;
  }
}

watch(
  () => activePhoto.value?.settings,
  () => {
    nextTick(renderCanvas);
  },
  { deep: true }
);

watch(
  () => activePhotoId.value,
  () => {
    activeImageElement = null;
    nextTick(renderCanvas);
  }
);

// ── Sliders & Presets Handlers ─────────────────────────
function handleSliderUpdate(key: keyof PhotoAdjustments, value: any) {
  updateAdjustment(key, value, applyBatchChanges.value);
}

function handleSliderCommit() {
  commitAdjustmentChange();
}

function handleApplyPreset(preset: Preset) {
  applyPreset(preset);
  toast.success('Preset aplicado', `Se aplicó "${preset.name}"`);
}

function handleCopy() {
  if (copySettings()) {
    toast.success('Ajustes copiados', 'Listo para pegar en cualquier foto o lote.');
  }
}

function handlePaste() {
  if (pasteSettings()) {
    toast.success('Ajustes pegados', `Aplicados a las fotos seleccionadas.`);
  }
}

function handleSyncBatch() {
  syncActiveToSelected();
  toast.success('Lote sincronizado', `Ajustes aplicados a ${selectedCount.value} fotos seleccionadas.`);
}

function handleResetBatch() {
  resetPhotos();
  toast.info('Ajustes restablecidos', 'Se volvió a la configuración original.');
}

function toggleCompare() {
  isComparing.value = !isComparing.value;
}

function handleFilmstripSelect(id: string, isShift: boolean) {
  if (isShift) {
    toggleSelectPhoto(id, true);
  } else {
    setActivePhoto(id);
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    loadPhotosFromFiles(Array.from(target.files));
    target.value = '';
  }
}

function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    loadPhotosFromFiles(Array.from(event.dataTransfer.files));
  }
}

// ── Export / Batch Download ────────────────────────────
async function startExport() {
  const targetPhotos =
    exportScope.value === 'selected'
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : photos.value;

  if (targetPhotos.length === 0) return;

  isExporting.value = true;
  exportTotal.value = targetPhotos.length;
  exportCurrent.value = 0;

  try {
    for (let i = 0; i < targetPhotos.length; i++) {
      const p = targetPhotos[i];
      exportCurrent.value = i + 1;

      const blob = await exportProcessedImageBlob(
        p.originalSrc,
        p.settings,
        exportQuality.value / 100
      );

      // Trigger browser download
      const link = document.createElement('a');
      const filename = p.name.replace(/\.[^/.]+$/, '') + '_moments_studio.jpg';
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);

      // Brief delay so browser handles multiple downloads cleanly
      await new Promise((res) => setTimeout(res, 250));
    }

    toast.success('Exportación completada', `Se procesaron ${targetPhotos.length} fotos exitosamente.`);
    showExportModal.value = false;
  } catch (e) {
    console.error('Error during batch export:', e);
    toast.error('Error', 'Hubo un problema procesando las fotos.');
  } finally {
    isExporting.value = false;
  }
}

// ── Keyboard Shortcuts ─────────────────────────────────
function handleKeyDown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) redo();
    else undo();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault();
    redo();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    e.preventDefault();
    handleCopy();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
    e.preventDefault();
    handlePaste();
  } else if (e.key === 'ArrowRight') {
    nextPhoto();
  } else if (e.key === 'ArrowLeft') {
    prevPhoto();
  } else if (e.key === '\\') {
    toggleCompare();
  }
}

function goBack() {
  router.back();
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  renderCanvas();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.slider-lightroom {
  @apply w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #121214;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
</style>
