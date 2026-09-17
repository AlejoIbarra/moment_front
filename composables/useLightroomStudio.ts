import { ref, computed, watch } from 'vue';
import {
  type PhotoAdjustments,
  type Preset,
  DEFAULT_ADJUSTMENTS,
  PRO_PRESETS
} from '~/utils/imageGradingEngine';

export interface StudioPhoto {
  id: string;
  name: string;
  originalSrc: string;
  previewSrc: string;
  file?: File;
  settings: PhotoAdjustments;
  isModified: boolean;
  appliedPresetName?: string;
  history: PhotoAdjustments[];
  historyIndex: number;
}

const photos = ref<StudioPhoto[]>([]);
const activePhotoId = ref<string>('');
const selectedPhotoIds = ref<string[]>([]);
const copiedSettings = ref<PhotoAdjustments | null>(null);
const userPresets = ref<Preset[]>([]);

// Initialize stored custom presets if available in browser
if (process.client) {
  try {
    const saved = localStorage.getItem('moments_lightroom_custom_presets');
    if (saved) {
      userPresets.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load custom presets from localStorage', e);
  }
}

export function useLightroomStudio() {
  // ── Computed Properties ─────────────────────────────────
  const activePhoto = computed(() => {
    return photos.value.find((p) => p.id === activePhotoId.value) || null;
  });

  const activePhotoIndex = computed(() => {
    return photos.value.findIndex((p) => p.id === activePhotoId.value);
  });

  const isBatchMode = computed(() => selectedPhotoIds.value.length > 1);

  const selectedCount = computed(() => selectedPhotoIds.value.length);

  const allPresets = computed(() => [...PRO_PRESETS, ...userPresets.value]);

  const canUndo = computed(() => {
    if (!activePhoto.value) return false;
    return activePhoto.value.historyIndex > 0;
  });

  const canRedo = computed(() => {
    if (!activePhoto.value) return false;
    return activePhoto.value.historyIndex < activePhoto.value.history.length - 1;
  });

  // ── History Management ──────────────────────────────────
  function pushHistory(photo: StudioPhoto) {
    // Truncate future history if we made a change after undoing
    photo.history = photo.history.slice(0, photo.historyIndex + 1);
    photo.history.push(JSON.parse(JSON.stringify(photo.settings)));
    if (photo.history.length > 30) photo.history.shift();
    photo.historyIndex = photo.history.length - 1;
    photo.isModified = checkIfModified(photo.settings);
  }

  function checkIfModified(settings: PhotoAdjustments): boolean {
    return Object.keys(DEFAULT_ADJUSTMENTS).some((k) => {
      const key = k as keyof PhotoAdjustments;
      return settings[key] !== DEFAULT_ADJUSTMENTS[key];
    });
  }

  // ── Loading Photos ──────────────────────────────────────
  async function loadPhotosFromFiles(files: File[]) {
    const newPhotos: StudioPhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const id = `photo_local_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`;
      newPhotos.push({
        id,
        name: file.name,
        originalSrc: url,
        previewSrc: url,
        file,
        settings: { ...DEFAULT_ADJUSTMENTS },
        isModified: false,
        history: [{ ...DEFAULT_ADJUSTMENTS }],
        historyIndex: 0
      });
    }

    photos.value = [...photos.value, ...newPhotos];
    if (!activePhotoId.value && photos.value.length > 0) {
      setActivePhoto(photos.value[0].id);
    }
  }

  function loadPhotosFromUrls(
    items: Array<{ id: string; url: string; name?: string; thumbnail?: string; initialSettings?: Partial<PhotoAdjustments> }>
  ) {
    const loaded: StudioPhoto[] = items.map((item, idx) => {
      const settings: PhotoAdjustments = {
        ...DEFAULT_ADJUSTMENTS,
        ...(item.initialSettings || {})
      };
      return {
        id: item.id || `photo_url_${idx}`,
        name: item.name || `Foto ${idx + 1}`,
        originalSrc: item.url,
        previewSrc: item.thumbnail || item.url,
        settings,
        isModified: checkIfModified(settings),
        history: [{ ...settings }],
        historyIndex: 0
      };
    });

    photos.value = loaded;
    if (photos.value.length > 0) {
      setActivePhoto(photos.value[0].id);
    }
  }

  function clearStudio() {
    photos.value.forEach((p) => {
      if (p.originalSrc.startsWith('blob:')) {
        URL.revokeObjectURL(p.originalSrc);
      }
    });
    photos.value = [];
    activePhotoId.value = '';
    selectedPhotoIds.value = [];
  }

  // ── Selection Methods ───────────────────────────────────
  function setActivePhoto(id: string) {
    activePhotoId.value = id;
    if (!selectedPhotoIds.value.includes(id)) {
      selectedPhotoIds.value = [id];
    }
  }

  function toggleSelectPhoto(id: string, isShift = false) {
    if (isShift && activePhotoId.value) {
      const startIdx = photos.value.findIndex((p) => p.id === activePhotoId.value);
      const endIdx = photos.value.findIndex((p) => p.id === id);
      if (startIdx !== -1 && endIdx !== -1) {
        const min = Math.min(startIdx, endIdx);
        const max = Math.max(startIdx, endIdx);
        const rangeIds = photos.value.slice(min, max + 1).map((p) => p.id);
        selectedPhotoIds.value = Array.from(new Set([...selectedPhotoIds.value, ...rangeIds]));
        activePhotoId.value = id;
        return;
      }
    }

    if (selectedPhotoIds.value.includes(id)) {
      selectedPhotoIds.value = selectedPhotoIds.value.filter((i) => i !== id);
      if (activePhotoId.value === id) {
        activePhotoId.value = selectedPhotoIds.value[0] || (photos.value[0]?.id ?? '');
      }
    } else {
      selectedPhotoIds.value.push(id);
      activePhotoId.value = id;
    }
  }

  function selectAll() {
    selectedPhotoIds.value = photos.value.map((p) => p.id);
  }

  function deselectAll() {
    if (activePhotoId.value) {
      selectedPhotoIds.value = [activePhotoId.value];
    } else {
      selectedPhotoIds.value = [];
    }
  }

  function selectOnly(ids: string[]) {
    selectedPhotoIds.value = ids;
    if (ids.length > 0 && !ids.includes(activePhotoId.value)) {
      activePhotoId.value = ids[0];
    }
  }

  // ── Adjustments Manipulation ────────────────────────────
  function updateAdjustment<K extends keyof PhotoAdjustments>(key: K, value: PhotoAdjustments[K], applyToBatch = false) {
    if (!activePhoto.value) return;

    const targets = applyToBatch && isBatchMode.value
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : [activePhoto.value];

    targets.forEach((photo) => {
      photo.settings[key] = value;
      photo.isModified = checkIfModified(photo.settings);
      photo.appliedPresetName = undefined;
    });
  }

  function commitAdjustmentChange() {
    if (!activePhoto.value) return;
    const targets = isBatchMode.value
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : [activePhoto.value];

    targets.forEach((photo) => {
      pushHistory(photo);
    });
  }

  // ── Presets ─────────────────────────────────────────────
  function applyPreset(preset: Preset, targetIds?: string[]) {
    const targets = targetIds && targetIds.length > 0
      ? photos.value.filter((p) => targetIds.includes(p.id))
      : selectedPhotoIds.value.length > 0
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : activePhoto.value
      ? [activePhoto.value]
      : [];

    targets.forEach((photo) => {
      photo.settings = {
        ...DEFAULT_ADJUSTMENTS,
        ...preset.settings
      };
      photo.appliedPresetName = preset.name;
      pushHistory(photo);
    });
  }

  function saveCustomPreset(name: string, description = 'Preset personalizado creado por el fotógrafo') {
    if (!activePhoto.value) return;
    const newPreset: Preset = {
      id: `custom_${Date.now()}`,
      name,
      category: 'Mis Presets',
      icon: 'lucide:sparkles',
      description,
      settings: JSON.parse(JSON.stringify(activePhoto.value.settings))
    };

    userPresets.value.push(newPreset);
    if (process.client) {
      try {
        localStorage.setItem('moments_lightroom_custom_presets', JSON.stringify(userPresets.value));
      } catch (e) {
        console.error(e);
      }
    }
  }

  function deleteCustomPreset(id: string) {
    userPresets.value = userPresets.value.filter((p) => p.id !== id);
    if (process.client) {
      try {
        localStorage.setItem('moments_lightroom_custom_presets', JSON.stringify(userPresets.value));
      } catch (e) {
        console.error(e);
      }
    }
  }

  // ── Copy / Paste / Sync Batch ───────────────────────────
  function copySettings() {
    if (!activePhoto.value) return false;
    copiedSettings.value = JSON.parse(JSON.stringify(activePhoto.value.settings));
    return true;
  }

  function pasteSettings(targetIds?: string[], specificKeys?: Array<keyof PhotoAdjustments>) {
    if (!copiedSettings.value) return false;

    const targets = targetIds && targetIds.length > 0
      ? photos.value.filter((p) => targetIds.includes(p.id))
      : selectedPhotoIds.value.length > 0
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : activePhoto.value
      ? [activePhoto.value]
      : [];

    targets.forEach((photo) => {
      if (specificKeys && specificKeys.length > 0) {
        specificKeys.forEach((k) => {
          photo.settings[k] = (copiedSettings.value as any)[k];
        });
      } else {
        photo.settings = JSON.parse(JSON.stringify(copiedSettings.value));
      }
      photo.appliedPresetName = activePhoto.value?.appliedPresetName;
      pushHistory(photo);
    });

    return true;
  }

  function syncActiveToSelected(targetIds?: string[]) {
    if (!activePhoto.value) return;
    const settingsCopy = JSON.parse(JSON.stringify(activePhoto.value.settings));
    const presetName = activePhoto.value.appliedPresetName;

    const targets = targetIds && targetIds.length > 0
      ? photos.value.filter((p) => targetIds.includes(p.id) && p.id !== activePhoto.value?.id)
      : photos.value.filter((p) => selectedPhotoIds.value.includes(p.id) && p.id !== activePhoto.value?.id);

    targets.forEach((photo) => {
      photo.settings = JSON.parse(JSON.stringify(settingsCopy));
      photo.appliedPresetName = presetName;
      pushHistory(photo);
    });
  }

  function resetPhotos(targetIds?: string[]) {
    const targets = targetIds && targetIds.length > 0
      ? photos.value.filter((p) => targetIds.includes(p.id))
      : selectedPhotoIds.value.length > 0
      ? photos.value.filter((p) => selectedPhotoIds.value.includes(p.id))
      : activePhoto.value
      ? [activePhoto.value]
      : [];

    targets.forEach((photo) => {
      photo.settings = { ...DEFAULT_ADJUSTMENTS };
      photo.appliedPresetName = undefined;
      pushHistory(photo);
    });
  }

  // ── Undo / Redo ─────────────────────────────────────────
  function undo() {
    if (!activePhoto.value || activePhoto.value.historyIndex <= 0) return;
    activePhoto.value.historyIndex--;
    activePhoto.value.settings = JSON.parse(
      JSON.stringify(activePhoto.value.history[activePhoto.value.historyIndex])
    );
    activePhoto.value.isModified = checkIfModified(activePhoto.value.settings);
  }

  function redo() {
    if (
      !activePhoto.value ||
      activePhoto.value.historyIndex >= activePhoto.value.history.length - 1
    )
      return;
    activePhoto.value.historyIndex++;
    activePhoto.value.settings = JSON.parse(
      JSON.stringify(activePhoto.value.history[activePhoto.value.historyIndex])
    );
    activePhoto.value.isModified = checkIfModified(activePhoto.value.settings);
  }

  function nextPhoto() {
    if (photos.value.length === 0) return;
    const currentIdx = activePhotoIndex.value;
    const nextIdx = (currentIdx + 1) % photos.value.length;
    setActivePhoto(photos.value[nextIdx].id);
  }

  function prevPhoto() {
    if (photos.value.length === 0) return;
    const currentIdx = activePhotoIndex.value;
    const prevIdx = (currentIdx - 1 + photos.value.length) % photos.value.length;
    setActivePhoto(photos.value[prevIdx].id);
  }

  return {
    photos,
    activePhoto,
    activePhotoId,
    activePhotoIndex,
    selectedPhotoIds,
    selectedCount,
    isBatchMode,
    copiedSettings,
    allPresets,
    userPresets,
    canUndo,
    canRedo,

    loadPhotosFromFiles,
    loadPhotosFromUrls,
    clearStudio,
    setActivePhoto,
    toggleSelectPhoto,
    selectAll,
    deselectAll,
    selectOnly,
    updateAdjustment,
    commitAdjustmentChange,
    applyPreset,
    saveCustomPreset,
    deleteCustomPreset,
    copySettings,
    pasteSettings,
    syncActiveToSelected,
    resetPhotos,
    undo,
    redo,
    nextPhoto,
    prevPhoto
  };
}
