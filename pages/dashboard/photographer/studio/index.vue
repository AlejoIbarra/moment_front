<template>
  <div class="fixed inset-0 z-50 bg-[#09090b] text-gray-200 flex flex-col overflow-hidden font-sans select-none">
    <!-- ═══════════════════════════════════════════ -->
    <!-- TOP TOOLBAR (Moments Studio Pro Bar)        -->
    <!-- ═══════════════════════════════════════════ -->
    <header class="h-14 bg-[#121214] border-b border-[#27272a] px-4 flex items-center justify-between flex-shrink-0 z-20">
      <!-- Left: Brand & Back -->
      <div class="flex items-center gap-3 sm:gap-4">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#323238] text-gray-300 hover:text-white transition-colors text-xs font-bold"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div class="flex items-center gap-2 border-l border-[#27272a] pl-3 sm:pl-4">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3ef4a1] via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20">
            <Icon name="lucide:aperture" class="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 class="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
              Moments Studio Pro
            </h1>
            <p class="text-[10px] text-gray-400 truncate max-w-[150px] sm:max-w-xs">
              {{ activePhoto ? activePhoto.name : (photos.length > 0 ? `${photos.length} fotos cargadas` : 'Sin fotos cargadas') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Center: Pro Tool Actions (Auto AI, Compare Modes, Undo/Redo, Grid, Copy/Paste) -->
      <div class="hidden lg:flex items-center gap-2">
        <!-- Auto AI Enhance Button -->
        <button
          @click="handleAutoEnhance"
          :disabled="photos.length === 0"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#3ef4a1]/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-[#3ef4a1]/40 text-[#3ef4a1] hover:text-white text-xs font-black transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          title="Revelado Inteligente Automático: optimiza exposición, sombras, luces y color con 1 clic (A)"
        >
          <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Auto Revelado AI</span>
        </button>

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

        <!-- Compare Modes (Off, Split Slider, Original) -->
        <div class="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl p-0.5 text-xs">
          <button
            @click="compareMode = 'off'"
            :class="[
              'px-2.5 py-1 rounded-lg font-bold transition-all',
              compareMode === 'off' ? 'bg-[#27272a] text-white shadow-xs' : 'text-gray-400 hover:text-gray-200'
            ]"
            title="Ver imagen revelada"
          >
            Editada
          </button>
          <button
            @click="compareMode = 'split'"
            :class="[
              'px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all',
              compareMode === 'split' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-400 hover:text-gray-200'
            ]"
            title="Dividir pantalla: compara antes vs después con barra deslizable"
          >
            <Icon name="lucide:columns-2" class="w-3 h-3" />
            <span>Dividida</span>
          </button>
          <button
            @click="compareMode = 'original'"
            :class="[
              'px-2.5 py-1 rounded-lg font-bold transition-all',
              compareMode === 'original' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs' : 'text-gray-400 hover:text-gray-200'
            ]"
            title="Ver foto original sin cambios (\)"
          >
            Original
          </button>
        </div>

        <!-- Grid Overlay Toggle -->
        <button
          @click="showGrid = !showGrid"
          :class="[
            'p-2 rounded-xl border text-xs font-bold transition-all',
            showGrid
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
              : 'bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:border-gray-600'
          ]"
          title="Cuadrícula regla de tercios (G)"
        >
          <Icon name="lucide:grid" class="w-4 h-4" />
        </button>

        <!-- Copy / Paste Settings -->
        <div class="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl p-0.5">
          <button
            @click="handleCopy"
            class="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1 hover:bg-[#27272a] rounded-lg transition-colors"
            title="Copiar ajustes de la foto activa (Ctrl+C)"
          >
            <Icon name="lucide:copy" class="w-3.5 h-3.5" />
            <span>Copiar</span>
          </button>
          <button
            @click="handlePaste"
            :disabled="!copiedSettings"
            class="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-30 flex items-center gap-1 hover:bg-[#27272a] rounded-lg transition-colors"
            title="Pegar ajustes (Ctrl+V)"
          >
            <Icon name="lucide:clipboard-paste" class="w-3.5 h-3.5" />
            <span>Pegar</span>
          </button>
        </div>

        <!-- Shortcuts Help Modal Button -->
        <button
          @click="showShortcutsModal = true"
          class="p-2 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-gray-600 text-gray-400 hover:text-white text-xs transition-all"
          title="Atajos de teclado y ayuda (?)"
        >
          <Icon name="lucide:keyboard" class="w-4 h-4" />
        </button>
      </div>

      <!-- Right: Import / Batch Actions & Export -->
      <div class="flex items-center gap-2">
        <!-- Import Button -->
        <button
          @click="showImportModal = true"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#323238] text-gray-200 hover:text-white font-bold text-xs border border-[#323238] transition-all"
        >
          <Icon name="lucide:plus-circle" class="w-3.5 h-3.5 text-indigo-400" />
          <span>Importar</span>
        </button>

        <!-- Sync Batch Button (Highlight when multi-selected) -->
        <button
          v-if="isBatchMode"
          @click="handleSyncBatch"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all animate-pulse"
        >
          <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5" />
          <span>Sincronizar ({{ selectedCount }})</span>
        </button>

        <!-- Publish to Event Button (Direct upload with preset applied) -->
        <button
          @click="openPublishModal"
          :disabled="photos.length === 0"
          class="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Guardar y subir fotos directamente a tu evento con los presets aplicados"
        >
          <Icon name="lucide:cloud-upload" class="w-3.5 h-3.5" />
          <span>Publicar en Evento</span>
        </button>

        <!-- Export / Save Button -->
        <button
          @click="showExportModal = true"
          :disabled="photos.length === 0"
          class="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-[#27272a] hover:bg-[#323238] text-gray-200 hover:text-white font-bold text-xs border border-[#323238] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name="lucide:download" class="w-3.5 h-3.5" />
          <span>Descargar JPG</span>
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
          v-if="photos.length > 0"
          class="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#18181b]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#27272a] text-xs shadow-md"
        >
          <button v-if="photos.length > 1" @click="prevPhoto" class="p-1 hover:text-white text-gray-400 transition-colors">
            <Icon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="font-mono font-bold text-gray-200">
            {{ activePhotoIndex + 1 }} / {{ photos.length }}
          </span>
          <button v-if="photos.length > 1" @click="nextPhoto" class="p-1 hover:text-white text-gray-400 transition-colors">
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
          <button
            v-if="activePhoto"
            @click="handleRemovePhoto(activePhoto.id)"
            class="p-1 text-gray-400 hover:text-red-400 border-l border-[#27272a] pl-2 ml-1 transition-colors"
            title="Quitar foto actual del estudio (Delete)"
          >
            <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Zoom & Viewport Controls Overlay -->
        <div
          v-if="activePhoto"
          class="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-[#18181b]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#27272a] text-xs shadow-xl"
        >
          <button
            @click="setZoomPreset('fit')"
            :class="[
              'px-2 py-1 rounded-lg text-[10px] font-bold transition-colors',
              zoom === 1 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            ]"
            title="Ajustar a pantalla (Z)"
          >
            Ajustar
          </button>
          <button
            @click="setZoomPreset(1)"
            :class="[
              'px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors',
              zoom === 1.5 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            ]"
            title="Zoom 100% Píxeles reales"
          >
            100%
          </button>
          <button
            @click="setZoomPreset(2)"
            :class="[
              'px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors',
              zoom === 2 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            ]"
            title="Zoom 200% Detalle"
          >
            200%
          </button>

          <div class="h-4 w-[1px] bg-[#27272a] mx-0.5"></div>

          <button
            @click="zoom = Math.max(0.2, zoom - 0.15)"
            class="p-1 hover:bg-[#27272a] text-gray-300 rounded-lg transition-colors"
            title="Reducir zoom"
          >
            <Icon name="lucide:zoom-out" class="w-3.5 h-3.5" />
          </button>
          <span class="font-mono text-[10px] font-bold text-gray-300 min-w-[34px] text-center">
            {{ Math.round(zoom * 100) }}%
          </span>
          <button
            @click="zoom = Math.min(3.5, zoom + 0.15)"
            class="p-1 hover:bg-[#27272a] text-gray-300 rounded-lg transition-colors"
            title="Aumentar zoom"
          >
            <Icon name="lucide:zoom-in" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Empty State (No Photos) -->
        <div
          v-if="photos.length === 0"
          class="max-w-lg w-full p-8 border-2 border-dashed border-[#27272a] rounded-3xl text-center space-y-6 bg-[#121214]/60 backdrop-blur-xs"
        >
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-[#3ef4a1]/20 border border-indigo-500/30 text-[#3ef4a1] mx-auto flex items-center justify-center shadow-lg">
            <Icon name="lucide:sparkles" class="w-8 h-8" />
          </div>

          <div>
            <h3 class="text-lg font-black text-white mb-1.5">Moments Studio Pro</h3>
            <p class="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Revelado digital y edición por lotes para fotógrafos. Sube archivos locales de tu PC o importa fotos de tus eventos para aplicar presets y publicarlas.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <!-- Option 1: Upload from PC -->
            <label
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-indigo-500/40 transition-all cursor-pointer group shadow-sm text-center"
            >
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="lucide:cloud-upload" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-white">Subir desde mi PC</p>
                <p class="text-[10px] text-gray-400">JPG, PNG, WebP, RAW</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
            </label>

            <!-- Option 2: Open From My Events -->
            <button
              @click="showImportModal = true"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#18181b] hover:bg-[#202024] border border-[#27272a] hover:border-purple-500/40 transition-all cursor-pointer group shadow-sm text-center"
            >
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="lucide:calendar" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-white">Fotos de mis Eventos</p>
                <p class="text-[10px] text-gray-400">{{ myEvents.length }} eventos listos</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Canvas Active Photo Rendering Viewport -->
        <div
          v-else
          ref="viewportRef"
          class="relative max-w-full max-h-full flex items-center justify-center overflow-hidden transition-transform duration-75 ease-out shadow-2xl rounded-lg select-none"
          :style="{ transform: `scale(${zoom})` }"
        >
          <!-- Processed Canvas (Graded output) -->
          <canvas
            ref="mainCanvasRef"
            class="max-w-full max-h-[calc(100vh-230px)] object-contain rounded-lg shadow-2xl transition-all"
            :class="{ 'opacity-0': compareMode === 'original' }"
          ></canvas>

          <!-- Original Preview (Shown in Full Original Mode) -->
          <img
            v-if="compareMode === 'original' && activePhoto"
            :src="activePhoto.originalSrc"
            class="absolute inset-0 max-w-full max-h-[calc(100vh-230px)] object-contain rounded-lg shadow-2xl m-auto"
            alt="Original"
          />

          <!-- Interactive Split Screen Compare View -->
          <div
            v-if="compareMode === 'split' && activePhoto"
            class="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
          >
            <!-- Left Side: Original Image clipped by split percentage -->
            <div
              class="absolute inset-0 overflow-hidden"
              :style="{ clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` }"
            >
              <img
                :src="activePhoto.originalSrc"
                class="w-full h-full object-contain"
                alt="Original"
              />
              <span class="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-gray-300 border border-white/20">
                Original
              </span>
            </div>

            <!-- Right Side Label -->
            <span
              class="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-[#3ef4a1] border border-[#3ef4a1]/30 pointer-events-none"
            >
              Revelada
            </span>

            <!-- Split Divider Line & Draggable Handle -->
            <div
              class="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize pointer-events-auto flex items-center justify-center shadow-2xl group"
              :style="{ left: `${splitPos}%` }"
              @mousedown="startSplitDrag"
              @touchstart="startSplitDrag"
            >
              <div class="w-6 h-6 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg border border-gray-300 font-bold text-[10px] group-hover:scale-110 transition-transform">
                ↔
              </div>
            </div>
          </div>

          <!-- Rule of Thirds Grid Overlay -->
          <div
            v-if="showGrid"
            class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/25 rounded-lg"
          >
            <div class="border-r border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
            <div class="border-r border-b border-white/20"></div>
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
            <LightroomSliders
              :settings="activePhoto ? activePhoto.settings : fallbackSettings"
              :applyToBatch="applyBatchChanges"
              @update="handleSliderUpdate"
              @commit="handleSliderCommit"
            />
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
      @remove-photo="handleRemovePhoto"
      @remove-selected="handleRemoveSelected"
      @clear-all="handleClearAll"
      @add-files="loadPhotosFromFiles"
    />

    <!-- ═══════════════════════════════════════════ -->
    <!-- IMPORT MODAL (From PC or Events)            -->
    <!-- ═══════════════════════════════════════════ -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div class="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Icon name="lucide:image-plus" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Importar Fotos al Estudio</h3>
              <p class="text-xs text-gray-400">Selecciona origen de las imágenes</p>
            </div>
          </div>
          <button @click="showImportModal = false" class="text-gray-400 hover:text-white">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Upload from computer -->
          <label class="p-4 rounded-xl border border-[#27272a] hover:border-indigo-500/40 bg-[#121214] hover:bg-[#202024] flex items-center justify-between cursor-pointer transition-all">
            <div class="flex items-center gap-3">
              <Icon name="lucide:upload" class="w-5 h-5 text-indigo-400" />
              <div>
                <p class="text-xs font-bold text-white">Subir archivos locales</p>
                <p class="text-[10px] text-gray-400">JPG, PNG, WebP de tu dispositivo</p>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-lg bg-[#27272a] text-gray-300 text-xs font-bold">Examinar</span>
            <input type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
          </label>

          <!-- Events List -->
          <div v-if="myEvents.length > 0" class="space-y-2 pt-2 border-t border-[#27272a]">
            <h4 class="text-xs font-bold text-gray-300">O cargar de tus eventos publicados:</h4>
            <div class="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-1">
              <div
                v-for="ev in myEvents"
                :key="ev.id || ev.uuid"
                @click="loadPhotosFromEvent(ev)"
                class="p-2.5 rounded-xl border border-[#27272a] hover:border-indigo-500/50 bg-[#121214] hover:bg-[#202024] flex items-center justify-between cursor-pointer transition-all"
              >
                <div class="min-w-0">
                  <p class="text-xs font-bold text-white truncate">{{ ev.title || 'Evento' }}</p>
                  <p class="text-[10px] text-gray-400">{{ ev.date }} • {{ ev.photoCount || 0 }} fotos</p>
                </div>
                <span class="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                  Abrir <Icon name="lucide:chevron-right" class="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- PUBLISH TO EVENT MODAL (UPLOAD WITH PRESET)  -->
    <!-- ═══════════════════════════════════════════ -->
    <div
      v-if="showPublishModal"
      class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-6 my-8 animate-scale-up">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-[#27272a] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icon name="lucide:cloud-upload" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-white">Publicar Fotos Reveladas</h3>
              <p class="text-xs text-gray-400">Subir directamente a tu evento con los presets y ajustes aplicados</p>
            </div>
          </div>
          <button v-if="!isPublishing" @click="showPublishModal = false" class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#27272a] transition-colors">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Success Screen -->
        <div v-if="publishSuccess" class="py-6 text-center space-y-5">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
            <Icon name="lucide:check-check" class="w-8 h-8" />
          </div>
          <div>
            <h4 class="text-lg font-black text-white">¡Fotos Publicadas con Éxito!</h4>
            <p class="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
              Se procesaron y subieron <strong class="text-emerald-400">{{ publishedCount }} fotos</strong> con su revelado, filtros y marca de agua correspondiente.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              @click="showPublishModal = false"
              class="flex-1 py-3 px-4 rounded-xl bg-[#27272a] hover:bg-[#323238] text-gray-300 font-bold text-xs transition-colors"
            >
              Seguir Editando en Studio
            </button>
            <button
              v-if="publishedEventId"
              @click="goToPublishedEvent"
              class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Ver Evento Publicado</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Publishing In-Progress State -->
        <div v-else-if="isPublishing" class="py-6 space-y-5">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-gray-300 flex items-center gap-2">
              <Icon name="lucide:loader-2" class="w-4 h-4 text-indigo-400 animate-spin" />
              Procesando y subiendo {{ publishCurrent }} de {{ publishTotal }}...
            </span>
            <span class="font-mono text-indigo-400 font-black text-sm">{{ Math.round((publishCurrent / publishTotal) * 100) }}%</span>
          </div>

          <div class="w-full h-3 bg-[#27272a] rounded-full overflow-hidden p-0.5 border border-[#323238]">
            <div
              class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-[#3ef4a1] rounded-full transition-all duration-300"
              :style="{ width: `${(publishCurrent / publishTotal) * 100}%` }"
            ></div>
          </div>

          <div class="bg-[#121214] border border-[#27272a] rounded-xl p-3 text-center space-y-1">
            <p class="text-[11px] text-gray-300 font-medium truncate">
              Foto: <span class="text-white font-bold">{{ publishCurrentName }}</span>
            </p>
            <p class="text-[10px] text-gray-500 animate-pulse">
              Aplicando renderizado digital de curvas, temperatura y preset en alta resolución...
            </p>
          </div>
        </div>

        <!-- Form: Step Configuration -->
        <div v-else class="space-y-5">
          
          <!-- Event Selection Mode Tabs -->
          <div class="space-y-3">
            <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider">1. Evento de Destino</label>
            <div class="grid grid-cols-2 gap-2 bg-[#121214] p-1 rounded-xl border border-[#27272a] text-xs font-bold">
              <button
                type="button"
                @click="targetEventMode = 'existing'"
                :class="[
                  'py-2 px-3 rounded-lg transition-all',
                  targetEventMode === 'existing'
                    ? 'bg-[#27272a] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                ]"
              >
                Evento Existente
              </button>
              <button
                type="button"
                @click="targetEventMode = 'new'"
                :class="[
                  'py-2 px-3 rounded-lg transition-all',
                  targetEventMode === 'new'
                    ? 'bg-[#27272a] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                ]"
              >
                + Crear Nuevo Evento
              </button>
            </div>

            <!-- Existing Event Dropdown/Picker -->
            <div v-if="targetEventMode === 'existing'" class="space-y-2">
              <div v-if="myEvents.length > 0">
                <select
                  v-model="selectedEventId"
                  class="w-full bg-[#121214] border border-[#27272a] rounded-xl py-2.5 px-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option :value="null" disabled>Selecciona un evento de tu lista</option>
                  <option v-for="ev in myEvents" :key="ev.id || ev.uuid" :value="ev.id || ev.uuid">
                    {{ ev.title }} ({{ ev.date }} • {{ ev.photoCount || 0 }} fotos)
                  </option>
                </select>
              </div>
              <div v-else class="p-4 bg-[#121214] border border-[#27272a] rounded-xl text-center space-y-2">
                <p class="text-xs text-gray-400">Aún no tienes eventos creados.</p>
                <button
                  type="button"
                  @click="targetEventMode = 'new'"
                  class="text-xs font-bold text-indigo-400 hover:underline"
                >
                  Crear uno nuevo ahora
                </button>
              </div>
            </div>

            <!-- New Event Inline Form -->
            <div v-else class="space-y-3 bg-[#121214] border border-[#27272a] p-4 rounded-2xl">
              <div>
                <label class="block text-[11px] font-bold text-gray-400 mb-1">Nombre / Título del Evento *</label>
                <input
                  v-model="newEventForm.title"
                  type="text"
                  placeholder="Ej: Torneo Clausura 2026 - Cuartos"
                  class="w-full bg-[#18181b] border border-[#27272a] rounded-xl py-2 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-bold text-gray-400 mb-1">Fecha</label>
                  <input
                    v-model="newEventForm.date"
                    type="date"
                    class="w-full bg-[#18181b] border border-[#27272a] rounded-xl py-2 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-gray-400 mb-1">Deporte / Categoría</label>
                  <input
                    v-model="newEventForm.sport"
                    type="text"
                    placeholder="Ej: Fútbol"
                    class="w-full bg-[#18181b] border border-[#27272a] rounded-xl py-2 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-400 mb-1">Ubicación / Estadio</label>
                <input
                  v-model="newEventForm.location"
                  type="text"
                  placeholder="Ej: Canchas El Campín"
                  class="w-full bg-[#18181b] border border-[#27272a] rounded-xl py-2 px-3 text-xs font-medium text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <!-- Scope and Price Configuration -->
          <div class="space-y-3 pt-1 border-t border-[#27272a]">
            <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider">2. Opciones de Publicación</label>
            
            <div class="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                type="button"
                @click="publishScope = 'all'"
                :class="[
                  'py-2 px-3 rounded-xl border transition-all text-center',
                  publishScope === 'all'
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm'
                    : 'bg-[#121214] border-[#27272a] text-gray-400 hover:text-white'
                ]"
              >
                Todas las fotos ({{ photos.length }})
              </button>
              <button
                type="button"
                @click="publishScope = 'selected'"
                :disabled="selectedCount === 0"
                :class="[
                  'py-2 px-3 rounded-xl border transition-all text-center disabled:opacity-40',
                  publishScope === 'selected'
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm'
                    : 'bg-[#121214] border-[#27272a] text-gray-400 hover:text-white'
                ]"
              >
                Solo seleccionadas ({{ selectedCount }})
              </button>
            </div>

            <!-- Price & AI Dorsals -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block text-[11px] font-bold text-gray-400 mb-1">Precio por Foto (COP)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                  <input
                    v-model.number="publishPrice"
                    type="number"
                    step="500"
                    min="1000"
                    class="w-full bg-[#121214] border border-[#27272a] rounded-xl py-2 pl-7 pr-3 text-xs font-bold text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#121214] border border-[#27272a]">
                <div>
                  <p class="text-[11px] font-bold text-white">IA de Dorsales</p>
                  <p class="text-[9px] text-gray-400">Indexar números</p>
                </div>
                <input
                  v-model="publishRunAI"
                  type="checkbox"
                  class="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <!-- Remove from studio after successful publish -->
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#121214] border border-[#27272a] sm:col-span-2">
                <div>
                  <p class="text-[11px] font-bold text-white">Quitar del Studio tras publicar</p>
                  <p class="text-[9px] text-gray-400">Remueve las fotos procesadas de la cola de trabajo</p>
                </div>
                <input
                  v-model="removeAfterPublish"
                  type="checkbox"
                  class="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 pt-3 border-t border-[#27272a]">
            <button
              type="button"
              @click="showPublishModal = false"
              class="flex-1 py-3 px-4 text-xs font-bold text-gray-400 hover:text-white rounded-xl bg-[#27272a] hover:bg-[#323238] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="startPublish"
              class="flex-1 py-3 px-4 text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Icon name="lucide:cloud-upload" class="w-4 h-4" />
              <span>Publicar {{ publishScope === 'selected' ? selectedCount : photos.length }} Fotos</span>
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- BATCH EXPORT MODAL (LOCAL DOWNLOAD)         -->
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
              <h3 class="text-sm font-bold text-white">Descargar Lote de Fotos</h3>
              <p class="text-xs text-gray-400">Procesar y guardar archivos JPG en tu PC</p>
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

          <!-- Watermark Option -->
          <div class="p-3 bg-[#121214] rounded-xl border border-[#27272a] space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Icon name="lucide:stamp" class="w-3.5 h-3.5 text-indigo-400" />
                Firma de Agua / Copyright
              </span>
              <input
                type="checkbox"
                v-model="applyExportWatermark"
                class="rounded bg-[#27272a] border-gray-600 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </div>
            <input
              v-if="applyExportWatermark"
              type="text"
              v-model="watermarkCustomText"
              placeholder="Ej: © Tu Nombre / Moments Studio"
              class="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Calidad de Imagen JPEG</label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="70"
                max="100"
                v-model.number="exportQuality"
                class="flex-1 slider-studio-pro"
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
              <span>Descargar Archivos</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- KEYBOARD SHORTCUTS MODAL                    -->
    <!-- ═══════════════════════════════════════════ -->
    <div
      v-if="showShortcutsModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div class="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-[#27272a] pb-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="lucide:keyboard" class="w-4 h-4 text-[#3ef4a1]" />
            Atajos de Teclado Pro
          </h3>
          <button @click="showShortcutsModal = false" class="text-gray-400 hover:text-white">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Auto Revelado AI</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-[#3ef4a1] font-bold">A</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Antes / Después</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-amber-300 font-bold">\</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Ajustar / Zoom</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">Z</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Cuadrícula Tercios</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">G</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Copiar Ajustes</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">Ctrl + C</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Pegar Ajustes</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">Ctrl + V</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Deshacer</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">Ctrl + Z</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Rehacer</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">Ctrl + Y</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Navegar fotos</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-gray-200 font-bold">← / →</kbd>
          </div>
          <div class="p-2.5 bg-[#121214] rounded-xl border border-[#27272a] flex items-center justify-between">
            <span class="text-gray-300">Quitar foto</span>
            <kbd class="px-2 py-0.5 rounded bg-[#27272a] font-mono text-[10px] text-red-400 font-bold">Del / Backspace</kbd>
          </div>
        </div>

        <button
          @click="showShortcutsModal = false"
          class="w-full py-2.5 rounded-xl bg-[#27272a] hover:bg-[#323238] text-white text-xs font-bold transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useEventsStore } from '~/stores/events';
import { usePhotosStore } from '~/stores/photos';
import { useToast } from '~/composables/useToast';
import LightroomSliders from '~/components/studio/LightroomSliders.vue';
import LightroomPresets from '~/components/studio/LightroomPresets.vue';
import LightroomHistogram from '~/components/studio/LightroomHistogram.vue';
import LightroomFilmstrip from '~/components/studio/LightroomFilmstrip.vue';
import {
  useLightroomStudio,
  type StudioPhoto
} from '~/composables/useLightroomStudio';
import {
  applyAdjustmentsToCanvas,
  exportProcessedImageBlob,
  DEFAULT_ADJUSTMENTS,
  type HistogramData,
  type Preset,
  type PhotoAdjustments
} from '~/utils/imageGradingEngine';

definePageMeta({
  layout: false
});

const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();
const eventsStore = useEventsStore();
const photosStore = usePhotosStore();
const config = useRuntimeConfig();

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
  removePhoto,
  removeSelectedPhotos,
  removePhotosByIds,
  clearStudio,
  setActivePhoto,
  toggleSelectPhoto,
  selectAll,
  deselectAll,
  updateAdjustment,
  commitAdjustmentChange,
  applyPreset,
  autoEnhancePhotos,
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
const compareMode = ref<'off' | 'split' | 'original'>('off');
const splitPos = ref(50); // 0 to 100%
const isDraggingSplit = ref(false);
const showGrid = ref(false);
const showShortcutsModal = ref(false);
const applyBatchChanges = ref(true);
const showImportModal = ref(false);

const viewportRef = ref<HTMLElement | null>(null);
const mainCanvasRef = ref<HTMLCanvasElement | null>(null);
const histogramData = ref<HistogramData | null>(null);
const fallbackSettings = ref<PhotoAdjustments>({ ...DEFAULT_ADJUSTMENTS });

// ── Events & Data ──────────────────────────────────────
const myEvents = ref<any[]>([]);

// ── Publish to Event States ────────────────────────────
const showPublishModal = ref(false);
const targetEventMode = ref<'existing' | 'new'>('existing');
const selectedEventId = ref<string | number | null>(null);
const newEventForm = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  sport: 'Fútbol',
  defaultPrice: 5000
});
const publishScope = ref<'all' | 'selected'>('all');
const publishPrice = ref(5000);
const publishRunAI = ref(true);
const removeAfterPublish = ref(true);
const isPublishing = ref(false);
const publishCurrent = ref(0);
const publishTotal = ref(0);
const publishCurrentName = ref('');
const publishSuccess = ref(false);
const publishedCount = ref(0);
const publishedEventId = ref<string | number | null>(null);

// ── Export States ──────────────────────────────────────
const showExportModal = ref(false);
const isExporting = ref(false);
const exportScope = ref<'all' | 'selected'>('all');
const exportQuality = ref(92);
const exportCurrent = ref(0);
const exportTotal = ref(0);
const applyExportWatermark = ref(false);
const watermarkCustomText = ref('');

// Active loaded image element cache
let activeImageElement: HTMLImageElement | null = null;

// ── Split Slider Drag Handlers ─────────────────────────
function startSplitDrag(e: MouseEvent | TouchEvent) {
  isDraggingSplit.value = true;
  window.addEventListener('mousemove', onSplitDrag);
  window.addEventListener('mouseup', stopSplitDrag);
  window.addEventListener('touchmove', onSplitDrag);
  window.addEventListener('touchend', stopSplitDrag);
}

function onSplitDrag(e: MouseEvent | TouchEvent) {
  if (!isDraggingSplit.value || !viewportRef.value) return;
  const rect = viewportRef.value.getBoundingClientRect();
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const offset = clientX - rect.left;
  const pct = Math.max(5, Math.min(95, (offset / rect.width) * 100));
  splitPos.value = Math.round(pct);
}

function stopSplitDrag() {
  isDraggingSplit.value = false;
  window.removeEventListener('mousemove', onSplitDrag);
  window.removeEventListener('mouseup', stopSplitDrag);
  window.removeEventListener('touchmove', onSplitDrag);
  window.removeEventListener('touchend', stopSplitDrag);
}

// ── Zoom Preset Helper ─────────────────────────────────
function setZoomPreset(val: 'fit' | 1 | 2) {
  if (val === 'fit') zoom.value = 1;
  else if (val === 1) zoom.value = 1.5;
  else if (val === 2) zoom.value = 2.2;
}

// ── Auto AI Enhance ────────────────────────────────────
async function handleAutoEnhance() {
  if (photos.value.length === 0) return;
  toast.info('Analizando imagen...', 'Calculando exposición, sombras y contraste óptimos.');
  await autoEnhancePhotos();
  toast.success('✨ Auto Revelado Pro aplicado', 'Balance tonal inteligente completado.');
}

function handleRemovePhoto(id: string) {
  removePhoto(id);
  toast.info('Foto quitada', 'Se removió la foto del espacio de trabajo.');
}

function handleRemoveSelected() {
  const count = selectedCount.value;
  removeSelectedPhotos();
  toast.info('Fotos quitadas', `Se removieron ${count} fotos del estudio.`);
}

function handleClearAll() {
  clearStudio();
  toast.info('Estudio limpio', 'Se vació el espacio de trabajo.');
}

function openPublishModal() {
  publishSuccess.value = false;
  publishCurrent.value = 0;
  publishTotal.value = 0;
  if (route.query.eventId) {
    selectedEventId.value = String(route.query.eventId);
  } else if (!selectedEventId.value && myEvents.value.length > 0) {
    selectedEventId.value = myEvents.value[0].id || myEvents.value[0].uuid;
  }
  showPublishModal.value = true;
}

function goToPublishedEvent() {
  if (publishedEventId.value) {
    router.push(`/dashboard/photographer/events/${publishedEventId.value}`);
  }
}

async function startPublish() {
  let targetEventId = selectedEventId.value;

  if (targetEventMode.value === 'new') {
    if (!newEventForm.value.title.trim()) {
      toast.warning('Título requerido', 'Por favor ingresa un título para el evento.');
      return;
    }
    try {
      const created = await eventsStore.createEvent({
        title: newEventForm.value.title,
        date: newEventForm.value.date,
        location: newEventForm.value.location,
        sport: newEventForm.value.sport,
        defaultPrice: publishPrice.value || newEventForm.value.defaultPrice || 5000
      });
      if (!created) {
        toast.error('Error', 'No se pudo crear el nuevo evento.');
        return;
      }
      targetEventId = created.id || created.uuid;
      await fetchMyEvents();
    } catch (e) {
      console.error('Error creating event for studio publish:', e);
      toast.error('Error', 'No se pudo crear el evento.');
      return;
    }
  }

  if (!targetEventId) {
    toast.warning('Selecciona un evento', 'Elige a qué evento deseas subir las fotos.');
    return;
  }

  const targetPhotos =
    publishScope.value === 'selected'
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : photos.value;

  if (targetPhotos.length === 0) {
    toast.warning('Sin fotos', 'No hay fotos seleccionadas para publicar.');
    return;
  }

  isPublishing.value = true;
  publishTotal.value = targetPhotos.length;
  publishCurrent.value = 0;
  publishSuccess.value = false;
  publishedEventId.value = targetEventId;

  let successCount = 0;
  const successfullyUploadedIds: string[] = [];

  try {
    for (let i = 0; i < targetPhotos.length; i++) {
      const p = targetPhotos[i];
      publishCurrent.value = i + 1;
      publishCurrentName.value = p.name;

      // Render high-res processed image with preset and color grading
      const blob = await exportProcessedImageBlob(
        p.originalSrc,
        p.settings,
        0.95
      );

      // Clean filename and ensure .jpg
      const baseName = p.name.replace(/\.[^/.]+$/, '');
      const cleanFileName = `${baseName}_graded.jpg`;
      const file = new File([blob], cleanFileName, { type: 'image/jpeg' });

      // Upload directly into event via photo store
      const uploadRes = await photosStore.uploadPhoto(
        targetEventId,
        file,
        publishPrice.value,
        '',
        publishRunAI.value
      );

      if (uploadRes) {
        successCount++;
        successfullyUploadedIds.push(p.id);
      }
    }

    publishedCount.value = successCount;
    publishSuccess.value = true;

    // Remove published photos if requested
    if (removeAfterPublish.value && successfullyUploadedIds.length > 0) {
      removePhotosByIds(successfullyUploadedIds);
    }

    toast.success(
      '¡Fotos publicadas!',
      `Se subieron ${successCount} fotos con su revelado aplicado al evento.`
    );
  } catch (e) {
    console.error('Error publishing photos from studio:', e);
    toast.error('Error', 'Hubo un inconveniente subiendo algunas fotos.');
  } finally {
    isPublishing.value = false;
  }
}

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
  if (activePhoto.value) {
    updateAdjustment(key, value, applyBatchChanges.value);
  } else {
    fallbackSettings.value[key] = value;
  }
}

function handleSliderCommit() {
  if (activePhoto.value) {
    commitAdjustmentChange();
  }
}

function handleApplyPreset(preset: Preset) {
  if (activePhoto.value) {
    applyPreset(preset);
  } else {
    fallbackSettings.value = { ...DEFAULT_ADJUSTMENTS, ...preset.settings };
  }
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
  compareMode.value = compareMode.value === 'original' ? 'off' : 'original';
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
    showImportModal.value = false;
    target.value = '';
    toast.success('Fotos importadas', 'Listas para revelar y aplicar filtros.');
  }
}

async function fetchMyEvents() {
  try {
    const data: any = await $fetch(`${config.public.apiBase}/events/my-events`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    });
    myEvents.value = Array.isArray(data) ? data : (data.content ?? []);
  } catch (e) {
    console.error('Error fetching events in studio:', e);
  }
}

async function loadPhotosFromEvent(ev: any) {
  try {
    const identifier = ev.uuid || ev.id;
    const eventData: any = await $fetch(`${config.public.apiBase}/events/${identifier}`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    });

    const eventPhotos = eventData.photos || [];
    if (eventPhotos.length === 0) {
      toast.warning('Sin fotos', 'Este evento aún no tiene fotos cargadas.');
      return;
    }

    const items = eventPhotos.map((p: any, idx: number) => ({
      id: p.id ? String(p.id) : `ev_p_${idx}`,
      name: p.filename || `${ev.title || 'Foto'} #${idx + 1}`,
      url: p.watermarkedUrl || p.hdUrl || p.thumbnailUrl,
      thumbnail: p.thumbnailUrl || p.watermarkedUrl || p.hdUrl
    }));

    loadPhotosFromUrls(items);
    showImportModal.value = false;
    toast.success('Evento importado', `Se cargaron ${items.length} fotos de ${ev.title}.`);
  } catch (e) {
    console.error('Error loading event photos:', e);
    toast.error('Error', 'No se pudieron cargar las fotos del evento.');
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

  const watermarkText = applyExportWatermark.value ? (watermarkCustomText.value || '© Moments Studio Pro') : '';

  try {
    for (let i = 0; i < targetPhotos.length; i++) {
      const p = targetPhotos[i];
      exportCurrent.value = i + 1;

      const blob = await exportProcessedImageBlob(
        p.originalSrc,
        p.settings,
        exportQuality.value / 100,
        watermarkText
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
  } else if (e.key === 'a' || e.key === 'A') {
    handleAutoEnhance();
  } else if (e.key === 'g' || e.key === 'G') {
    showGrid.value = !showGrid.value;
  } else if (e.key === '?' || e.key === 'F1') {
    showShortcutsModal.value = !showShortcutsModal.value;
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (activePhoto.value) {
      handleRemovePhoto(activePhoto.value.id);
    }
  }
}

function goBack() {
  router.push('/dashboard/photographer');
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown);
  await fetchMyEvents();
  if (route.query.eventId) {
    const foundEvent = myEvents.value.find(
      (ev) => String(ev.id || ev.uuid) === String(route.query.eventId)
    );
    if (foundEvent) {
      await loadPhotosFromEvent(foundEvent);
    }
  } else if (photos.value.length > 0) {
    renderCanvas();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.slider-studio-pro {
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
