<template>
  <div class="photographer-dashboard">
    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- PROFILE HEADER                                         -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <header class="dash-header">
      <div class="dash-header__inner">
        <!-- Avatar -->
        <div class="dash-avatar" @click="$refs.fileInput.click()">
          <div class="dash-avatar__ring">
            <div class="dash-avatar__img-wrap">
              <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" />
              <Icon v-else name="lucide:camera" class="dash-avatar__placeholder" />
            </div>
          </div>
          <div class="dash-avatar__overlay">
            <Icon name="lucide:upload" class="w-6 h-6" />
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
        </div>

        <!-- Info -->
        <div class="dash-header__info">
          <div class="dash-header__top-row">
            <h1 class="dash-header__name">{{ authStore.user?.username || 'Photographer' }}</h1>
            <span class="dash-badge dash-badge--pro">PRO</span>
          </div>

          <div class="dash-stats">
            <div class="dash-stat">
              <span class="dash-stat__number">{{ events.length }}</span>
              <span class="dash-stat__label">{{ $t('dashboard.photographer.my_events') }}</span>
            </div>
            <div class="dash-stat">
              <span class="dash-stat__number">{{ totalPhotos }}</span>
              <span class="dash-stat__label">{{ $t('dashboard.photographer.photos') }}</span>
            </div>
            <div class="dash-stat">
              <span class="dash-stat__number">{{ myPackages.length }}</span>
              <span class="dash-stat__label">{{ $t('dashboard.photographer.packages') }}</span>
            </div>
          </div>

          <div class="dash-header__wallet">
            <Icon name="lucide:wallet" class="w-4 h-4" />
            <span>${{ walletStore.balance.toFixed(2) }}</span>
          </div>
          <button @click="$router.push('/dashboard/photographer/settings')" class="dash-header__settings">
            <Icon name="lucide:settings" class="w-4 h-4" />
            <span>{{ $t('dashboard.photographer.settings') }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB NAVIGATION                                         -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <nav class="dash-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['dash-tab', { 'dash-tab--active': activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        <Icon :name="tab.icon" class="dash-tab__icon" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB: EVENTS                                            -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section v-if="activeTab === 'events'" class="dash-section">
      <div class="dash-section__header">
        <h2 class="dash-section__title">{{ $t('dashboard.photographer.my_events') }}</h2>
        <button @click="showCreateEventModal = true" class="dash-btn dash-btn--gradient">
          <Icon name="lucide:plus" class="w-4 h-4" />
          {{ $t('dashboard.photographer.create_event') }}
        </button>
      </div>

      <div v-if="eventsLoading" class="dash-loader">
        <div class="dash-spinner"></div>
      </div>

      <div v-else-if="events.length === 0" class="dash-empty">
        <div class="dash-empty__icon-ring">
          <Icon name="lucide:calendar-plus" class="dash-empty__icon" />
        </div>
        <h3 class="dash-empty__title">{{ $t('dashboard.photographer.no_events') }}</h3>
        <p class="dash-empty__text">{{ $t('dashboard.photographer.start_selling') }}</p>
        <button @click="showCreateEventModal = true" class="dash-btn dash-btn--gradient">
          {{ $t('dashboard.photographer.create_event') }}
        </button>
      </div>

      <div v-else class="dash-events-grid">
        <div v-for="event in events" :key="event.id" class="dash-event-card" @click="goToEvent(event.id)">
          <div class="dash-event-card__cover">
            <img v-if="event.previewPhotos && event.previewPhotos.length > 0" :src="event.previewPhotos[0]" alt="Cover" />
            <div v-else class="dash-event-card__cover-placeholder">
              <Icon name="lucide:image" class="w-10 h-10" />
            </div>
            <div class="dash-event-card__cover-overlay">
              <button class="dash-btn-icon" @click.stop="quickUpload(event)" title="Upload photos">
                <Icon name="lucide:upload" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="dash-event-card__body">
            <div class="dash-event-card__date">
              <Icon name="lucide:calendar" class="w-3 h-3" />
              {{ event.date }}
            </div>
            <h3 class="dash-event-card__title">{{ event.title }}</h3>
            <p class="dash-event-card__location">
              <Icon name="lucide:map-pin" class="w-3 h-3" />
              {{ event.location }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB: PACKAGES                                          -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section v-if="activeTab === 'packages'" class="dash-section">
      <div class="dash-section__header">
        <h2 class="dash-section__title">{{ $t('dashboard.photographer.my_packages') }}</h2>
        <button @click="showCreatePackageModal = true" class="dash-btn dash-btn--gradient">
          <Icon name="lucide:plus" class="w-4 h-4" />
          {{ $t('dashboard.photographer.create_package') }}
        </button>
      </div>

      <div v-if="packagesLoading" class="dash-loader">
        <div class="dash-spinner"></div>
      </div>

      <div v-else-if="myPackages.length === 0" class="dash-empty">
        <div class="dash-empty__icon-ring">
          <Icon name="lucide:package" class="dash-empty__icon" />
        </div>
        <h3 class="dash-empty__title">{{ $t('dashboard.photographer.no_packages') }}</h3>
        <p class="dash-empty__text">{{ $t('dashboard.photographer.start_packages') }}</p>
        <button @click="showCreatePackageModal = true" class="dash-btn dash-btn--gradient">
          {{ $t('dashboard.photographer.create_package') }}
        </button>
      </div>

      <div v-else class="dash-packages-grid">
        <div v-for="pkg in myPackages" :key="pkg.id" class="dash-package-card">
          <div class="dash-package-card__header">
            <div class="dash-package-card__photo-count">
              <span class="dash-package-card__count">{{ pkg.photoCount }}</span>
              <span class="dash-package-card__count-label">{{ pkg.photoCount === 1 ? 'foto' : 'fotos' }}</span>
            </div>
            <div class="dash-package-card__actions">
              <button @click="editPackage(pkg)" class="dash-btn-icon dash-btn-icon--sm">
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button @click="confirmDeletePackage(pkg)" class="dash-btn-icon dash-btn-icon--sm dash-btn-icon--danger">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="dash-package-card__body">
            <h3 class="dash-package-card__name">{{ pkg.name }}</h3>
            <p v-if="pkg.description" class="dash-package-card__desc">{{ pkg.description }}</p>
            <p v-if="pkg.eventTitle" class="dash-package-card__event">
              <Icon name="lucide:calendar" class="w-3 h-3" />
              {{ pkg.eventTitle }}
            </p>
            <p v-else class="dash-package-card__event dash-package-card__event--global">
              <Icon name="lucide:globe" class="w-3 h-3" />
              {{ $t('dashboard.photographer.all_events') }}
            </p>
          </div>
          <div class="dash-package-card__footer">
            <span class="dash-package-card__price">${{ formatPrice(pkg.price) }}</span>
            <span class="dash-package-card__per">COP</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB: QUICK UPLOAD                                      -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section v-if="activeTab === 'upload'" class="dash-section">
      <div class="dash-section__header">
        <h2 class="dash-section__title">{{ $t('dashboard.photographer.quick_upload') }}</h2>
      </div>

      <!-- Event Selection -->
      <div class="dash-upload-selector">
        <label class="dash-label">{{ $t('dashboard.photographer.select_event') }}</label>
        <div class="dash-select-wrap">
          <select v-model="selectedEventId" class="dash-select">
            <option :value="null" disabled>{{ $t('dashboard.photographer.choose_event') }}</option>
            <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.title }} — {{ ev.date }}</option>
          </select>
        </div>
      </div>

      <div v-if="selectedEventId" class="dash-upload-zone-wrap">
        <div class="dash-price-bar">
          <span class="dash-label">{{ $t('dashboard.photographer.base_price') }}</span>
          <div class="dash-price-input">
            <span>$</span>
            <input type="number" v-model="defaultPrice" step="100" min="0" />
          </div>
        </div>

        <div
          class="dash-dropzone"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @click="$refs.uploadInput.click()"
        >
          <div class="dash-dropzone__inner">
            <div class="dash-dropzone__icon">
              <Icon name="lucide:cloud-upload" class="w-10 h-10" />
            </div>
            <p class="dash-dropzone__title">{{ $t('dashboard.photographer.drag_drop') }}</p>
            <p class="dash-dropzone__subtitle">JPG, PNG · {{ $t('dashboard.photographer.high_res') }}</p>
          </div>
          <input type="file" class="hidden" multiple accept="image/jpeg, image/png" ref="uploadInput" @change="handleFileSelect" />
        </div>

        <!-- Pre-upload list -->
        <div v-if="selectedFiles.length > 0" class="dash-file-list">
          <div v-for="(file, index) in selectedFiles" :key="index" class="dash-file-item">
            <div class="dash-file-item__info">
              <div class="dash-file-item__thumb">
                <Icon name="lucide:image" class="w-5 h-5" />
              </div>
              <div>
                <p class="dash-file-item__name">{{ file.name }}</p>
                <p :class="['dash-file-item__status', `dash-file-item__status--${uploadStatus[index] || 'ready'}`]">
                  <template v-if="uploadStatus[index] === 'uploading'">{{ $t('dashboard.photographer.uploading') }}...</template>
                  <template v-else-if="uploadStatus[index] === 'done'">✓ {{ $t('dashboard.photographer.completed') }}</template>
                  <template v-else-if="uploadStatus[index] === 'error'">✗ {{ $t('dashboard.photographer.failed') }}</template>
                  <template v-else>{{ $t('dashboard.photographer.ready') }}</template>
                </p>
              </div>
            </div>
            <button v-if="!uploadStatus[index]" @click.stop="removeFile(index)" class="dash-btn-icon dash-btn-icon--sm dash-btn-icon--danger">
              <Icon name="lucide:x" class="w-4 h-4" />
            </button>
          </div>

          <button v-if="!isUploading" @click="uploadFiles" class="dash-btn dash-btn--primary dash-btn--full">
            <Icon name="lucide:upload" class="w-5 h-5" />
            {{ $t('dashboard.photographer.share_feed') }} ({{ selectedFiles.length }})
          </button>
        </div>
      </div>

      <div v-else class="dash-empty dash-empty--sm">
        <Icon name="lucide:arrow-up-circle" class="dash-empty__icon" style="width:48px;height:48px" />
        <p class="dash-empty__text">{{ $t('dashboard.photographer.select_event_prompt') }}</p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- MODAL: CREATE EVENT                                    -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showCreateEventModal" class="dash-modal-backdrop" @click.self="showCreateEventModal = false">
        <div class="dash-modal">
          <div class="dash-modal__header">
            <h3>{{ $t('dashboard.photographer.create_event') }}</h3>
            <button @click="showCreateEventModal = false" class="dash-btn-icon"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="createEvent" class="dash-modal__body">
            <div class="dash-field">
              <label class="dash-label">{{ $t('dashboard.photographer.event_title') }}</label>
              <input v-model="newEvent.title" type="text" required placeholder="e.g. Wedding of Alex & Maria" class="dash-input" />
            </div>
            <div class="dash-field-row">
              <div class="dash-field">
                <label class="dash-label">{{ $t('dashboard.photographer.event_date') }}</label>
                <input v-model="newEvent.date" type="date" required class="dash-input" />
              </div>
              <div class="dash-field">
                <label class="dash-label">{{ $t('dashboard.photographer.event_location') }}</label>
                <input v-model="newEvent.location" type="text" required placeholder="City or Venue" class="dash-input" />
              </div>
            </div>
            <div class="dash-field">
              <label class="dash-label">{{ $t('dashboard.photographer.event_description') }}</label>
              <textarea v-model="newEvent.description" rows="3" placeholder="Describe the vibe..." class="dash-input dash-input--textarea"></textarea>
            </div>
            <div class="dash-modal__actions">
              <button type="button" @click="showCreateEventModal = false" class="dash-btn dash-btn--ghost">{{ $t('common.cancel') }}</button>
              <button type="submit" class="dash-btn dash-btn--primary">{{ $t('common.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- MODAL: CREATE / EDIT PACKAGE                           -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showCreatePackageModal" class="dash-modal-backdrop" @click.self="closePackageModal">
        <div class="dash-modal">
          <div class="dash-modal__header">
            <h3>{{ editingPackage ? $t('dashboard.photographer.edit_package') : $t('dashboard.photographer.create_package') }}</h3>
            <button @click="closePackageModal" class="dash-btn-icon"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="savePackage" class="dash-modal__body">
            <div class="dash-field">
              <label class="dash-label">{{ $t('dashboard.photographer.pkg_name') }}</label>
              <input v-model="newPackage.name" type="text" required placeholder='e.g. "Pack Básico"' class="dash-input" />
            </div>
            <div class="dash-field-row">
              <div class="dash-field">
                <label class="dash-label">{{ $t('dashboard.photographer.pkg_photos') }}</label>
                <input v-model.number="newPackage.photoCount" type="number" min="1" required class="dash-input" />
              </div>
              <div class="dash-field">
                <label class="dash-label">{{ $t('dashboard.photographer.pkg_price') }} (COP)</label>
                <input v-model.number="newPackage.price" type="number" min="0" step="100" required class="dash-input" />
              </div>
            </div>
            <div class="dash-field">
              <label class="dash-label">{{ $t('dashboard.photographer.pkg_event') }}</label>
              <select v-model="newPackage.eventId" class="dash-select">
                <option :value="null">{{ $t('dashboard.photographer.all_events') }}</option>
                <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
              </select>
            </div>
            <div class="dash-field">
              <label class="dash-label">{{ $t('dashboard.photographer.pkg_desc') }}</label>
              <textarea v-model="newPackage.description" rows="2" placeholder="Optional description..." class="dash-input dash-input--textarea"></textarea>
            </div>

            <!-- Live Preview -->
            <div class="dash-package-preview">
              <div class="dash-package-preview__badge">{{ newPackage.photoCount || 0 }} {{ (newPackage.photoCount || 0) === 1 ? 'foto' : 'fotos' }}</div>
              <div class="dash-package-preview__name">{{ newPackage.name || '...' }}</div>
              <div class="dash-package-preview__price">${{ formatPrice(newPackage.price) }} <small>COP</small></div>
            </div>

            <div class="dash-modal__actions">
              <button type="button" @click="closePackageModal" class="dash-btn dash-btn--ghost">{{ $t('common.cancel') }}</button>
              <button type="submit" class="dash-btn dash-btn--primary">{{ editingPackage ? $t('common.save') : $t('dashboard.photographer.create_package') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Quick Upload Modal (triggered from event card) -->
    <Transition name="modal">
      <div v-if="showQuickUploadModal" class="dash-modal-backdrop" @click.self="showQuickUploadModal = false">
        <div class="dash-modal">
          <div class="dash-modal__header">
            <h3>Upload to: {{ quickUploadEvent?.title }}</h3>
            <button @click="showQuickUploadModal = false" class="dash-btn-icon"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <div class="dash-modal__body">
            <p class="text-sm text-gray-500 mb-4">Redirecting to event page...</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'
import { usePackagesStore } from '~/stores/packages'
import { usePhotosStore } from '~/stores/photos'

const { $api } = useNuxtApp()
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const packagesStore = usePackagesStore()
const photosStore = usePhotosStore()

// ─── State ──────────────────────────────────────────────────────
const activeTab = ref('events')
const fileInput = ref(null)
const uploadInput = ref(null)
const uploading = ref(false)

// Events
const showCreateEventModal = ref(false)
const newEvent = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  description: ''
})

// Packages
const showCreatePackageModal = ref(false)
const editingPackage = ref(null)
const newPackage = ref({
  name: '',
  photoCount: 1,
  price: 5000,
  eventId: null,
  description: ''
})

// Upload
const selectedEventId = ref(null)
const defaultPrice = ref(5000)
const selectedFiles = ref([])
const uploadStatus = ref([])
const isUploading = ref(false)

// Quick Upload
const showQuickUploadModal = ref(false)
const quickUploadEvent = ref(null)

// ─── Computed ───────────────────────────────────────────────────
const events = computed(() => eventsStore.myEvents)
const eventsLoading = computed(() => eventsStore.loading)
const myPackages = computed(() => packagesStore.myPackages)
const packagesLoading = computed(() => packagesStore.loading)
const totalPhotos = computed(() => events.value.reduce((sum, ev) => sum + (ev.photoCount || 0), 0))

const { t } = useI18n()

const tabs = computed(() => [
  { key: 'events', icon: 'lucide:calendar', label: t('dashboard.photographer.my_events') },
  { key: 'packages', icon: 'lucide:package', label: t('dashboard.photographer.packages') },
  { key: 'upload', icon: 'lucide:upload', label: t('dashboard.photographer.quick_upload') },
])

// ─── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  if (!authStore.isPhotographer) {
    router.push('/')
    return
  }
  await Promise.all([
    walletStore.fetchBalance(),
    eventsStore.fetchMyEvents(),
    packagesStore.fetchMyPackages()
  ])
})

// ─── Event Methods ──────────────────────────────────────────────
async function createEvent() {
  try {
    const success = await eventsStore.createEvent(newEvent.value)
    if (success) {
      showCreateEventModal.value = false
      newEvent.value = { title: '', date: new Date().toISOString().split('T')[0], location: '', description: '' }
    } else {
      alert('Failed to create event.')
    }
  } catch (e) {
    console.error('Failed to create event', e)
  }
}

function goToEvent(id) {
  router.push(`/dashboard/photographer/events/${id}`)
}

function quickUpload(event) {
  router.push(`/dashboard/photographer/events/${event.id}`)
}

// ─── Package Methods ────────────────────────────────────────────
function editPackage(pkg) {
  editingPackage.value = pkg
  newPackage.value = {
    name: pkg.name,
    photoCount: pkg.photoCount,
    price: pkg.price || 0,
    eventId: pkg.eventId || null,
    description: pkg.description || ''
  }
  showCreatePackageModal.value = true
}

function closePackageModal() {
  showCreatePackageModal.value = false
  editingPackage.value = null
  newPackage.value = { name: '', photoCount: 1, price: 5000, eventId: null, description: '' }
}

async function savePackage() {
  try {
    if (editingPackage.value) {
      const result = await packagesStore.updatePackage(editingPackage.value.id, newPackage.value)
      if (!result) { alert('Failed to update package'); return }
    } else {
      const result = await packagesStore.createPackage(newPackage.value)
      if (!result) { alert('Failed to create package'); return }
    }
    closePackageModal()
  } catch (e) {
    console.error(e)
  }
}

async function confirmDeletePackage(pkg) {
  if (!confirm(`Delete package "${pkg.name}"?`)) return
  await packagesStore.deletePackage(pkg.id)
}

function formatPrice(price) {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('es-CO')
}

// ─── Upload Methods ─────────────────────────────────────────────
function handleFileSelect(e) {
  addFiles(Array.from(e.target.files))
}

function handleDrop(e) {
  if (e.dataTransfer.files) {
    addFiles(Array.from(e.dataTransfer.files))
  }
}

function addFiles(files) {
  const validFiles = files.filter(f => f.type.startsWith('image/'))
  selectedFiles.value = [...selectedFiles.value, ...validFiles]
  uploadStatus.value = new Array(selectedFiles.value.length).fill(null)
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1)
  uploadStatus.value.splice(index, 1)
}

async function uploadFiles() {
  if (selectedFiles.value.length === 0 || !selectedEventId.value) return
  isUploading.value = true

  for (let i = 0; i < selectedFiles.value.length; i++) {
    if (uploadStatus.value[i]) continue
    const file = selectedFiles.value[i]
    uploadStatus.value[i] = 'uploading'

    try {
      const result = await photosStore.uploadPhoto(selectedEventId.value, file, defaultPrice.value)
      uploadStatus.value[i] = result ? 'done' : 'error'
    } catch (e) {
      console.error(e)
      uploadStatus.value[i] = 'error'
    }
  }

  isUploading.value = false

  const newFiles = []
  const newStatus = []
  for (let i = 0; i < selectedFiles.value.length; i++) {
    if (uploadStatus.value[i] === 'error') {
      newFiles.push(selectedFiles.value[i])
      newStatus.push(uploadStatus.value[i])
    }
  }
  selectedFiles.value = newFiles
  uploadStatus.value = newStatus
}

// ─── Profile Photo ──────────────────────────────────────────────
async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await $api('/photo/upload-public', { method: 'POST', body: formData })
    const photoUrl = res.url
    await $api('/users/profile-photo', { method: 'PUT', body: photoUrl })
    authStore.user.profilePhotoUrl = photoUrl
  } catch (e) {
    console.error(e)
    alert('Upload failed.')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════ */
/* DESIGN TOKENS                                                  */
/* ═══════════════════════════════════════════════════════════════ */
:root {
  --dash-bg: #fafbfc;
  --dash-surface: #ffffff;
  --dash-border: #e8ecf1;
  --dash-text: #1a1d23;
  --dash-text-muted: #6b7280;
  --dash-text-dim: #9ca3af;
  --dash-primary: #6366f1;
  --dash-primary-hover: #4f46e5;
  --dash-primary-light: #eef2ff;
  --dash-accent: #8b5cf6;
  --dash-accent-light: #f5f3ff;
  --dash-danger: #ef4444;
  --dash-danger-light: #fef2f2;
  --dash-success: #10b981;
  --dash-radius: 16px;
  --dash-radius-sm: 10px;
  --dash-radius-xs: 6px;
  --dash-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  --dash-shadow-lg: 0 4px 24px rgba(0,0,0,0.08);
}

.photographer-dashboard {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px 80px;
  min-height: 100vh;
  background: var(--dash-bg);
}

/* ═══════════════════════════════════════════════════════════════ */
/* HEADER                                                         */
/* ═══════════════════════════════════════════════════════════════ */
.dash-header {
  padding: 32px 0;
  border-bottom: 1px solid var(--dash-border);
}
.dash-header__inner {
  display: flex;
  align-items: center;
  gap: 32px;
}
.dash-header__info {
  flex: 1;
}
.dash-header__top-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.dash-header__name {
  font-size: 24px;
  font-weight: 300;
  color: var(--dash-text);
  letter-spacing: -0.02em;
}
.dash-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 20px;
}
.dash-badge--pro {
  background: linear-gradient(135deg, var(--dash-primary), var(--dash-accent));
  color: white;
}
.dash-header__wallet {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 16px;
  background: var(--dash-primary-light);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dash-primary);
}
.dash-header__settings {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  margin-left: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dash-header__settings:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Avatar */
.dash-avatar {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}
.dash-avatar__ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6);
  padding: 3px;
  transition: transform 0.3s ease;
}
.dash-avatar:hover .dash-avatar__ring { transform: scale(1.05); }
.dash-avatar__img-wrap {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: white;
  padding: 3px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dash-avatar__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.dash-avatar__placeholder {
  width: 48px;
  height: 48px;
  color: #d1d5db;
}
.dash-avatar__overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.dash-avatar:hover .dash-avatar__overlay { opacity: 1; }

/* Stats */
.dash-stats {
  display: flex;
  gap: 28px;
}
.dash-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dash-stat__number {
  font-size: 18px;
  font-weight: 700;
  color: var(--dash-text);
}
.dash-stat__label {
  font-size: 11px;
  color: var(--dash-text-muted);
  text-transform: capitalize;
}

/* ═══════════════════════════════════════════════════════════════ */
/* TAB NAVIGATION                                                 */
/* ═══════════════════════════════════════════════════════════════ */
.dash-tabs {
  display: flex;
  justify-content: center;
  gap: 0;
  border-bottom: 1px solid var(--dash-border);
  margin-top: -1px;
}
.dash-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--dash-text-dim);
  border: none;
  border-top: 2px solid transparent;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;
}
.dash-tab:hover {
  color: var(--dash-text-muted);
}
.dash-tab--active {
  color: var(--dash-text);
  border-top-color: var(--dash-text);
}
.dash-tab__icon {
  width: 14px;
  height: 14px;
}

/* ═══════════════════════════════════════════════════════════════ */
/* SECTION                                                        */
/* ═══════════════════════════════════════════════════════════════ */
.dash-section {
  padding-top: 32px;
  animation: fadeIn 0.3s ease;
}
.dash-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.dash-section__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--dash-text);
}

/* ═══════════════════════════════════════════════════════════════ */
/* BUTTONS                                                        */
/* ═══════════════════════════════════════════════════════════════ */
.dash-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--dash-radius-sm);
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dash-btn--primary {
  background: var(--dash-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}
.dash-btn--primary:hover {
  background: var(--dash-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
.dash-btn--primary:active { transform: scale(0.97); }
.dash-btn--accent {
  background: var(--dash-accent);
  color: white;
}
.dash-btn--accent:hover { background: #7c3aed; }
.dash-btn--gradient {
  background: linear-gradient(135deg, var(--dash-primary), var(--dash-accent));
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  border: none;
}
.dash-btn--gradient:hover {
  background: linear-gradient(135deg, var(--dash-primary-hover), #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}
.dash-btn--ghost {
  background: transparent;
  color: var(--dash-text-muted);
}
.dash-btn--ghost:hover { background: #f3f4f6; }
.dash-btn--full { width: 100%; justify-content: center; padding: 14px; margin-top: 16px; }

.dash-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  color: var(--dash-text);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}
.dash-btn-icon:hover { background: white; transform: scale(1.1); }
.dash-btn-icon--sm { width: 32px; height: 32px; }
.dash-btn-icon--danger:hover { background: var(--dash-danger-light); color: var(--dash-danger); }

/* ═══════════════════════════════════════════════════════════════ */
/* EVENT CARDS                                                    */
/* ═══════════════════════════════════════════════════════════════ */
.dash-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.dash-event-card {
  background: var(--dash-surface);
  border: 1px solid var(--dash-border);
  border-radius: var(--dash-radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dash-event-card:hover {
  box-shadow: var(--dash-shadow-lg);
  transform: translateY(-4px);
}
.dash-event-card__cover {
  position: relative;
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  overflow: hidden;
}
.dash-event-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.dash-event-card:hover .dash-event-card__cover img { transform: scale(1.08); }
.dash-event-card__cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #d1d5db;
}
.dash-event-card__cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;
}
.dash-event-card:hover .dash-event-card__cover-overlay {
  background: rgba(0,0,0,0.25);
  opacity: 1;
}
.dash-event-card__body {
  padding: 16px 20px 20px;
}
.dash-event-card__date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--dash-primary);
  margin-bottom: 8px;
}
.dash-event-card__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--dash-text);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dash-event-card:hover .dash-event-card__title { color: var(--dash-primary); }
.dash-event-card__location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--dash-text-muted);
}

/* ═══════════════════════════════════════════════════════════════ */
/* PACKAGE CARDS                                                  */
/* ═══════════════════════════════════════════════════════════════ */
.dash-packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.dash-package-card {
  background: var(--dash-surface);
  border: 1px solid var(--dash-border);
  border-radius: var(--dash-radius);
  overflow: hidden;
  transition: all 0.3s ease;
}
.dash-package-card:hover {
  box-shadow: var(--dash-shadow-lg);
  transform: translateY(-2px);
}
.dash-package-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}
.dash-package-card__photo-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.dash-package-card__count {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--dash-primary), var(--dash-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.dash-package-card__count-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--dash-text-muted);
}
.dash-package-card__actions {
  display: flex;
  gap: 4px;
}
.dash-package-card__body {
  padding: 12px 20px;
}
.dash-package-card__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--dash-text);
  margin-bottom: 4px;
}
.dash-package-card__desc {
  font-size: 13px;
  color: var(--dash-text-muted);
  margin-bottom: 8px;
}
.dash-package-card__event {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--dash-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dash-package-card__event--global {
  color: var(--dash-text-dim);
}
.dash-package-card__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--dash-border);
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.dash-package-card__price {
  font-size: 22px;
  font-weight: 800;
  color: var(--dash-text);
}
.dash-package-card__per {
  font-size: 12px;
  font-weight: 600;
  color: var(--dash-text-dim);
}

/* ═══════════════════════════════════════════════════════════════ */
/* UPLOAD SECTION                                                 */
/* ═══════════════════════════════════════════════════════════════ */
.dash-upload-selector {
  margin-bottom: 24px;
}
.dash-upload-zone-wrap {
  animation: fadeIn 0.3s ease;
}
.dash-price-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--dash-surface);
  border: 1px solid var(--dash-border);
  border-radius: var(--dash-radius-sm);
  margin-bottom: 16px;
}
.dash-price-input {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: var(--dash-text);
}
.dash-price-input input {
  width: 80px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: var(--dash-text);
  outline: none;
  text-align: right;
}
.dash-dropzone {
  border: 2px dashed var(--dash-border);
  border-radius: var(--dash-radius);
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--dash-surface);
}
.dash-dropzone:hover {
  border-color: var(--dash-primary);
  background: var(--dash-primary-light);
}
.dash-dropzone__inner { display: flex; flex-direction: column; align-items: center; }
.dash-dropzone__icon {
  width: 64px;
  height: 64px;
  background: var(--dash-primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dash-primary);
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}
.dash-dropzone:hover .dash-dropzone__icon { transform: scale(1.1); }
.dash-dropzone__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--dash-text);
  margin-bottom: 4px;
}
.dash-dropzone__subtitle {
  font-size: 12px;
  color: var(--dash-text-dim);
}

/* File List */
.dash-file-list {
  margin-top: 16px;
}
.dash-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--dash-surface);
  border: 1px solid var(--dash-border);
  border-radius: var(--dash-radius-sm);
  margin-bottom: 8px;
}
.dash-file-item__info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dash-file-item__thumb {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}
.dash-file-item__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--dash-text);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dash-file-item__status {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 2px;
}
.dash-file-item__status--ready { color: var(--dash-text-dim); }
.dash-file-item__status--uploading { color: var(--dash-primary); }
.dash-file-item__status--done { color: var(--dash-success); }
.dash-file-item__status--error { color: var(--dash-danger); }

/* ═══════════════════════════════════════════════════════════════ */
/* FORM ELEMENTS                                                  */
/* ═══════════════════════════════════════════════════════════════ */
.dash-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--dash-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.dash-input {
  width: 100%;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: var(--dash-radius-sm);
  font-size: 14px;
  color: var(--dash-text);
  outline: none;
  transition: all 0.2s ease;
}
.dash-input:focus {
  border-color: var(--dash-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.dash-input--textarea { resize: none; }
.dash-select {
  width: 100%;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: var(--dash-radius-sm);
  font-size: 14px;
  color: var(--dash-text);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
}
.dash-select:focus {
  border-color: var(--dash-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.dash-select-wrap {
  position: relative;
}
.dash-field { margin-bottom: 16px; }
.dash-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ═══════════════════════════════════════════════════════════════ */
/* MODAL                                                          */
/* ═══════════════════════════════════════════════════════════════ */
.dash-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
}
.dash-modal {
  background: var(--dash-surface);
  width: 100%;
  max-width: 520px;
  border-radius: var(--dash-radius);
  box-shadow: var(--dash-shadow-lg);
  overflow: hidden;
  animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dash-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--dash-border);
}
.dash-modal__header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--dash-text);
}
.dash-modal__body {
  padding: 24px;
}
.dash-modal__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding-top: 16px;
}
.dash-modal__actions .dash-btn { flex: 1; justify-content: center; }
.dash-modal__actions .dash-btn--primary { flex: 2; }

/* ═══════════════════════════════════════════════════════════════ */
/* PACKAGE PREVIEW                                                */
/* ═══════════════════════════════════════════════════════════════ */
.dash-package-preview {
  margin-top: 8px;
  padding: 20px;
  background: linear-gradient(135deg, #eef2ff, #f5f3ff);
  border-radius: var(--dash-radius-sm);
  text-align: center;
  border: 1px dashed var(--dash-primary);
}
.dash-package-preview__badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--dash-primary), var(--dash-accent));
  color: white;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 8px;
}
.dash-package-preview__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--dash-text);
  margin-bottom: 4px;
}
.dash-package-preview__price {
  font-size: 28px;
  font-weight: 800;
  color: var(--dash-primary);
}
.dash-package-preview__price small {
  font-size: 12px;
  font-weight: 600;
  color: var(--dash-text-dim);
}

/* ═══════════════════════════════════════════════════════════════ */
/* EMPTY STATE & LOADER                                           */
/* ═══════════════════════════════════════════════════════════════ */
.dash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}
.dash-empty--sm { padding: 40px 24px; }
.dash-empty__icon-ring {
  width: 72px;
  height: 72px;
  border: 2px solid var(--dash-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.dash-empty__icon {
  width: 32px;
  height: 32px;
  color: var(--dash-text);
}
.dash-empty__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--dash-text);
  margin-bottom: 8px;
}
.dash-empty__text {
  font-size: 14px;
  color: var(--dash-text-muted);
  margin-bottom: 20px;
}
.dash-loader {
  display: flex;
  justify-content: center;
  padding: 64px;
}
.dash-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--dash-border);
  border-top-color: var(--dash-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ═══════════════════════════════════════════════════════════════ */
/* ANIMATIONS                                                     */
/* ═══════════════════════════════════════════════════════════════ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active .dash-modal { animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* ═══════════════════════════════════════════════════════════════ */
/* RESPONSIVE                                                     */
/* ═══════════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .dash-header__inner {
    flex-direction: column;
    text-align: center;
  }
  .dash-avatar__ring {
    width: 96px;
    height: 96px;
  }
  .dash-stats { justify-content: center; }
  .dash-header__wallet { justify-content: center; }
  .dash-tabs { gap: 0; }
  .dash-tab { padding: 12px 16px; font-size: 11px; }
  .dash-section__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  .dash-events-grid { grid-template-columns: 1fr; }
  .dash-packages-grid { grid-template-columns: 1fr; }
  .dash-field-row { grid-template-columns: 1fr; }
}

.hidden { display: none; }
</style>
