<template>
  <div class="space-y-4">
    <!-- Header & Action to save custom preset -->
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
        <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#3ef4a1]" />
        Presets & Estilos
      </h3>
      <div class="flex items-center gap-1.5">
        <!-- Import / Export Actions -->
        <label
          class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#27272a] cursor-pointer transition-colors"
          title="Importar Presets (.json)"
        >
          <Icon name="lucide:upload" class="w-3.5 h-3.5" />
          <input type="file" accept=".json" class="hidden" @change="handleImportPresets" />
        </label>
        <button
          @click="handleExportPresets"
          class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#27272a] transition-colors"
          title="Exportar mis Presets (.json)"
        >
          <Icon name="lucide:download" class="w-3.5 h-3.5" />
        </button>
        <button
          @click="showSaveModal = true"
          class="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded-lg transition-colors border border-indigo-500/20"
        >
          <Icon name="lucide:plus" class="w-3 h-3" />
          <span>Guardar</span>
        </button>
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        :class="[
          'px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap',
          selectedCategory === cat
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-[#27272a] text-gray-400 hover:text-gray-200 hover:bg-[#323238]'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Preset Grid -->
    <div class="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
      <div
        v-for="preset in filteredPresets"
        :key="preset.id"
        @click="handleApply(preset)"
        :class="[
          'group relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left',
          activePresetName === preset.name
            ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-500/10'
            : 'bg-[#18181b] border-[#27272a] hover:border-gray-600 hover:bg-[#202024]'
        ]"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm',
              activePresetName === preset.name
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-[#27272a] text-gray-300 group-hover:bg-[#323238]'
            ]"
          >
            <Icon :name="preset.icon || 'lucide:sparkles'" class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-gray-100 truncate group-hover:text-white">
              {{ preset.name }}
            </h4>
            <p class="text-[10px] text-gray-400 truncate leading-tight mt-0.5">
              {{ preset.description }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <!-- Delete button for custom presets -->
          <button
            v-if="preset.category === 'Mis Presets'"
            @click.stop="deleteCustomPreset(preset.id)"
            class="p-1 text-gray-500 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Eliminar preset"
          >
            <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
          </button>

          <span
            v-if="activePresetName === preset.name"
            class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"
          ></span>
        </div>
      </div>
    </div>

    <!-- Save Custom Preset Modal -->
    <div
      v-if="showSaveModal"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="lucide:bookmark-plus" class="w-4 h-4 text-[#3ef4a1]" />
            Guardar Preset Personalizado
          </h3>
          <button @click="showSaveModal = false" class="text-gray-400 hover:text-white">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Nombre del Preset</label>
          <input
            v-model="customPresetName"
            type="text"
            placeholder="Ej: Estadio Nocturno Pro"
            class="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Descripción (opcional)</label>
          <input
            v-model="customPresetDesc"
            type="text"
            placeholder="Para partidos con poca luz"
            class="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="showSaveModal = false"
            class="flex-1 py-2 px-3 text-xs font-bold text-gray-400 hover:text-white rounded-xl bg-[#27272a] hover:bg-[#323238] transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleSavePreset"
            :disabled="!customPresetName.trim()"
            class="flex-1 py-2 px-3 text-xs font-bold text-black bg-[#3ef4a1] hover:bg-[#34d38c] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Preset } from '~/utils/imageGradingEngine';

const props = defineProps<{
  activePresetName?: string;
}>();

const emit = defineEmits<{
  (e: 'apply', preset: Preset): void;
}>();

const { allPresets, userPresets, saveCustomPreset, deleteCustomPreset, importCustomPresets } = useLightroomStudio();

const selectedCategory = ref('Todos');
const showSaveModal = ref(false);
const customPresetName = ref('');
const customPresetDesc = ref('');

const categories = computed(() => {
  const cats = new Set<string>(['Todos']);
  allPresets.value.forEach((p) => cats.add(p.category));
  return Array.from(cats);
});

const filteredPresets = computed(() => {
  if (selectedCategory.value === 'Todos') return allPresets.value;
  return allPresets.value.filter((p) => p.category === selectedCategory.value);
});

function handleApply(preset: Preset) {
  emit('apply', preset);
}

function handleSavePreset() {
  if (!customPresetName.value.trim()) return;
  saveCustomPreset(customPresetName.value.trim(), customPresetDesc.value.trim());
  customPresetName.value = '';
  customPresetDesc.value = '';
  showSaveModal.value = false;
}

function handleExportPresets() {
  if (userPresets.value.length === 0) {
    alert('No tienes presets personalizados para exportar. Guarda primero uno con el botón "+"');
    return;
  }
  const jsonStr = JSON.stringify(userPresets.value, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `moments_studio_presets_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportPresets(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target?.result as string);
      if (Array.isArray(parsed)) {
        importCustomPresets(parsed);
      }
    } catch (err) {
      console.error('Failed to parse presets file', err);
    }
  };
  reader.readAsText(file);
  input.value = '';
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #18181b;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
</style>
