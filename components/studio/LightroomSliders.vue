<template>
  <div class="space-y-5 text-gray-300">
    <!-- ═══════════════════════════════════════════ -->
    <!-- 1. SECCIÓN: LUZ / TONO                      -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
        <h3 class="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="lucide:sun" class="w-3.5 h-3.5 text-amber-400" />
          Tono & Luz
        </h3>
        <button
          @click="resetGroup(['exposure', 'contrast', 'highlights', 'shadows', 'whites', 'blacks'])"
          class="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          title="Resetear grupo de tono"
        >
          Reset
        </button>
      </div>

      <div class="space-y-3.5">
        <!-- Exposición -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('exposure')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Exposición (EV)
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.exposure) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.exposure"
            @input="onInput('exposure', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Contraste -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('contrast')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Contraste
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.contrast) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.contrast"
            @input="onInput('contrast', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Iluminaciones / Highlights -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('highlights')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Iluminaciones
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.highlights) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.highlights"
            @input="onInput('highlights', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Sombras / Shadows -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('shadows')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Sombras
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.shadows) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.shadows"
            @input="onInput('shadows', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Blancos -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('whites')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Blancos
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.whites) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.whites"
            @input="onInput('whites', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Negros -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('blacks')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Negros
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.blacks) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.blacks"
            @input="onInput('blacks', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 2. SECCIÓN: COLOR & BALANCE DE BLANCOS      -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
        <h3 class="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="lucide:palette" class="w-3.5 h-3.5 text-indigo-400" />
          Color & Temp
        </h3>
        <button
          @click="resetGroup(['temperature', 'tint', 'vibrance', 'saturation'])"
          class="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          title="Resetear grupo de color"
        >
          Reset
        </button>
      </div>

      <div class="space-y-3.5">
        <!-- Temperatura (Azul a Amarillo) -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('temperature')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Temperatura (K)
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.temperature) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.temperature"
            @input="onInput('temperature', $event)"
            @change="onChange"
            class="slider-studio-pro slider-temp"
          />
        </div>

        <!-- Tinte (Verde a Magenta) -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('tint')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Matiz / Tinte
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.tint) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.tint"
            @input="onInput('tint', $event)"
            @change="onChange"
            class="slider-studio-pro slider-tint"
          />
        </div>

        <!-- Intensidad / Vibrance -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('vibrance')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Intensidad (Vibrance)
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.vibrance) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.vibrance"
            @input="onInput('vibrance', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Saturación -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('saturation')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Saturación
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.saturation) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.saturation"
            @input="onInput('saturation', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 3. SECCIÓN: COLOR GRADING & TONO DIVIDIDO   -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
        <h3 class="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="lucide:palette" class="w-3.5 h-3.5 text-purple-400" />
          Color Grading (Tono Dividido)
        </h3>
        <button
          @click="resetGroup(['shadowsTint', 'highlightsTint'])"
          class="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          title="Resetear gradación de color"
        >
          Reset
        </button>
      </div>

      <div class="space-y-3.5">
        <!-- Tinte de Sombras (Teal vs Amber) -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('shadowsTint')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Tinte Sombras (Teal / Cálido)
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.shadowsTint) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.shadowsTint"
            @input="onInput('shadowsTint', $event)"
            @change="onChange"
            class="slider-studio-pro slider-shadows-tint"
          />
        </div>

        <!-- Tinte de Altas Luces (Cyan vs Gold) -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('highlightsTint')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Tinte Luces (Cyan / Dorado)
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.highlightsTint) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.highlightsTint"
            @input="onInput('highlightsTint', $event)"
            @change="onChange"
            class="slider-studio-pro slider-highlights-tint"
          />
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 4. SECCIÓN: DETALLE & EFECTOS               -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
        <h3 class="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="lucide:wand-2" class="w-3.5 h-3.5 text-[#3ef4a1]" />
          Detalle & Efectos
        </h3>
        <button
          @click="resetGroup(['clarity', 'dehaze', 'sharpness', 'vignette', 'grain', 'sepia'])"
          class="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          title="Resetear grupo de efectos"
        >
          Reset
        </button>
      </div>

      <div class="space-y-3.5">
        <!-- Claridad -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('clarity')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Claridad & Textura
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.clarity) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.clarity"
            @input="onInput('clarity', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Desempañar / Dehaze -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('dehaze')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Desempañar (Dehaze)
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.dehaze) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.dehaze"
            @input="onInput('dehaze', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Enfoque / Sharpness -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('sharpness')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Enfoque (Nitidez)
            </span>
            <span class="font-mono text-gray-400">{{ settings.sharpness }}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="settings.sharpness"
            @input="onInput('sharpness', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Viñeteado -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('vignette')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Viñeta
            </span>
            <span class="font-mono text-gray-400">{{ formatVal(settings.vignette) }}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            :value="settings.vignette"
            @input="onInput('vignette', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Grano de película -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('grain')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Grano Analógico
            </span>
            <span class="font-mono text-gray-400">{{ settings.grain }}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="settings.grain"
            @input="onInput('grain', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>

        <!-- Tonalidad Sepia -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span
              @dblclick="resetSlider('sepia')"
              class="font-medium text-gray-300 cursor-pointer hover:text-white select-none"
              title="Doble clic para resetear"
            >
              Tono Cálido / Sepia
            </span>
            <span class="font-mono text-gray-400">{{ settings.sepia }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="settings.sepia"
            @input="onInput('sepia', $event)"
            @change="onChange"
            class="slider-studio-pro"
          />
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 5. SECCIÓN: GEOMETRÍA & ROTACIÓN            -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-[#27272a] pb-1.5">
        <h3 class="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="lucide:rotate-cw" class="w-3.5 h-3.5 text-blue-400" />
          Geometría & Orientación
        </h3>
      </div>

      <div class="grid grid-cols-4 gap-2">
        <button
          @click="rotateCW"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-gray-600 transition-colors text-[10px] font-bold"
          title="Rotar 90° hacia la derecha"
        >
          <Icon name="lucide:rotate-cw" class="w-4 h-4 text-indigo-400" />
          <span>+90°</span>
        </button>

        <button
          @click="rotateCCW"
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-gray-600 transition-colors text-[10px] font-bold"
          title="Rotar 90° hacia la izquierda"
        >
          <Icon name="lucide:rotate-ccw" class="w-4 h-4 text-indigo-400" />
          <span>-90°</span>
        </button>

        <button
          @click="toggleFlipH"
          :class="[
            'flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-colors text-[10px] font-bold',
            settings.flipH
              ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300'
              : 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] hover:border-gray-600 text-gray-300'
          ]"
          title="Voltear horizontalmente"
        >
          <Icon name="lucide:flip-horizontal" class="w-4 h-4" />
          <span>Espejo H</span>
        </button>

        <button
          @click="toggleFlipV"
          :class="[
            'flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-colors text-[10px] font-bold',
            settings.flipV
              ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300'
              : 'bg-[#18181b] hover:bg-[#27272a] border-[#27272a] hover:border-gray-600 text-gray-300'
          ]"
          title="Voltear verticalmente"
        >
          <Icon name="lucide:flip-vertical" class="w-4 h-4" />
          <span>Espejo V</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PhotoAdjustments } from '~/utils/imageGradingEngine';
import { DEFAULT_ADJUSTMENTS } from '~/utils/imageGradingEngine';

const props = defineProps<{
  settings: PhotoAdjustments;
  applyToBatch?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update', key: keyof PhotoAdjustments, value: any): void;
  (e: 'commit'): void;
}>();

function formatVal(val: number): string {
  if (val > 0) return `+${val}`;
  return `${val}`;
}

function onInput(key: keyof PhotoAdjustments, event: Event) {
  const target = event.target as HTMLInputElement;
  const num = parseInt(target.value, 10) || 0;
  emit('update', key, num);
}

function onChange() {
  emit('commit');
}

function resetSlider(key: keyof PhotoAdjustments) {
  emit('update', key, DEFAULT_ADJUSTMENTS[key]);
  emit('commit');
}

function resetGroup(keys: Array<keyof PhotoAdjustments>) {
  keys.forEach((k) => {
    emit('update', k, DEFAULT_ADJUSTMENTS[k]);
  });
  emit('commit');
}

function rotateCW() {
  const next = (props.settings.rotation + 90) % 360;
  emit('update', 'rotation', next);
  emit('commit');
}

function rotateCCW() {
  const next = (props.settings.rotation - 90 + 360) % 360;
  emit('update', 'rotation', next);
  emit('commit');
}

function toggleFlipH() {
  emit('update', 'flipH', !props.settings.flipH);
  emit('commit');
}

function toggleFlipV() {
  emit('update', 'flipV', !props.settings.flipV);
  emit('commit');
}
</script>

<style scoped>
.slider-studio-pro {
  @apply w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400;
}

.slider-temp {
  background: linear-gradient(90deg, #38bdf8 0%, #27272a 50%, #f59e0b 100%);
}

.slider-tint {
  background: linear-gradient(90deg, #22c55e 0%, #27272a 50%, #ec4899 100%);
}

.slider-shadows-tint {
  background: linear-gradient(90deg, #06b6d4 0%, #27272a 50%, #f97316 100%);
}

.slider-highlights-tint {
  background: linear-gradient(90deg, #38bdf8 0%, #27272a 50%, #eab308 100%);
}

input[type='range']::-webkit-slider-thumb {
  @apply w-3.5 h-3.5 bg-white rounded-full shadow-md border border-gray-400 appearance-none transition-transform hover:scale-125;
}
</style>
