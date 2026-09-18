<template>
  <div class="pd-root">
    <div class="pd-orb pd-orb--1" aria-hidden="true"></div>
    <div class="pd-orb pd-orb--2" aria-hidden="true"></div>
    <div class="pd-orb pd-orb--3" aria-hidden="true"></div>

    <!-- HERO HEADER -->
    <!-- COMPACT PRO HEADER -->
    <header class="pd-hero">
      <div class="pd-hero__inner">
        <div class="pd-hero__left">
          <div class="pd-avatar" @click="$refs.fileInput.click()" title="Cambiar foto de perfil">
            <div class="pd-avatar__ring">
              <div class="pd-avatar__img-wrap">
                <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" />
                <Icon v-else name="lucide:camera" class="pd-avatar__placeholder" />
              </div>
            </div>
            <div class="pd-avatar__overlay">
              <Icon name="lucide:upload" class="w-3.5 h-3.5" />
            </div>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
          </div>

          <div class="pd-hero__profile">
            <div class="pd-hero__top-row">
              <h1 class="pd-hero__name">{{ authStore.user?.username || 'Photographer' }}</h1>
              <span class="pd-badge pd-badge--pro">PRO</span>
            </div>
            <div class="pd-compact-stats">
              <span><strong>{{ events.length }}</strong> {{ $t('dashboard.photographer.my_events') }}</span>
              <span class="pd-compact-dot">·</span>
              <span><strong>{{ totalPhotos }}</strong> {{ $t('dashboard.photographer.photos') }}</span>
              <span class="pd-compact-dot">·</span>
              <span><strong>{{ myPackages.length }}</strong> {{ $t('dashboard.photographer.packages') }}</span>
            </div>
          </div>
        </div>

        <div class="pd-hero__actions">
          <button @click="showCreateEventModal = true" class="pd-action-btn pd-action-btn--create">
            <Icon name="lucide:plus" class="w-3.5 h-3.5" />
            <span>{{ $t('dashboard.photographer.create_event') }}</span>
          </button>
          <div class="pd-wallet-chip">
            <Icon name="lucide:wallet" class="w-3.5 h-3.5" />
            <span>${{ walletStore.balance.toFixed(2) }}</span>
          </div>
          <button @click="$router.push('/dashboard/photographer/studio')" class="pd-action-btn pd-action-btn--studio">
            <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
          <button @click="notifStore.isDropdownOpen = !notifStore.isDropdownOpen" class="pd-action-btn relative" title="Ver Notificaciones">
            <Icon name="lucide:bell" class="w-3.5 h-3.5" />
            <span v-if="notifStore.unreadCount > 0" class="ml-1 px-1.5 py-0.5 text-[9px] font-black bg-rose-500 text-white rounded-full">
              {{ notifStore.unreadCount }}
            </span>
          </button>
          <button @click="$router.push('/dashboard/photographer/settings')" class="pd-action-btn" title="Configuración">
            <Icon name="lucide:settings" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>

    <!-- TAB NAV -->
    <nav class="pd-tabs">
      <div class="pd-tabs__track">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['pd-tab', { 'pd-tab--active': activeTab === tab.key }]"
          @click="tab.key === 'studio' ? $router.push('/dashboard/photographer/studio') : (activeTab = tab.key)"
        >
          <Icon :name="tab.icon" class="pd-tab__icon" />
          <span>{{ tab.label }}</span>
          <span v-if="tab.key === 'studio'" class="pd-tab__dot"></span>
        </button>
      </div>
    </nav>

    <!-- TAB: SUMMARY -->
    <section v-if="activeTab === 'summary'" class="pd-section">
      <div v-if="dashboardLoading" class="pd-loader"><div class="pd-spinner"></div></div>
      <div v-else-if="dashboardData" class="pd-summary">
        <div class="pd-kpi-grid">
          <div class="pd-kpi pd-kpi--green">
            <div class="pd-kpi__icon-wrap"><Icon name="lucide:wallet" class="pd-kpi__icon" /></div>
            <div class="pd-kpi__body">
              <span class="pd-kpi__label">Saldo Disponible</span>
              <span class="pd-kpi__value">${{ walletStore.balance.toFixed(2) }}</span>
            </div>
            <div class="pd-kpi__glow pd-kpi__glow--green"></div>
          </div>
          <div class="pd-kpi pd-kpi--blue">
            <div class="pd-kpi__icon-wrap"><Icon name="lucide:trending-up" class="pd-kpi__icon" /></div>
            <div class="pd-kpi__body">
              <span class="pd-kpi__label">{{ $t('dashboard.photographer.total_earnings') }}</span>
              <span class="pd-kpi__value">${{ dashboardData.totalEarnings?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="pd-kpi__glow pd-kpi__glow--blue"></div>
          </div>
          <div class="pd-kpi pd-kpi--purple">
            <div class="pd-kpi__icon-wrap"><Icon name="lucide:arrow-up-right" class="pd-kpi__icon" /></div>
            <div class="pd-kpi__body">
              <span class="pd-kpi__label">{{ $t('dashboard.photographer.total_withdrawn') }}</span>
              <span class="pd-kpi__value">${{ dashboardData.totalWithdrawn?.toFixed(2) || '0.00' }}</span>
            </div>
            <div class="pd-kpi__glow pd-kpi__glow--purple"></div>
          </div>
        </div>

        <div class="pd-kpi-grid">
          <div class="pd-kpi pd-kpi--orange">
            <div class="pd-kpi__icon-wrap"><Icon name="lucide:gift" class="pd-kpi__icon" /></div>
            <div class="pd-kpi__body">
              <span class="pd-kpi__label">Códigos Generados</span>
              <span class="pd-kpi__value">{{ dashboardData.totalGiftCardsGenerated || 0 }}</span>
            </div>
            <div class="pd-kpi__glow pd-kpi__glow--orange"></div>
          </div>
          <div class="pd-kpi pd-kpi--indigo">
            <div class="pd-kpi__icon-wrap"><Icon name="lucide:truck" class="pd-kpi__icon" /></div>
            <div class="pd-kpi__body">
              <span class="pd-kpi__label">Códigos Entregados</span>
              <span class="pd-kpi__value">{{ dashboardData.totalGiftCardsDelivered || 0 }}</span>
            </div>
            <div class="pd-kpi__glow pd-kpi__glow--indigo"></div>
          </div>
          <div class="pd-kpi pd-kpi--rose">
            <div class="pd-kpi__icon-wrap"><Icon name="lucide:check-circle" class="pd-kpi__icon" /></div>
            <div class="pd-kpi__body">
              <span class="pd-kpi__label">Códigos Redimidos</span>
              <span class="pd-kpi__value">{{ dashboardData.totalGiftCardsRedeemed || 0 }}</span>
            </div>
            <div class="pd-kpi__glow pd-kpi__glow--rose"></div>
          </div>
        </div>

        <div class="pd-summary-cols">
          <div class="pd-glass-card pd-glass-card--wide">
            <div class="pd-card-header">
              <div class="pd-card-header__title">
                <Icon name="lucide:shopping-bag" class="w-4 h-4 text-emerald-400" />
                {{ $t('dashboard.photographer.sold_photos') }}
              </div>
            </div>
            <div v-if="dashboardData.soldPhotos && dashboardData.soldPhotos.length > 0" class="pd-table-wrap">
              <table class="pd-table">
                <thead>
                  <tr>
                    <th>{{ $t('dashboard.photographer.photo') }}</th>
                    <th>{{ $t('dashboard.photographer.event') }}</th>
                    <th>{{ $t('dashboard.photographer.buyer') }}</th>
                    <th>{{ $t('dashboard.photographer.price') }}</th>
                    <th>{{ $t('dashboard.photographer.earnings') }}</th>
                    <th>{{ $t('dashboard.photographer.date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dashboardData.soldPhotos" :key="item.photoId">
                    <td>
                      <div class="pd-table__thumb">
                        <img v-if="item.watermarkedUrl" :src="item.watermarkedUrl" alt="Photo" />
                        <Icon v-else name="lucide:image" class="w-5 h-5" style="color:var(--pd-text-dim)" />
                      </div>
                    </td>
                    <td class="pd-table__bold">{{ item.eventTitle }}</td>
                    <td class="pd-table__muted">@{{ item.buyerUsername }}</td>
                    <td class="pd-table__bold">${{ item.price?.toFixed(2) }}</td>
                    <td class="pd-table__earn">+${{ item.photographerEarnings?.toFixed(2) }}</td>
                    <td class="pd-table__date">{{ item.purchasedAt ? new Date(item.purchasedAt).toLocaleDateString() : '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="pd-empty-inline">
              <Icon name="lucide:camera-off" class="w-10 h-10" style="opacity:.3" />
              <p>{{ $t('dashboard.photographer.no_sales') }}</p>
            </div>
          </div>

          <div class="pd-glass-card">
            <div class="pd-card-header">
              <div class="pd-card-header__title">
                <Icon name="lucide:flame" class="w-4 h-4" style="color:var(--pd-orange)" />
                {{ $t('dashboard.photographer.top_selling_events') }}
              </div>
            </div>
            <div v-if="dashboardData.topEvents && dashboardData.topEvents.length > 0" class="pd-top-events">
              <div v-for="(event, idx) in dashboardData.topEvents" :key="event.eventId" class="pd-top-event" @click="goToEvent(event.eventId)">
                <span class="pd-top-event__rank">#{{ idx + 1 }}</span>
                <div class="pd-top-event__info">
                  <h4>{{ event.title }}</h4>
                  <span>{{ event.date }}</span>
                </div>
                <div class="pd-top-event__right">
                  <span class="pd-top-event__sales">{{ event.photosSold }} ventas</span>
                  <span class="pd-top-event__earn">+${{ event.totalEarnings?.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="pd-empty-inline">
              <Icon name="lucide:calendar-range" class="w-10 h-10" style="opacity:.3" />
              <p>{{ $t('dashboard.photographer.no_sales') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB: EVENTS -->
    <section v-if="activeTab === 'events'" class="pd-section">
      <div class="pd-section-header">
        <h2 class="pd-section-title">{{ $t('dashboard.photographer.my_events') }}</h2>
        <div class="pd-section-header__actions">
          <div class="pd-search-wrap">
            <Icon name="lucide:search" class="pd-search-icon" />
            <input v-model="searchQuery" type="text" :placeholder="$t('dashboard.photographer.search_events')" class="pd-search-input" />
          </div>
          <button @click="showCreateEventModal = true" class="pd-primary-btn">
            <Icon name="lucide:plus" class="w-4 h-4" />
            {{ $t('dashboard.photographer.create_event') }}
          </button>
        </div>
      </div>
      <div v-if="eventsLoading" class="pd-loader"><div class="pd-spinner"></div></div>
      <div v-else-if="events.length === 0" class="pd-empty">
        <div class="pd-empty__orb"><Icon name="lucide:calendar-plus" class="w-8 h-8" /></div>
        <h3>{{ $t('dashboard.photographer.no_events') }}</h3>
        <p>{{ $t('dashboard.photographer.start_selling') }}</p>
        <button @click="showCreateEventModal = true" class="pd-primary-btn">{{ $t('dashboard.photographer.create_event') }}</button>
      </div>
      <div v-else class="pd-events-grid">
        <div v-for="event in filteredEvents" :key="event.id" class="pd-event-card" @click="goToEvent(event.id)">
          <div class="pd-event-card__cover">
            <img v-if="event.previewPhotos && event.previewPhotos.length > 0" :src="event.previewPhotos[0]" alt="Cover" />
            <div v-else class="pd-event-card__cover-placeholder"><Icon name="lucide:image" class="w-10 h-10" /></div>
            <div class="pd-event-card__overlay">
              <button class="pd-icon-btn" @click.stop="quickUpload(event)"><Icon name="lucide:upload" class="w-4 h-4" /></button>
            </div>
          </div>
          <div class="pd-event-card__body">
            <div class="pd-event-card__date"><Icon name="lucide:calendar" class="w-3 h-3" />{{ event.date }}</div>
            <h3 class="pd-event-card__title">{{ event.title }}</h3>
            <p class="pd-event-card__location"><Icon name="lucide:map-pin" class="w-3 h-3" />{{ event.location }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB: PACKAGES -->
    <section v-if="activeTab === 'packages'" class="pd-section">
      <div class="pd-section-header">
        <h2 class="pd-section-title">{{ $t('dashboard.photographer.my_packages') }}</h2>
        <button @click="showCreatePackageModal = true" class="pd-primary-btn">
          <Icon name="lucide:plus" class="w-4 h-4" />{{ $t('dashboard.photographer.create_package') }}
        </button>
      </div>
      <div v-if="packagesLoading" class="pd-loader"><div class="pd-spinner"></div></div>
      <div v-else-if="myPackages.length === 0" class="pd-empty">
        <div class="pd-empty__orb"><Icon name="lucide:package" class="w-8 h-8" /></div>
        <h3>{{ $t('dashboard.photographer.no_packages') }}</h3>
        <p>{{ $t('dashboard.photographer.start_packages') }}</p>
        <button @click="showCreatePackageModal = true" class="pd-primary-btn">{{ $t('dashboard.photographer.create_package') }}</button>
      </div>
      <div v-else class="pd-packages-grid">
        <div v-for="pkg in myPackages" :key="pkg.id" class="pd-pkg-card">
          <div class="pd-pkg-card__header">
            <div class="pd-pkg-card__count-wrap">
              <span class="pd-pkg-card__count">{{ pkg.photoCount }}</span>
              <span class="pd-pkg-card__count-unit">{{ pkg.photoCount === 1 ? 'foto' : 'fotos' }}</span>
            </div>
            <div class="pd-pkg-card__actions">
              <button @click="editPackage(pkg)" class="pd-icon-btn pd-icon-btn--sm"><Icon name="lucide:pencil" class="w-3.5 h-3.5" /></button>
              <button @click="confirmDeletePackage(pkg)" class="pd-icon-btn pd-icon-btn--sm pd-icon-btn--danger"><Icon name="lucide:trash-2" class="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div class="pd-pkg-card__body">
            <h3 class="pd-pkg-card__name">{{ pkg.name }}</h3>
            <p v-if="pkg.description" class="pd-pkg-card__desc">{{ pkg.description }}</p>
            <p v-if="pkg.eventTitle" class="pd-pkg-card__event"><Icon name="lucide:calendar" class="w-3 h-3" />{{ pkg.eventTitle }}</p>
            <p v-else class="pd-pkg-card__event pd-pkg-card__event--global"><Icon name="lucide:globe" class="w-3 h-3" />{{ $t('dashboard.photographer.all_events') }}</p>
          </div>
          <div class="pd-pkg-card__footer">
            <span class="pd-pkg-card__price">${{ formatPrice(pkg.price) }}</span>
            <span class="pd-pkg-card__currency">COP</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB: QUICK UPLOAD -->
    <section v-if="activeTab === 'upload'" class="pd-section">
      <div class="pd-section-header">
        <h2 class="pd-section-title">{{ $t('dashboard.photographer.quick_upload') }}</h2>
      </div>
      <div class="pd-upload-wrap">
        <div class="pd-glass-card" style="padding:20px">
          <label class="pd-label">{{ $t('dashboard.photographer.select_event') }}</label>
          <div class="pd-select-wrap">
            <Icon name="lucide:chevron-down" class="pd-select-arrow" />
            <select v-model="selectedEventId" class="pd-select">
              <option :value="null" disabled>{{ $t('dashboard.photographer.choose_event') }}</option>
              <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.title }} — {{ ev.date }}</option>
            </select>
          </div>
        </div>
        <div v-if="selectedEventId" class="pd-upload-zone-wrap">
          <div class="pd-glass-card">
            <div class="pd-price-bar">
              <span class="pd-label" style="margin:0">{{ $t('dashboard.photographer.base_price') }}</span>
              <div class="pd-price-input">
                <span>$</span>
                <input type="number" v-model="defaultPrice" step="100" min="0" />
              </div>
            </div>
          </div>
          <div class="pd-dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="$refs.uploadInput.click()">
            <div class="pd-dropzone__inner">
              <div class="pd-dropzone__icon-wrap"><Icon name="lucide:cloud-upload" class="w-8 h-8" /></div>
              <p class="pd-dropzone__title">{{ $t('dashboard.photographer.drag_drop') }}</p>
              <p class="pd-dropzone__sub">JPG, PNG, Canon RAW (CR3 / CR2), DNG, RAW · {{ $t('dashboard.photographer.high_res') }}</p>
            </div>
            <input type="file" class="hidden" multiple accept="image/jpeg,image/png,image/webp,.cr3,.CR3,.cr2,.CR2,.raw,.RAW,.dng,.DNG,.nef,.NEF,.arw,.ARW" ref="uploadInput" @change="handleFileSelect" />
          </div>
          <div v-if="selectedFiles.length > 0" class="pd-file-list">
            <div v-for="(file, index) in selectedFiles" :key="index" class="pd-file-item">
              <div class="pd-file-item__info">
                <div class="pd-file-item__thumb"><Icon name="lucide:image" class="w-4 h-4" /></div>
                <div>
                  <p class="pd-file-item__name">{{ file.name }}</p>
                  <p :class="['pd-file-item__status', 'pd-file-item__status--' + (uploadStatus[index] || 'ready')]">
                    <template v-if="uploadStatus[index] === 'uploading'">{{ $t('dashboard.photographer.uploading') }}...</template>
                    <template v-else-if="uploadStatus[index] === 'done'">✓ {{ $t('dashboard.photographer.completed') }}</template>
                    <template v-else-if="uploadStatus[index] === 'error'">✗ {{ $t('dashboard.photographer.failed') }}</template>
                    <template v-else>{{ $t('dashboard.photographer.ready') }}</template>
                  </p>
                </div>
              </div>
              <button v-if="!uploadStatus[index]" @click.stop="removeFile(index)" class="pd-icon-btn pd-icon-btn--sm pd-icon-btn--danger"><Icon name="lucide:x" class="w-3.5 h-3.5" /></button>
            </div>
            <button v-if="!isUploading" @click="uploadFiles" class="pd-primary-btn pd-primary-btn--full">
              <Icon name="lucide:upload" class="w-4 h-4" />{{ $t('dashboard.photographer.share_feed') }} ({{ selectedFiles.length }})
            </button>
          </div>
        </div>
        <div v-else class="pd-empty">
          <div class="pd-empty__orb"><Icon name="lucide:arrow-up-circle" class="w-8 h-8" /></div>
          <p>{{ $t('dashboard.photographer.select_event_prompt') }}</p>
        </div>
      </div>
    </section>

    <!-- TAB: GIFT CARDS -->
    <section v-if="activeTab === 'giftcards'" class="pd-section">
      <div class="pd-section-header">
        <div>
          <h2 class="pd-section-title">Tarjetas de Regalo 🎁</h2>
          <p class="pd-section-subtitle">Crea códigos promocionales · tarifa de $750 COP por código generado.</p>
        </div>
      </div>
      <div class="pd-giftcard-layout">
        <div class="pd-glass-card pd-gc-form">
          <h3 class="pd-gc-form__title">Configurar Lote</h3>
          <div class="pd-field">
            <label class="pd-label">Valor por Tarjeta</label>
            <div class="pd-price-input pd-price-input--field">
              <span>$</span>
              <input type="number" v-model.number="giftCardAmount" min="10000" max="30000" step="5000" class="pd-field-input" style="background:transparent;border:none;outline:none;flex:1;font-size:16px;color:var(--pd-text)" />
            </div>
            <span class="pd-field-hint">Mínimo 10.000 · Máximo 30.000 COP</span>
          </div>
          <div class="pd-field">
            <label class="pd-label">Cantidad a Generar</label>
            <input type="number" v-model.number="giftCardCount" min="1" step="1" class="pd-field-input pd-field-input--full" />
          </div>
          <div class="pd-gc-summary">
            <div class="pd-gc-summary__row"><span>Cantidad</span><span>{{ giftCardCount }} tarjetas</span></div>
            <div class="pd-gc-summary__row"><span>Tarifa/tarjeta</span><span>$750 COP</span></div>
            <div class="pd-gc-summary__row pd-gc-summary__row--total"><span>Total a pagar</span><span>${{ (giftCardCount * 750).toLocaleString('es-CO') }} COP</span></div>
          </div>
          <button @click="handleGenerateGiftCards" :disabled="generatingGiftCards" class="pd-primary-btn pd-primary-btn--full pd-primary-btn--indigo">
            <Icon name="lucide:zap" class="w-4 h-4" />{{ generatingGiftCards ? 'Procesando...' : 'Generar ' + giftCardCount + ' Tarjetas' }}
          </button>
        </div>

        <div class="pd-glass-card pd-gc-batches">
          <div class="pd-card-header">
            <div class="pd-card-header__title"><Icon name="lucide:layers" class="w-4 h-4" style="color:var(--pd-indigo)" />Mis Lotes Generados</div>
            <button @click="fetchMyGiftCardBatches" class="pd-refresh-btn"><Icon name="lucide:refresh-cw" class="w-3.5 h-3.5" />Actualizar</button>
          </div>
          <div v-if="giftCardsLoading" class="pd-loader pd-loader--sm"><div class="pd-spinner"></div></div>
          <div v-else-if="giftCardBatches.length === 0" class="pd-empty-inline">
            <Icon name="lucide:gift" class="w-10 h-10" style="opacity:.3" /><p>Aún no has generado ningún lote.</p>
          </div>
          <div v-else class="pd-table-wrap">
            <table class="pd-table">
              <thead>
                <tr>
                  <th>Lote</th><th class="text-center">Total</th><th class="text-center">Disponibles</th><th class="text-center">Usados</th><th>Valor/c</th><th>Fecha</th><th class="text-right">Exportar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="batch in giftCardBatches" :key="batch.batchReference">
                  <td>
                    <span class="pd-table__mono">{{ batch.batchReference }}</span>
                    <span :class="['pd-batch-badge', !batch.paid ? 'pd-batch-badge--pending' : batch.active === 0 ? 'pd-batch-badge--depleted' : 'pd-batch-badge--active']">
                      {{ !batch.paid ? 'Pendiente' : batch.active === 0 ? 'Agotado' : 'En uso' }}
                    </span>
                  </td>
                  <td class="text-center pd-table__bold">{{ batch.total }}</td>
                  <td class="text-center"><span class="pd-pill pd-pill--green">{{ batch.active }}</span></td>
                  <td class="text-center"><span class="pd-pill pd-pill--gray">{{ batch.used }}</span></td>
                  <td class="pd-table__muted">${{ Number(batch.amount).toLocaleString('es-CO') }}</td>
                  <td class="pd-table__date">{{ formatBatchDate(batch.createdAt) }}</td>
                  <td class="text-right">
                    <div class="pd-table-actions">
                      <button @click="viewBatchCodes(batch.batchReference)" class="pd-mini-btn pd-mini-btn--blue"><Icon name="lucide:eye" class="w-3 h-3" />Ver</button>
                      <button @click="downloadBatchExcel(batch.batchReference)" class="pd-mini-btn pd-mini-btn--green"><Icon name="lucide:file-spreadsheet" class="w-3 h-3" />Excel</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL: BATCH CODES -->
    <Transition name="fade">
      <div v-if="showBatchModal" class="pd-modal-backdrop" @click.self="showBatchModal = false">
        <div class="pd-modal pd-modal--lg">
          <div class="pd-modal__header">
            <h3>Códigos del Lote: <span class="pd-modal__mono">{{ selectedBatchRef }}</span></h3>
            <button @click="showBatchModal = false" class="pd-icon-btn"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <div class="pd-modal__body pd-modal__body--scroll">
            <div v-if="loadingBatchCodes" class="pd-loader pd-loader--sm"><div class="pd-spinner"></div></div>
            <div v-else class="pd-codes-grid">
              <div v-for="card in selectedBatchCodes" :key="card.id" :class="['pd-code-card', !card.active && 'pd-code-card--used']">
                <div>
                  <p class="pd-code-card__code" :class="card.delivered && 'pd-code-card__code--struck'">{{ card.code }}</p>
                  <p :class="['pd-code-card__status', card.active ? 'pd-code-card__status--ok' : 'pd-code-card__status--dim']">
                    {{ card.active ? 'Disponible' : (card.claimedBy ? 'Reclamado por ' + card.claimedBy.username : 'Inactivo') }}
                  </p>
                </div>
                <div class="pd-code-card__actions">
                  <label v-if="card.active" class="pd-code-card__checkbox"><input type="checkbox" :checked="card.delivered" @change="toggleDelivered(card)" />Entregado</label>
                  <NuxtLink v-if="card.active" :to="'/gift/' + card.code" target="_blank" class="pd-icon-btn pd-icon-btn--sm pd-icon-btn--indigo"><Icon name="lucide:external-link" class="w-3.5 h-3.5" /></NuxtLink>
                  <button v-if="card.active" @click="shareOnWhatsApp(card.code, card.amount)" class="pd-icon-btn pd-icon-btn--sm pd-icon-btn--wa"><Icon name="lucide:share-2" class="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL: CREATE EVENT -->
    <Transition name="fade">
      <div v-if="showCreateEventModal" class="pd-modal-backdrop" @click.self="showCreateEventModal = false">
        <div class="pd-modal">
          <div class="pd-modal__header">
            <h3>{{ $t('dashboard.photographer.create_event') }}</h3>
            <button @click="showCreateEventModal = false" class="pd-icon-btn"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="createEvent" class="pd-modal__body">
            <div class="pd-field">
              <label class="pd-label">{{ $t('dashboard.photographer.event_title') }}</label>
              <input v-model="newEvent.title" type="text" required placeholder="Ej: Boda de Alex &amp; Maria" class="pd-field-input pd-field-input--full" />
            </div>
            <div class="pd-field-row">
              <div class="pd-field">
                <label class="pd-label">{{ $t('dashboard.photographer.event_date') }}</label>
                <input v-model="newEvent.date" type="date" required class="pd-field-input pd-field-input--full" />
              </div>
              <div class="pd-field">
                <label class="pd-label">{{ $t('dashboard.photographer.event_location') }}</label>
                <input v-model="newEvent.location" type="text" required placeholder="Ciudad o Lugar" class="pd-field-input pd-field-input--full" />
              </div>
            </div>
            <div class="pd-field">
              <label class="pd-label">{{ $t('dashboard.photographer.event_description') }}</label>
              <textarea v-model="newEvent.description" rows="3" placeholder="Describe el estilo..." class="pd-field-input pd-field-input--full pd-field-input--textarea"></textarea>
            </div>
            <div class="pd-modal__actions">
              <button type="button" @click="showCreateEventModal = false" class="pd-ghost-btn">{{ $t('common.cancel') }}</button>
              <button type="submit" class="pd-primary-btn">{{ $t('common.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- MODAL: CREATE / EDIT PACKAGE -->
    <Transition name="fade">
      <div v-if="showCreatePackageModal" class="pd-modal-backdrop" @click.self="closePackageModal">
        <div class="pd-modal">
          <div class="pd-modal__header">
            <h3>{{ editingPackage ? $t('dashboard.photographer.edit_package') : $t('dashboard.photographer.create_package') }}</h3>
            <button @click="closePackageModal" class="pd-icon-btn"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="savePackage" class="pd-modal__body">
            <div class="pd-field">
              <label class="pd-label">{{ $t('dashboard.photographer.pkg_name') }}</label>
              <input v-model="newPackage.name" type="text" required placeholder='Ej: "Pack Básico"' class="pd-field-input pd-field-input--full" />
            </div>
            <div class="pd-field-row">
              <div class="pd-field">
                <label class="pd-label">{{ $t('dashboard.photographer.pkg_photos') }}</label>
                <input v-model.number="newPackage.photoCount" type="number" min="1" required class="pd-field-input pd-field-input--full" />
              </div>
              <div class="pd-field">
                <label class="pd-label">{{ $t('dashboard.photographer.pkg_price') }} (COP)</label>
                <input v-model.number="newPackage.price" type="number" min="0" step="100" required class="pd-field-input pd-field-input--full" />
              </div>
            </div>
            <div class="pd-field">
              <label class="pd-label">{{ $t('dashboard.photographer.pkg_event') }}</label>
              <div class="pd-select-wrap">
                <Icon name="lucide:chevron-down" class="pd-select-arrow" />
                <select v-model="newPackage.eventId" class="pd-select">
                  <option :value="null">{{ $t('dashboard.photographer.all_events') }}</option>
                  <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
                </select>
              </div>
            </div>
            <div class="pd-field">
              <label class="pd-label">{{ $t('dashboard.photographer.pkg_desc') }}</label>
              <textarea v-model="newPackage.description" rows="2" placeholder="Opcional..." class="pd-field-input pd-field-input--full pd-field-input--textarea"></textarea>
            </div>
            <div class="pd-pkg-preview">
              <span class="pd-pkg-preview__badge">{{ newPackage.photoCount || 0 }} {{ (newPackage.photoCount || 0) === 1 ? 'foto' : 'fotos' }}</span>
              <h4 class="pd-pkg-preview__name">{{ newPackage.name || 'Nombre del Paquete' }}</h4>
              <div class="pd-pkg-preview__price">
                <span>${{ formatPrice(newPackage.price) }}</span>
                <small>COP</small>
              </div>
            </div>
            <div class="pd-modal__actions">
              <button type="button" @click="closePackageModal" class="pd-ghost-btn">{{ $t('common.cancel') }}</button>
              <button type="submit" class="pd-primary-btn">{{ editingPackage ? $t('common.save') : $t('dashboard.photographer.create_package') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Quick Upload Modal -->
    <Transition name="fade">
      <div v-if="showQuickUploadModal" class="pd-modal-backdrop" @click.self="showQuickUploadModal = false">
        <div class="pd-modal">
          <div class="pd-modal__header">
            <h3>Upload to: {{ quickUploadEvent?.title }}</h3>
            <button @click="showQuickUploadModal = false" class="pd-icon-btn"><Icon name="lucide:x" class="w-5 h-5" /></button>
          </div>
          <div class="pd-modal__body">
            <p class="pd-modal__text">Redirecting to event page...</p>
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
import { useNotificationsStore } from '~/stores/notifications'

const { $api } = useNuxtApp()
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const packagesStore = usePackagesStore()
const photosStore = usePhotosStore()
const notifStore = useNotificationsStore()
const { confirm } = useConfirm()
const toast = useToast()

const activeTab = ref('events')
const fileInput = ref(null)
const uploadInput = ref(null)
const uploading = ref(false)

const dashboardData = ref(null)
const dashboardLoading = ref(false)

async function fetchDashboardData() {
  dashboardLoading.value = true
  try {
    const data = await $api('/users/photographer/dashboard')
    dashboardData.value = data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    toast.error('No se pudo cargar la información del resumen.')
  } finally {
    dashboardLoading.value = false
  }
}

const showCreateEventModal = ref(false)
const newEvent = ref({ title: '', date: new Date().toISOString().split('T')[0], location: '', description: '' })
const searchQuery = ref('')

const showCreatePackageModal = ref(false)
const editingPackage = ref(null)
const newPackage = ref({ name: '', photoCount: 1, price: 5000, eventId: null, description: '' })

const selectedEventId = ref(null)
const defaultPrice = ref(5000)
const selectedFiles = ref([])
const uploadStatus = ref([])
const isUploading = ref(false)

const showQuickUploadModal = ref(false)
const quickUploadEvent = ref(null)

const events = computed(() => eventsStore.myEvents)
const eventsLoading = computed(() => eventsStore.loading)
const myPackages = computed(() => packagesStore.myPackages)
const packagesLoading = computed(() => packagesStore.loading)
const totalPhotos = computed(() => events.value.reduce((sum, ev) => sum + (ev.photoCount || 0), 0))

const filteredEvents = computed(() => {
  if (!events.value) return []
  if (!searchQuery.value) return events.value
  const q = searchQuery.value.toLowerCase()
  return events.value.filter(e => e.title.toLowerCase().includes(q) || (e.date && e.date.toLowerCase().includes(q)))
})

const { t } = useI18n()

const tabs = computed(() => [
  { key: 'events', icon: 'lucide:calendar', label: t('dashboard.photographer.my_events') },
  { key: 'summary', icon: 'lucide:bar-chart-2', label: t('dashboard.photographer.summary') },
  { key: 'packages', icon: 'lucide:package', label: t('dashboard.photographer.packages') },
  { key: 'upload', icon: 'lucide:upload', label: t('dashboard.photographer.quick_upload') },
  { key: 'studio', icon: 'lucide:sparkles', label: 'Studio Pro' },
  { key: 'giftcards', icon: 'lucide:gift', label: 'Tarjetas de Regalo' },
])

onMounted(async () => {
  if (!authStore.isPhotographer) { router.push('/'); return }
  await Promise.all([walletStore.fetchBalance(), eventsStore.fetchMyEvents(), packagesStore.fetchMyPackages(), fetchDashboardData(), fetchMyGiftCardBatches()])
})

const giftCards = ref([])
const giftCardBatches = ref([])
const giftCardsLoading = ref(false)
const generatingGiftCards = ref(false)
const giftCardAmount = ref(10000)
const giftCardCount = ref(20)
const showBatchModal = ref(false)
const selectedBatchRef = ref('')
const selectedBatchCodes = ref([])
const loadingBatchCodes = ref(false)

async function toggleDelivered(card) {
  try {
    card.delivered = !card.delivered
    await $api(`/giftcards/${card.code}/deliver`, { method: 'PATCH' })
    toast.success('Éxito', `Estado actualizado a ${card.delivered ? 'entregado' : 'no entregado'}.`)
  } catch (err) {
    card.delivered = !card.delivered
    toast.error('Error', 'No se pudo actualizar el estado.')
  }
}

async function fetchMyGiftCardBatches() {
  giftCardsLoading.value = true
  try { giftCardBatches.value = await $api('/giftcards/my-batches') }
  catch (error) { console.error('Error fetching gift card batches:', error) }
  finally { giftCardsLoading.value = false }
}

function formatBatchDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function downloadBatchExcel(batchRef) {
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/giftcards/batch/${batchRef}/export.xlsx`, { headers: { Authorization: `Bearer ${authStore.token}` } })
    if (!response.ok) throw new Error('Error al descargar')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `gift_cards_${batchRef}.xlsx`; a.click()
    URL.revokeObjectURL(url)
  } catch (e) { toast.error('Error', 'No se pudo descargar el Excel: ' + e.message) }
}

async function viewBatchCodes(batchRef) {
  selectedBatchRef.value = batchRef; showBatchModal.value = true; loadingBatchCodes.value = true
  try { const { $api } = useNuxtApp(); selectedBatchCodes.value = await $api(`/giftcards/batch/${batchRef}/cards`) }
  catch (e) { toast.error('Error', 'No se pudieron cargar los códigos.') }
  finally { loadingBatchCodes.value = false }
}

function shareOnWhatsApp(code, amount) {
  const url = `https://www.moments-gallery.com/gift/${code}`
  const message = `¡Hola! Te comparto este código de regalo válido por $${Number(amount).toLocaleString('es-CO')} para comprar fotos. Haz clic aquí para canjearlo: ${url}`
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
}

async function handleGenerateGiftCards() {
  if (giftCardAmount.value < 10000 || giftCardAmount.value > 30000) { toast.error('Monto inválido', 'El monto por tarjeta debe estar entre 10.000 y 30.000 COP.'); return }
  if (giftCardCount.value < 1) { toast.error('Cantidad inválida', 'Debe generar al menos 1 tarjeta.'); return }
  generatingGiftCards.value = true
  try {
    const WidgetCheckoutClass = await getWompiWidget()
    if (!WidgetCheckoutClass) { toast.error('Error de pasarela', 'La pasarela de pago Wompi no se pudo cargar.'); generatingGiftCards.value = false; return }
    const data = await $api('/giftcards/photographer/prepare-generation', { method: 'POST', body: { amountPerCard: giftCardAmount.value, count: giftCardCount.value } })
    const checkoutOptions = { publicKey: data.publicKey, currency: data.currency, amountInCents: data.amountInCents, reference: data.reference, redirectUrl: window.location.origin + '/payment/success', customerData: { email: data.customerEmail } }
    if (data.signature) checkoutOptions.signature = { integrity: data.signature }
    const checkout = new WidgetCheckoutClass(checkoutOptions)
    checkout.open((res) => { if (res.transaction.status === 'APPROVED') { toast.success('Pago exitoso', 'Las tarjetas de regalo se están activando.'); fetchMyGiftCardBatches() } })
  } catch (error) { toast.error('Error', error.response?._data?.error || 'No se pudo iniciar la generación de tarjetas.') }
  finally { generatingGiftCards.value = false }
}

async function createEvent() {
  try {
    const success = await eventsStore.createEvent(newEvent.value)
    if (success) {
      toast.success('Evento creado'); showCreateEventModal.value = false
      newEvent.value = { title: '', date: new Date().toISOString().split('T')[0], location: '', description: '' }
    } else { toast.error('Failed to create event.') }
  } catch (e) { console.error('Failed to create event', e) }
}

function goToEvent(id) { router.push(`/dashboard/photographer/events/${id}`) }
function quickUpload(event) { router.push(`/dashboard/photographer/events/${event.id}`) }

function editPackage(pkg) {
  editingPackage.value = pkg
  newPackage.value = { name: pkg.name, photoCount: pkg.photoCount, price: pkg.price || 0, eventId: pkg.eventId || null, description: pkg.description || '' }
  showCreatePackageModal.value = true
}

function closePackageModal() {
  showCreatePackageModal.value = false; editingPackage.value = null
  newPackage.value = { name: '', photoCount: 1, price: 5000, eventId: null, description: '' }
}

async function savePackage() {
  try {
    if (editingPackage.value) {
      const result = await packagesStore.updatePackage(editingPackage.value.id, newPackage.value)
      if (!result) { toast.error('Failed to update package'); return }
      toast.success('Paquete actualizado')
    } else {
      const result = await packagesStore.createPackage(newPackage.value)
      if (!result) { toast.error('Failed to create package'); return }
      toast.success('Paquete creado')
    }
    closePackageModal()
  } catch (e) { console.error(e) }
}

async function confirmDeletePackage(pkg) {
  const ok = await confirm({ title: '¿Eliminar paquete?', message: `¿Estás seguro de que quieres eliminar el paquete "${pkg.name}"?` })
  if (ok) { await packagesStore.deletePackage(pkg.id) }
}

function formatPrice(price) {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('es-CO')
}

function handleFileSelect(e) { addFiles(Array.from(e.target.files)) }
function handleDrop(e) { if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files)) }

function addFiles(files) {
  const rawExtensions = ['.jpg','.jpeg','.png','.webp','.cr3','.cr2','.dng','.raw','.nef','.arw']
  const validFiles = files.filter(f => { const isImageMime = f.type && f.type.startsWith('image/'); const ext = f.name.includes('.') ? f.name.substring(f.name.lastIndexOf('.')).toLowerCase() : ''; return isImageMime || rawExtensions.includes(ext) })
  selectedFiles.value = [...selectedFiles.value, ...validFiles]
  uploadStatus.value = new Array(selectedFiles.value.length).fill(null)
}

function removeFile(index) { selectedFiles.value.splice(index, 1); uploadStatus.value.splice(index, 1) }

async function uploadFiles() {
  if (selectedFiles.value.length === 0 || !selectedEventId.value) return
  isUploading.value = true
  for (let i = 0; i < selectedFiles.value.length; i++) {
    if (uploadStatus.value[i]) continue
    uploadStatus.value[i] = 'uploading'
    try { const result = await photosStore.uploadPhoto(selectedEventId.value, selectedFiles.value[i], defaultPrice.value); uploadStatus.value[i] = result ? 'done' : 'error' }
    catch (e) { uploadStatus.value[i] = 'error' }
  }
  isUploading.value = false
  const newFiles = [], newStatus = []
  for (let i = 0; i < selectedFiles.value.length; i++) { if (uploadStatus.value[i] === 'error') { newFiles.push(selectedFiles.value[i]); newStatus.push(uploadStatus.value[i]) } }
  selectedFiles.value = newFiles; uploadStatus.value = newStatus
}

async function onFileSelected(event) {
  const file = event.target.files[0]; if (!file) return
  uploading.value = true
  try {
    const formData = new FormData(); formData.append('file', file)
    const res = await $api('/photos/upload-public', { method: 'POST', body: formData })
    const photoUrl = res.url
    await $api('/users/profile-photo', { method: 'PUT', body: photoUrl })
    authStore.user.profilePhotoUrl = photoUrl
    toast.success('Foto de perfil actualizada')
  } catch (e) { toast.error('Upload failed.') }
  finally { uploading.value = false }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --pd-bg: #09090f;
  --pd-surface: rgba(255,255,255,0.04);
  --pd-surface-hover: rgba(255,255,255,0.07);
  --pd-border: rgba(255,255,255,0.07);
  --pd-border-strong: rgba(255,255,255,0.12);
  --pd-text: #eef0f6;
  --pd-text-muted: #7d8899;
  --pd-text-dim: #3d4554;
  --pd-green: #3ef4a1;
  --pd-blue: #60a5fa;
  --pd-purple: #a78bfa;
  --pd-indigo: #818cf8;
  --pd-orange: #fb923c;
  --pd-rose: #fb7185;
  --pd-radius: 16px;
  --pd-radius-sm: 10px;
}

.pd-root {
  font-family: 'Inter', system-ui, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 40px;
  min-height: calc(100vh - 60px);
  background: var(--pd-bg);
  color: var(--pd-text);
  position: relative;
  overflow-x: hidden;
}

/* ORBS */
.pd-orb { position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
.pd-orb--1 { width: 600px; height: 600px; top: -200px; left: -250px; background: radial-gradient(circle, rgba(62,244,161,0.05) 0%, transparent 70%); animation: orbDrift 22s ease-in-out infinite alternate; }
.pd-orb--2 { width: 450px; height: 450px; top: 50%; right: -150px; background: radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%); animation: orbDrift 27s ease-in-out infinite alternate-reverse; }
.pd-orb--3 { width: 350px; height: 350px; bottom: 0; left: 35%; background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%); animation: orbDrift 19s ease-in-out infinite alternate; }
.pd-root > * { position: relative; z-index: 1; }

/* COMPACT HERO */
.pd-hero { padding: 12px 0 10px; border-bottom: 1px solid var(--pd-border); }
.pd-hero__inner { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.pd-hero__left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.pd-hero__profile { display: flex; flex-direction: column; gap: 2px; }
.pd-hero__top-row { display: flex; align-items: center; gap: 8px; }
.pd-hero__name { font-size: 16px; font-weight: 800; letter-spacing: -0.02em; background: linear-gradient(135deg, #eef0f6 30%, var(--pd-green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.pd-badge { font-size: 8px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; }
.pd-badge--pro { background: linear-gradient(135deg, var(--pd-indigo), var(--pd-purple)); color: white; box-shadow: 0 0 12px rgba(129,140,248,0.3); }

.pd-compact-stats { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--pd-text-muted); }
.pd-compact-stats strong { color: var(--pd-text); font-weight: 700; }
.pd-compact-dot { color: var(--pd-text-dim); }

.pd-hero__actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pd-wallet-chip { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: rgba(62,244,161,0.08); border: 1px solid rgba(62,244,161,0.22); border-radius: 14px; font-size: 12px; font-weight: 700; color: var(--pd-green); }
.pd-action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: var(--pd-surface); border: 1px solid var(--pd-border-strong); border-radius: 14px; font-size: 12px; font-weight: 600; color: var(--pd-text-muted); cursor: pointer; transition: all 0.2s ease; }
.pd-action-btn:hover { background: var(--pd-surface-hover); color: var(--pd-text); border-color: rgba(255,255,255,0.2); }
.pd-action-btn--studio { background: linear-gradient(135deg, rgba(62,244,161,0.08), rgba(129,140,248,0.1)); border-color: rgba(129,140,248,0.25); color: var(--pd-text); }
.pd-action-btn--studio:hover { background: linear-gradient(135deg, rgba(62,244,161,0.15), rgba(129,140,248,0.18)); box-shadow: 0 0 20px rgba(129,140,248,0.2); }
.pd-action-btn--create { background: var(--pd-green); color: #0a0c10; font-weight: 700; border-color: var(--pd-green); }
.pd-action-btn--create:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(62,244,161,0.35); }

/* AVATAR */
.pd-avatar { position: relative; cursor: pointer; flex-shrink: 0; }
.pd-avatar__ring { width: 44px; height: 44px; border-radius: 50%; background: conic-gradient(var(--pd-green), var(--pd-indigo), var(--pd-purple), var(--pd-green)); padding: 2px; transition: transform 0.3s ease, box-shadow 0.3s ease; flex-shrink: 0; }
.pd-avatar:hover .pd-avatar__ring { transform: scale(1.06); box-shadow: 0 0 20px rgba(62,244,161,0.35); }
.pd-avatar__img-wrap { width: 100%; height: 100%; border-radius: 50%; background: #12151c; padding: 2px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.pd-avatar__img-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.pd-avatar__placeholder { width: 22px; height: 22px; color: var(--pd-text-dim); }
.pd-avatar__overlay { position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; color: white; opacity: 0; transition: opacity 0.25s ease; }
.pd-avatar:hover .pd-avatar__overlay { opacity: 1; }

/* TABS */
.pd-tabs { border-bottom: 1px solid var(--pd-border); overflow-x: auto; scrollbar-width: none; }
.pd-tabs::-webkit-scrollbar { display: none; }
.pd-tabs__track { display: flex; min-width: max-content; }
.pd-tab { position: relative; display: flex; align-items: center; gap: 6px; padding: 11px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--pd-text-dim); border: none; background: none; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.pd-tab::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--pd-green); border-radius: 2px 2px 0 0; transform: scaleX(0); transition: transform 0.25s ease; }
.pd-tab:hover { color: var(--pd-text-muted); }
.pd-tab--active { color: var(--pd-text); }
.pd-tab--active::after { transform: scaleX(1); }
.pd-tab__icon { width: 13px; height: 13px; }
.pd-tab__dot { width: 5px; height: 5px; border-radius: 50%; background: var(--pd-green); box-shadow: 0 0 6px var(--pd-green); animation: pulse 2s ease-in-out infinite; }

/* SECTION */
.pd-section { padding-top: 16px; animation: fadeUp 0.3s ease; }
.pd-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.pd-section-title { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: var(--pd-text); }
.pd-section-subtitle { font-size: 12px; color: var(--pd-text-muted); margin-top: 2px; }
.pd-section-header__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* GLASS CARD */
.pd-glass-card { background: var(--pd-surface); border: 1px solid var(--pd-border); border-radius: var(--pd-radius); overflow: hidden; backdrop-filter: blur(12px); transition: border-color 0.2s ease; }
.pd-glass-card:hover { border-color: var(--pd-border-strong); }
.pd-glass-card--wide { grid-column: span 2; }
.pd-card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--pd-border); }
.pd-card-header__title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--pd-text); }

/* KPI */
.pd-summary { display: flex; flex-direction: column; gap: 18px; }
.pd-kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.pd-kpi { position: relative; display: flex; align-items: center; gap: 16px; padding: 22px; background: var(--pd-surface); border: 1px solid var(--pd-border); border-radius: var(--pd-radius); overflow: hidden; transition: transform 0.25s ease, border-color 0.25s ease; }
.pd-kpi:hover { transform: translateY(-3px); border-color: var(--pd-border-strong); }
.pd-kpi__icon-wrap { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pd-kpi__icon { width: 22px; height: 22px; }
.pd-kpi__body { display: flex; flex-direction: column; }
.pd-kpi__label { font-size: 11px; font-weight: 600; color: var(--pd-text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.pd-kpi__value { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; color: var(--pd-text); }
.pd-kpi--green .pd-kpi__icon-wrap { background: rgba(62,244,161,0.1); color: var(--pd-green); }
.pd-kpi--blue .pd-kpi__icon-wrap { background: rgba(96,165,250,0.1); color: var(--pd-blue); }
.pd-kpi--purple .pd-kpi__icon-wrap { background: rgba(167,139,250,0.1); color: var(--pd-purple); }
.pd-kpi--orange .pd-kpi__icon-wrap { background: rgba(251,146,60,0.1); color: var(--pd-orange); }
.pd-kpi--indigo .pd-kpi__icon-wrap { background: rgba(129,140,248,0.1); color: var(--pd-indigo); }
.pd-kpi--rose .pd-kpi__icon-wrap { background: rgba(251,113,133,0.1); color: var(--pd-rose); }
.pd-kpi__glow { position: absolute; top: 0; left: 0; right: 0; height: 1px; opacity: 0; transition: opacity 0.3s ease; }
.pd-kpi:hover .pd-kpi__glow { opacity: 1; }
.pd-kpi__glow--green { background: linear-gradient(90deg, transparent, var(--pd-green), transparent); }
.pd-kpi__glow--blue { background: linear-gradient(90deg, transparent, var(--pd-blue), transparent); }
.pd-kpi__glow--purple { background: linear-gradient(90deg, transparent, var(--pd-purple), transparent); }
.pd-kpi__glow--orange { background: linear-gradient(90deg, transparent, var(--pd-orange), transparent); }
.pd-kpi__glow--indigo { background: linear-gradient(90deg, transparent, var(--pd-indigo), transparent); }
.pd-kpi__glow--rose { background: linear-gradient(90deg, transparent, var(--pd-rose), transparent); }

/* SUMMARY COLS */
.pd-summary-cols { display: grid; grid-template-columns: 1fr minmax(260px, 330px); gap: 18px; align-items: start; }

/* TABLE */
.pd-table-wrap { overflow-x: auto; }
.pd-table { width: 100%; border-collapse: collapse; }
.pd-table thead tr { border-bottom: 1px solid var(--pd-border); }
.pd-table th { padding: 12px 16px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pd-text-muted); text-align: left; white-space: nowrap; }
.pd-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s ease; }
.pd-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.pd-table td { padding: 12px 16px; font-size: 13px; vertical-align: middle; white-space: nowrap; }
.pd-table__thumb { width: 44px; height: 44px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--pd-border); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.pd-table__thumb img { width: 100%; height: 100%; object-fit: cover; }
.pd-table__bold { font-weight: 600; color: var(--pd-text); }
.pd-table__muted { color: var(--pd-text-muted); }
.pd-table__earn { color: var(--pd-green); font-weight: 700; }
.pd-table__date { color: var(--pd-text-dim); font-size: 11px; }
.pd-table__mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: var(--pd-indigo); font-weight: 700; }
.pd-batch-badge { margin-left: 8px; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.pd-batch-badge--pending { background: rgba(251,146,60,0.12); color: var(--pd-orange); }
.pd-batch-badge--active { background: rgba(96,165,250,0.12); color: var(--pd-blue); }
.pd-batch-badge--depleted { background: rgba(255,255,255,0.05); color: var(--pd-text-dim); }
.pd-pill { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.pd-pill--green { background: rgba(62,244,161,0.1); color: var(--pd-green); }
.pd-pill--gray { background: rgba(255,255,255,0.05); color: var(--pd-text-muted); }
.pd-table-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }

/* TOP EVENTS */
.pd-top-events { display: flex; flex-direction: column; }
.pd-top-event { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--pd-border); cursor: pointer; transition: background 0.2s ease; }
.pd-top-event:last-child { border-bottom: none; }
.pd-top-event:hover { background: rgba(255,255,255,0.03); }
.pd-top-event__rank { font-size: 11px; font-weight: 800; color: var(--pd-text-dim); width: 22px; flex-shrink: 0; }
.pd-top-event__info { flex: 1; min-width: 0; }
.pd-top-event__info h4 { font-size: 13px; font-weight: 700; color: var(--pd-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pd-top-event__info span { font-size: 11px; color: var(--pd-text-muted); }
.pd-top-event__right { text-align: right; flex-shrink: 0; }
.pd-top-event__sales { display: block; font-size: 11px; color: var(--pd-text-muted); }
.pd-top-event__earn { font-size: 14px; font-weight: 800; color: var(--pd-green); }

/* BUTTONS */
.pd-primary-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: linear-gradient(135deg, #1c1c24, #2a2a35); border: 1px solid rgba(255,255,255,0.13); border-radius: var(--pd-radius-sm); font-size: 13px; font-weight: 700; color: var(--pd-text); cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.pd-primary-btn:hover { background: linear-gradient(135deg, #28283a, #373748); border-color: rgba(255,255,255,0.22); transform: translateY(-1px); box-shadow: 0 4px 18px rgba(0,0,0,0.35); }
.pd-primary-btn:active { transform: scale(0.97); }
.pd-primary-btn--full { width: 100%; justify-content: center; padding: 14px; margin-top: 16px; }
.pd-primary-btn--indigo { background: linear-gradient(135deg, #3730a3, #6366f1); border-color: rgba(129,140,248,0.28); box-shadow: 0 4px 16px rgba(99,102,241,0.25); }
.pd-primary-btn--indigo:hover { background: linear-gradient(135deg, #4338ca, #818cf8); box-shadow: 0 6px 24px rgba(99,102,241,0.4); }
.pd-ghost-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: transparent; border: 1px solid var(--pd-border-strong); border-radius: var(--pd-radius-sm); font-size: 13px; font-weight: 600; color: var(--pd-text-muted); cursor: pointer; transition: all 0.2s ease; }
.pd-ghost-btn:hover { background: var(--pd-surface-hover); color: var(--pd-text); }
.pd-icon-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--pd-border); background: var(--pd-surface); color: var(--pd-text-muted); cursor: pointer; transition: all 0.2s ease; }
.pd-icon-btn:hover { background: var(--pd-surface-hover); color: var(--pd-text); border-color: var(--pd-border-strong); }
.pd-icon-btn--sm { width: 30px; height: 30px; }
.pd-icon-btn--danger:hover { background: rgba(251,113,133,0.12); color: var(--pd-rose); border-color: rgba(251,113,133,0.28); }
.pd-icon-btn--indigo { background: rgba(129,140,248,0.08); color: var(--pd-indigo); border-color: rgba(129,140,248,0.18); }
.pd-icon-btn--indigo:hover { background: rgba(129,140,248,0.18); }
.pd-icon-btn--wa { background: rgba(37,211,102,0.08); color: #25d366; border-color: rgba(37,211,102,0.18); }
.pd-icon-btn--wa:hover { background: rgba(37,211,102,0.18); }
.pd-mini-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s ease; }
.pd-mini-btn--blue { background: rgba(96,165,250,0.1); color: var(--pd-blue); }
.pd-mini-btn--blue:hover { background: rgba(96,165,250,0.2); }
.pd-mini-btn--green { background: rgba(62,244,161,0.1); color: var(--pd-green); }
.pd-mini-btn--green:hover { background: rgba(62,244,161,0.2); }
.pd-refresh-btn { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--pd-indigo); background: none; border: none; cursor: pointer; transition: color 0.2s ease; }
.pd-refresh-btn:hover { color: var(--pd-purple); }

/* SEARCH */
.pd-search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 320px; }
.pd-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--pd-text-dim); pointer-events: none; }
.pd-search-input { width: 100%; padding: 9px 14px 9px 36px; background: var(--pd-surface); border: 1px solid var(--pd-border); border-radius: var(--pd-radius-sm); font-size: 13px; color: var(--pd-text); outline: none; transition: all 0.2s ease; }
.pd-search-input::placeholder { color: var(--pd-text-dim); }
.pd-search-input:focus { border-color: rgba(255,255,255,0.18); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }

/* EVENT CARDS */
.pd-events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.pd-event-card { background: var(--pd-surface); border: 1px solid var(--pd-border); border-radius: var(--pd-radius); overflow: hidden; cursor: pointer; transition: all 0.3s ease; }
.pd-event-card:hover { border-color: var(--pd-border-strong); transform: translateY(-5px); box-shadow: 0 18px 48px rgba(0,0,0,0.45); }
.pd-event-card__cover { position: relative; aspect-ratio: 16/10; background: linear-gradient(135deg, #1a1d24, #12151c); overflow: hidden; }
.pd-event-card__cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.pd-event-card:hover .pd-event-card__cover img { transform: scale(1.08); }
.pd-event-card__cover-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: var(--pd-text-dim); }
.pd-event-card__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center; gap: 8px; opacity: 0; transition: all 0.3s ease; }
.pd-event-card:hover .pd-event-card__overlay { background: rgba(0,0,0,0.45); opacity: 1; }
.pd-event-card__body { padding: 18px 20px 20px; }
.pd-event-card__date { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--pd-green); margin-bottom: 8px; }
.pd-event-card__title { font-size: 16px; font-weight: 700; color: var(--pd-text); margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color 0.2s ease; }
.pd-event-card:hover .pd-event-card__title { color: var(--pd-green); }
.pd-event-card__location { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--pd-text-muted); }

/* PACKAGE CARDS */
.pd-packages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.pd-pkg-card { background: var(--pd-surface); border: 1px solid var(--pd-border); border-radius: var(--pd-radius); overflow: hidden; transition: all 0.3s ease; }
.pd-pkg-card:hover { border-color: var(--pd-border-strong); transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.35); }
.pd-pkg-card__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 0; }
.pd-pkg-card__count-wrap { display: flex; align-items: baseline; gap: 6px; }
.pd-pkg-card__count { font-size: 42px; font-weight: 900; background: linear-gradient(135deg, var(--pd-green), var(--pd-indigo)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.pd-pkg-card__count-unit { font-size: 13px; font-weight: 600; color: var(--pd-text-muted); }
.pd-pkg-card__actions { display: flex; gap: 4px; }
.pd-pkg-card__body { padding: 12px 20px; }
.pd-pkg-card__name { font-size: 15px; font-weight: 700; color: var(--pd-text); margin-bottom: 4px; }
.pd-pkg-card__desc { font-size: 12px; color: var(--pd-text-muted); margin-bottom: 8px; }
.pd-pkg-card__event { display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: var(--pd-indigo); text-transform: uppercase; letter-spacing: 0.06em; }
.pd-pkg-card__event--global { color: var(--pd-text-dim); }
.pd-pkg-card__footer { padding: 14px 20px; border-top: 1px solid var(--pd-border); display: flex; align-items: baseline; gap: 5px; }
.pd-pkg-card__price { font-size: 22px; font-weight: 800; color: var(--pd-text); }
.pd-pkg-card__currency { font-size: 11px; font-weight: 700; color: var(--pd-text-dim); }

/* UPLOAD */
.pd-upload-wrap { display: flex; flex-direction: column; gap: 20px; }
.pd-upload-zone-wrap { animation: fadeUp 0.3s ease; display: flex; flex-direction: column; gap: 16px; }
.pd-price-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; }
.pd-price-input { display: flex; align-items: center; gap: 4px; font-weight: 700; color: var(--pd-text); }
.pd-price-input input { width: 80px; background: transparent; border: none; font-size: 14px; font-weight: 700; color: var(--pd-text); outline: none; text-align: right; }
.pd-price-input--field { padding: 10px 16px; background: rgba(255,255,255,0.04); border: 1px solid var(--pd-border); border-radius: var(--pd-radius-sm); }
.pd-dropzone { border: 1.5px dashed var(--pd-border-strong); border-radius: var(--pd-radius); padding: 56px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(255,255,255,0.01); }
.pd-dropzone:hover { border-color: rgba(62,244,161,0.4); background: rgba(62,244,161,0.04); }
.pd-dropzone__inner { display: flex; flex-direction: column; align-items: center; }
.pd-dropzone__icon-wrap { width: 64px; height: 64px; border-radius: 50%; background: rgba(62,244,161,0.08); border: 1px solid rgba(62,244,161,0.18); display: flex; align-items: center; justify-content: center; color: var(--pd-green); margin-bottom: 16px; transition: transform 0.3s ease; }
.pd-dropzone:hover .pd-dropzone__icon-wrap { transform: scale(1.1); box-shadow: 0 0 22px rgba(62,244,161,0.2); }
.pd-dropzone__title { font-size: 15px; font-weight: 700; color: var(--pd-text); margin-bottom: 6px; }
.pd-dropzone__sub { font-size: 12px; color: var(--pd-text-dim); }
.pd-file-list { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
.pd-file-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--pd-surface); border: 1px solid var(--pd-border); border-radius: var(--pd-radius-sm); }
.pd-file-item__info { display: flex; align-items: center; gap: 12px; }
.pd-file-item__thumb { width: 38px; height: 38px; background: rgba(255,255,255,0.04); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--pd-text-dim); }
.pd-file-item__name { font-size: 13px; font-weight: 600; color: var(--pd-text); max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pd-file-item__status { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 2px; }
.pd-file-item__status--ready { color: var(--pd-text-dim); }
.pd-file-item__status--uploading { color: var(--pd-indigo); }
.pd-file-item__status--done { color: var(--pd-green); }
.pd-file-item__status--error { color: var(--pd-rose); }

/* GIFT CARDS */
.pd-giftcard-layout { display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start; }
.pd-gc-form { padding: 28px; display: flex; flex-direction: column; gap: 20px; }
.pd-gc-form__title { font-size: 16px; font-weight: 700; color: var(--pd-text); }
.pd-gc-batches { min-height: 300px; }
.pd-gc-summary { background: rgba(129,140,248,0.05); border: 1px solid rgba(129,140,248,0.14); border-radius: var(--pd-radius-sm); padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.pd-gc-summary__row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; color: var(--pd-text-muted); }
.pd-gc-summary__row--total { padding-top: 8px; border-top: 1px solid rgba(129,140,248,0.18); font-size: 14px; color: var(--pd-indigo); font-weight: 800; }

/* FORM */
.pd-label { display: block; font-size: 10px; font-weight: 700; color: var(--pd-text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
.pd-field { display: flex; flex-direction: column; }
.pd-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pd-field-hint { font-size: 11px; color: var(--pd-text-dim); margin-top: 6px; }
.pd-field-input { padding: 11px 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--pd-border); border-radius: var(--pd-radius-sm); font-size: 14px; color: var(--pd-text); outline: none; transition: all 0.2s ease; }
.pd-field-input::placeholder { color: var(--pd-text-dim); }
.pd-field-input:focus { border-color: rgba(255,255,255,0.18); box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
.pd-field-input--full { width: 100%; box-sizing: border-box; }
.pd-field-input--textarea { resize: none; }
.pd-select-wrap { position: relative; }
.pd-select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--pd-text-dim); pointer-events: none; }
.pd-select { width: 100%; padding: 11px 36px 11px 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--pd-border); border-radius: var(--pd-radius-sm); font-size: 14px; color: var(--pd-text); cursor: pointer; outline: none; appearance: none; transition: all 0.2s ease; }
.pd-select:focus { border-color: rgba(255,255,255,0.18); }
.pd-select option { background: #1a1d24; }

/* PACKAGE PREVIEW */
.pd-pkg-preview { padding: 20px; background: linear-gradient(135deg, rgba(62,244,161,0.07), rgba(129,140,248,0.07)); border: 1px solid rgba(62,244,161,0.18); border-radius: var(--pd-radius-sm); text-align: center; }
.pd-pkg-preview__badge { display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; background: linear-gradient(135deg, var(--pd-indigo), var(--pd-purple)); color: white; padding: 4px 14px; border-radius: 20px; margin-bottom: 8px; }
.pd-pkg-preview__name { font-size: 16px; font-weight: 700; color: var(--pd-text); margin-bottom: 4px; }
.pd-pkg-preview__price { display: flex; align-items: baseline; justify-content: center; gap: 4px; }
.pd-pkg-preview__price span { font-size: 30px; font-weight: 900; color: var(--pd-green); }
.pd-pkg-preview__price small { font-size: 12px; font-weight: 600; color: var(--pd-text-dim); }

/* EMPTY & LOADER */
.pd-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 72px 24px; text-align: center; gap: 12px; }
.pd-empty__orb { width: 72px; height: 72px; border-radius: 50%; background: var(--pd-surface); border: 1px solid var(--pd-border-strong); display: flex; align-items: center; justify-content: center; color: var(--pd-text-muted); margin-bottom: 4px; }
.pd-empty h3 { font-size: 18px; font-weight: 700; color: var(--pd-text); }
.pd-empty p { font-size: 14px; color: var(--pd-text-muted); }
.pd-empty-inline { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; gap: 10px; color: var(--pd-text-muted); }
.pd-empty-inline p { font-size: 13px; font-weight: 500; }
.pd-loader { display: flex; justify-content: center; padding: 64px; }
.pd-loader--sm { padding: 32px; }
.pd-spinner { width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.07); border-top-color: var(--pd-green); border-radius: 50%; animation: spin 0.7s linear infinite; }

/* MODAL */
.pd-modal-backdrop { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0,0,0,0.72); backdrop-filter: blur(14px); }
.pd-modal { background: #12141e; border: 1px solid var(--pd-border-strong); width: 100%; max-width: 500px; border-radius: var(--pd-radius); box-shadow: 0 28px 90px rgba(0,0,0,0.65); overflow: hidden; animation: scaleUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pd-modal--lg { max-width: 720px; }
.pd-modal__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--pd-border); }
.pd-modal__header h3 { font-size: 17px; font-weight: 700; color: var(--pd-text); }
.pd-modal__mono { font-family: monospace; color: var(--pd-indigo); }
.pd-modal__body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.pd-modal__body--scroll { max-height: 60vh; overflow-y: auto; }
.pd-modal__actions { display: flex; gap: 12px; padding-top: 8px; }
.pd-modal__actions .pd-ghost-btn { flex: 1; justify-content: center; }
.pd-modal__actions .pd-primary-btn { flex: 2; justify-content: center; }
.pd-modal__text { font-size: 14px; color: var(--pd-text-muted); }

/* CODES GRID */
.pd-codes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.pd-code-card { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--pd-border); border-radius: var(--pd-radius-sm); transition: background 0.2s ease; }
.pd-code-card:hover { background: rgba(255,255,255,0.05); }
.pd-code-card--used { opacity: 0.45; }
.pd-code-card__code { font-family: monospace; font-weight: 700; color: var(--pd-text); font-size: 14px; }
.pd-code-card__code--struck { text-decoration: line-through; }
.pd-code-card__status { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }
.pd-code-card__status--ok { color: var(--pd-green); }
.pd-code-card__status--dim { color: var(--pd-text-dim); }
.pd-code-card__actions { display: flex; align-items: center; gap: 6px; }
.pd-code-card__checkbox { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; color: var(--pd-text-muted); cursor: pointer; }

/* ANIMATIONS */
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleUp { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
@keyframes orbDrift { from { transform: translate(0, 0) scale(1); } to { transform: translate(30px, 20px) scale(1.05); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .pd-kpi-grid { grid-template-columns: 1fr 1fr; }
  .pd-summary-cols { grid-template-columns: 1fr; }
  .pd-glass-card--wide { grid-column: span 1; }
  .pd-giftcard-layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .pd-hero { padding: 10px 0 8px; }
  .pd-hero__inner { flex-direction: row; justify-content: space-between; align-items: center; gap: 8px; }
  .pd-hero__left { gap: 10px; }
  .pd-avatar__ring { width: 38px; height: 38px; }
  .pd-hero__name { font-size: 14px; }
  .pd-compact-stats { font-size: 10px; }
  .pd-hero__actions { gap: 6px; }
  .pd-action-btn { padding: 5px 10px; font-size: 11px; }
  .pd-wallet-chip { padding: 5px 10px; font-size: 11px; }
  .pd-tab { padding: 10px 12px; font-size: 10px; }
  .pd-section { padding-top: 12px; }
  .pd-section-header { flex-direction: column; align-items: stretch; gap: 10px; }
  .pd-section-header__actions { flex-direction: row; }
  .pd-search-wrap { max-width: 100%; flex: 1; }
  .pd-kpi-grid { grid-template-columns: 1fr; }
  .pd-events-grid { grid-template-columns: 1fr; }
  .pd-packages-grid { grid-template-columns: 1fr; }
  .pd-field-row { grid-template-columns: 1fr; }
  .pd-codes-grid { grid-template-columns: 1fr; }
}

.hidden { display: none; }
</style>
