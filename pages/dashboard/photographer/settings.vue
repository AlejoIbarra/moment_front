<template>
  <div class="min-h-screen bg-[#F0F2F5] pb-16">
    <!-- Top Bar Navigation -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="$router.push('/dashboard/photographer')"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-700"
            title="Volver al panel"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>{{ $t('settings_page.title') }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Moments Pro
              </span>
            </h1>
            <p class="text-xs text-gray-500 hidden sm:block">
              {{ $t('settings_page.subtitle') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            v-if="authStore.user?.username"
            :to="'/profile/@' + authStore.user.username"
            target="_blank"
            class="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <Icon name="lucide:external-link" class="w-3.5 h-3.5 text-gray-500" />
            <span class="hidden sm:inline">{{ $t('settings_page.profile.view_public_profile') }}</span>
            <span class="sm:hidden">Perfil</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Container -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-6">

      <!-- Facebook-Style Profile Hero Card -->
      <div class="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden mb-6">
        <!-- Cover Banner with Gradient -->
        <div class="h-32 sm:h-44 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 relative">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div class="absolute right-4 bottom-4 flex items-center gap-2">
            <span class="text-xs font-bold px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-full border border-white/10 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#3ef4a1] animate-pulse"></span>
              {{ authStore.photographerPlan === 'PREMIUM' ? 'Plan Premium Activo' : 'Cuenta Verificada' }}
            </span>
          </div>
        </div>

        <!-- User Identity Row -->
        <div class="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <!-- Avatar with Camera Badge Overlay -->
            <div class="relative group cursor-pointer" @click="$refs.profileInput.click()">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-white shadow-xl ring-4 ring-emerald-500/20">
                <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="authStore.user?.profilePhotoUrl"
                    :src="authStore.user.profilePhotoUrl"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="lucide:camera" class="w-12 h-12 text-gray-300" />
                </div>
              </div>
              <div class="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-black/85 hover:bg-black text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Icon name="lucide:camera" class="w-4 h-4" />
              </div>
              <input type="file" ref="profileInput" class="hidden" accept="image/*" @change="uploadProfilePhoto" />
            </div>

            <!-- Identity text -->
            <div class="space-y-1 pb-1">
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <h2 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {{ authStore.user?.title || authStore.user?.username }}
                </h2>
                <Icon name="lucide:badge-check" class="w-5 h-5 text-indigo-600 fill-indigo-100 shrink-0" title="Verificado" />
              </div>
              <p class="text-sm font-semibold text-gray-500">
                @{{ authStore.user?.username }} ·
                <span class="text-emerald-700 font-bold">{{ selectedCountry === 'BR' ? '🇧🇷 Brasil' : (selectedCountry === 'MX' ? '🇲🇽 México' : '🇨🇴 Colombia') }}</span>
              </p>
              <p v-if="uploadingProfile" class="text-xs text-indigo-600 font-semibold animate-pulse">
                {{ $t('settings_page.profile.uploading') }}
              </p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="activeTab = 'language'"
              class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span class="text-sm leading-none">{{ currentPlatformFlag }}</span>
              <span>{{ currentPlatformLanguageName }}</span>
            </button>
          </div>
        </div>

        <!-- Facebook-Style Category Tabs Bar -->
        <div class="px-4 sm:px-6 border-t border-gray-100 bg-gray-50/50 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="activeTab = t.id"
            :class="[
              'px-4 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer',
              activeTab === t.id
                ? 'border-emerald-500 text-emerald-700 bg-white/80 shadow-2xs font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/60'
            ]"
          >
            <Icon :name="t.icon" class="w-4 h-4" :class="activeTab === t.id ? 'text-emerald-600' : 'text-gray-400'" />
            <span>{{ t.label }}</span>
            <span v-if="t.badge" class="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
              {{ t.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- TAB 1: PERFIL & CUENTA -->
      <div v-show="activeTab === 'profile'" class="space-y-6 animate-fade-in">
        <!-- Edit Username UI -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="lucide:at-sign" class="w-4 h-4 text-emerald-600" />
              {{ $t('settings_page.profile.username_title') }}
            </h3>
            <span class="text-xs text-gray-400 font-mono">@{{ authStore.user?.username }}</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('settings_page.profile.username_desc') }}
          </p>
          <div class="flex flex-col items-end gap-3">
            <div class="w-full relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</span>
              <input 
                type="text"
                v-model="usernameText" 
                maxlength="30"
                :placeholder="$t('settings_page.profile.username_placeholder')"
                class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm font-semibold text-gray-900"
              />
            </div>
            <div class="w-full flex justify-between items-center">
              <span class="text-xs text-gray-400">{{ usernameText?.length || 0 }} / 30</span>
              <button 
                @click="updateUsername" 
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-600/10" 
                :disabled="savingUsername || usernameText === authStore.user?.username"
              >
                {{ savingUsername ? 'Guardando...' : $t('settings_page.profile.username_save') }}
              </button>
            </div>
            <p v-if="usernameSuccess" class="text-xs text-emerald-600 font-semibold mt-1">✓ {{ $t('settings_page.profile.username_success') }}</p>
          </div>
        </div>

        <!-- Profile Description (Bio) -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Icon name="lucide:user-check" class="w-4 h-4 text-emerald-600" />
            {{ $t('settings_page.profile.bio_title') }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('settings_page.profile.bio_desc') }}
          </p>
          
          <div class="flex flex-col items-end gap-3">
            <textarea 
              v-model="descriptionText" 
              rows="3" 
              maxlength="1000"
              :placeholder="$t('settings_page.profile.bio_placeholder')"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-sm text-gray-900 font-medium"
            ></textarea>
            <div class="w-full flex justify-between items-center">
              <span class="text-xs text-gray-400">{{ descriptionText?.length || 0 }} / 1000</span>
              <button 
                @click="updateDescription" 
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-600/10" 
                :disabled="savingDescription"
              >
                {{ savingDescription ? 'Guardando...' : $t('settings_page.profile.bio_save') }}
              </button>
            </div>
            <p v-if="descriptionSuccess" class="text-xs text-emerald-600 font-semibold mt-1">✓ {{ $t('settings_page.profile.bio_success') }}</p>
          </div>
        </div>
      </div>

      <!-- TAB 2: IDIOMA & REGIÓN (ESTILO FACEBOOK) -->
      <div v-show="activeTab === 'language'" class="space-y-6 animate-fade-in">
        
        <!-- Platform Language Facebook-Style Card -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Icon name="lucide:languages" class="w-4 h-4" />
              </div>
              <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider">
                {{ $t('settings_page.language.section_title') }}
              </h3>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Moments App
            </span>
          </div>

          <p class="text-sm text-gray-500 mb-5">
            {{ $t('settings_page.language.section_desc') }}
          </p>

          <!-- 3 Interactive Cards (Facebook-style Radio Cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <!-- Español -->
            <div
              @click="selectPlatformLanguage('es')"
              :class="[
                'p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 group',
                platformLanguage === 'es'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/70'
              ]"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-2xl">🇪🇸</span>
                  <div
                    :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                      platformLanguage === 'es'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 bg-white'
                    ]"
                  >
                    <Icon v-if="platformLanguage === 'es'" name="lucide:check" class="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 class="text-sm font-black text-gray-900">
                  {{ $t('settings_page.language.lang_es') }}
                </h4>
                <p class="text-xs text-gray-500 mt-1 leading-snug">
                  {{ $t('settings_page.language.lang_es_desc') }}
                </p>
              </div>
              <span v-if="platformLanguage === 'es'" class="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <Icon name="lucide:check-circle" class="w-3.5 h-3.5 text-emerald-600" />
                Idioma Activo
              </span>
            </div>

            <!-- Português (Brasil) -->
            <div
              @click="selectPlatformLanguage('pt')"
              :class="[
                'p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 group',
                platformLanguage === 'pt'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/70'
              ]"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-2xl">🇧🇷</span>
                  <div
                    :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                      platformLanguage === 'pt'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 bg-white'
                    ]"
                  >
                    <Icon v-if="platformLanguage === 'pt'" name="lucide:check" class="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 class="text-sm font-black text-gray-900">
                  {{ $t('settings_page.language.lang_pt') }}
                </h4>
                <p class="text-xs text-gray-500 mt-1 leading-snug">
                  {{ $t('settings_page.language.lang_pt_desc') }}
                </p>
              </div>
              <span v-if="platformLanguage === 'pt'" class="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <Icon name="lucide:check-circle" class="w-3.5 h-3.5 text-emerald-600" />
                Idioma Ativo
              </span>
            </div>

            <!-- English -->
            <div
              @click="selectPlatformLanguage('en')"
              :class="[
                'p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 group',
                platformLanguage === 'en'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/70'
              ]"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-2xl">🇺🇸</span>
                  <div
                    :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                      platformLanguage === 'en'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-gray-300 bg-white'
                    ]"
                  >
                    <Icon v-if="platformLanguage === 'en'" name="lucide:check" class="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 class="text-sm font-black text-gray-900">
                  {{ $t('settings_page.language.lang_en') }}
                </h4>
                <p class="text-xs text-gray-500 mt-1 leading-snug">
                  {{ $t('settings_page.language.lang_en_desc') }}
                </p>
              </div>
              <span v-if="platformLanguage === 'en'" class="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <Icon name="lucide:check-circle" class="w-3.5 h-3.5 text-emerald-600" />
                Active Language
              </span>
            </div>
          </div>

          <div class="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <Icon name="lucide:info" class="w-4 h-4 text-emerald-600 shrink-0" />
              {{ $t('settings_page.language.select_language_hint') }}
            </span>
            <p v-if="languageSuccess" class="text-xs font-bold text-emerald-700">✓ {{ $t('settings_page.language.language_updated') }}</p>
          </div>
        </div>

        <!-- Country of Operation & Default Currency -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Icon name="lucide:coins" class="w-4 h-4" />
              </div>
              <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">
                {{ $t('settings_page.language.country_title') }}
              </h3>
            </div>
            <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Latinoamérica & Global</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('settings_page.language.country_desc') }}
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select 
              v-model="selectedCountry" 
              class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="CO">🇨🇴 Colombia (COP - Pesos Colombianos / PSE / Nequi)</option>
              <option value="BR">🇧🇷 Brasil (BRL - Reais / Pix / Mercado Pago)</option>
              <option value="MX">🇲🇽 México (MXN - Pesos Mexicanos / SPEI)</option>
              <option value="AR">🇦🇷 Argentina (ARS - Pesos Argentinos)</option>
              <option value="CL">🇨🇱 Chile (CLP - Pesos Chilenos)</option>
              <option value="PE">🇵🇪 Perú (PEN - Soles Peruanos)</option>
              <option value="EC">🇪🇨 Ecuador (USD - Dólares)</option>
              <option value="UY">🇺🇾 Uruguay (UYU - Pesos Uruguayos)</option>
              <option value="CR">🇨🇷 Costa Rica (USD/CRC)</option>
              <option value="PA">🇵🇦 Panamá (USD - Dólares)</option>
              <option value="GT">🇬🇹 Guatemala (GTQ - Quetzales)</option>
              <option value="BO">🇧🇴 Bolivia (BOB - Bolivianos)</option>
              <option value="PY">🇵🇾 Paraguay (PYG - Guaraníes)</option>
              <option value="DO">🇩🇴 República Dominicana (DOP)</option>
              <option value="ES">🇪🇸 España (EUR - Euros)</option>
              <option value="US">🇺🇸 Estados Unidos / Global (USD)</option>
            </select>
            <button 
              @click="updateCountry" 
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-indigo-600/10"
              :disabled="savingCountry || selectedCountry === (authStore.user?.country || 'CO')"
            >
              {{ savingCountry ? 'Guardando...' : $t('settings_page.language.country_save') }}
            </button>
          </div>
          <p v-if="countrySuccess" class="text-xs text-emerald-600 font-semibold mt-2">✓ {{ $t('settings_page.language.country_success') }}</p>
        </div>

        <!-- Location & Coverage Area -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="lucide:map-pin" class="w-4 h-4 text-emerald-600" />
              {{ $t('settings_page.language.coverage_title') }}
            </h3>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {{ $t('settings_page.language.coverage_badge') }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('settings_page.language.coverage_desc') }}
          </p>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">
                {{ $t('settings_page.language.base_city') }}
              </label>
              <input 
                type="text" 
                v-model="cityText" 
                :placeholder="$t('settings_page.language.base_city_placeholder')"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-gray-700 block">
                  {{ $t('settings_page.language.coverage_zones') }}
                </label>
                <span class="text-[10px] text-gray-400 font-medium">
                  {{ settingsMunicipalities.length }} municipio(s)
                </span>
              </div>

              <!-- Tags list -->
              <div v-if="settingsMunicipalities.length > 0" class="flex flex-wrap gap-1.5 mb-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span
                  v-for="(mun, idx) in settingsMunicipalities"
                  :key="idx"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold"
                >
                  <Icon name="lucide:map-pin" class="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span>{{ mun }}</span>
                  <button
                    type="button"
                    @click="removeSettingsMunicipality(idx)"
                    class="hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                  >
                    <Icon name="lucide:x" class="w-3 h-3" />
                  </button>
                </span>
              </div>

              <!-- Input to add with Enter -->
              <div class="relative">
                <input 
                  type="text" 
                  v-model="newSettingsMunicipality"
                  @keydown.enter.prevent="addSettingsMunicipality"
                  @keydown.comma.prevent="addSettingsMunicipality"
                  :placeholder="$t('settings_page.language.municipality_placeholder')"
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none pr-24"
                />
                <button
                  type="button"
                  v-if="newSettingsMunicipality.trim()"
                  @click="addSettingsMunicipality"
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  {{ $t('settings_page.language.add_button') }}
                </button>
              </div>
              <p class="text-[11px] text-gray-500 mt-1">
                {{ $t('settings_page.language.coverage_hint') }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-1">
              <p v-if="locationSuccess" class="text-xs text-emerald-600 font-semibold">✓ {{ $t('settings_page.language.coverage_success') }}</p>
              <div v-else></div>
              <button 
                @click="updateLocationSettings"
                :disabled="savingLocation"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-600/10"
              >
                {{ savingLocation ? 'Guardando...' : $t('settings_page.language.coverage_save') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: PAGOS & RETIROS -->
      <div v-show="activeTab === 'payments'" class="space-y-6 animate-fade-in">
        <!-- Mercado Pago Marketplace Card -->
        <div class="bg-gradient-to-r from-blue-50/70 via-sky-50/50 to-white border border-blue-200/80 rounded-2xl p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-[#009ee3] text-white flex items-center justify-center shadow-md shrink-0 font-black text-lg">
                <Icon name="lucide:hand-coins" class="w-6 h-6 text-white" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-gray-900">
                    {{ $t('settings_page.payments.title') }}
                  </h3>
                  <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                    {{ $t('settings_page.payments.badge') }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 mt-0.5">
                  {{ $t('settings_page.payments.desc') }}
                </p>
              </div>
            </div>

            <span 
              :class="[mpStatus.connected ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-gray-100 text-gray-600 border-gray-200', 'px-3 py-1 rounded-full text-xs font-black border shrink-0 text-center']"
            >
              {{ mpStatus.connected ? $t('settings_page.payments.connected') : $t('settings_page.payments.not_connected') }}
            </span>
          </div>

          <!-- Connected State -->
          <div v-if="mpStatus.connected" class="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-0.5">
              <p class="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-emerald-600" />
                {{ $t('settings_page.payments.connected_message') }}
              </p>
              <p class="text-[11px] text-emerald-800 font-mono">
                {{ $t('settings_page.payments.seller_id') }}: {{ mpStatus.userId }} <span v-if="mpStatus.nickname">({{ mpStatus.nickname }})</span>
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0 flex-wrap">
              <a 
                href="https://www.mercadopago.com.co/activities" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-3.5 py-1.5 bg-[#009ee3] hover:bg-[#0089c7] text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Icon name="lucide:wallet" class="w-3.5 h-3.5" />
                <span>{{ $t('settings_page.payments.go_to_mp') }}</span>
                <Icon name="lucide:external-link" class="w-3 h-3 opacity-80" />
              </a>
              <button 
                @click="disconnectMercadoPago"
                :disabled="disconnectingMp"
                class="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {{ disconnectingMp ? 'Desconectando...' : $t('settings_page.payments.disconnect') }}
              </button>
            </div>
          </div>

          <!-- Disconnected State -->
          <div v-else class="space-y-4 pt-2">
            <!-- Split explanation badge -->
            <div class="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-950 space-y-2">
              <div class="flex items-center gap-2 text-blue-900 font-black">
                <Icon name="lucide:zap" class="w-4 h-4 text-[#009ee3]" />
                <span>{{ $t('settings_page.payments.how_it_works') }}</span>
              </div>
              <p class="leading-relaxed text-blue-900/90">
                {{ $t('settings_page.payments.how_it_works_desc') }}
              </p>
            </div>

            <!-- 2 Simple Steps -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">1</span>
                <div class="space-y-1">
                  <p class="text-xs font-bold text-gray-900">{{ $t('settings_page.payments.step_1_title') }}</p>
                  <p class="text-[11px] text-gray-500 leading-snug">
                    {{ $t('settings_page.payments.step_1_desc') }}
                  </p>
                  <a 
                    href="https://www.mercadopago.com.co" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="inline-flex items-center gap-1 text-[11px] font-bold text-[#009ee3] hover:underline pt-0.5"
                  >
                    <span>{{ $t('settings_page.payments.step_1_link') }}</span>
                    <Icon name="lucide:external-link" class="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div class="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">2</span>
                <div class="space-y-1">
                  <p class="text-xs font-bold text-gray-900">{{ $t('settings_page.payments.step_2_title') }}</p>
                  <p class="text-[11px] text-gray-500 leading-snug">
                    {{ $t('settings_page.payments.step_2_desc') }}
                  </p>
                  <span class="text-[11px] text-emerald-600 font-bold inline-flex items-center gap-1 pt-0.5">
                    <Icon name="lucide:check" class="w-3 h-3" /> {{ $t('settings_page.payments.step_2_ready') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span class="text-xs text-gray-500 flex items-center gap-1.5">
                <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-600" />
                {{ $t('settings_page.payments.protected_note') }}
              </span>
              <button 
                @click="connectMercadoPago" 
                :disabled="connectingMp"
                class="w-full sm:w-auto px-7 py-3.5 bg-[#009ee3] hover:bg-[#0082ba] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Icon v-if="connectingMp" name="lucide:loader-2" class="w-4 h-4 animate-spin text-white" />
                <Icon v-else name="lucide:link" class="w-4 h-4 text-white" />
                <span>{{ connectingMp ? $t('settings_page.payments.connecting') : $t('settings_page.payments.connect_button') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bank Details Card -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="lucide:landmark" class="w-4 h-4 text-emerald-600" />
              {{ $t('settings_page.payments.bank_title') }}
            </h3>
            <span class="text-xs text-gray-400">Transferencias periódicas</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('settings_page.payments.bank_desc') }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Nombre del Titular</label>
              <input type="text" v-model="payoutData.accountHolder" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Ej: Juan Pérez" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Entidad Bancaria</label>
              <input type="text" v-model="payoutData.bankName" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Ej: Bancolombia, Nubank, Itaú..." />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Número de Cuenta</label>
              <input type="text" v-model="payoutData.accountNumber" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono" placeholder="Ej: 123456789" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1">Número de Documento / CPF / NIT</label>
              <input type="text" v-model="payoutData.documentNumber" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono" placeholder="Ej: 1085293..." />
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 mt-2">
            <p v-if="payoutSuccess" class="text-xs text-emerald-600 font-semibold">✓ {{ $t('settings_page.payments.bank_success') }}</p>
            <div v-else></div>
            <button
              @click="savePayoutSettings"
              :disabled="savingPayout"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-600/10"
            >
              {{ savingPayout ? 'Guardando...' : $t('settings_page.payments.bank_save') }}
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 4: MARCA DE AGUA (WATERMARK) -->
      <div v-show="activeTab === 'watermark'" class="space-y-6 animate-fade-in">
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="lucide:image" class="w-4 h-4 text-emerald-600" />
              {{ $t('settings_page.watermark.title') }}
            </h3>
            <span v-if="authStore.photographerPlan !== 'PREMIUM' && !authStore.isAdmin" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
              <Icon name="lucide:crown" class="w-3 h-3 text-amber-500 fill-amber-500" />
              {{ $t('settings_page.watermark.premium_badge') }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            {{ $t('settings_page.watermark.desc') }}
          </p>

          <!-- Upsell banner if not Premium -->
          <div v-if="authStore.photographerPlan !== 'PREMIUM' && !authStore.isAdmin" class="mb-5 p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Icon name="lucide:crown" class="w-4 h-4 fill-white" />
              </div>
              <div>
                <p class="text-xs font-bold text-amber-950">{{ $t('settings_page.watermark.upsell_title') }}</p>
                <p class="text-[11px] text-amber-800">{{ $t('settings_page.watermark.upsell_desc') }}</p>
              </div>
            </div>
            <NuxtLink
              to="/dashboard/photographer/subscription"
              class="shrink-0 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              {{ $t('settings_page.watermark.upsell_button') }}
            </NuxtLink>
          </div>

          <div class="flex flex-col sm:flex-row items-start gap-6">
            <!-- Current Logo Preview -->
            <div class="relative group cursor-pointer" @click="$refs.logoInput.click()">
              <div class="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                <img v-if="watermarkLogoUrl" :src="watermarkLogoUrl" alt="Watermark Logo" class="w-full h-full object-contain p-2" />
                <div v-else class="text-center">
                  <Icon name="lucide:image-plus" class="w-10 h-10 text-gray-300 mx-auto mb-1" />
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ $t('settings_page.watermark.upload_logo') }}</span>
                </div>
              </div>
              <div v-if="watermarkLogoUrl" class="absolute inset-0 rounded-2xl bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="lucide:upload" class="w-8 h-8 text-white" />
              </div>
              <input type="file" ref="logoInput" class="hidden" accept="image/png, image/svg+xml, image/jpeg" @change="uploadWatermarkLogo" />
            </div>

            <div class="flex-1">
              <div class="space-y-3 text-sm">
                <div class="flex items-start gap-2 text-gray-600">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{{ $t('settings_page.watermark.format_rec') }}</span>
                </div>
                <div class="flex items-start gap-2 text-gray-600">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{{ $t('settings_page.watermark.opacity_rec') }}</span>
                </div>
                <div class="flex items-start gap-2 text-gray-600">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{{ $t('settings_page.watermark.size_rec') }}</span>
                </div>
              </div>
              <p v-if="uploadingLogo" class="text-xs text-emerald-600 font-semibold mt-3 animate-pulse">Subiendo logo...</p>
              <p v-if="logoSuccess" class="text-xs text-emerald-600 font-semibold mt-3">✓ {{ $t('settings_page.watermark.success') }}</p>

              <button v-if="watermarkLogoUrl" @click="removeLogo"
                      class="mt-4 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                {{ $t('settings_page.watermark.remove_logo') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-if="watermarkLogoUrl" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            {{ $t('settings_page.watermark.preview_title') }}
          </h3>
          <p class="text-xs text-gray-500 mb-4">{{ $t('settings_page.watermark.preview_desc') }}</p>
          <div class="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
            <div class="absolute inset-0 flex items-center justify-center">
              <p class="text-gray-500 text-sm">Vista previa de protección anticopia</p>
            </div>
            <img :src="watermarkLogoUrl" class="relative w-1/3" style="transform: rotate(-30deg); opacity: 0.85;" />
          </div>
        </div>
      </div>

      <!-- TAB 5: ACCESIBILIDAD -->
      <div v-show="activeTab === 'accessibility'" class="space-y-6 animate-fade-in">
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Icon name="lucide:accessibility" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">{{ $t('settings_page.accessibility.title') }}</h3>
                <p class="text-xs text-gray-500">{{ $t('settings_page.accessibility.desc') }}</p>
              </div>
            </div>
            <button 
              @click="accessibility.isOpen.value = true"
              type="button"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
            >
              <Icon name="lucide:sliders" class="w-4 h-4" />
              <span>{{ $t('settings_page.accessibility.button') }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAccessibility } from '~/composables/useAccessibility'
import { useImageActions } from '~/composables/useImageActions'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const accessibility = useAccessibility()
const router = useRouter()
const route = useRoute()
const { confirm } = useConfirm()
const toast = useToast()
const { locale, setLocale, t } = useI18n()

// Active tab (Facebook Style Settings Categories)
const activeTab = ref('profile')

const tabs = computed(() => [
  { id: 'profile', label: t('settings_page.tabs.profile') || 'Perfil & Cuenta', icon: 'lucide:user' },
  { id: 'language', label: t('settings_page.tabs.language') || 'Idioma & Región', icon: 'lucide:globe', badge: platformLanguage.value.toUpperCase() },
  { id: 'payments', label: t('settings_page.tabs.payments') || 'Pagos & Retiros', icon: 'lucide:credit-card' },
  { id: 'watermark', label: t('settings_page.tabs.watermark') || 'Marca de Agua', icon: 'lucide:image' },
  { id: 'accessibility', label: t('settings_page.tabs.accessibility') || 'Accesibilidad', icon: 'lucide:accessibility' }
])

// Platform Language State
const platformLanguage = ref('es')
const languageSuccess = ref(false)

const currentPlatformFlag = computed(() => {
  if (platformLanguage.value === 'pt') return '🇧🇷'
  if (platformLanguage.value === 'en') return '🇺🇸'
  return '🇪🇸'
})

const currentPlatformLanguageName = computed(() => {
  if (platformLanguage.value === 'pt') return 'Português'
  if (platformLanguage.value === 'en') return 'English'
  return 'Español'
})

function selectPlatformLanguage(code) {
  platformLanguage.value = code
  if (typeof setLocale === 'function') {
    setLocale(code)
  } else {
    locale.value = code
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('moment_platform_locale', code)
    localStorage.setItem('moment_selected_locale', code)
    document.cookie = `i18n_redirected=${code}; path=/; max-age=31536000; SameSite=Lax`
    if (document.documentElement) {
      document.documentElement.lang = code
    }
  }
  authStore.updateUserData({ preferredLanguage: code })
  languageSuccess.value = true
  const langNames = { es: 'Español', pt: 'Português (Brasil)', en: 'English' }
  toast.success('Idioma actualizado', `El idioma de la plataforma ahora es ${langNames[code] || code}`)
  setTimeout(() => { languageSuccess.value = false }, 3500)
}

// Profile upload and fields
const uploadingProfile = ref(false)
const uploadingLogo = ref(false)
const logoSuccess = ref(false)
const watermarkLogoUrl = ref('')

const usernameText = ref('')
const savingUsername = ref(false)
const usernameSuccess = ref(false)

const descriptionText = ref('')
const savingDescription = ref(false)
const descriptionSuccess = ref(false)

const selectedCountry = ref(authStore.user?.country || 'CO')
const savingCountry = ref(false)
const countrySuccess = ref(false)

const cityText = ref(authStore.user?.city || '')
const coverageAreaText = ref(authStore.user?.coverageArea || '')
const newSettingsMunicipality = ref('')
const settingsMunicipalities = ref(
  (authStore.user?.coverageArea || '')
    .split(/[,;\n]+/)
    .map(s => s.trim())
    .filter(Boolean)
)
const savingLocation = ref(false)
const locationSuccess = ref(false)

function addSettingsMunicipality() {
  const val = newSettingsMunicipality.value.trim()
  if (!val) return
  const parts = val.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean)
  for (const p of parts) {
    if (!settingsMunicipalities.value.some(m => m.toLowerCase() === p.toLowerCase())) {
      settingsMunicipalities.value.push(p)
    }
  }
  newSettingsMunicipality.value = ''
}

function removeSettingsMunicipality(index) {
  settingsMunicipalities.value.splice(index, 1)
}

async function updateLocationSettings() {
  if (newSettingsMunicipality.value.trim()) {
    addSettingsMunicipality()
  }
  const finalCoverage = settingsMunicipalities.value.join(', ')
  savingLocation.value = true
  try {
    if (typeof authStore.updateLocation === 'function') {
      await authStore.updateLocation(cityText.value.trim(), finalCoverage)
    } else {
      const config = useRuntimeConfig()
      const activeToken = authStore.token || (process.client ? localStorage.getItem('token') : null)
      await $fetch(`${config.public.apiBase}/users/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
        },
        body: {
          city: cityText.value.trim(),
          coverageArea: finalCoverage
        }
      })
      authStore.updateUserData({
        city: cityText.value.trim(),
        coverageArea: finalCoverage
      })
    }
    coverageAreaText.value = finalCoverage
    locationSuccess.value = true
    toast.success('Ubicación actualizada', 'Tu ciudad y zona de cobertura han sido guardadas con éxito.')
    setTimeout(() => locationSuccess.value = false, 3500)
  } catch (e) {
    console.error('Error al actualizar ubicación:', e)
    const errorMsg = e.response?._data?.message || e.data?.message || e.message || 'No se pudo actualizar la ubicación.'
    toast.error('Error', errorMsg)
  } finally {
    savingLocation.value = false
  }
}

async function updateCountry() {
  savingCountry.value = true
  try {
    const res = await $api('/users/country', {
      method: 'PUT',
      body: { country: selectedCountry.value }
    })
    if (res && res.success) {
      authStore.updateUserData({ country: selectedCountry.value })
      countrySuccess.value = true
      toast.success('País actualizado', `Tu país ha sido configurado en ${selectedCountry.value}`)
      setTimeout(() => countrySuccess.value = false, 3500)
    }
  } catch (e) {
    toast.error('Error', 'No se pudo actualizar el país.')
  } finally {
    savingCountry.value = false
  }
}

// Mercado Pago Marketplace
const mpStatus = ref({
  connected: false,
  userId: null,
  nickname: null
})
const connectingMp = ref(false)
const disconnectingMp = ref(false)

async function fetchMercadoPagoStatus() {
  try {
    const res = await $api('/mercadopago/status')
    if (res) {
      mpStatus.value = {
        connected: !!res.connected,
        userId: res.userId || null,
        nickname: res.nickname || null
      }
    }
  } catch (e) {
    console.error('Error fetching Mercado Pago status:', e)
  }
}

async function connectMercadoPago() {
  connectingMp.value = true
  const username = authStore.user?.username || 'photographer'
  const country = (authStore.user?.country || selectedCountry.value || 'CO').toUpperCase()

  try {
    const res = await $api(`/mercadopago/connect-url?country=${country}`)
    if (res && res.url) {
      window.location.href = res.url
      return
    }
  } catch (e) {
    console.warn('Backend connect-url fallback, generating direct URL', e)
  }

  const clientId = '4998016578193672'
  const redirectUri = encodeURIComponent('https://www.moments-gallery.com/dashboard/photographer/mercadopago-callback')
  const domain = country === 'MX' ? 'https://auth.mercadopago.com.mx/authorization'
               : country === 'AR' ? 'https://auth.mercadopago.com.ar/authorization'
               : country === 'CL' ? 'https://auth.mercadopago.cl/authorization'
               : country === 'PE' ? 'https://auth.mercadopago.com.pe/authorization'
               : country === 'UY' ? 'https://auth.mercadopago.com.uy/authorization'
               : country === 'BR' ? 'https://auth.mercadopago.com.br/authorization'
               : 'https://auth.mercadopago.com.co/authorization'

  const directMpUrl = `${domain}?client_id=${clientId}&response_type=code&state=${encodeURIComponent(username)}&redirect_uri=${redirectUri}`
  window.location.href = directMpUrl
}

async function disconnectMercadoPago() {
  if (disconnectingMp.value) return
  const confirmed = await confirm({
    title: 'Desconectar Mercado Pago',
    message: '¿Estás seguro de que deseas desconectar tu cuenta de Mercado Pago?',
    confirmText: 'Desconectar',
    cancelText: 'Cancelar'
  })
  if (!confirmed) return

  disconnectingMp.value = true
  try {
    const res = await $api('/mercadopago/disconnect', { method: 'POST' })
    if (res && res.success) {
      mpStatus.value.connected = false
      mpStatus.value.userId = null
      mpStatus.value.nickname = null
      toast.success('Desconectado', 'Tu cuenta de Mercado Pago ha sido desvinculada.')
    }
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudo desconectar la cuenta.')
  } finally {
    disconnectingMp.value = false
  }
}

// Payout / Bank settings
const payoutData = ref({
  accountHolder: '',
  bankName: '',
  documentType: 'CC',
  documentNumber: '',
  accountType: 'AHORROS',
  accountNumber: '',
  wompiSubmerchantId: '',
  payoutEnabled: false
})
const savingPayout = ref(false)
const payoutSuccess = ref(false)

async function savePayoutSettings() {
  if (savingPayout.value) return
  savingPayout.value = true
  try {
    const res = await $api('/users/payout-settings', {
      method: 'PUT',
      body: payoutData.value
    })
    if (res) {
      payoutData.value.payoutEnabled = !!res.payoutEnabled
      payoutData.value.wompiSubmerchantId = res.wompiSubmerchantId || ''
      payoutSuccess.value = true
      toast.success('Datos Bancarios Guardados', 'Tu información para dispersión directa ha sido actualizada.')
      setTimeout(() => { payoutSuccess.value = false }, 4000)
    }
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron guardar los datos bancarios.')
  } finally {
    savingPayout.value = false
  }
}

async function updateUsername() {
  if (savingUsername.value || usernameText.value === authStore.user?.username) return
  savingUsername.value = true
  try {
    const res = await authStore.updateUsername(usernameText.value)
    if (res.success) {
      usernameSuccess.value = true
      toast.success('Nombre de usuario actualizado', `Tu nuevo nombre de usuario es @${authStore.user?.username || usernameText.value}`)
      setTimeout(() => { usernameSuccess.value = false }, 3000)
    } else {
      toast.error('No se pudo actualizar', res.error || 'El nombre de usuario no se pudo actualizar.')
    }
  } catch (e) {
    console.error(e)
    toast.error('Error', 'Error al guardar el nombre de usuario')
  } finally {
    savingUsername.value = false
  }
}

async function uploadProfilePhoto(event) {
  const file = event.target.files[0]
  if (!file) return
  uploadingProfile.value = true
  try {
    const { compressImage } = useImageActions()
    const optimizedFile = await compressImage(file)

    const formData = new FormData()
    formData.append('file', optimizedFile)
    const config = useRuntimeConfig()
    const res = await $fetch(`${config.public.apiBase}/photos/upload-public`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })
    await $fetch(`${config.public.apiBase}/users/profile-photo`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'text/plain' 
      },
      body: res.url
    })
    authStore.updateUserData({ profilePhotoUrl: res.url })
    toast.success('Foto actualizada', 'Tu foto de perfil se actualizó correctamente.')
  } catch (e) {
    console.error(e)
    toast.error('Error', 'Error al subir la foto de perfil')
  } finally {
    uploadingProfile.value = false
  }
}

async function updateDescription() {
  if (savingDescription.value) return
  savingDescription.value = true
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/users/description`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'text/plain' 
      },
      body: descriptionText.value
    })
    authStore.updateUserData({ description: descriptionText.value })
    descriptionSuccess.value = true
    toast.success('Biografía guardada', 'Tu descripción profesional ha sido actualizada.')
    setTimeout(() => { descriptionSuccess.value = false }, 3000)
  } catch (e) {
    console.error(e)
    toast.error('Error', 'Error al guardar la biografía')
  } finally {
    savingDescription.value = false
  }
}

async function uploadWatermarkLogo(event) {
  const file = event.target.files[0]
  if (!file) return

  if (authStore.photographerPlan !== 'PREMIUM' && !authStore.isAdmin) {
    toast.info('Función Exclusiva Plan Premium', 'La personalización de logo de marca de agua requiere el Plan Premium. Actualiza tu suscripción para activarla.')
    router.push('/dashboard/photographer/subscription')
    return
  }

  uploadingLogo.value = true
  logoSuccess.value = false
  try {
    const { compressImage } = useImageActions()
    const optimizedFile = await compressImage(file, { 
      maxWidth: 1000, 
      maxHeight: 1000, 
      quality: 0.9, 
      type: 'image/png' 
    })

    const formData = new FormData()
    formData.append('file', optimizedFile)
    const config = useRuntimeConfig()
    const res = await $fetch(`${config.public.apiBase}/photos/upload-public`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })
    await $fetch(`${config.public.apiBase}/users/watermark-logo`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'text/plain' 
      },
      body: res.url
    })
    watermarkLogoUrl.value = res.url
    logoSuccess.value = true
    toast.success('Marca de agua', 'Tu logotipo ha sido cargado exitosamente.')
    setTimeout(() => { logoSuccess.value = false }, 3000)
  } catch (e) {
    console.error(e)
    const msg = e?.data?.message || e?.data?.error || e?.message || 'Error al subir el logo'
    toast.error('Error', msg)
  } finally {
    uploadingLogo.value = false
  }
}

async function removeLogo() {
  const ok = await confirm({
    title: '¿Eliminar marca de agua?',
    message: '¿Estás seguro de que quieres eliminar tu logo de marca de agua?'
  })
  if (!ok) return
  try {
    const config = useRuntimeConfig()
    let deleted = false
    try {
      await $fetch(`${config.public.apiBase}/users/watermark-logo`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${authStore.token}` 
        }
      })
      deleted = true
    } catch (delError) {
      console.warn('DELETE not supported, falling back to PUT', delError)
    }

    if (!deleted) {
      await $fetch(`${config.public.apiBase}/users/watermark-logo`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'text/plain' 
        },
        body: ''
      })
    }

    watermarkLogoUrl.value = ''
    toast.success('Marca de agua eliminada', 'El logo de marca de agua ha sido eliminado exitosamente.')
  } catch (e) {
    console.error('Error al eliminar marca de agua:', e)
    toast.error('Error', 'No se pudo eliminar la marca de agua')
  }
}

onMounted(async () => {
  if (!authStore.isPhotographer) {
    router.push('/')
    return
  }

  // Set active tab from query if present
  if (route.query.tab && ['profile', 'language', 'payments', 'watermark', 'accessibility'].includes(String(route.query.tab))) {
    activeTab.value = String(route.query.tab)
  }

  // Load platform language
  if (process.client) {
    const saved = localStorage.getItem('moment_platform_locale') || localStorage.getItem('moment_selected_locale')
    if (saved && ['es', 'en', 'pt'].includes(saved)) {
      platformLanguage.value = saved
    } else if (typeof locale.value === 'string') {
      platformLanguage.value = locale.value
    }
  }

  // Set current user fields
  usernameText.value = authStore.user?.username || ''
  descriptionText.value = authStore.user?.description || ''
  cityText.value = authStore.user?.city || ''
  coverageAreaText.value = authStore.user?.coverageArea || ''
  selectedCountry.value = authStore.user?.country || 'CO'

  // Fetch current watermark logo
  try {
    const res = await $api('/users/watermark-logo')
    watermarkLogoUrl.value = res.url || ''
  } catch (e) {
    console.error(e)
  }

  // Fetch payout / bank settings
  try {
    const pRes = await $api('/users/payout-settings')
    if (pRes) {
      payoutData.value = {
        accountHolder: pRes.accountHolder || '',
        bankName: pRes.bankName || '',
        documentType: pRes.documentType || 'CC',
        documentNumber: pRes.documentNumber || '',
        accountType: pRes.accountType || 'AHORROS',
        accountNumber: pRes.accountNumber || '',
        wompiSubmerchantId: pRes.wompiSubmerchantId || '',
        payoutEnabled: !!pRes.payoutEnabled
      }
    }
  } catch (e) {
    console.error('Error fetching payout settings:', e)
  }

  // Fetch Mercado Pago Marketplace status
  await fetchMercadoPagoStatus()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
