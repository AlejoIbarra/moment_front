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
          <p class="text-sm text-gray-500 mb-4 max-w-lg mt-2 whitespace-pre-wrap">{{ authStore.user?.description || 'Professional event photographer capturing your best moments. 📸✨' }}</p>

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

          <!-- Header Actions Bar -->
          <div class="dash-header__actions mt-4 flex items-center gap-2 flex-wrap">
            <!-- Moments PRO Status / Activation Pill -->
            <div 
              v-if="authStore.isPro || authStore.isAdmin" 
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs"
              title="Membresía Moments PRO Activa"
            >
              <Icon name="lucide:crown" class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Moments PRO Activo</span>
            </div>
            <NuxtLink
              v-else
              to="/dashboard/photographer/subscription"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-sm transition-all group"
              title="Desbloquea álbumes privados, entrega personalizada y más por solo $5.000 COP/mes"
            >
              <Icon name="lucide:crown" class="w-3.5 h-3.5 text-yellow-200 group-hover:scale-110 transition-transform" />
              <span>Activar Moments PRO ($5.000/mes)</span>
            </NuxtLink>

            <!-- Wallet Pill -->
            <button
              @click="$router.push('/wallet')"
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs group"
              title="Mi Billetera y Ganancias"
            >
              <div class="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Icon name="lucide:wallet" class="w-2.5 h-2.5" />
              </div>
              <span>${{ walletStore.balance.toFixed(2) }} COP</span>
              <Icon name="lucide:arrow-right" class="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <!-- Ver Mi Perfil Público -->
            <button
              @click="$router.push(`/profile/${authStore.user?.username}`)"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200/80 text-gray-700 transition-all cursor-pointer border border-transparent hover:border-gray-300"
              title="Ver cómo los compradores ven tu perfil"
            >
              <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-gray-500" />
              <span>Ver Vitrina Pública</span>
            </button>

            <!-- Settings Button -->
            <button
              @click="$router.push('/dashboard/photographer/settings')"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200/80 text-gray-700 transition-all cursor-pointer border border-transparent hover:border-gray-300"
              title="Configuración de Cuenta"
            >
              <Icon name="lucide:settings" class="w-3.5 h-3.5 text-gray-500" />
              <span>{{ $t('dashboard.photographer.settings') }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- DASHBOARD NAVIGATION HUB (Centro de Control Pro Sin Scroll) -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <nav class="my-6">
      <div class="flex items-center justify-between mb-3 px-1">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Centro de Mando</span>
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Modo Fotógrafo
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">Explora tus herramientas de venta, entrega y gestión fotográfica</p>
        </div>
      </div>

      <!-- Cuadrícula Adaptativa Sin Scroll: 2 columnas en móvil, 4 columnas en desktop -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          v-for="(tab, index) in allTabs"
          :key="tab.key"
          @click="handleTabClick(tab)"
          :class="[
            'relative rounded-2xl text-left transition-all duration-200 cursor-pointer select-none border group',
            // Mensajes (índice 6) se expande a 2 columnas para equilibrar la cuadrícula tanto en móvil como en desktop
            index === 6
              ? 'col-span-2 p-3.5 sm:p-4 flex flex-row items-center justify-between gap-3'
              : 'col-span-1 p-3 sm:p-4 flex flex-col justify-between min-h-[118px] sm:min-h-[128px]',
            activeTab === tab.key && tab.type !== 'link'
              ? 'bg-slate-950 text-white border-slate-900 shadow-lg shadow-black/15 scale-[1.01] ring-2 ring-emerald-400/40'
              : 'bg-white hover:bg-slate-50/90 text-slate-800 hover:text-black border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
          ]"
        >
          <!-- LAYOUT PARA LOS BOTONES 0-5 (Tarjetas Verticales) -->
          <template v-if="index !== 6">
            <!-- Fila Superior: Ícono + Badge -->
            <div class="flex items-start justify-between gap-1.5 w-full mb-2">
              <div
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs"
                :class="activeTab === tab.key && tab.type !== 'link' ? 'bg-white/15 text-[#3ef4a1]' : tab.iconBg + ' ' + tab.iconColor"
              >
                <Icon :name="tab.icon" class="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              <div class="flex items-center gap-1 flex-shrink-0">
                <span
                  v-if="tab.badge"
                  :class="[
                    'px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold leading-tight flex items-center gap-1',
                    activeTab === tab.key && tab.type !== 'link'
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor
                  ]"
                >
                  {{ tab.badge }}
                </span>

                <span
                  v-if="tab.type === 'link'"
                  class="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  :class="activeTab === tab.key ? 'text-white' : 'text-slate-400 group-hover:text-slate-800'"
                >
                  <Icon name="lucide:arrow-up-right" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </span>
              </div>
            </div>

            <!-- Fila Inferior: Título + Descripción Explicativa -->
            <div class="min-w-0 w-full flex flex-col justify-end">
              <div class="flex items-center gap-1.5 mb-0.5">
                <span
                  class="font-extrabold text-xs sm:text-[13px] tracking-tight truncate"
                  :class="activeTab === tab.key && tab.type !== 'link' ? 'text-white' : 'text-slate-900'"
                >
                  {{ tab.label }}
                </span>
                <span
                  v-if="activeTab === tab.key && tab.type !== 'link'"
                  class="w-1.5 h-1.5 rounded-full bg-[#3ef4a1] flex-shrink-0"
                ></span>
              </div>
              <p
                class="text-[10.5px] sm:text-[11.5px] leading-tight line-clamp-2"
                :class="activeTab === tab.key && tab.type !== 'link' ? 'text-slate-300' : 'text-slate-500'"
              >
                {{ tab.description }}
              </p>
            </div>
          </template>

          <!-- LAYOUT HORIZONTAL PARA MENSAJES (Índice 6 - Col-Span-2 Banner) -->
          <template v-else>
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs"
                :class="activeTab === tab.key && tab.type !== 'link' ? 'bg-white/15 text-[#3ef4a1]' : tab.iconBg + ' ' + tab.iconColor"
              >
                <Icon :name="tab.icon" class="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <span
                    class="font-extrabold text-xs sm:text-[13px] tracking-tight truncate"
                    :class="activeTab === tab.key && tab.type !== 'link' ? 'text-white' : 'text-slate-900'"
                  >
                    {{ tab.label }}
                  </span>
                  <span
                    v-if="activeTab === tab.key && tab.type !== 'link'"
                    class="w-1.5 h-1.5 rounded-full bg-[#3ef4a1] flex-shrink-0"
                  ></span>
                </div>
                <p
                  class="text-[10.5px] sm:text-[11.5px] leading-tight line-clamp-1 sm:line-clamp-2"
                  :class="activeTab === tab.key && tab.type !== 'link' ? 'text-slate-300' : 'text-slate-500'"
                >
                  {{ tab.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0 ml-2">
              <span
                v-if="tab.badge"
                :class="[
                  'px-2 py-0.5 rounded-md text-[10px] font-bold leading-tight flex items-center gap-1',
                  activeTab === tab.key && tab.type !== 'link'
                    ? 'bg-white/20 text-white'
                    : tab.badgeColor
                ]"
              >
                {{ tab.badge }}
              </span>
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                :class="activeTab === tab.key ? 'text-white' : 'text-slate-400 group-hover:text-slate-800'"
              >
                <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
              </span>
            </div>
          </template>
        </button>
      </div>
    </nav>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB: SUMMARY / DASHBOARD                               -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section v-if="activeTab === 'summary'" class="dash-section">
      <h2 class="dash-section__title mb-6">{{ $t('dashboard.photographer.summary') }}</h2>

      <div v-if="dashboardLoading" class="dash-loader">
        <div class="dash-spinner"></div>
      </div>

      <div v-else-if="dashboardData" class="flex flex-col gap-8">
        <!-- Dashboard Core Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <Icon name="lucide:wallet" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-sm text-gray-500 font-medium block">Saldo Disponible</span>
              <span class="text-2xl font-bold text-gray-900">${{ walletStore.balance.toFixed(2) }}</span>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Icon name="lucide:dollar-sign" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-sm text-gray-500 font-medium block">{{ $t('dashboard.photographer.total_earnings') }}</span>
              <span class="text-2xl font-bold text-gray-900">${{ dashboardData.totalEarnings?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <Icon name="lucide:arrow-up-right" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-sm text-gray-500 font-medium block">{{ $t('dashboard.photographer.total_withdrawn') }}</span>
              <span class="text-2xl font-bold text-gray-900">${{ dashboardData.totalWithdrawn?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
        </div>

        <!-- Gift Card Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-4 bg-orange-50 text-orange-600 rounded-xl">
              <Icon name="lucide:gift" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-sm text-gray-500 font-medium block">Códigos Generados (Pagados)</span>
              <span class="text-2xl font-bold text-gray-900">{{ dashboardData.totalGiftCardsGenerated || 0 }}</span>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
              <Icon name="lucide:truck" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-sm text-gray-500 font-medium block">Códigos Entregados</span>
              <span class="text-2xl font-bold text-gray-900">{{ dashboardData.totalGiftCardsDelivered || 0 }}</span>
            </div>
          </div>

          <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-4 bg-rose-50 text-rose-600 rounded-xl">
              <Icon name="lucide:check-circle" class="w-8 h-8" />
            </div>
            <div>
              <span class="text-sm text-gray-500 font-medium block">Códigos Redimidos</span>
              <span class="text-2xl font-bold text-gray-900">{{ dashboardData.totalGiftCardsRedeemed || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent/Sold Photos (Col-span 2) -->
          <div class="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('dashboard.photographer.sold_photos') }}</h3>
            
            <div v-if="dashboardData.soldPhotos && dashboardData.soldPhotos.length > 0" class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-gray-100 text-xs text-gray-400 uppercase font-semibold">
                    <th class="py-3 px-4">{{ $t('dashboard.photographer.photo') }}</th>
                    <th class="py-3 px-4">{{ $t('dashboard.photographer.event') }}</th>
                    <th class="py-3 px-4">{{ $t('dashboard.photographer.buyer') }}</th>
                    <th class="py-3 px-4">{{ $t('dashboard.photographer.price') }}</th>
                    <th class="py-3 px-4">{{ $t('dashboard.photographer.earnings') }}</th>
                    <th class="py-3 px-4">{{ $t('dashboard.photographer.date') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 text-sm">
                  <tr v-for="item in dashboardData.soldPhotos" :key="item.photoId" class="hover:bg-gray-50/50 transition-all">
                    <td class="py-3 px-4">
                      <div class="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                        <img v-if="item.watermarkedUrl" :src="item.watermarkedUrl" alt="Photo" class="w-full h-full object-cover" />
                        <Icon v-else name="lucide:image" class="text-gray-300 w-5 h-5" />
                      </div>
                    </td>
                    <td class="py-3 px-4 font-medium text-gray-800">{{ item.eventTitle }}</td>
                    <td class="py-3 px-4 text-gray-600">@{{ item.buyerUsername }}</td>
                    <td class="py-3 px-4 text-gray-600 font-semibold">${{ item.price?.toFixed(2) }}</td>
                    <td class="py-3 px-4 text-emerald-600 font-semibold">+${{ item.photographerEarnings?.toFixed(2) }}</td>
                    <td class="py-3 px-4 text-xs text-gray-500">{{ item.purchasedAt ? formatColombiaDateTime(item.purchasedAt) : '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="text-center py-12 text-gray-400">
              <Icon name="lucide:camera-off" class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{{ $t('dashboard.photographer.no_sales') }}</p>
            </div>
          </div>

          <!-- Top Events (Col-span 1) -->
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('dashboard.photographer.top_selling_events') }}</h3>
            
            <div v-if="dashboardData.topEvents && dashboardData.topEvents.length > 0" class="flex flex-col gap-4">
              <div v-for="event in dashboardData.topEvents" :key="event.eventId" class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-all cursor-pointer" @click="goToEvent(event.eventId)">
                <div>
                  <h4 class="font-bold text-gray-800 text-sm">{{ event.title }}</h4>
                  <span class="text-xs text-gray-400">{{ event.date }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500 block">{{ event.photosSold }} ventas</span>
                  <span class="text-sm font-extrabold text-emerald-600">+${{ event.totalEarnings?.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12 text-gray-400">
              <Icon name="lucide:calendar-range" class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{{ $t('dashboard.photographer.no_sales') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB: EVENTS                                            -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section v-if="activeTab === 'events'" class="dash-section">
      <div class="dash-section__header flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <h2 class="dash-section__title">{{ $t('dashboard.photographer.my_events') }}</h2>
        <div class="flex flex-1 items-center gap-4">
          <div class="relative flex-1">
            <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('dashboard.photographer.search_events')"
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button @click="showCreateEventModal = true" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap">
            <Icon name="lucide:plus" class="w-4 h-4" />
            {{ $t('dashboard.photographer.create_event') }}
          </button>
        </div>
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
        <button @click="showCreateEventModal = true" class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
          <Icon name="lucide:plus" class="w-4 h-4" />
          {{ $t('dashboard.photographer.create_event') }}
        </button>
      </div>

      <div v-else class="dash-events-grid">
        <div v-for="event in filteredEvents" :key="event.id" class="dash-event-card" @click="goToEvent(event.id)">
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
            <div class="flex items-center justify-between gap-2 mb-1">
              <div class="dash-event-card__date">
                <Icon name="lucide:calendar" class="w-3 h-3" />
                {{ event.date }}
              </div>
              <div class="flex items-center gap-1">
                <span v-if="event.isPrivate" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Icon name="lucide:lock" class="w-2.5 h-2.5" />
                  Privado
                </span>
                <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 flex items-center gap-1">
                  <Icon name="lucide:globe" class="w-2.5 h-2.5" />
                  Público
                </span>
                <span v-if="event.isPrivate && event.allowFreeDownloads" class="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Descarga gratuita sin marca de agua">
                  Sin marca
                </span>
              </div>
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
        <button @click="showCreatePackageModal = true" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95">
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
        <button @click="showCreatePackageModal = true" class="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
          <Icon name="lucide:plus" class="w-4 h-4" />
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
            <p class="dash-dropzone__subtitle">JPG, PNG, Canon RAW (CR3 / CR2), DNG, RAW · {{ $t('dashboard.photographer.high_res') }}</p>
          </div>
          <input type="file" class="hidden" multiple accept="image/jpeg, image/png, image/webp, image/x-canon-cr3, image/cr3, .cr3, .CR3, .cr2, .CR2, .raw, .RAW, .dng, .DNG, .nef, .NEF, .arw, .ARW" ref="uploadInput" @change="handleFileSelect" />
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
    <!-- TAB: GIFT CARDS                                        -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <section v-if="activeTab === 'giftcards'" class="dash-section">
      <!-- Section Header -->
      <div class="dash-section__header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-indigo-600" />
            Sistema de Regalos & Fidelización
          </div>
          <h2 class="dash-section__title text-2xl sm:text-3xl font-black text-gray-900">Generar Tarjetas de Regalo & Cupones 🎁</h2>
          <p class="text-sm text-gray-500 mt-1 max-w-2xl">
            Crea códigos promocionales canjeables para tus clientes. Solo pagas una tarifa fija de <span class="font-bold text-gray-800">$750 COP</span> por cada código generado.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="fetchMyGiftCardBatches" 
            class="px-4 py-2 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5" :class="{'animate-spin': giftCardsLoading}" />
            Actualizar Lotes
          </button>
        </div>
      </div>

      <!-- Sub-Tabs Navigation for Gift Cards -->
      <div class="flex items-center gap-2 mb-8 bg-gray-100/90 p-1.5 rounded-2xl w-fit border border-gray-200/60 shadow-xs">
        <button
          type="button"
          @click="setGiftCardSubTab('create')"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer',
            giftCardSubTab === 'create'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          ]"
        >
          <Icon name="lucide:sparkles" class="w-4 h-4 text-indigo-600" />
          <span>Crear Tarjetas / Cupones</span>
        </button>

        <button
          type="button"
          @click="setGiftCardSubTab('history')"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer',
            giftCardSubTab === 'history'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          ]"
        >
          <Icon name="lucide:layers" class="w-4 h-4" />
          <span>Mis Lotes Generados</span>
          <span 
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-black transition-colors',
              giftCardSubTab === 'history' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ giftCardBatches.length }}
          </span>
        </button>
      </div>

      <!-- SUB-VIEW 1: Interactive Creator Studio & Real-Time Live Preview -->
      <div v-if="giftCardSubTab === 'create'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        
        <!-- Left: Interactive Studio Configurator (7 Cols) -->
        <div class="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div class="border-b border-gray-100 pb-4">
            <h3 class="text-lg font-black text-gray-900 flex items-center gap-2">
              <Icon name="lucide:sliders-horizontal" class="w-5 h-5 text-indigo-600" />
              Configurar Lote
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">Personaliza el tipo de beneficio, las fotos o el saldo y la validez de las tarjetas.</p>
          </div>

          <!-- STEP 1: Tipo de Beneficio -->
          <div class="flex flex-col gap-2.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                Tipo de Beneficio
              </label>
              <span class="text-[11px] font-semibold text-indigo-600">
                {{ giftCardType === 'PHOTOS' ? 'Canje por cantidad de fotos' : 'Cupón de descuento monetario' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Option: Por Fotos -->
              <div 
                @click="giftCardType = 'PHOTOS'"
                :class="[
                  'cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 relative overflow-hidden',
                  giftCardType === 'PHOTOS'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors', giftCardType === 'PHOTOS' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500']">
                  <Icon name="lucide:camera" class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-extrabold text-sm text-gray-900">Por Fotos</span>
                    <span class="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-indigo-100 text-indigo-700">Popular</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5 leading-snug">Canje directo de 5 a 20 fotos digitales en alta calidad.</p>
                </div>
                <div v-if="giftCardType === 'PHOTOS'" class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="lucide:check" class="w-3.5 h-3.5" />
                </div>
              </div>

              <!-- Option: Cupón Saldo ($) -->
              <div 
                @click="giftCardType = 'BALANCE'"
                :class="[
                  'cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 relative overflow-hidden',
                  giftCardType === 'BALANCE'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors', giftCardType === 'BALANCE' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500']">
                  <Icon name="lucide:ticket" class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-extrabold text-sm text-gray-900">Cupón Saldo ($)</span>
                    <span class="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-100 text-amber-800">Descuento</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5 leading-snug">Monto en pesos COP aplicable en el carrito de compras.</p>
                </div>
                <div v-if="giftCardType === 'BALANCE'" class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <Icon name="lucide:check" class="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 2: Beneficio Value Configurator -->
          <!-- IF PHOTOS: Dynamic Stepper + Interactive Range Slider + Quick Presets -->
          <div v-if="giftCardType === 'PHOTOS'" class="bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-100 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                Fotos por Tarjeta
              </label>
              <span class="text-xs font-black text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full border border-indigo-200">
                {{ giftCardPhotoCount }} Fotos c/u
              </span>
            </div>

            <!-- Interactive Stepper -->
            <div class="flex items-center justify-center gap-4 py-2">
              <button
                type="button"
                @click="stepPhotos(-1)"
                :disabled="giftCardPhotoCount <= 5"
                class="w-12 h-12 rounded-2xl bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-600 flex items-center justify-center text-xl font-black shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="lucide:minus" class="w-5 h-5" />
              </button>
              
              <div class="flex flex-col items-center justify-center min-w-[140px] px-3 py-1 bg-white border border-indigo-200 rounded-2xl shadow-xs">
                <input 
                  type="number" 
                  v-model.number="giftCardPhotoCount" 
                  min="5" 
                  max="20"
                  class="w-20 text-center text-3xl font-black text-indigo-600 tracking-tight leading-none bg-transparent focus:outline-none"
                  @change="giftCardPhotoCount = Math.max(5, Math.min(20, giftCardPhotoCount || 5))"
                />
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Fotos Gratis</span>
              </div>

              <button
                type="button"
                @click="stepPhotos(1)"
                :disabled="giftCardPhotoCount >= 20"
                class="w-12 h-12 rounded-2xl bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-600 flex items-center justify-center text-xl font-black shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="lucide:plus" class="w-5 h-5" />
              </button>
            </div>

            <!-- Range Slider -->
            <div class="flex flex-col gap-1.5 px-2">
              <input 
                type="range" 
                min="5" 
                max="20" 
                step="1" 
                v-model.number="giftCardPhotoCount"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              />
              <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>Mín: 5 fotos</span>
                <span>Máx: 20 fotos</span>
              </div>
            </div>

            <!-- Quick Preset Chips -->
            <div class="flex flex-wrap gap-2 pt-1 border-t border-gray-200/60">
              <span class="text-[11px] font-bold text-gray-500 self-center mr-1">Rápido:</span>
              <button
                v-for="preset in [5, 8, 10, 15, 20]"
                :key="preset"
                type="button"
                @click="giftCardPhotoCount = preset"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  giftCardPhotoCount === preset
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                ]"
              >
                {{ preset }} fotos {{ preset === 10 ? '⭐' : preset === 20 ? '(Máx)' : '' }}
              </button>
            </div>
            <p class="text-[11px] text-gray-500">
              El cliente puede redimir las {{ giftCardPhotoCount }} fotos todas juntas o en diferentes compras hasta agotarlas.
            </p>
          </div>

          <!-- IF BALANCE: Stepper + Presets + Input -->
          <div v-else class="bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-100 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">2</span>
                Monto por Cupón ($ COP)
              </label>
              <span class="text-xs font-black text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
                ${{ (giftCardAmount || 0).toLocaleString('es-CO') }} COP
              </span>
            </div>

            <!-- Interactive Stepper -->
            <div class="flex items-center justify-center gap-4 py-2">
              <button
                type="button"
                @click="stepAmount(-5000)"
                :disabled="giftCardAmount <= 5000"
                class="w-12 h-12 rounded-2xl bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-gray-700 hover:text-amber-600 flex items-center justify-center text-xl font-black shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="lucide:minus" class="w-5 h-5" />
              </button>
              
              <div class="relative flex-1 max-w-[200px]">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">$</span>
                <input 
                  type="number" 
                  v-model.number="giftCardAmount" 
                  min="5000" 
                  step="5000"
                  placeholder="20000"
                  class="w-full pl-8 pr-3 py-2.5 text-center text-xl font-black text-gray-900 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              <button
                type="button"
                @click="stepAmount(5000)"
                :disabled="giftCardAmount >= 500000"
                class="w-12 h-12 rounded-2xl bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50 text-gray-700 hover:text-amber-600 flex items-center justify-center text-xl font-black shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="lucide:plus" class="w-5 h-5" />
              </button>
            </div>

            <!-- Quick Preset Chips -->
            <div class="flex flex-wrap gap-2 pt-1 border-t border-gray-200/60">
              <span class="text-[11px] font-bold text-gray-500 self-center mr-1">Preajustes:</span>
              <button
                v-for="preset in [10000, 20000, 30000, 50000, 100000]"
                :key="preset"
                type="button"
                @click="giftCardAmount = preset"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  giftCardAmount === preset 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                ]"
              >
                ${{ (preset / 1000) }}k COP {{ preset === 20000 ? '⭐' : '' }}
              </button>
            </div>
            <p class="text-[11px] text-gray-500">
              El cliente aplicará este saldo como descuento directo en el checkout de compra de fotos.
            </p>
          </div>

          <!-- STEP 3: Ámbito de Validez (Event Restriction) -->
          <div class="flex flex-col gap-2.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                Ámbito de Validez
              </label>
              <span class="text-[11px] font-semibold text-gray-500">
                {{ giftCardScope === 'ALL' ? 'Todos tus eventos' : 'Evento específico' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Option: Todos los eventos -->
              <div
                @click="giftCardScope = 'ALL'; giftCardEventId = ''"
                :class="[
                  'cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3',
                  giftCardScope === 'ALL'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', giftCardScope === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500']">
                  <Icon name="lucide:globe" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-extrabold text-sm text-gray-900">Todos los eventos</p>
                  <p class="text-xs text-gray-500 mt-0.5 leading-tight">Canjeable en cualquier galería de tu perfil.</p>
                </div>
                <div v-if="giftCardScope === 'ALL'" class="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="lucide:check" class="w-3 h-3" />
                </div>
              </div>

              <!-- Option: Un solo evento -->
              <div
                @click="giftCardScope = 'EVENT'; if (!giftCardEventId && events.length) giftCardEventId = events[0].id"
                :class="[
                  'cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3',
                  giftCardScope === 'EVENT'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', giftCardScope === 'EVENT' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500']">
                  <Icon name="lucide:calendar-check" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-extrabold text-sm text-gray-900">Un solo evento</p>
                  <p class="text-xs text-gray-500 mt-0.5 leading-tight">Restringido a un evento exclusivo.</p>
                </div>
                <div v-if="giftCardScope === 'EVENT'" class="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="lucide:check" class="w-3 h-3" />
                </div>
              </div>
            </div>

            <!-- Event selector dropdown if EVENT -->
            <Transition name="fade">
              <div v-if="giftCardScope === 'EVENT'" class="mt-2 p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-col gap-2">
                <label class="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <Icon name="lucide:target" class="w-4 h-4 text-indigo-600" />
                  Selecciona el evento exclusivo:
                </label>
                <select 
                  v-model="giftCardEventId"
                  class="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                >
                  <option value="" disabled>-- Elige un evento de tu lista --</option>
                  <option v-for="ev in events" :key="ev.id" :value="ev.id">
                    {{ ev.title }} ({{ ev.date }})
                  </option>
                </select>
                <p v-if="!giftCardEventId" class="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <Icon name="lucide:alert-circle" class="w-3.5 h-3.5 flex-shrink-0" />
                  Debes seleccionar un evento para continuar.
                </p>
              </div>
            </Transition>
          </div>

          <!-- STEP 4: Cantidad a Generar -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                Cantidad de Tarjetas a Generar
              </label>
              <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {{ giftCardCount }} Códigos
              </span>
            </div>

            <div class="flex items-center justify-center gap-4 py-1">
              <button
                type="button"
                @click="stepCount(-1)"
                :disabled="giftCardCount <= 5"
                class="w-11 h-11 rounded-2xl bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-600 flex items-center justify-center text-lg font-black shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="lucide:minus" class="w-4 h-4" />
              </button>

              <div class="flex flex-col items-center justify-center min-w-[130px] px-3 py-1 bg-white border border-gray-200 rounded-2xl shadow-xs">
                <input 
                  type="number" 
                  v-model.number="giftCardCount" 
                  min="5" 
                  max="20"
                  class="w-20 text-center text-2xl font-black text-gray-900 tracking-tight leading-none bg-transparent focus:outline-none"
                  @change="giftCardCount = Math.max(5, Math.min(20, giftCardCount || 5))"
                />
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tarjetas en el lote</span>
              </div>

              <button
                type="button"
                @click="stepCount(1)"
                :disabled="giftCardCount >= 20"
                class="w-11 h-11 rounded-2xl bg-white border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-gray-700 hover:text-indigo-600 flex items-center justify-center text-lg font-black shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Icon name="lucide:plus" class="w-4 h-4" />
              </button>
            </div>

            <!-- Range Slider -->
            <input 
              type="range" 
              min="5" 
              max="20" 
              step="1" 
              v-model.number="giftCardCount"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />

            <!-- Quick Chips -->
            <div class="flex flex-wrap gap-2 pt-1">
              <button
                v-for="cPreset in [5, 10, 15, 20]"
                :key="cPreset"
                type="button"
                @click="giftCardCount = cPreset"
                :class="[
                  'px-3 py-1 rounded-xl text-xs font-bold transition-all',
                  giftCardCount === cPreset 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ cPreset }} tarjetas {{ cPreset === 20 ? '(Máx)' : '' }}
              </button>
            </div>
          </div>

          <!-- STEP 5: Live Receipt Summary & Trigger -->
          <div class="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-md flex flex-col gap-3">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <span class="text-xs font-bold uppercase tracking-widest text-[#3ef4a1]">Resumen del Pedido</span>
              <span class="text-xs text-slate-300 font-mono">{{ giftCardCount }} unidades</span>
            </div>

            <div class="flex flex-col gap-2 text-xs">
              <div class="flex justify-between items-center text-slate-200">
                <span>Beneficio unitario:</span>
                <span class="font-extrabold text-white">
                  {{ giftCardType === 'PHOTOS' ? `${giftCardPhotoCount} fotos digitales` : `$${(giftCardAmount || 0).toLocaleString('es-CO')} COP saldo` }}
                </span>
              </div>
              <div class="flex justify-between items-center text-slate-200">
                <span>Validez:</span>
                <span class="font-extrabold text-white truncate max-w-[180px] text-right">
                  {{ giftCardScope === 'ALL' ? 'Todos tus eventos' : (events.find(e => e.id === giftCardEventId)?.title || 'Evento no seleccionado') }}
                </span>
              </div>
              <div class="flex justify-between items-center text-slate-200">
                <span>Tarifa por tarjeta:</span>
                <span class="font-mono text-slate-300">$750 COP</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-white/10 text-sm">
                <span class="font-bold text-white">Total a pagar:</span>
                <span class="text-xl font-black text-[#3ef4a1]">${{ (giftCardCount * 750).toLocaleString('es-CO') }} COP</span>
              </div>
            </div>

            <button 
              @click="handleGenerateGiftCards" 
              :disabled="generatingGiftCards || (giftCardScope === 'EVENT' && !giftCardEventId)"
              class="mt-2 w-full py-4 bg-[#3ef4a1] hover:bg-[#3ef4a1]/90 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-[#3ef4a1]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="generatingGiftCards" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <Icon v-else name="lucide:zap" class="w-5 h-5" />
              {{ generatingGiftCards ? 'Creando Lote...' : `Generar ${giftCardCount} Tarjetas (${(giftCardCount * 750).toLocaleString('es-CO')} COP)` }}
            </button>
          </div>
        </div>

        <!-- Right: Real-time Live Holographic Card Preview & Guide (5 Cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
          
          <!-- Live Preview Box -->
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-black text-gray-900 text-sm flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Vista Previa en Vivo
                </h4>
                <p class="text-[11px] text-gray-400">Así verá tu cliente su tarjeta digital interactiva.</p>
              </div>
              <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">Simulación</span>
            </div>

            <!-- Visual Holographic Card Mockup -->
            <div 
              class="relative w-full aspect-[16/10] rounded-2xl p-5 text-white shadow-xl overflow-hidden border border-white/15 flex flex-col justify-between transition-all duration-300 group"
              :class="giftCardType === 'PHOTOS' ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900' : 'bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900'"
            >
              <!-- Ambient background glowing spheres -->
              <div 
                class="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-colors duration-500"
                :class="giftCardType === 'PHOTOS' ? 'bg-[#3ef4a1]/25' : 'bg-amber-400/25'"
              ></div>
              <div 
                class="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-colors duration-500"
                :class="giftCardType === 'PHOTOS' ? 'bg-indigo-500/25' : 'bg-orange-500/25'"
              ></div>
              
              <!-- Subtle decorative pattern -->
              <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

              <!-- Top Row: Moments Logo + Benefit Badge -->
              <div class="flex items-center justify-between relative z-10">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-7 h-7 rounded-lg flex items-center justify-center shadow-md font-black text-xs"
                    :class="giftCardType === 'PHOTOS' ? 'bg-[#3ef4a1] text-slate-950' : 'bg-amber-400 text-slate-950'"
                  >
                    <Icon name="lucide:gift" class="w-4 h-4" />
                  </div>
                  <span class="font-black text-xs tracking-wider uppercase text-white/90">Moments Card</span>
                </div>
                <span 
                  class="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md border"
                  :class="giftCardType === 'PHOTOS' ? 'bg-[#3ef4a1]/10 text-[#3ef4a1] border-[#3ef4a1]/30' : 'bg-amber-400/10 text-amber-300 border-amber-400/30'"
                >
                  {{ giftCardType === 'PHOTOS' ? 'Tarjeta Fotos' : 'Cupón Saldo' }}
                </span>
              </div>

              <!-- Center: Large Benefit Value -->
              <div class="relative z-10 my-auto py-2">
                <p class="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">Beneficio Canjeable</p>
                <div class="flex items-baseline gap-2">
                  <h3 class="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none drop-shadow-sm">
                    {{ giftCardType === 'PHOTOS' ? `${giftCardPhotoCount} Fotos` : `$${(giftCardAmount || 0).toLocaleString('es-CO')}` }}
                  </h3>
                  <span 
                    class="text-xs font-extrabold uppercase"
                    :class="giftCardType === 'PHOTOS' ? 'text-[#3ef4a1]' : 'text-amber-400'"
                  >
                    {{ giftCardType === 'PHOTOS' ? 'Digitales HD' : 'COP' }}
                  </span>
                </div>

                <!-- Scope Tag -->
                <div class="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[10.5px] font-semibold text-slate-200">
                  <Icon :name="giftCardScope === 'ALL' ? 'lucide:globe' : 'lucide:calendar-check'" class="w-3.5 h-3.5" :class="giftCardType === 'PHOTOS' ? 'text-[#3ef4a1]' : 'text-amber-400'" />
                  <span class="truncate max-w-[200px]">
                    {{ giftCardScope === 'ALL' ? 'Válido en todos tus eventos' : (events.find(e => e.id === giftCardEventId)?.title || 'Selecciona un evento') }}
                  </span>
                </div>
              </div>

              <!-- Bottom Row: Photographer Info + Code Preview -->
              <div class="flex items-end justify-between relative z-10 border-t border-white/10 pt-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-white/20 border border-white/30 overflow-hidden flex items-center justify-center text-[10px] font-bold">
                    <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" class="w-full h-full object-cover" />
                    <span v-else>{{ (authStore.user?.username || 'F')[0].toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Emitido por</p>
                    <p class="text-xs font-bold text-white truncate max-w-[110px]">{{ authStore.user?.username || 'Fotógrafo' }}</p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold">Código Simulado</p>
                  <span class="font-mono text-xs font-bold tracking-wider" :class="giftCardType === 'PHOTOS' ? 'text-[#3ef4a1]' : 'text-amber-400'">
                    MOMENT-••••-••••
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Guide / Benefits Card -->
          <div class="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex flex-col gap-4">
            <h4 class="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Icon name="lucide:lightbulb" class="w-4 h-4 text-amber-500" />
              ¿Cómo funciona el flujo con tus clientes?
            </h4>
            
            <div class="flex flex-col gap-3">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p class="text-xs font-bold text-gray-800">Generas el lote</p>
                  <p class="text-[11px] text-gray-500 leading-snug">Pagas $750 COP por código y obtienes enlaces únicos para cada cliente.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p class="text-xs font-bold text-gray-800">Compartes por WhatsApp o Excel</p>
                  <p class="text-[11px] text-gray-500 leading-snug">Envías el enlace directo con un clic o descargas la lista completa en Excel.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p class="text-xs font-bold text-gray-800">Tu cliente raspa y canjea</p>
                  <p class="text-[11px] text-gray-500 leading-snug">El cliente raspa la tarjeta interactiva y el descuento se aplica automáticamente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- SUB-VIEW 2: Mis Lotes Generados (Full Width Dedicated View) -->
      <div v-else-if="giftCardSubTab === 'history'" class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden animate-fade-in">
        <!-- History Header with Search & Filter -->
        <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-gray-900 text-lg">Mis Lotes Generados</h3>
              <span class="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-black">
                {{ giftCardBatches.length }} lotes
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">Haz clic en "Ver Códigos" para enviarlos por WhatsApp o descargar tu reporte en Excel.</p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              @click="setGiftCardSubTab('create')"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              <span>Crear Nuevo Lote</span>
            </button>

            <!-- Search Bar -->
            <div class="relative min-w-[200px]">
              <Icon name="lucide:search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                v-model="batchSearchQuery"
                placeholder="Buscar lote o evento..."
                class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <!-- Type Filter Tabs -->
            <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                @click="batchFilterType = 'ALL'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  batchFilterType === 'ALL' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                ]"
              >
                Todos
              </button>
              <button
                type="button"
                @click="batchFilterType = 'PHOTOS'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  batchFilterType === 'PHOTOS' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                ]"
              >
                Fotos
              </button>
              <button
                type="button"
                @click="batchFilterType = 'BALANCE'"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  batchFilterType === 'BALANCE' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                ]"
              >
                Cupones $
              </button>
            </div>
          </div>
        </div>

        <!-- Table Loading State -->
        <div v-if="giftCardsLoading" class="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div class="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-semibold">Cargando tus lotes promocionales...</p>
        </div>

        <!-- Table Empty State -->
        <div v-else-if="filteredGiftCardBatches.length === 0" class="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <Icon name="lucide:gift" class="w-8 h-8 text-gray-300" />
          </div>
          <p class="text-sm font-bold text-gray-700">No se encontraron lotes</p>
          <p class="text-xs text-gray-400 mt-1 max-w-sm mb-4">
            {{ batchSearchQuery ? 'No hay resultados que coincidan con tu búsqueda.' : 'Aún no has generado ningún lote de tarjetas de regalo o cupones.' }}
          </p>
          <button 
            type="button"
            @click="setGiftCardSubTab('create')"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Icon name="lucide:sparkles" class="w-4 h-4" />
            Crear Mi Primer Lote
          </button>
        </div>

        <!-- Rich Batches Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50/80">
              <tr class="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <!-- Lote / Tipo -->
                <th 
                  @click="toggleBatchSort('batchReference')" 
                  class="px-6 py-4 cursor-pointer select-none group hover:text-indigo-600 transition-colors"
                  title="Ordenar por Lote"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Lote / Tipo</span>
                    <Icon 
                      v-if="batchSortKey === 'batchReference'" 
                      :name="batchSortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" 
                      class="w-3.5 h-3.5 text-indigo-600 font-bold" 
                    />
                    <Icon 
                      v-else 
                      name="lucide:arrow-up-down" 
                      class="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </th>

                <!-- Beneficio -->
                <th 
                  @click="toggleBatchSort('benefit')" 
                  class="px-6 py-4 cursor-pointer select-none group hover:text-indigo-600 transition-colors"
                  title="Ordenar por Beneficio (Fotos / Saldo)"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Beneficio</span>
                    <Icon 
                      v-if="batchSortKey === 'benefit'" 
                      :name="batchSortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" 
                      class="w-3.5 h-3.5 text-indigo-600 font-bold" 
                    />
                    <Icon 
                      v-else 
                      name="lucide:arrow-up-down" 
                      class="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </th>

                <!-- Progreso de Uso -->
                <th 
                  @click="toggleBatchSort('progress')" 
                  class="px-6 py-4 cursor-pointer select-none group hover:text-indigo-600 transition-colors"
                  title="Ordenar por Progreso de Uso (Usados / Total)"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Progreso de Uso</span>
                    <Icon 
                      v-if="batchSortKey === 'progress'" 
                      :name="batchSortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" 
                      class="w-3.5 h-3.5 text-indigo-600 font-bold" 
                    />
                    <Icon 
                      v-else 
                      name="lucide:arrow-up-down" 
                      class="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </th>

                <!-- Validez -->
                <th 
                  @click="toggleBatchSort('validity')" 
                  class="px-6 py-4 cursor-pointer select-none group hover:text-indigo-600 transition-colors"
                  title="Ordenar por Ámbito de Validez"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Validez</span>
                    <Icon 
                      v-if="batchSortKey === 'validity'" 
                      :name="batchSortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" 
                      class="w-3.5 h-3.5 text-indigo-600 font-bold" 
                    />
                    <Icon 
                      v-else 
                      name="lucide:arrow-up-down" 
                      class="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </th>

                <!-- Fecha -->
                <th 
                  @click="toggleBatchSort('createdAt')" 
                  class="px-6 py-4 cursor-pointer select-none group hover:text-indigo-600 transition-colors"
                  title="Ordenar por Fecha de Creación"
                >
                  <div class="flex items-center gap-1.5">
                    <span>Fecha</span>
                    <Icon 
                      v-if="batchSortKey === 'createdAt'" 
                      :name="batchSortOrder === 'asc' ? 'lucide:arrow-up' : 'lucide:arrow-down'" 
                      class="w-3.5 h-3.5 text-indigo-600 font-bold" 
                    />
                    <Icon 
                      v-else 
                      name="lucide:arrow-up-down" 
                      class="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </th>

                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-for="batch in paginatedGiftCardBatches" :key="batch.batchReference" class="hover:bg-gray-50/60 transition-colors">
                <!-- Batch Ref + Badges -->
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-mono text-xs font-black text-indigo-600 bg-indigo-50/60 px-2 py-0.5 rounded-md border border-indigo-100">
                        {{ batch.batchReference }}
                      </span>
                      <span :class="['text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider', batch.cardType === 'BALANCE' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-purple-50 text-purple-700 border border-purple-200']">
                        {{ batch.cardType === 'BALANCE' ? 'Cupón $' : 'Fotos' }}
                      </span>
                      <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', !batch.paid ? 'bg-amber-50 text-amber-600' : batch.active === 0 ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-700 font-black']">
                        {{ !batch.paid ? 'Pendiente' : batch.active === 0 ? 'Agotado' : 'En uso' }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Benefit -->
                <td class="px-6 py-4">
                  <span v-if="batch.cardType === 'BALANCE'" class="font-black text-sm text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    ${{ Number(batch.amount || 0).toLocaleString('es-CO') }} COP
                  </span>
                  <span v-else class="font-black text-sm text-purple-900 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                    {{ batch.photoCount || 5 }} fotos c/u
                  </span>
                </td>

                <!-- Progress Bar -->
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1.5 min-w-[140px]">
                    <div class="flex justify-between text-xs font-bold text-gray-700">
                      <span>{{ batch.used }} usados</span>
                      <span class="text-gray-400">{{ batch.total }} total</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex">
                      <div 
                        class="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        :style="{ width: `${batch.total > 0 ? (batch.used / batch.total) * 100 : 0}%` }"
                      ></div>
                    </div>
                    <span class="text-[10px] text-gray-400 font-semibold">
                      {{ batch.active }} disponibles para canjear
                    </span>
                  </div>
                </td>

                <!-- Scope / Validez -->
                <td class="px-6 py-4">
                  <span v-if="batch.eventTitle" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 max-w-[180px] truncate" :title="batch.eventTitle">
                    <Icon name="lucide:calendar" class="w-3.5 h-3.5 flex-shrink-0" />
                    <span class="truncate">{{ batch.eventTitle }}</span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1 text-xs font-bold text-gray-500">
                    <Icon name="lucide:globe" class="w-3.5 h-3.5 text-gray-400" />
                    Todos los eventos
                  </span>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 text-xs text-gray-500 font-medium">
                  {{ formatBatchDate(batch.createdAt) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="!batch.paid"
                      @click="payBatchWithWompi(batch)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer"
                      title="Pagar este lote con Wompi"
                    >
                      <Icon name="lucide:credit-card" class="w-4 h-4" />
                      Pagar Wompi
                    </button>
                    <button
                      v-if="!batch.paid"
                      @click="activateBatchDirectly(batch.batchReference)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer"
                      title="Activar lote manualmente"
                    >
                      <Icon name="lucide:check-circle" class="w-4 h-4" />
                      Activar
                    </button>
                    <button
                      @click="viewBatchCodes(batch.batchReference)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-xl transition-all shadow-xs"
                    >
                      <Icon name="lucide:eye" class="w-4 h-4" />
                      Ver Códigos
                    </button>
                    <button
                      @click="downloadBatchExcel(batch.batchReference)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-xl transition-all shadow-xs"
                    >
                      <Icon name="lucide:file-spreadsheet" class="w-4 h-4" />
                      Excel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination Footer Bar -->
          <div v-if="sortedGiftCardBatches.length > 0" class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div class="text-gray-500 font-medium">
              Mostrando <span class="font-bold text-gray-800">{{ (batchCurrentPage - 1) * batchPageSize + 1 }}</span> a <span class="font-bold text-gray-800">{{ Math.min(batchCurrentPage * batchPageSize, sortedGiftCardBatches.length) }}</span> de <span class="font-bold text-gray-800">{{ sortedGiftCardBatches.length }}</span> lotes
            </div>

            <!-- Page controls (only if more than 1 page) -->
            <div v-if="totalBatchPages > 1" class="flex items-center gap-1.5">
              <button
                type="button"
                :disabled="batchCurrentPage === 1"
                @click="batchCurrentPage--"
                class="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Página anterior"
              >
                <Icon name="lucide:chevron-left" class="w-4 h-4" />
                <span class="hidden sm:inline">Anterior</span>
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in totalBatchPages"
                  :key="page"
                  type="button"
                  @click="batchCurrentPage = page"
                  :class="[
                    'w-8 h-8 rounded-lg font-black transition-all flex items-center justify-center text-xs cursor-pointer',
                    batchCurrentPage === page 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                type="button"
                :disabled="batchCurrentPage === totalBatchPages"
                @click="batchCurrentPage++"
                class="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Página siguiente"
              >
                <span class="hidden sm:inline">Siguiente</span>
                <Icon name="lucide:chevron-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- MODAL: PENDING BATCH PAYMENT / ACTIVATION OPTIONS        -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="pendingBatchPaymentModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" @click.self="pendingBatchPaymentModal.show = false">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up">
          <div class="p-6 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white relative">
            <button @click="pendingBatchPaymentModal.show = false" class="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
              Lote Generado Exitosamente
            </div>
            <h3 class="text-xl font-black text-white">Activar Lote de Tarjetas</h3>
            <p class="text-indigo-200 text-xs mt-1 font-mono">Ref: {{ pendingBatchPaymentModal.batchRef }}</p>
          </div>

          <div class="p-6 space-y-5">
            <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Tarjetas Generadas</p>
                <p class="text-base font-black text-slate-900">{{ pendingBatchPaymentModal.count }} unidades</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Tarifa Plataforma</p>
                <p class="text-xl font-black text-indigo-600">${{ (pendingBatchPaymentModal.amount || 0).toLocaleString('es-CO') }} COP</p>
              </div>
            </div>

            <div class="space-y-3">
              <!-- Primary Option 1: Direct Wompi Checkout in new tab -->
              <a
                v-if="pendingBatchPaymentModal.webCheckoutUrl"
                :href="pendingBatchPaymentModal.webCheckoutUrl"
                target="_blank"
                rel="noopener noreferrer"
                @click="pendingBatchPaymentModal.show = false"
                class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
              >
                <Icon name="lucide:credit-card" class="w-4 h-4" />
                Pagar ${{ (pendingBatchPaymentModal.amount || 0).toLocaleString('es-CO') }} COP en Wompi (Nequi, Bancolombia, PSE)
              </a>

              <!-- Primary Option 2: Instant Free Activation -->
              <button
                type="button"
                @click="activatePendingBatchNow(pendingBatchPaymentModal.batchRef)"
                class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
              >
                <Icon name="lucide:zap" class="w-4 h-4" />
                Activar Inmediatamente (Gratis / Sin Pasarela)
              </button>
            </div>

            <p class="text-center text-[11px] text-slate-400">
              💡 Si tu navegador o red bloqueó el popup de Wompi, puedes abrir el pago seguro en la pestaña oficial o activar el lote de inmediato.
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- MODAL: VIEW BATCH CODES                                -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showBatchModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showBatchModal = false">
        <div class="bg-white w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Códigos del Lote: <span class="text-indigo-600 font-mono">{{ selectedBatchRef }}</span></h3>
            <button @click="showBatchModal = false" class="text-gray-400 hover:text-gray-600 transition-colors"><Icon name="lucide:x" class="w-6 h-6" /></button>
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loadingBatchCodes" class="flex justify-center py-12">
              <div class="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else class="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div v-for="card in selectedBatchCodes" :key="card.id" class="border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div>
                  <p class="font-mono font-bold text-gray-900" :class="{'line-through opacity-50': card.delivered}">{{ card.code }}</p>
                  <p class="text-[11px] mt-0.5 flex items-center gap-1.5 font-bold" :class="card.active ? 'text-emerald-600' : 'text-gray-400'">
                    <span class="inline-block w-1.5 h-1.5 rounded-full" :class="card.active ? 'bg-emerald-500' : 'bg-gray-300'"></span>
                    <span v-if="card.cardType === 'BALANCE'">
                      {{ card.active ? `$${Number(card.amount || 0).toLocaleString('es-CO')} COP disponible` : (card.claimedBy ? 'Canjeado (' + card.claimedBy.username + ')' : 'Inactivo') }}
                    </span>
                    <span v-else>
                      {{ card.active ? `${card.photosRemaining ?? card.photoCount ?? 5} de ${card.photoCount ?? 5} fotos disp.` : (card.claimedBy ? 'Agotada (' + card.claimedBy.username + ')' : 'Inactiva') }}
                    </span>
                  </p>
                  <p v-if="card.event?.title" class="text-[10px] text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
                    <Icon name="lucide:calendar" class="w-3 h-3" />
                    Solo válido en: {{ card.event.title }}
                  </p>
                </div>
                <div class="flex gap-1.5 items-center">
                  <label v-if="card.active" class="flex items-center gap-1 text-[10px] text-gray-500 font-bold cursor-pointer mr-1">
                    <input type="checkbox" :checked="card.delivered" @change="toggleDelivered(card)" class="rounded text-indigo-600 focus:ring-indigo-500 w-3 h-3 cursor-pointer" />
                    Entregado
                  </label>
                  <button
                    v-if="card.active"
                    @click="copyCardLink(card.code)"
                    class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors shadow-sm"
                    title="Copiar Código"
                  >
                    <Icon name="lucide:copy" class="w-4 h-4" />
                  </button>
                  <NuxtLink
                    v-if="card.active"
                    :to="`/gift/${card.code}`"
                    target="_blank"
                    class="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors shadow-sm"
                    title="Previsualizar Tarjeta"
                  >
                    <Icon name="lucide:external-link" class="w-4 h-4" />
                  </NuxtLink>
                  <button
                    v-if="card.active"
                    @click="shareInChat(card)"
                    class="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                    title="Enviar por Chat"
                  >
                    <Icon name="lucide:message-circle" class="w-4 h-4" />
                  </button>
                  <button
                    v-if="card.active"
                    @click="shareOnWhatsApp(card)"
                    class="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
                    title="Compartir por WhatsApp"
                  >
                    <Icon name="lucide:share-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- MODAL: CREATE EVENT                                    -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showCreateEventModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showCreateEventModal = false">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">{{ $t('dashboard.photographer.create_event') }}</h3>
            <button @click="showCreateEventModal = false" class="text-gray-400 hover:text-gray-600 transition-colors"><Icon name="lucide:x" class="w-6 h-6" /></button>
          </div>
          <form @submit.prevent="createEvent" class="p-6 space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.event_title') }}</label>
              <input v-model="newEvent.title" type="text" required placeholder="Ej: Boda de Alex & Maria" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.event_date') }}</label>
                <input v-model="newEvent.date" type="date" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.event_location') }}</label>
                <input v-model="newEvent.location" type="text" required placeholder="Ciudad o Lugar" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.event_description') }}</label>
              <textarea v-model="newEvent.description" rows="2" placeholder="Describe el estilo..." class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <!-- PRIVACY TOGGLE & SETTINGS -->
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-gray-800 uppercase tracking-wider">Visibilidad del Álbum</span>
                    <NuxtLink 
                      v-if="!authStore.isPro && !authStore.isAdmin" 
                      to="/dashboard/photographer/subscription" 
                      target="_blank"
                      title="Ver beneficios Moments PRO para Fotógrafos"
                      class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                      <Icon name="lucide:crown" class="w-3 h-3 text-amber-500" /> PRO
                    </NuxtLink>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">
                    {{ newEvent.isPrivate ? 'Privado: Solo por enlace y correos autorizados.' : 'Público: Aparece en el marketplace.' }}
                  </p>
                </div>

                <div class="flex bg-gray-200/80 p-1 rounded-xl shrink-0">
                  <button 
                    type="button" 
                    @click="newEvent.isPrivate = false"
                    :class="[!newEvent.isPrivate ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900', 'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1']">
                    <Icon name="lucide:globe" class="w-3.5 h-3.5" />
                    Público
                  </button>
                  <button 
                    type="button" 
                    @click="handleSelectPrivate('new')"
                    :class="[newEvent.isPrivate ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900', 'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer']"
                    :title="!authStore.isPro && !authStore.isAdmin ? 'Requiere Moments PRO' : ''">
                    <Icon name="lucide:lock" class="w-3.5 h-3.5" />
                    <span>Privado</span>
                    <span v-if="!authStore.isPro && !authStore.isAdmin" class="text-[9px] font-black uppercase px-1 py-0.5 rounded bg-amber-200 text-amber-900 ml-0.5">PRO</span>
                  </button>
                </div>
              </div>

              <!-- PRO Upsell Callout when user is not PRO -->
              <div v-if="!authStore.isPro && !authStore.isAdmin" class="p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Icon name="lucide:crown" class="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-amber-950">Álbumes Privados con Moments PRO</p>
                    <p class="text-[11px] text-amber-800 leading-tight">Acceso restringido por enlace, correos autorizados y descarga directa sin marcas por solo <strong class="font-bold text-amber-900">$5.000 COP / mes</strong>.</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/dashboard/photographer/subscription" 
                  target="_blank"
                  class="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all text-center">
                  <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-yellow-200" />
                  Activar PRO ($5.000 COP)
                </NuxtLink>
              </div>

              <!-- Options for Private Event -->
              <div v-if="newEvent.isPrivate" class="pt-3 border-t border-gray-200/70 space-y-3">
                <!-- Delivery Mode -->
                <div>
                  <label class="text-xs font-bold text-gray-700 block mb-1.5">Modo de fotos para clientes autorizados</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      @click="newEvent.allowFreeDownloads = false"
                      :class="[!newEvent.allowFreeDownloads ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-500' : 'border-gray-200 bg-white text-gray-600', 'p-2.5 rounded-xl border text-left text-xs transition-all']">
                      <div class="font-bold flex items-center gap-1 mb-0.5">
                        <Icon name="lucide:shopping-bag" class="w-3.5 h-3.5 text-indigo-600" />
                        Vender fotos
                      </div>
                      <p class="text-[10px] text-gray-500 leading-tight">Con marca de agua. Deben comprarlas.</p>
                    </button>

                    <button 
                      type="button" 
                      @click="newEvent.allowFreeDownloads = true"
                      :class="[newEvent.allowFreeDownloads ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-500' : 'border-gray-200 bg-white text-gray-600', 'p-2.5 rounded-xl border text-left text-xs transition-all']">
                      <div class="font-bold flex items-center gap-1 mb-0.5">
                        <Icon name="lucide:download-cloud" class="w-3.5 h-3.5 text-emerald-600" />
                        Descarga libre
                      </div>
                      <p class="text-[10px] text-gray-500 leading-tight">Sin marca de agua. Descarga directa gratis.</p>
                    </button>
                  </div>
                </div>

                <!-- Allowed Emails -->
                <div>
                  <label class="text-xs font-bold text-gray-700 block mb-1">
                    Correos o usuarios autorizados
                  </label>
                  <input 
                    v-model="newEvent.allowedEmails" 
                    type="text" 
                    placeholder="cliente@gmail.com, invitado@hotmail.com, @carlos" 
                    class="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                  <p class="text-[10px] text-gray-400 mt-1">Separa varios correos con comas. Tú (fotógrafo) siempre tienes acceso.</p>
                </div>
              </div>
            </div>
            <div class="pt-4 flex gap-3">
              <button type="button" @click="showCreateEventModal = false" class="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all flex-1">{{ $t('common.cancel') }}</button>
              <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex-1">{{ $t('common.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- MODAL: CREATE / EDIT PACKAGE                           -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showCreatePackageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="closePackageModal">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">{{ editingPackage ? $t('dashboard.photographer.edit_package') : $t('dashboard.photographer.create_package') }}</h3>
            <button @click="closePackageModal" class="text-gray-400 hover:text-gray-600 transition-colors"><Icon name="lucide:x" class="w-6 h-6" /></button>
          </div>
          <form @submit.prevent="savePackage" class="p-6 space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.pkg_name') }}</label>
              <input v-model="newPackage.name" type="text" required placeholder='Ej: "Pack Básico"' class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.pkg_photos') }} (Máx. 20)</label>
                <input v-model.number="newPackage.photoCount" type="number" min="1" max="20" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.pkg_price') }} (COP)</label>
                <input v-model.number="newPackage.price" type="number" min="0" step="100" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.pkg_event') }}</label>
              <select v-model="newPackage.eventId" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option :value="null">{{ $t('dashboard.photographer.all_events') }}</option>
                <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ $t('dashboard.photographer.pkg_desc') }}</label>
              <textarea v-model="newPackage.description" rows="2" placeholder="Opcional..." class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <!-- Live Preview -->
            <div class="mt-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-center relative overflow-hidden">
              <div class="absolute -right-4 -top-4 w-16 h-16 bg-indigo-100 rounded-full opacity-50"></div>
              <div class="absolute -left-4 -bottom-4 w-12 h-12 bg-purple-100 rounded-full opacity-50"></div>
              <div class="relative z-10">
                <span class="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 shadow-sm">
                  {{ newPackage.photoCount || 0 }} {{ (newPackage.photoCount || 0) === 1 ? 'foto' : 'fotos' }}
                </span>
                <h4 class="text-lg font-bold text-gray-900 leading-tight">{{ newPackage.name || 'Nombre del Paquete' }}</h4>
                <div class="mt-1 flex items-baseline justify-center gap-1">
                  <span class="text-3xl font-black text-indigo-600">${{ formatPrice(newPackage.price) }}</span>
                  <span class="text-xs font-bold text-gray-500">COP</span>
                </div>
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" @click="closePackageModal" class="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all flex-1">{{ $t('common.cancel') }}</button>
              <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex-1">{{ editingPackage ? $t('common.save') : $t('dashboard.photographer.create_package') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Quick Upload Modal (triggered from event card) -->
    <Transition name="fade">
      <div v-if="showQuickUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showQuickUploadModal = false">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Upload to: {{ quickUploadEvent?.title }}</h3>
            <button @click="showQuickUploadModal = false" class="text-gray-400 hover:text-gray-600 transition-colors"><Icon name="lucide:x" class="w-6 h-6" /></button>
          </div>
          <div class="p-6">
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
import { useChatStore } from '~/stores/chat'

const { $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const packagesStore = usePackagesStore()
const photosStore = usePhotosStore()
const chatStore = useChatStore()
const { confirm } = useConfirm()
const toast = useToast()

// ─── State ──────────────────────────────────────────────────────
const activeTab = ref('events')
const fileInput = ref(null)
const uploadInput = ref(null)
const uploading = ref(false)

// Dashboard / Summary
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

// Events
const showCreateEventModal = ref(false)
const newEvent = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  description: '',
  isPrivate: false,
  allowFreeDownloads: false,
  allowedEmails: ''
})
const searchQuery = ref('')

async function handleSelectPrivate(target = 'new') {
  if (!authStore.isPro && !authStore.isAdmin) {
    const wantToUpgrade = await confirm({
      title: 'Función Exclusiva Moments PRO 👑',
      message: 'Los álbumes privados (con acceso por enlace y correos autorizados) son exclusivos para miembros Moments PRO ($5.000 COP / mes).\n\n¿Deseas conocer los beneficios de Moments PRO?',
      confirmText: 'Ver Beneficios PRO',
      cancelText: 'Seguir en Público',
      icon: 'lucide:crown'
    })
    if (wantToUpgrade) {
      window.open('/dashboard/photographer/subscription', '_blank')
    }
    return
  }
  if (target === 'new') {
    newEvent.value.isPrivate = true
  }
}

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

const filteredEvents = computed(() => {
  if (!events.value) return []
  if (!searchQuery.value) return events.value
  const q = searchQuery.value.toLowerCase()
  return events.value.filter(e => 
    e.title.toLowerCase().includes(q) || 
    (e.date && e.date.toLowerCase().includes(q))
  )
})

const { t } = useI18n()

const allTabs = computed(() => [
  {
    key: 'events',
    label: t('dashboard.photographer.my_events') || 'Mis Eventos',
    description: 'Gestiona tus álbumes, galerías públicas y fotos en venta',
    icon: 'lucide:calendar',
    badge: events.value?.length ? `${events.value.length} eventos` : '0 eventos',
    badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    type: 'tab'
  },
  {
    key: 'summary',
    label: t('dashboard.photographer.summary') || 'Resumen',
    description: 'Métricas de ventas, ingresos y visitas en tiempo real',
    icon: 'lucide:bar-chart-2',
    badge: 'Métricas',
    badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    type: 'tab'
  },
  {
    key: 'packages',
    label: t('dashboard.photographer.packages') || 'Paquetes',
    description: 'Crea tarifas, planes y servicios de fotografía contratables',
    icon: 'lucide:package',
    badge: myPackages.value?.length ? `${myPackages.value.length} planes` : 'Configurar',
    badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    type: 'tab'
  },
  {
    key: 'upload',
    label: t('dashboard.photographer.quick_upload') || 'Subida Rápida',
    description: 'Carga masiva de fotos con marca de agua a tus eventos',
    icon: 'lucide:upload-cloud',
    badge: 'Express',
    badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    type: 'tab'
  },
  {
    key: 'studio',
    label: 'Studio Pro',
    description: 'Edición avanzada, retoque con IA y entrega VIP privada',
    icon: 'lucide:sparkles',
    badge: 'PRO ⭐',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-xs',
    iconColor: 'text-fuchsia-600',
    iconBg: 'bg-fuchsia-50',
    type: 'link',
    to: '/dashboard/photographer/studio'
  },
  {
    key: 'giftcards',
    label: 'Tarjetas de Regalo',
    description: 'Emite cupones y bonos de saldo prepagados para clientes',
    icon: 'lucide:gift',
    badge: 'Cupones',
    badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    type: 'tab'
  },
  {
    key: 'chat',
    label: 'Mensajes',
    description: 'Bandeja de entrada y chat en tiempo real con compradores',
    icon: 'lucide:message-circle',
    badge: chatStore.unreadCount > 0 ? `${chatStore.unreadCount} nuevos` : 'Chat directo',
    badgeColor: chatStore.unreadCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-50 text-teal-700 border border-teal-200/60',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    type: 'link',
    to: '/chat'
  },
])

const tabs = allTabs
const mainTabs = allTabs

function handleTabClick(tab) {
  if (tab.type === 'link' && tab.to) {
    router.push(tab.to)
  } else {
    activeTab.value = tab.key
    if (typeof window !== 'undefined') {
      localStorage.setItem('photographer_active_tab', tab.key)
    }
    router.replace({ query: { ...route.query, tab: tab.key } })
  }
}

watch(activeTab, (newTab) => {
  if (newTab && typeof window !== 'undefined') {
    localStorage.setItem('photographer_active_tab', newTab)
    if (route.query.tab !== newTab) {
      router.replace({ query: { ...route.query, tab: newTab } })
    }
  }
})

// ─── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  if (!authStore.isPhotographer) {
    router.push('/')
    return
  }
  
  const validTabs = ['summary', 'events', 'packages', 'upload', 'giftcards']
  const queryTab = route.query.tab
  const savedTab = typeof window !== 'undefined' ? localStorage.getItem('photographer_active_tab') : null
  
  if (queryTab && validTabs.includes(queryTab)) {
    activeTab.value = queryTab
  } else if (savedTab && validTabs.includes(savedTab)) {
    activeTab.value = savedTab
    router.replace({ query: { ...route.query, tab: savedTab } })
  }

  // Restore subtab for giftcards
  const querySubTab = route.query.subtab
  const savedSubTab = typeof window !== 'undefined' ? localStorage.getItem('photographer_giftcard_subtab') : null
  if (querySubTab === 'create' || querySubTab === 'history') {
    giftCardSubTab.value = querySubTab
  } else if (savedSubTab === 'create' || savedSubTab === 'history') {
    giftCardSubTab.value = savedSubTab
  }

  await Promise.all([
    walletStore.fetchBalance(),
    eventsStore.fetchMyEvents(),
    packagesStore.fetchMyPackages(),
    fetchDashboardData(),
    fetchMyGiftCardBatches()
  ])
})

// Gift Cards
const giftCardSubTab = ref('create') // 'create' or 'history'

function setGiftCardSubTab(sub) {
  giftCardSubTab.value = sub
  if (typeof window !== 'undefined') {
    localStorage.setItem('photographer_giftcard_subtab', sub)
  }
  router.replace({ query: { ...route.query, tab: 'giftcards', subtab: sub } })
}

const giftCards = ref([])
const giftCardBatches = ref([])
const giftCardsLoading = ref(false)
const generatingGiftCards = ref(false)
const giftCardType = ref('PHOTOS') // 'PHOTOS' or 'BALANCE'
const giftCardAmount = ref(10000)
const giftCardPhotoCount = ref(5)
const giftCardCount = ref(5)
const giftCardScope = ref('ALL') // 'ALL' or 'EVENT'
const giftCardEventId = ref('')
const showBatchModal = ref(false)
const selectedBatchRef = ref('')
const selectedBatchCodes = ref([])
const loadingBatchCodes = ref(false)

const pendingBatchPaymentModal = ref({
  show: false,
  batchRef: '',
  webCheckoutUrl: '',
  amount: 0,
  count: 0
})

function openWompiDirectCheckout(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

async function activatePendingBatchNow(batchRef) {
  pendingBatchPaymentModal.value.show = false
  await activateBatchDirectly(batchRef)
}

const batchSearchQuery = ref('')
const batchFilterType = ref('ALL') // 'ALL', 'PHOTOS', 'BALANCE'
const batchSortKey = ref('createdAt') // 'createdAt', 'batchReference', 'benefit', 'progress', 'validity'
const batchSortOrder = ref('desc') // 'asc' | 'desc'
const batchPageSize = 10
const batchCurrentPage = ref(1)

watch([batchSearchQuery, batchFilterType], () => {
  batchCurrentPage.value = 1
})

function toggleBatchSort(key) {
  if (batchSortKey.value === key) {
    batchSortOrder.value = batchSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    batchSortKey.value = key
    batchSortOrder.value = (key === 'createdAt' || key === 'benefit' || key === 'progress') ? 'desc' : 'asc'
  }
  batchCurrentPage.value = 1
}

const filteredGiftCardBatches = computed(() => {
  if (!giftCardBatches.value) return []
  return giftCardBatches.value.filter(batch => {
    const q = batchSearchQuery.value.trim().toLowerCase()
    const matchesSearch = !q || 
      (batch.batchReference && batch.batchReference.toLowerCase().includes(q)) ||
      (batch.eventTitle && batch.eventTitle.toLowerCase().includes(q))
    
    const matchesType = batchFilterType.value === 'ALL' ||
      (batchFilterType.value === 'PHOTOS' && batch.cardType !== 'BALANCE') ||
      (batchFilterType.value === 'BALANCE' && batch.cardType === 'BALANCE')
    
    return matchesSearch && matchesType
  })
})

const sortedGiftCardBatches = computed(() => {
  const list = [...filteredGiftCardBatches.value]
  const key = batchSortKey.value
  const order = batchSortOrder.value === 'asc' ? 1 : -1

  return list.sort((a, b) => {
    if (key === 'createdAt') {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return (timeA - timeB) * order
    }

    if (key === 'batchReference') {
      const refA = (a.batchReference || '').toLowerCase()
      const refB = (b.batchReference || '').toLowerCase()
      return refA.localeCompare(refB) * order
    }

    if (key === 'benefit') {
      const valA = a.cardType === 'BALANCE' ? Number(a.amount || 0) : Number(a.photoCount || 5)
      const valB = b.cardType === 'BALANCE' ? Number(b.amount || 0) : Number(b.photoCount || 5)
      return (valA - valB) * order
    }

    if (key === 'progress') {
      const usedA = Number(a.used || 0)
      const usedB = Number(b.used || 0)
      if (usedA !== usedB) return (usedA - usedB) * order
      const totalA = Number(a.total || 0)
      const totalB = Number(b.total || 0)
      return (totalA - totalB) * order
    }

    if (key === 'validity') {
      const valA = (a.eventTitle || 'Todos los eventos').toLowerCase()
      const valB = (b.eventTitle || 'Todos los eventos').toLowerCase()
      return valA.localeCompare(valB) * order
    }

    return 0
  })
})

const totalBatchPages = computed(() => Math.max(1, Math.ceil(sortedGiftCardBatches.value.length / batchPageSize)))

const paginatedGiftCardBatches = computed(() => {
  const start = (batchCurrentPage.value - 1) * batchPageSize
  return sortedGiftCardBatches.value.slice(start, start + batchPageSize)
})

function stepPhotos(delta) {
  const newVal = (Number(giftCardPhotoCount.value) || 5) + delta
  if (newVal >= 5 && newVal <= 20) {
    giftCardPhotoCount.value = newVal
  }
}

function stepAmount(delta) {
  const current = Number(giftCardAmount.value) || 10000
  const newVal = current + delta
  if (newVal >= 5000 && newVal <= 500000) {
    giftCardAmount.value = newVal
  }
}

function stepCount(delta) {
  const newVal = (Number(giftCardCount.value) || 5) + delta
  if (newVal >= 5 && newVal <= 20) {
    giftCardCount.value = newVal
  }
}

function copyCardLink(code) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(code)
    toast.success('Código Copiado', `El código ${code} ha sido copiado al portapapeles.`)
  }
}

function shareInChat(card) {
  router.push(`/chat?giftCardId=${card.id}&code=${card.code}&photos=${card.photosRemaining || card.photoCount || 5}`)
}

async function toggleDelivered(card) {
  try {
    card.delivered = !card.delivered;
    await $api(`/giftcards/${card.code}/deliver`, { method: 'PATCH' });
    toast.success('Éxito', `Estado actualizado a ${card.delivered ? 'entregado' : 'no entregado'}.`)
  } catch (err) {
    card.delivered = !card.delivered; // revert
    console.error('Error toggling delivery status:', err);
    toast.error('Error', 'No se pudo actualizar el estado.')
  }
}

async function fetchMyGiftCards() {
  giftCardsLoading.value = true
  try {
    const data = await $api('/giftcards/my-cards')
    giftCards.value = data
  } catch (error) {
    console.error('Error fetching gift cards:', error)
  } finally {
    giftCardsLoading.value = false
  }
}

async function fetchMyGiftCardBatches() {
  giftCardsLoading.value = true
  try {
    giftCardBatches.value = await $api('/giftcards/my-batches')
  } catch (error) {
    console.error('Error fetching gift card batches:', error)
  } finally {
    giftCardsLoading.value = false
  }
}

import { formatColombiaDateTime, formatColombiaDate } from '~/utils/date'

function formatBatchDate(dateStr) {
  return formatColombiaDate(dateStr)
}

async function downloadBatchExcel(batchRef) {
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/giftcards/batch/${batchRef}/export.xlsx`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (!response.ok) throw new Error('Error al descargar')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gift_cards_${batchRef}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    toast.error('Error', 'No se pudo descargar el Excel: ' + e.message)
  }
}

async function viewBatchCodes(batchRef) {
  selectedBatchRef.value = batchRef
  showBatchModal.value = true
  loadingBatchCodes.value = true
  try {
    const { $api } = useNuxtApp()
    selectedBatchCodes.value = await $api(`/giftcards/batch/${batchRef}/cards`)
  } catch (e) {
    toast.error('Error', 'No se pudieron cargar los códigos.')
  } finally {
    loadingBatchCodes.value = false
  }
}

function shareOnWhatsApp(card) {
  const url = `https://www.moments-gallery.com/gift/${card.code}`
  let message = ''
  if (card.cardType === 'BALANCE') {
    const val = Number(card.amount || 0).toLocaleString('es-CO')
    message = `¡Hola! 🎁 Te comparto este cupón de descuento por $${val} COP para tus fotos: ${card.code}\n\nPuedes canjearlo aquí: ${url}`
  } else {
    const photos = card.photosRemaining ?? card.photoCount ?? 5
    message = `¡Hola! 🎁 Te comparto este código de regalo para descargar ${photos} fotos gratis: ${card.code}\n\nPuedes canjearlo aquí: ${url}`
  }
  if (card.event?.title) {
    message += `\n(Válido exclusivamente para el evento: ${card.event.title})`
  }
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

async function activateBatchDirectly(batchRef) {
  try {
    toast.info('Activando lote...')
    await $api(`/giftcards/batch/${batchRef}/activate`, { method: 'POST' })
    toast.success('¡Lote Activado!', 'El lote de tarjetas ha sido activado exitosamente.')
    await fetchMyGiftCardBatches()
  } catch (err) {
    console.error('Error al activar lote manualmente:', err)
    toast.error('Error al activar', err.response?._data?.error || 'No se pudo activar el lote.')
  }
}

async function openWompiForBatch(data) {
  const cleanRedirectUrl = window.location.origin + '/payment/success'
  const webCheckoutUrl = buildWompiWebCheckoutUrl({
    publicKey: data.publicKey,
    currency: data.currency || 'COP',
    amountInCents: data.amountInCents,
    reference: data.reference,
    signature: data.signature,
    redirectUrl: cleanRedirectUrl,
    customerEmail: data.customerEmail || authStore.user?.email || 'soporte@moments-gallery.com'
  })

  let WidgetCheckoutClass = null
  try {
    WidgetCheckoutClass = await getWompiWidget()
  } catch (wErr) {
    console.warn('[Wompi] Error al cargar getWompiWidget():', wErr)
  }

  if (WidgetCheckoutClass) {
    const checkoutOptions = {
      publicKey: data.publicKey,
      currency: data.currency || 'COP',
      amountInCents: data.amountInCents,
      reference: data.reference,
      redirectUrl: cleanRedirectUrl,
      customerData: {
        email: data.customerEmail || authStore.user?.email || 'soporte@moments-gallery.com'
      }
    }
    if (data.signature) {
      checkoutOptions.signature = { integrity: data.signature }
    }

    try {
      const checkout = new WidgetCheckoutClass(checkoutOptions)
      checkout.open(async (res) => {
        const transaction = res?.transaction
        console.log('[DashboardPhotographer] Transacción Wompi:', transaction)
        if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'PENDING')) {
          toast.info('Confirmando transacción y activando tarjetas...')
          try {
            await $api('/wompi/confirm-transaction', {
              method: 'POST',
              body: {
                wompiId: transaction.id || '',
                reference: data.reference,
                status: transaction.status
              }
            })
          } catch (e) {
            console.error('Error en confirmación wompi:', e)
          }

          try {
            await $api(`/giftcards/batch/${data.reference}/activate`, { method: 'POST' })
          } catch (e) {
            console.error('Error en activación de lote:', e)
          }

          toast.success('¡Lote Activado!', 'Tus tarjetas de regalo ya están listas para usar.')
          await fetchMyGiftCardBatches()
          setGiftCardSubTab('history')
          router.push(`/payment/success?reference=${data.reference}&id=${transaction.id || ''}`)
        } else {
          await fetchMyGiftCardBatches()
          setGiftCardSubTab('history')
        }
      })
      return
    } catch (openErr) {
      console.warn('[Wompi] Error al invocar modal, redirigiendo a Web Checkout:', openErr)
      window.location.href = webCheckoutUrl
      return
    }
  }

  // Fallback directo a Web Checkout oficial si el widget no está disponible
  console.warn('[Wompi] Widget no disponible en navegador, redirigiendo a Wompi Web Checkout...')
  window.location.href = webCheckoutUrl
}

async function payBatchWithWompi(batch) {
  try {
    toast.info('Abriendo pasarela de pago Wompi...')
    const data = await $api(`/giftcards/batch/${batch.batchReference}/payment-payload`)
    await openWompiForBatch(data)
  } catch (err) {
    console.error('Error al preparar pago del lote:', err)
    toast.error('Error al preparar pago', err.response?._data?.error || 'No se pudo iniciar el pago en Wompi.')
  }
}

async function handleGenerateGiftCards() {
  if (giftCardType.value === 'PHOTOS' && (giftCardPhotoCount.value < 5 || giftCardPhotoCount.value > 20)) {
    toast.error('Fotos inválidas', 'Debe seleccionar entre 5 y 20 fotos por tarjeta.')
    return
  }
  if (giftCardType.value === 'BALANCE' && (!giftCardAmount.value || giftCardAmount.value <= 0)) {
    toast.error('Monto inválido', 'Ingrese un valor válido para el cupón.')
    return
  }
  if (giftCardScope.value === 'EVENT' && !giftCardEventId.value) {
    toast.error('Evento requerido', 'Por favor selecciona el evento para restringir las tarjetas.')
    return
  }
  if (giftCardCount.value < 5 || giftCardCount.value > 20) {
    toast.error('Cantidad inválida', 'Debe generar entre 5 y 20 tarjetas por lote.')
    return
  }

  generatingGiftCards.value = true
  try {
    const data = await $api('/giftcards/photographer/prepare-generation', {
      method: 'POST',
      body: {
        cardType: giftCardType.value,
        amount: giftCardType.value === 'BALANCE' ? Number(giftCardAmount.value) : 0,
        photoCount: giftCardType.value === 'PHOTOS' ? Math.max(5, Math.min(20, Number(giftCardPhotoCount.value))) : 0,
        eventId: giftCardScope.value === 'EVENT' ? (Number(giftCardEventId.value) || null) : null,
        count: Math.max(5, Math.min(20, Number(giftCardCount.value)))
      }
    })

    // Actualizar lotes en segundo plano sin forzar cambio de tab antes de pagar
    fetchMyGiftCardBatches()

    // Abrir pasarela Wompi directamente
    await openWompiForBatch(data)
  } catch (error) {
    console.error('Error preparing gift cards:', error)
    toast.error('Error', error.response?._data?.error || error.message || 'No se pudo iniciar la generación de tarjetas.')
  } finally {
    generatingGiftCards.value = false
  }
}

// ─── Event Methods ──────────────────────────────────────────────
async function createEvent() {
  if (newEvent.value.isPrivate && !authStore.isPro && !authStore.isAdmin) {
    toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para crear álbumes privados.')
    return
  }
  try {
    const success = await eventsStore.createEvent(newEvent.value)
    if (success) {
      toast.success('Evento creado con éxito')
      showCreateEventModal.value = false
      // Reset form
      newEvent.value = {
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        isPrivate: false,
        allowFreeDownloads: false,
        allowedEmails: ''
      }
    } else {
      toast.error(eventsStore.error || 'Error al crear el evento')
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
    if (newPackage.value.photoCount > 20) {
      toast.error('Límite de fotos', 'Un paquete puede tener como máximo 20 fotos.')
      return
    }
    if (newPackage.value.photoCount < 1) {
      toast.error('Cantidad inválida', 'El paquete debe tener al menos 1 foto.')
      return
    }

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
  } catch (e) {
    console.error(e)
  }
}

async function confirmDeletePackage(pkg) {
  const ok = await confirm({
    title: '¿Eliminar paquete?',
    message: `¿Estás seguro de que quieres eliminar el paquete "${pkg.name}"?`
  })
  if (ok) {
    await packagesStore.deletePackage(pkg.id)
  }
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
  const rawExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.cr3', '.cr2', '.dng', '.raw', '.nef', '.arw']
  const validFiles = files.filter(f => {
    const isImageMime = f.type && f.type.startsWith('image/')
    const ext = f.name.includes('.') ? f.name.substring(f.name.lastIndexOf('.')).toLowerCase() : ''
    return isImageMime || rawExtensions.includes(ext)
  })
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
    const res = await $api('/photos/upload-public', { method: 'POST', body: formData })
    const photoUrl = res.url
    await $api('/users/profile-photo', { method: 'PUT', body: photoUrl })
    authStore.user.profilePhotoUrl = photoUrl
    toast.success('Foto de perfil actualizada')
  } catch (e) {
    console.error(e)
    toast.error('Upload failed.')
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
  color: var(--dash-primary);
  border-top-color: var(--dash-primary);
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

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
