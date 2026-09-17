<template>
  <div class="bg-[#121214] border-t border-[#27272a] p-3 select-none">
    <!-- Batch Action Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-2.5 px-1">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-gray-300 flex items-center gap-1.5">
          <Icon name="lucide:film" class="w-4 h-4 text-indigo-400" />
          Tira de Fotos ({{ photos.length }})
        </span>

        <!-- Selection count pill -->
        <span
          v-if="selectedCount > 0"
          class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
        >
          {{ selectedCount }} seleccionada{{ selectedCount > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Quick batch action buttons -->
      <div class="flex items-center gap-2 text-xs">
        <button
          @click="handleSelectAll"
          class="px-2.5 py-1 rounded-lg bg-[#27272a] hover:bg-[#323238] text-gray-300 hover:text-white transition-colors font-medium text-[11px]"
        >
          {{ selectedCount === photos.length ? 'Deseleccionar' : 'Seleccionar Todo' }}
        </button>

        <!-- Sync Button -->
        <button
          v-if="selectedCount > 1"
          @click="$emit('sync-batch')"
          class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm flex items-center gap-1 text-[11px]"
          title="Sincronizar los ajustes de la foto activa con todas las fotos seleccionadas"
        >
          <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5" />
          Sincronizar Lote ({{ selectedCount }})
        </button>

        <!-- Paste Settings Button -->
        <button
          v-if="hasCopiedSettings && selectedCount > 0"
          @click="$emit('paste-batch')"
          class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm flex items-center gap-1 text-[11px]"
          title="Pegar ajustes copiados en las fotos seleccionadas"
        >
          <Icon name="lucide:clipboard-check" class="w-3.5 h-3.5" />
          Pegar Ajustes ({{ selectedCount }})
        </button>

        <!-- Reset batch -->
        <button
          v-if="selectedCount > 0"
          @click="$emit('reset-batch')"
          class="px-2.5 py-1 rounded-lg bg-[#27272a] hover:bg-amber-500/20 text-gray-400 hover:text-amber-300 transition-colors font-medium text-[11px]"
          title="Restablecer ajustes de las fotos seleccionadas"
        >
          Reset
        </button>

        <!-- Remove selected photos button -->
        <button
          v-if="selectedCount > 0"
          @click="$emit('remove-selected')"
          class="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 transition-all font-bold text-[11px] flex items-center gap-1"
          title="Quitar las fotos seleccionadas del estudio"
        >
          <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
          <span>Quitar ({{ selectedCount }})</span>
        </button>

        <!-- Clear all studio workspace button -->
        <button
          v-if="photos.length > 0"
          @click="$emit('clear-all')"
          class="px-2 py-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-[#27272a] transition-colors text-[11px]"
          title="Limpiar todas las fotos del estudio"
        >
          Limpiar Todo
        </button>
      </div>
    </div>

    <!-- Horizontal Filmstrip -->
    <div
      ref="stripRef"
      class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-lightroom"
    >
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        @click="handleClickPhoto(photo, $event)"
        :class="[
          'relative flex-shrink-0 w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden cursor-pointer transition-all border-2 group',
          activePhotoId === photo.id
            ? 'border-[#3ef4a1] ring-2 ring-[#3ef4a1]/30 shadow-lg scale-[1.02]'
            : isSelected(photo.id)
            ? 'border-indigo-500 ring-1 ring-indigo-500/50'
            : 'border-[#27272a] hover:border-gray-500 opacity-75 hover:opacity-100'
        ]"
      >
        <!-- Thumbnail Image -->
        <img
          :src="photo.previewSrc || photo.originalSrc"
          :alt="photo.name"
          class="w-full h-full object-cover"
        />

        <!-- Multi-select Checkbox overlay -->
        <div
          @click.stop="toggleCheckbox(photo.id)"
          class="absolute top-1.5 left-1.5 z-10 w-4 h-4 rounded-md flex items-center justify-center transition-all cursor-pointer shadow-sm"
          :class="[
            isSelected(photo.id)
              ? 'bg-indigo-600 text-white border border-indigo-400'
              : 'bg-black/60 text-transparent border border-white/40 hover:border-white opacity-0 group-hover:opacity-100'
          ]"
          title="Seleccionar foto para edición por lote"
        >
          <Icon name="lucide:check" class="w-3 h-3 stroke-[3]" />
        </div>

        <!-- Quick Remove Button (hover overlay) -->
        <button
          @click.stop="$emit('remove-photo', photo.id)"
          class="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-md bg-black/80 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md"
          title="Quitar esta foto del estudio"
        >
          <Icon name="lucide:x" class="w-3 h-3" />
        </button>

        <!-- Index badge (hidden on hover when remove button shows) -->
        <div
          class="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-md bg-black/70 text-[9px] font-mono font-bold text-gray-300 backdrop-blur-xs group-hover:hidden"
        >
          #{{ index + 1 }}
        </div>

        <!-- Modified badge / Preset indicator -->
        <div
          v-if="photo.isModified || photo.appliedPresetName"
          class="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-xs flex items-center justify-between text-[9px] text-white"
        >
          <span class="truncate font-medium text-[8px] text-gray-300">
            {{ photo.appliedPresetName || 'Editada' }}
          </span>
          <span class="w-1.5 h-1.5 rounded-full bg-[#3ef4a1] flex-shrink-0"></span>
        </div>
      </div>

      <!-- Add more photos button -->
      <label
        class="flex-shrink-0 w-24 h-20 sm:w-28 sm:h-22 rounded-xl border-2 border-dashed border-[#27272a] hover:border-indigo-500/50 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-indigo-400 cursor-pointer transition-all"
      >
        <Icon name="lucide:plus" class="w-5 h-5" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Añadir</span>
        <input
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="handleFileAdd"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { StudioPhoto } from '~/composables/useLightroomStudio';

const props = defineProps<{
  photos: StudioPhoto[];
  activePhotoId: string;
  selectedPhotoIds: string[];
  hasCopiedSettings: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-photo', id: string, isShift: boolean): void;
  (e: 'toggle-select', id: string): void;
  (e: 'select-all'): void;
  (e: 'deselect-all'): void;
  (e: 'sync-batch'): void;
  (e: 'paste-batch'): void;
  (e: 'reset-batch'): void;
  (e: 'remove-photo', id: string): void;
  (e: 'remove-selected'): void;
  (e: 'clear-all'): void;
  (e: 'add-files', files: File[]): void;
}>();

const stripRef = ref<HTMLElement | null>(null);

const selectedCount = computed(() => props.selectedPhotoIds.length);

function isSelected(id: string): boolean {
  return props.selectedPhotoIds.includes(id);
}

function handleClickPhoto(photo: StudioPhoto, event: MouseEvent) {
  if (event.ctrlKey || event.metaKey) {
    emit('toggle-select', photo.id);
  } else if (event.shiftKey) {
    emit('select-photo', photo.id, true);
  } else {
    emit('select-photo', photo.id, false);
  }
}

function toggleCheckbox(id: string) {
  emit('toggle-select', id);
}

function handleSelectAll() {
  if (props.selectedPhotoIds.length === props.photos.length) {
    emit('deselect-all');
  } else {
    emit('select-all');
  }
}

function handleFileAdd(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('add-files', Array.from(target.files));
    target.value = '';
  }
}
</script>

<style scoped>
.scrollbar-lightroom::-webkit-scrollbar {
  height: 6px;
}
.scrollbar-lightroom::-webkit-scrollbar-track {
  background: #121214;
}
.scrollbar-lightroom::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 6px;
}
.scrollbar-lightroom::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
</style>
