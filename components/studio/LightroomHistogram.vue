<template>
  <div class="bg-[#18181b] border border-[#27272a] rounded-xl p-3 shadow-inner">
    <div class="flex items-center justify-between mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
      <span class="flex items-center gap-1.5 text-indigo-400">
        <Icon name="lucide:activity" class="w-3.5 h-3.5" />
        Histograma RGB
      </span>
      <div class="flex items-center gap-2 text-[10px]">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span>R</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span>G</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span>B</span>
        <span class="flex items-center gap-1 text-gray-300"><span class="w-2 h-2 rounded-full bg-gray-200"></span>L</span>
      </div>
    </div>

    <!-- Histogram Canvas -->
    <div class="relative w-full h-24 bg-[#09090b] rounded-lg overflow-hidden border border-[#27272a]">
      <canvas ref="canvasRef" class="w-full h-full block" width="256" height="96"></canvas>

      <!-- Zone Overlays on Hover -->
      <div class="absolute inset-0 grid grid-cols-5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none text-[8px] font-mono font-bold text-gray-500">
        <div class="border-r border-white/5 flex items-end p-1">Negros</div>
        <div class="border-r border-white/5 flex items-end p-1">Sombras</div>
        <div class="border-r border-white/5 flex items-end p-1">Expos.</div>
        <div class="border-r border-white/5 flex items-end p-1">Ilumin.</div>
        <div class="flex items-end p-1">Blancos</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { HistogramData } from '~/utils/imageGradingEngine';

const props = defineProps<{
  histogram: HistogramData | null;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

function drawHistogram() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background subtle grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += w / 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  if (!props.histogram) {
    // Placeholder curve if no active photo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Sin datos de imagen', w / 2, h / 2 + 3);
    return;
  }

  const { r, g, b, luma, maxVal } = props.histogram;
  const scaleY = (val: number) => h - (val / maxVal) * (h * 0.9);

  // Draw Luma fill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let i = 0; i < 256; i++) {
    const x = (i / 255) * w;
    const y = scaleY(luma[i] || 0);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Helper for channel stroke
  const drawChannel = (arr: number[], color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * w;
      const y = scaleY(arr[i] || 0);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  drawChannel(r, 'rgba(239, 68, 68, 0.7)');
  drawChannel(g, 'rgba(34, 197, 94, 0.7)');
  drawChannel(b, 'rgba(59, 130, 246, 0.7)');
}

watch(() => props.histogram, drawHistogram, { deep: true });
onMounted(drawHistogram);
</script>
