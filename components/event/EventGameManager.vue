<template>
  <div class="space-y-8">
    
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-amber-500 mb-3" />
      <p class="text-sm font-medium">Cargando configuración de juegos rompehielos...</p>
    </div>

    <div v-else class="space-y-6">

      <!-- Game Mode Selector Tabs -->
      <div class="bg-white border border-gray-200 rounded-3xl p-3 shadow-xs">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto">
            <button
              type="button"
              @click="switchSelectedMode('PHOTO_QUEST')"
              class="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              :class="activeMode === 'PHOTO_QUEST' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-800'"
            >
              <Icon name="lucide:gamepad-2" class="w-4 h-4 text-amber-500" />
              <span>1. Misión de Retos & Ruleta</span>
              <span v-if="questGame?.active" class="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
            <button
              type="button"
              @click="switchSelectedMode('PHOTO_CONTEST')"
              class="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              :class="activeMode === 'PHOTO_CONTEST' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-800'"
            >
              <Icon name="lucide:trophy" class="w-4 h-4 text-yellow-500" />
              <span>2. Torneo de Likes & Podio</span>
              <span v-if="contestGame?.active" class="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
            <button
              type="button"
              @click="switchSelectedMode('PAPARAZZI_ARCADE')"
              class="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              :class="activeMode === 'PAPARAZZI_ARCADE' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-800'"
            >
              <Icon name="lucide:crosshair" class="w-4 h-4 text-emerald-500" />
              <span>3. Reto Paparazzi 2D</span>
              <span v-if="arcadeGame?.active" class="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 px-3">
            <div
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide border transition-all"
              :class="isConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs' : 'bg-slate-100 text-slate-500 border-slate-200'"
              :title="isConnected ? 'WebSocket conectado. Las fotos, votos y puntuaciones se sincronizan en vivo sin recargar.' : 'Conectando sincronización en tiempo real...'"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
              ></span>
              <span>{{ isConnected ? 'En Vivo (WebSocket)' : 'Conectando...' }}</span>
            </div>
            <span class="hidden md:inline text-xs text-slate-400 font-medium">
              Resultados en tiempo real
            </span>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- TAB 1: RETOS FOTOGRÁFICOS & RULETA                          -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div v-if="activeMode === 'PHOTO_QUEST'" class="space-y-8 animate-fade-in">
        
        <!-- Setup Hero if not configured -->
        <div v-if="!questGame" class="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-900 border border-amber-300/40 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div class="max-w-2xl mx-auto space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Icon name="lucide:gamepad-2" class="w-9 h-9" />
            </div>

            <div>
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-800 border border-amber-500/30">
                DINÁMICAS PARA INVITADOS
              </span>
              <h3 class="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
                Misión de Retos & Ruleta Rompehielos
              </h3>
              <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                Los asistentes escanean un código QR en su mesa, reciben <strong class="text-gray-900">retos fotográficos aleatorios y persistentes</strong> (por ejemplo: foto con la novia, foto al zapato del novio, foto con alguien de azul), toman o suben fotos desde su celular y van llenando el muro de la fiesta.
              </p>
            </div>

            <!-- Quick Template Buttons -->
            <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                @click="initQuestTemplate('WEDDING')"
                class="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:sparkles" class="w-4 h-4" />
                Crear Dinámica de Boda
              </button>
              <button
                @click="initQuestTemplate('PARTY')"
                class="px-5 py-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl text-xs sm:text-sm border border-gray-200 shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:party-popper" class="w-4 h-4 text-amber-500" />
                Plantilla Fiesta / Cumpleaños
              </button>
              <button
                @click="initQuestTemplate('CORPORATE')"
                class="px-5 py-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl text-xs sm:text-sm border border-gray-200 shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:briefcase" class="w-4 h-4 text-indigo-500" />
                Plantilla Corporativa
              </button>
            </div>
          </div>
        </div>

        <!-- Quest Game Dashboard -->
        <div v-else class="space-y-8">
          <!-- Top Summary & QR Action Bar -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900">{{ questGame.title }}</h3>
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                    :class="questGame.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ questGame.active ? '● Juego Activo' : 'Pausado' }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">
                  {{ questGame.description || 'Los invitados recibirán retos fotográficos aleatorios al escanear el QR.' }}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <button
                  @click="openQrModalFor(questGame.uuid, questGame.title)"
                  class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Icon name="lucide:qr-code" class="w-4 h-4" />
                  Ver y Descargar Código QR
                </button>
                <button
                  @click="printTableCardsFor(questGame.uuid, questGame.title, 'QUEST')"
                  class="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl text-xs border border-gray-200 flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Icon name="lucide:printer" class="w-4 h-4 text-gray-600" />
                  Imprimir Fichas para Mesas
                </button>
                <NuxtLink
                  :to="`/game/${questGame.uuid}`"
                  target="_blank"
                  class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-all active:scale-95"
                >
                  <Icon name="lucide:external-link" class="w-4 h-4" />
                  Abrir Vista Invitado
                </NuxtLink>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Retos en Banco</span>
                <span class="text-2xl font-black text-slate-900">{{ questGame.challenges?.length || 0 }}</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Por Invitado</span>
                <span class="text-2xl font-black text-amber-600">{{ questGame.challengesPerUser }}</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Participantes</span>
                <span class="text-2xl font-black text-indigo-600">{{ questGame.totalParticipantsCount || 0 }}</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completados</span>
                <span class="text-2xl font-black text-emerald-600">{{ questGame.completedParticipantsCount || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Configuration Form: Challenges Pool & Options -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h4 class="text-lg font-bold text-gray-900">Configuración de la Dinámica</h4>
                <p class="text-xs text-gray-500">Personaliza los retos que recibirán los invitados de forma aleatoria.</p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="saveQuestGame"
                  :disabled="savingQuest"
                  class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  <Icon v-if="savingQuest" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:save" class="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Título del Juego</label>
                <input
                  v-model="questForm.title"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Ej: Misión Fotográfica Rompehielos"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Retos a Asignar por Invitado</label>
                <div class="flex items-center gap-3">
                  <input
                    v-model.number="questForm.challengesPerUser"
                    type="number"
                    min="1"
                    max="10"
                    class="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-center focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <span class="text-xs text-gray-500">Se seleccionarán de forma aleatoria del banco abajo y quedarán fijos para cada usuario.</span>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Descripción o Instrucciones</label>
                <textarea
                  v-model="questForm.description"
                  rows="2"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Instrucciones breves que verán los invitados..."
                ></textarea>
              </div>
            </div>

            <!-- Challenges List Header -->
            <div class="pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h5 class="text-base font-bold text-gray-900">Banco de Retos ({{ questForm.challenges.length }})</h5>
                <p class="text-xs text-gray-500">Agrega todos los retos que desees. La app los repartirá al azar entre los invitados.</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="addSuggestedChallenges"
                  class="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-amber-600" />
                  + Cargar 5 Retos Populares
                </button>
                <button
                  type="button"
                  @click="addChallengeRow"
                  class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                  Agregar Reto
                </button>
              </div>
            </div>

            <!-- Challenges Rows -->
            <div class="space-y-3">
              <div
                v-for="(ch, idx) in questForm.challenges"
                :key="idx"
                class="flex items-center gap-3 p-3.5 bg-gray-50 hover:bg-amber-50/40 rounded-2xl border border-gray-200/80 transition-all group"
              >
                <span class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 font-black text-xs flex items-center justify-center shrink-0">
                  {{ idx + 1 }}
                </span>
                
                <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div class="sm:col-span-8">
                    <input
                      v-model="ch.title"
                      type="text"
                      class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej: Foto al zapato del novio..."
                    />
                  </div>
                  <div class="sm:col-span-4">
                    <input
                      v-model="ch.description"
                      type="text"
                      class="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-normal text-gray-500 outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Pista o detalle opcional..."
                    />
                  </div>
                </div>

                <button
                  type="button"
                  @click="removeChallengeRow(idx)"
                  class="w-8 h-8 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Eliminar reto"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Live Feed of photos taken by guests in quest -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon name="lucide:activity" class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Muro de Fotos en Tiempo Real
                    <span v-if="isConnected" class="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Auto-Sync
                    </span>
                  </h4>
                  <p class="text-xs text-gray-500">Fotos que los invitados han subido al completar sus misiones.</p>
                </div>
              </div>
              <button
                @click="loadLiveFeed"
                class="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Refrescar muro manualmente"
              >
                <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5 text-gray-500" />
                Actualizar
              </button>
            </div>

            <div v-if="liveFeed.length === 0" class="py-12 text-center text-gray-400 space-y-2">
              <Icon name="lucide:camera-off" class="w-8 h-8 mx-auto text-gray-300" />
              <p class="text-xs font-semibold">Aún no hay fotos subidas en esta dinámica.</p>
              <p class="text-[11px] text-gray-400">Cuando los invitados escaneen el código y completen retos, aparecerán aquí al instante.</p>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="item in liveFeed"
                :key="item.assignmentId"
                class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-sm"
              >
                <img :src="item.photoUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span class="text-[10px] font-black uppercase text-amber-400">{{ item.challengeTitle }}</span>
                  <span class="text-xs font-bold truncate">{{ formatUser(item.participantUsername, item.participantName) }}</span>
                  <span class="text-[9px] text-slate-300">{{ formatTime(item.completedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- TAB 2: TORNEO DE LIKES & PODIO EN VIVO                      -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div v-if="activeMode === 'PHOTO_CONTEST'" class="space-y-8 animate-fade-in">
        
        <!-- Setup Hero if not configured -->
        <div v-if="!contestGame" class="bg-gradient-to-br from-yellow-500/15 via-amber-500/5 to-slate-900 border border-yellow-400/40 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div class="max-w-2xl mx-auto space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/30">
              <Icon name="lucide:trophy" class="w-9 h-9" />
            </div>

            <div>
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-800 border border-yellow-500/30">
                TORNEO DE FOTOS & PODIO EN VIVO
              </span>
              <h3 class="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
                Concurso: "La Mejor Foto de la Noche"
              </h3>
              <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                Los asistentes escanean un código QR, <strong class="text-gray-900">suben sus fotos espontáneas del evento y votan con likes (❤️)</strong> por sus favoritas. Habrá un podio en tiempo real y la foto más votada se llevará el trofeo.
              </p>
            </div>

            <div class="pt-4 flex justify-center">
              <button
                @click="initContestGame"
                class="px-8 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-yellow-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:sparkles" class="w-5 h-5" />
                <span>Activar Concurso de Fotos con Podio</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Contest Active Dashboard -->
        <div v-else class="space-y-8">

          <!-- Top Summary Card -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900">{{ contestGame.title }}</h3>
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                    :class="contestStatusData?.contestStatus === 'CLOSED' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : (contestStatusData?.contestStatus === 'VOTING_ONLY' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')"
                  >
                    {{ contestStatusData?.contestStatus === 'CLOSED' ? '🔴 Concurso Finalizado' : (contestStatusData?.contestStatus === 'VOTING_ONLY' ? '🟡 Solo Votaciones' : '🟢 Abierto para Subir y Votar') }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">
                  {{ contestGame.description || 'La foto con más likes al terminar el evento ganará el primer lugar en el podio.' }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-3">
                <button
                  @click="openContestBigScreen"
                  class="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:bg-slate-800 text-yellow-300 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer border border-yellow-500/30"
                  title="Abrir vista optimizada para proyector o pantalla gigante del evento"
                >
                  <Icon name="lucide:tv" class="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span>Pantalla Gigante / Proyector</span>
                </button>
                <button
                  @click="openQrModalFor(contestGame.uuid, contestGame.title)"
                  class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Icon name="lucide:qr-code" class="w-4 h-4" />
                  Código QR Concurso
                </button>
                <button
                  @click="printTableCardsFor(contestGame.uuid, contestGame.title, 'CONTEST')"
                  class="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl text-xs border border-gray-200 flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Icon name="lucide:printer" class="w-4 h-4 text-gray-600" />
                  Imprimir Fichas para Mesas
                </button>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fotos Subidas</span>
                <span class="text-2xl font-black text-slate-900">{{ contestStatusData?.totalPhotos || 0 }}</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Votos Totales (Likes)</span>
                <span class="text-2xl font-black text-rose-600 flex items-center gap-1.5">
                  <Icon name="lucide:heart" class="w-5 h-5 fill-rose-600" />
                  {{ contestStatusData?.totalLikes || 0 }}
                </span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Participantes</span>
                <span class="text-2xl font-black text-indigo-600">{{ contestStatusData?.totalParticipants || 0 }}</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estado del Concurso</span>
                <select
                  :value="contestStatusData?.contestStatus || 'OPEN'"
                  @change="changeContestStatus(($event.target as HTMLSelectElement).value)"
                  class="mt-1 bg-white border border-gray-200 rounded-lg text-xs font-bold py-1 px-2 outline-none text-slate-800"
                >
                  <option value="OPEN">Abierto (Subir y Votar)</option>
                  <option value="VOTING_ONLY">Solo Votaciones</option>
                  <option value="CLOSED">Finalizado / Cerrado</option>
                </select>
              </div>
            </div>
          </div>

          <!-- THE PODIUM SECTION (1st, 2nd, 3rd) -->
          <div class="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-yellow-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
            <div class="flex items-center justify-between pb-8 border-b border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 flex items-center justify-center">
                  <Icon name="lucide:crown" class="w-7 h-7" />
                </div>
                <div>
                  <h4 class="text-xl font-black text-white flex items-center gap-2">
                    Podio de Ganadores en Tiempo Real
                    <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                      LIVE
                    </span>
                  </h4>
                  <p class="text-xs text-slate-400">Las 3 fotos con mayor cantidad de likes de todos los invitados.</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span v-if="isConnected" class="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Votación en vivo activa
                </span>
                <button
                  @click="fetchContestStatus"
                  class="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Refrescar podio manualmente"
                >
                  <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5 text-yellow-400" />
                  Refrescar
                </button>
              </div>
            </div>

            <!-- Empty podium state -->
            <div v-if="!contestStatusData?.photos?.length" class="py-16 text-center text-slate-400 space-y-3">
              <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-yellow-400">
                <Icon name="lucide:trophy" class="w-8 h-8" />
              </div>
              <h5 class="text-base font-bold text-white">El podio aún no tiene fotos</h5>
              <p class="text-xs text-slate-400 max-w-sm mx-auto">
                Invita a los asistentes a escanear el código QR para que suban sus fotos y comiencen a votar.
              </p>
            </div>

            <!-- PODIUM STAGE (2nd - 1st - 3rd) -->
            <div v-else class="pt-8">
              <div class="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto pt-6">

                <!-- 2nd Place (Silver) -->
                <div class="flex flex-col items-center text-center">
                  <div v-if="contestStatusData.podium[1]" class="space-y-2 mb-3">
                    <div class="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-lg bg-slate-800 mx-auto group">
                      <img :src="contestStatusData.podium[1].photoUrl" class="w-full h-full object-cover" />
                      <div class="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-400 flex items-center gap-1">
                        <Icon name="lucide:heart" class="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                        {{ contestStatusData.podium[1].likeCount }}
                      </div>
                    </div>
                    <span class="text-xs sm:text-sm font-bold text-white truncate block max-w-[100px] sm:max-w-[130px]">
                      {{ formatUser(contestStatusData.podium[1].uploaderUsername, contestStatusData.podium[1].uploaderFullName) }}
                    </span>
                  </div>
                  <div v-else class="h-28 flex items-center justify-center text-xs text-slate-500">Vacante</div>

                  <!-- Pedestal -->
                  <div class="w-full h-24 sm:h-32 bg-gradient-to-t from-slate-700 to-slate-500 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-lg border-t-2 border-slate-300">
                    <span class="text-2xl sm:text-4xl font-black text-slate-100">2</span>
                    <span class="text-[10px] font-black uppercase text-slate-200">Plata 🥈</span>
                  </div>
                </div>

                <!-- 1st Place (Gold / Champion) -->
                <div class="flex flex-col items-center text-center">
                  <div v-if="contestStatusData.podium[0]" class="space-y-2 mb-3 relative">
                    <!-- Floating Crown -->
                    <div class="absolute -top-7 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                      <Icon name="lucide:crown" class="w-8 h-8 fill-yellow-400" />
                    </div>

                    <div class="relative w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30 bg-slate-800 mx-auto group ring-4 ring-yellow-400/20">
                      <img :src="contestStatusData.podium[0].photoUrl" class="w-full h-full object-cover" />
                      <div class="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-black text-rose-400 flex items-center gap-1">
                        <Icon name="lucide:heart" class="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        {{ contestStatusData.podium[0].likeCount }}
                      </div>
                    </div>
                    <span class="text-xs sm:text-sm font-black text-yellow-300 truncate block max-w-[110px] sm:max-w-[150px]">
                      {{ formatUser(contestStatusData.podium[0].uploaderUsername, contestStatusData.podium[0].uploaderFullName) }}
                    </span>
                    <span v-if="contestStatusData.podium[0].winner" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-yellow-400 text-slate-950 inline-block">
                      👑 GANADOR
                    </span>
                  </div>
                  <div v-else class="h-36 flex items-center justify-center text-xs text-slate-500">Vacante</div>

                  <!-- Pedestal -->
                  <div class="w-full h-36 sm:h-44 bg-gradient-to-t from-yellow-700 via-amber-500 to-yellow-400 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-2xl border-t-2 border-yellow-200">
                    <span class="text-3xl sm:text-5xl font-black text-slate-950">1</span>
                    <span class="text-xs font-black uppercase text-slate-950 tracking-wider">Campeón 🥇</span>
                  </div>
                </div>

                <!-- 3rd Place (Bronze) -->
                <div class="flex flex-col items-center text-center">
                  <div v-if="contestStatusData.podium[2]" class="space-y-2 mb-3">
                    <div class="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-600 shadow-lg bg-slate-800 mx-auto group">
                      <img :src="contestStatusData.podium[2].photoUrl" class="w-full h-full object-cover" />
                      <div class="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-400 flex items-center gap-1">
                        <Icon name="lucide:heart" class="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                        {{ contestStatusData.podium[2].likeCount }}
                      </div>
                    </div>
                    <span class="text-xs sm:text-sm font-bold text-white truncate block max-w-[100px] sm:max-w-[130px]">
                      {{ formatUser(contestStatusData.podium[2].uploaderUsername, contestStatusData.podium[2].uploaderFullName) }}
                    </span>
                  </div>
                  <div v-else class="h-28 flex items-center justify-center text-xs text-slate-500">Vacante</div>

                  <!-- Pedestal -->
                  <div class="w-full h-18 sm:h-24 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-lg border-t-2 border-amber-500">
                    <span class="text-xl sm:text-3xl font-black text-amber-100">3</span>
                    <span class="text-[10px] font-black uppercase text-amber-200">Bronce 🥉</span>
                  </div>
                </div>

              </div>

              <!-- Winner Crowning Action -->
              <div v-if="contestStatusData?.podium?.[0]" class="pt-8 text-center">
                <button
                  type="button"
                  @click="crownWinner(contestStatusData.podium[0].id)"
                  class="px-6 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <Icon name="lucide:crown" class="w-4 h-4" />
                  <span>{{ contestStatusData.winnerPhotoId ? 'Confirmar Ganador Oficial' : '👑 ¡Coronar al #1 como Ganador del Evento!' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- All Contest Photos Grid & Moderation -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h4 class="text-lg font-bold text-gray-900">Todas las Fotografías en Competencia ({{ contestStatusData?.photos?.length || 0 }})</h4>
                <p class="text-xs text-gray-500">Ordenadas de mayor a menor número de likes.</p>
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  @click="importAlbumPhotos"
                  :disabled="importingAlbumPhotos"
                  class="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Importar todas las fotos del álbum oficial al concurso de votos"
                >
                  <Icon :name="importingAlbumPhotos ? 'lucide:loader-2' : 'lucide:download-cloud'" class="w-4 h-4" :class="{ 'animate-spin': importingAlbumPhotos }" />
                  <span>{{ importingAlbumPhotos ? 'Cargando fotos...' : 'Cargar Fotos del Álbum' }}</span>
                </button>

                <label class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95">
                  <Icon :name="uploadingContestPhoto ? 'lucide:loader-2' : 'lucide:upload'" class="w-4 h-4" :class="{ 'animate-spin': uploadingContestPhoto }" />
                  <span>{{ uploadingContestPhoto ? 'Subiendo...' : 'Subir Foto Directa' }}</span>
                  <input type="file" multiple accept="image/*" class="hidden" :disabled="uploadingContestPhoto" @change="handleDirectContestUpload" />
                </label>
              </div>
            </div>

            <!-- Empty state with direct quick action -->
            <div v-if="!contestStatusData?.photos?.length" class="py-12 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-amber-500 flex items-center justify-center mx-auto shadow-xs">
                <Icon name="lucide:trophy" class="w-6 h-6" />
              </div>
              <div class="space-y-1">
                <h5 class="text-sm font-black text-slate-800">Aún no hay fotos en competencia</h5>
                <p class="text-xs text-slate-500 max-w-md mx-auto">
                  Carga las fotos que ya tienes en este evento para que los invitados puedan votar por ellas, o permite que los invitados suban fotos escaneando el código QR.
                </p>
              </div>
              <div class="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  @click="importAlbumPhotos"
                  :disabled="importingAlbumPhotos"
                  class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Icon :name="importingAlbumPhotos ? 'lucide:loader-2' : 'lucide:download-cloud'" class="w-4 h-4" :class="{ 'animate-spin': importingAlbumPhotos }" />
                  <span>{{ importingAlbumPhotos ? 'Cargando fotos del álbum...' : '📥 Cargar Fotos del Álbum Ahora' }}</span>
                </button>
                <label class="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95">
                  <Icon :name="uploadingContestPhoto ? 'lucide:loader-2' : 'lucide:upload'" class="w-4 h-4" :class="{ 'animate-spin': uploadingContestPhoto }" />
                  <span>{{ uploadingContestPhoto ? 'Subiendo...' : '📸 Subir Fotos' }}</span>
                  <input type="file" multiple accept="image/*" class="hidden" :disabled="uploadingContestPhoto" @change="handleDirectContestUpload" />
                </label>
              </div>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="photo in contestStatusData.photos"
                :key="photo.id"
                class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm"
              >
                <img :src="photo.photoUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                <!-- Rank Badge -->
                <div class="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-xs text-white border border-white/20 flex items-center gap-1">
                  <span>#{{ photo.rank }}</span>
                  <span v-if="photo.rank === 1">🥇</span>
                  <span v-else-if="photo.rank === 2">🥈</span>
                  <span v-else-if="photo.rank === 3">🥉</span>
                </div>

                <!-- Likes Badge -->
                <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-md flex items-center gap-1">
                  <Icon name="lucide:heart" class="w-3 h-3 fill-white" />
                  {{ photo.likeCount }}
                </div>

                <!-- Footer overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-xs font-bold truncate">{{ formatUser(photo.uploaderUsername, photo.uploaderFullName) }}</span>
                  <p v-if="photo.caption" class="text-[10px] text-slate-300 line-clamp-1 mt-0.5">"{{ photo.caption }}"</p>
                  
                  <div class="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      @click="crownWinner(photo.id)"
                      class="flex-1 py-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-lg text-[10px] transition-colors"
                      title="Coronar como ganador"
                    >
                      👑 Ganador
                    </button>
                    <button
                      type="button"
                      @click="deleteContestPhoto(photo.id)"
                      class="w-7 h-7 bg-red-500/80 hover:bg-red-600 rounded-lg text-white flex items-center justify-center transition-colors"
                      title="Eliminar foto"
                    >
                      <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- TAB 3: RETO PAPARAZZI 2D (CÁMARA INTERACTIVA)               -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div v-if="activeMode === 'PAPARAZZI_ARCADE'" class="space-y-8 animate-fade-in">
        
        <!-- Setup Hero if not configured -->
        <div v-if="!arcadeGame" class="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl text-white">
          <div class="max-w-2xl mx-auto space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Icon name="lucide:crosshair" class="w-9 h-9" />
            </div>

            <div>
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MINIJUEGO 2D INTERACTIVO
              </span>
              <h3 class="text-2xl sm:text-3xl font-black text-white mt-3">
                Reto Paparazzi 2D: Enfoque Perfecto
              </h3>
              <p class="text-sm text-slate-300 mt-2 leading-relaxed">
                Los invitados apuntan el visor 2D de una cámara réflex retro para seguir objetivos que flotan por la pantalla (novios, copas de champán, parejas bailando y estrellas). Cuando el visor se torna <strong class="text-emerald-400 font-bold">verde neón (FOCUS LOCK)</strong>, disparan para lograr fotos perfectas con sonido de obturador real, combos y acumular puntos en el ranking oficial.
              </p>
            </div>

            <div class="pt-4 flex justify-center">
              <button
                @click="initArcadeGame"
                class="px-8 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Icon name="lucide:sparkles" class="w-5 h-5" />
                <span>Activar Reto Paparazzi 2D</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Arcade Active Dashboard -->
        <div v-else class="space-y-8">

          <!-- Top Summary Card -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl sm:text-2xl font-black text-gray-900">{{ arcadeGame.title }}</h3>
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                    :class="arcadeGame.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ arcadeGame.active ? '● Juego Activo' : 'Pausado' }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">
                  {{ arcadeGame.description || 'Juego 2D interactivo de cámara réflex con ranking de mejores fotógrafos.' }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-3">
                <NuxtLink
                  :to="`/game/${arcadeGame.uuid}`"
                  target="_blank"
                  class="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 hover:bg-slate-800 text-emerald-300 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-500/30"
                >
                  <Icon name="lucide:gamepad-2" class="w-4 h-4 text-emerald-400" />
                  <span>Probar Juego en Vivo</span>
                </NuxtLink>
                <button
                  @click="openQrModalFor(arcadeGame.uuid, arcadeGame.title)"
                  class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Icon name="lucide:qr-code" class="w-4 h-4" />
                  Código QR Juego
                </button>
                <button
                  @click="printTableCardsFor(arcadeGame.uuid, arcadeGame.title, 'ARCADE')"
                  class="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl text-xs border border-gray-200 flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Icon name="lucide:printer" class="w-4 h-4 text-gray-600" />
                  Imprimir Fichas para Mesas
                </button>
                <span v-if="isConnected" class="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-2 rounded-xl border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ranking en Vivo
                </span>
                <button
                  @click="fetchArcadeLeaderboard"
                  class="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors cursor-pointer"
                  title="Refrescar ranking manualmente"
                >
                  <Icon name="lucide:refresh-cw" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Partidas Jugadas</span>
                <span class="text-2xl font-black text-slate-900">{{ arcadeLeaderboard.length }}</span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Puntaje Récord</span>
                <span class="text-2xl font-black text-amber-500 flex items-center gap-1.5">
                  <Icon name="lucide:trophy" class="w-5 h-5 text-amber-500" />
                  {{ arcadeTopScore ? arcadeTopScore.score.toLocaleString() : '0' }}
                </span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Líder Actual</span>
                <span class="text-sm font-black text-emerald-600 truncate block mt-1">
                  {{ arcadeTopScore ? (arcadeTopScore.userFullName || ('@' + arcadeTopScore.username)) : 'Sin récord aún' }}
                </span>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Precisión Media</span>
                <span class="text-2xl font-black text-indigo-600">{{ arcadeAvgAccuracy }}%</span>
              </div>
            </div>
          </div>

          <!-- Leaderboard Table Card -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <Icon name="lucide:award" class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="text-lg font-black text-gray-900">Tabla de Clasificación Paparazzi en Vivo</h4>
                  <p class="text-xs text-gray-500">Ranking en tiempo real con los mejores tiradores y paparazzi del evento</p>
                </div>
              </div>

              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                Top {{ arcadeLeaderboard.length }} Jugadores
              </span>
            </div>

            <!-- Empty Leaderboard -->
            <div v-if="!arcadeLeaderboard.length" class="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Icon name="lucide:crosshair" class="w-6 h-6" />
              </div>
              <p class="text-sm font-bold text-gray-700">Aún no hay puntuaciones registradas</p>
              <p class="text-xs text-gray-400 max-w-sm mx-auto">
                Comparte el código QR o imprime las fichas para las mesas para que los invitados compitan en el juego de cámara.
              </p>
            </div>

            <!-- Table of Scores -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr class="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider font-black">
                    <th class="py-3 px-3">Puesto</th>
                    <th class="py-3 px-3">Paparazzi / Invitado</th>
                    <th class="py-3 px-3 text-right">Puntaje</th>
                    <th class="py-3 px-3 text-center">Precisión</th>
                    <th class="py-3 px-3 text-center">Disparos Perfectos</th>
                    <th class="py-3 px-3 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="entry in arcadeLeaderboard"
                    :key="entry.id"
                    :class="entry.rank === 1 ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50/70 transition-colors'"
                  >
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <span
                        class="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs"
                        :class="entry.rank === 1 ? 'bg-yellow-400 text-slate-950 shadow-sm' : (entry.rank === 2 ? 'bg-slate-200 text-slate-800' : (entry.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600'))"
                      >
                        {{ entry.rank === 1 ? '🥇' : (entry.rank === 2 ? '🥈' : (entry.rank === 3 ? '🥉' : entry.rank)) }}
                      </span>
                    </td>
                    <td class="py-3.5 px-3">
                      <div class="flex items-center gap-3">
                        <img
                          :src="entry.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'"
                          class="w-8 h-8 rounded-full object-cover ring-2 ring-black/5"
                        />
                        <div>
                          <span class="font-bold text-gray-900 block leading-tight">{{ entry.userFullName || entry.username }}</span>
                          <span class="text-[11px] text-gray-400 block">@{{ entry.username }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-3 text-right font-black text-sm whitespace-nowrap" :class="entry.rank === 1 ? 'text-amber-600' : 'text-gray-900'">
                      {{ entry.score.toLocaleString() }} pts
                    </td>
                    <td class="py-3.5 px-3 text-center">
                      <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {{ entry.accuracyPercentage }}%
                      </span>
                    </td>
                    <td class="py-3.5 px-3 text-center text-gray-600 font-bold">
                      🎯 {{ entry.perfectShots }} / {{ entry.shotsTaken }}
                    </td>
                    <td class="py-3.5 px-3 text-right text-gray-400 text-xs whitespace-nowrap">
                      {{ formatTime(entry.playedAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- QR CODE MODAL                                               -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showQrModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 animate-scale-up shadow-2xl">
          <div class="flex items-center justify-between pb-2 border-b border-gray-100">
            <h4 class="text-base font-bold text-gray-900">Código QR de la Dinámica</h4>
            <button @click="showQrModal = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <p class="text-xs text-gray-500">{{ activeQrTitle }}</p>

          <div class="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <canvas ref="qrCanvas" class="max-w-full rounded-xl"></canvas>
          </div>

          <div class="space-y-2">
            <button
              @click="downloadQrPng"
              class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Icon name="lucide:download" class="w-4 h-4" />
              Descargar Imagen PNG
            </button>
            <button
              @click="copyActiveGameLink"
              class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:copy" class="w-4 h-4" />
              Copiar Enlace Directo
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- BIG SCREEN / PROJECTOR LIVE STAGE MODAL                     -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showBigScreenModal" class="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        <!-- Big Screen Header -->
        <div class="flex items-center justify-between pb-6 border-b border-white/10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center border border-yellow-400/30">
              <Icon name="lucide:trophy" class="w-7 h-7" />
            </div>
            <div>
              <span class="text-xs font-black uppercase tracking-widest text-yellow-400">PANTALLA EN VIVO DEL EVENTO</span>
              <h2 class="text-2xl sm:text-4xl font-black text-white">{{ contestGame?.title || 'Torneo de la Mejor Foto' }}</h2>
              <p class="text-xs sm:text-sm text-slate-400">{{ props.eventTitle }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span v-if="isConnected" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              EN VIVO (WEBSOCKET)
            </span>
            <button
              @click="fetchContestStatus"
              class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:refresh-cw" class="w-4 h-4 text-yellow-400" />
              Refrescar Votos
            </button>
            <button
              @click="showBigScreenModal = false"
              class="px-4 py-2 bg-white/10 hover:bg-rose-500/80 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Salir de Pantalla Gigante (ESC)
            </button>
          </div>
        </div>

        <!-- Big Screen Stage Podium -->
        <div class="py-12 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div v-if="!contestStatusData?.podium?.length" class="text-center py-20 text-slate-500">
            Esperando fotos de los invitados...
          </div>

          <div v-else class="grid grid-cols-3 gap-4 sm:gap-10 items-end">
            <!-- 2nd -->
            <div class="flex flex-col items-center text-center">
              <div v-if="contestStatusData.podium[1]" class="space-y-3 mb-4">
                <div class="w-28 h-28 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-slate-300 shadow-2xl bg-slate-900 mx-auto">
                  <img :src="contestStatusData.podium[1].photoUrl" class="w-full h-full object-cover" />
                </div>
                <div class="text-lg sm:text-2xl font-black text-white truncate max-w-[200px]">
                  {{ formatUser(contestStatusData.podium[1].uploaderUsername, contestStatusData.podium[1].uploaderFullName) }}
                </div>
                <span class="px-3 py-1 bg-black/70 rounded-full text-sm font-black text-rose-400 inline-flex items-center gap-1.5 border border-white/10">
                  <Icon name="lucide:heart" class="w-4 h-4 fill-rose-500" />
                  {{ contestStatusData.podium[1].likeCount }} VOTOS
                </span>
              </div>
              <div class="w-full h-40 sm:h-52 bg-gradient-to-t from-slate-700 to-slate-500 rounded-t-3xl flex flex-col items-center justify-center p-4 border-t-4 border-slate-300 shadow-2xl">
                <span class="text-4xl sm:text-7xl font-black text-slate-100">2</span>
                <span class="text-xs sm:text-sm font-black uppercase text-slate-200">Plata 🥈</span>
              </div>
            </div>

            <!-- 1st -->
            <div class="flex flex-col items-center text-center">
              <div v-if="contestStatusData.podium[0]" class="space-y-3 mb-4 relative">
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                  <Icon name="lucide:crown" class="w-12 h-12 fill-yellow-400" />
                </div>
                <div class="w-36 h-36 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-500/50 bg-slate-900 mx-auto ring-8 ring-yellow-400/20">
                  <img :src="contestStatusData.podium[0].photoUrl" class="w-full h-full object-cover" />
                </div>
                <div class="text-xl sm:text-3xl font-black text-yellow-300 truncate max-w-[250px]">
                  {{ formatUser(contestStatusData.podium[0].uploaderUsername, contestStatusData.podium[0].uploaderFullName) }}
                </div>
                <span class="px-4 py-1.5 bg-yellow-400 text-slate-950 rounded-full text-sm font-black inline-flex items-center gap-1.5 shadow-lg">
                  <Icon name="lucide:heart" class="w-4 h-4 fill-slate-950" />
                  {{ contestStatusData.podium[0].likeCount }} VOTOS (LÍDER)
                </span>
              </div>
              <div class="w-full h-56 sm:h-72 bg-gradient-to-t from-yellow-700 via-amber-500 to-yellow-400 rounded-t-3xl flex flex-col items-center justify-center p-4 border-t-4 border-yellow-200 shadow-2xl">
                <span class="text-5xl sm:text-8xl font-black text-slate-950">1</span>
                <span class="text-sm sm:text-base font-black uppercase text-slate-950 tracking-wider">CAMPEÓN 🥇</span>
              </div>
            </div>

            <!-- 3rd -->
            <div class="flex flex-col items-center text-center">
              <div v-if="contestStatusData.podium[2]" class="space-y-3 mb-4">
                <div class="w-28 h-28 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-900 mx-auto">
                  <img :src="contestStatusData.podium[2].photoUrl" class="w-full h-full object-cover" />
                </div>
                <div class="text-lg sm:text-2xl font-black text-white truncate max-w-[200px]">
                  {{ formatUser(contestStatusData.podium[2].uploaderUsername, contestStatusData.podium[2].uploaderFullName) }}
                </div>
                <span class="px-3 py-1 bg-black/70 rounded-full text-sm font-black text-rose-400 inline-flex items-center gap-1.5 border border-white/10">
                  <Icon name="lucide:heart" class="w-4 h-4 fill-rose-500" />
                  {{ contestStatusData.podium[2].likeCount }} VOTOS
                </span>
              </div>
              <div class="w-full h-28 sm:h-36 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-3xl flex flex-col items-center justify-center p-4 border-t-4 border-amber-500 shadow-2xl">
                <span class="text-3xl sm:text-6xl font-black text-amber-100">3</span>
                <span class="text-xs sm:text-sm font-black uppercase text-amber-200">Bronce 🥉</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Big Screen Footer -->
        <div class="text-center pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
          <span>Escanea el QR en tu mesa para votar por tu foto favorita</span>
          <span>Moments • Sistema de Podio en Tiempo Real</span>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import { useGameLiveSync, type GameEventPayload } from '~/composables/useGameLiveSync'

const props = defineProps<{
  eventId: number
  eventTitle: string
}>()

const toast = useToast()
const authStore = useAuthStore()
const { $api } = useNuxtApp()

const loading = ref(true)
const activeMode = ref<'PHOTO_QUEST' | 'PHOTO_CONTEST' | 'PAPARAZZI_ARCADE'>('PHOTO_QUEST')

// Quest Game State
const questGame = ref<any>(null)
const savingQuest = ref(false)
const questForm = reactive({
  title: '',
  description: '',
  challengesPerUser: 3,
  challenges: [] as Array<{ id?: number; title: string; description: string; icon: string; points: number }>
})
const liveFeed = ref<any[]>([])

// Contest Game State
const contestGame = ref<any>(null)
const contestStatusData = ref<any>(null)
const showBigScreenModal = ref(false)
const importingAlbumPhotos = ref(false)
const uploadingContestPhoto = ref(false)

// Arcade Game State (Reto Paparazzi 2D)
const arcadeGame = ref<any>(null)
const arcadeLeaderboard = ref<any[]>([])

const arcadeTopScore = computed(() => {
  if (!arcadeLeaderboard.value.length) return null
  return arcadeLeaderboard.value[0]
})

const arcadeAvgAccuracy = computed(() => {
  if (!arcadeLeaderboard.value.length) return 0
  const sum = arcadeLeaderboard.value.reduce((acc, curr) => acc + (curr.accuracyPercentage || 0), 0)
  return Math.round(sum / arcadeLeaderboard.value.length)
})

// QR Modal State
const showQrModal = ref(false)
const activeQrUrl = ref('')
const activeQrTitle = ref('')
const qrCanvas = ref<HTMLCanvasElement | null>(null)

// Real-time WebSocket synchronization (ultra-lightweight live push)
const { isConnected, lastEventReceived } = useGameLiveSync({
  eventId: computed(() => props.eventId),
  onEvent: (event) => {
    handleRealtimeGameEvent(event)
  },
  onFallbackSync: () => {
    // Gentle periodic heartbeat fallback (every 60s if tab visible)
    if (activeMode.value === 'PHOTO_CONTEST' && contestGame.value) {
      fetchContestStatus()
    } else if (activeMode.value === 'PAPARAZZI_ARCADE' && arcadeGame.value) {
      fetchArcadeLeaderboard()
    } else if (activeMode.value === 'PHOTO_QUEST' && questGame.value) {
      loadLiveFeed()
    }
  }
})

function handleRealtimeGameEvent(event: GameEventPayload) {
  if (!event) return

  switch (event.action) {
    case 'CONTEST_LIKE_TOGGLED': {
      if (!contestStatusData.value) return
      const { photoId, likeCount, totalLikes } = event.data || {}
      if (totalLikes !== undefined) {
        contestStatusData.value.totalLikes = totalLikes
      }
      if (contestStatusData.value.photos) {
        const photo = contestStatusData.value.photos.find((p: any) => p.id === photoId)
        if (photo) {
          photo.likeCount = likeCount
        }
        // Re-sort photos and update podium live
        contestStatusData.value.photos.sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
        contestStatusData.value.photos.forEach((p: any, idx: number) => { p.rank = idx + 1 })
        contestStatusData.value.podium = contestStatusData.value.photos.slice(0, 3)
      }
      break
    }

    case 'CONTEST_PHOTO_ADDED': {
      if (!contestStatusData.value) {
        fetchContestStatus()
        return
      }
      const newPhoto = event.data
      if (newPhoto && contestStatusData.value.photos) {
        const exists = contestStatusData.value.photos.some((p: any) => p.id === newPhoto.id)
        if (!exists) {
          contestStatusData.value.photos.unshift(newPhoto)
          contestStatusData.value.totalPhotos = (contestStatusData.value.totalPhotos || 0) + 1
          contestStatusData.value.photos.sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
          contestStatusData.value.photos.forEach((p: any, idx: number) => { p.rank = idx + 1 })
          contestStatusData.value.podium = contestStatusData.value.photos.slice(0, 3)
          toast.info('Nueva foto en el concurso', `@${newPhoto.uploaderUsername || 'Invitado'} sumó una fotografía`)
        }
      }
      break
    }

    case 'CONTEST_WINNER_DECLARED': {
      if (!contestStatusData.value) return
      const { winnerPhotoId } = event.data || {}
      contestStatusData.value.winnerPhotoId = winnerPhotoId
      if (contestStatusData.value.photos) {
        contestStatusData.value.photos.forEach((p: any) => {
          p.winner = (p.id === winnerPhotoId)
        })
      }
      toast.success('👑 ¡Ganador Coronado!', 'Se ha proclamado oficialmente la foto ganadora del evento.')
      break
    }

    case 'CONTEST_STATUS_CHANGED': {
      if (!contestStatusData.value) return
      const { contestStatus } = event.data || {}
      if (contestStatus) {
        contestStatusData.value.contestStatus = contestStatus
      }
      break
    }

    case 'CONTEST_PHOTO_DELETED': {
      if (!contestStatusData.value || !contestStatusData.value.photos) return
      const { photoId, totalPhotos, totalLikes } = event.data || {}
      contestStatusData.value.photos = contestStatusData.value.photos.filter((p: any) => p.id !== photoId)
      if (totalPhotos !== undefined) contestStatusData.value.totalPhotos = totalPhotos
      if (totalLikes !== undefined) contestStatusData.value.totalLikes = totalLikes
      contestStatusData.value.photos.forEach((p: any, idx: number) => { p.rank = idx + 1 })
      contestStatusData.value.podium = contestStatusData.value.photos.slice(0, 3)
      break
    }

    case 'ARCADE_SCORE_SUBMITTED': {
      const { scoreItem, totalPlays } = event.data || {}
      if (arcadeGame.value && totalPlays !== undefined) {
        arcadeGame.value.totalPlays = totalPlays
      }
      if (scoreItem) {
        const exists = arcadeLeaderboard.value.some((s: any) => s.id === scoreItem.id)
        if (!exists) {
          arcadeLeaderboard.value.push(scoreItem)
          arcadeLeaderboard.value.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
          arcadeLeaderboard.value = arcadeLeaderboard.value.slice(0, 15)
          arcadeLeaderboard.value.forEach((s: any, idx: number) => { s.rank = idx + 1 })
          toast.info('Nueva puntuación arcade', `${scoreItem.fullName || scoreItem.username} obtuvo ${scoreItem.score} pts`)
        }
      }
      break
    }

    case 'QUEST_PHOTO_SUBMITTED': {
      const feedItem = event.data
      if (feedItem) {
        const exists = liveFeed.value.some((f: any) => f.assignmentId === feedItem.assignmentId)
        if (!exists) {
          liveFeed.value.unshift(feedItem)
          if (liveFeed.value.length > 25) {
            liveFeed.value = liveFeed.value.slice(0, 25)
          }
          toast.info('¡Reto completado!', `${feedItem.participantName || feedItem.participantUsername} completó: ${feedItem.challengeTitle}`)
        }
      }
      break
    }
  }
}

function switchSelectedMode(mode: 'PHOTO_QUEST' | 'PHOTO_CONTEST' | 'PAPARAZZI_ARCADE') {
  activeMode.value = mode
  if (mode === 'PHOTO_CONTEST' && contestGame.value) {
    fetchContestStatus()
  } else if (mode === 'PAPARAZZI_ARCADE' && arcadeGame.value) {
    fetchArcadeLeaderboard()
  }
}

async function loadAllGames() {
  loading.value = true
  try {
    const res: any = await $api(`/events/${props.eventId}/games`)

    if (Array.isArray(res)) {
      questGame.value = res.find((g: any) => g.gameType === 'PHOTO_QUEST' || g.gameType === 'ROULETTE') || null
      contestGame.value = res.find((g: any) => g.gameType === 'PHOTO_CONTEST') || null
      arcadeGame.value = res.find((g: any) => g.gameType === 'PAPARAZZI_ARCADE') || null

      if (questGame.value) {
        questForm.title = questGame.value.title
        questForm.description = questGame.value.description || ''
        questForm.challengesPerUser = questGame.value.challengesPerUser || 3
        questForm.challenges = (questGame.value.challenges || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          icon: c.icon || 'lucide:camera',
          points: c.points || 100
        }))
        loadLiveFeed()
      }

      if (contestGame.value) {
        fetchContestStatus()
      }

      if (arcadeGame.value) {
        fetchArcadeLeaderboard()
      }
    }
  } catch (err) {
    console.error('Error loading games:', err)
  } finally {
    loading.value = false
  }
}

// -------------------------------------------------------------
// QUEST GAME LOGIC
// -------------------------------------------------------------
function initQuestTemplate(templateType: 'WEDDING' | 'PARTY' | 'CORPORATE') {
  let title = 'Misión Fotográfica'
  let challenges: string[] = []

  if (templateType === 'WEDDING') {
    title = 'Misión Fotográfica de la Boda'
    challenges = [
      'Foto con la novia o los novios',
      'Foto de los zapatos del novio',
      'Foto con alguien que tenga buzo o vestido azul',
      'Selfie con la mesa más animada',
      'Foto brindando con una copa',
      'El mejor paso de baile en la pista',
      'Foto con alguien que acabas de conocer hoy'
    ]
  } else if (templateType === 'PARTY') {
    title = 'Retos Locos de la Fiesta'
    challenges = [
      'Selfie con el cumpleañero/anfitrión',
      'Foto con la persona con el peinado más curioso',
      'El brindis más épico de tu mesa',
      'Foto con alguien con camisa o vestido rojo',
      'Tu mejor pose de modelo en la fiesta',
      'Foto de la comida o bebida favorita de hoy'
    ]
  } else {
    title = 'Rally Fotográfico de Integración'
    challenges = [
      'Selfie con un compañero de otra área',
      'Foto con el jefe o líder de equipo sonriendo',
      'El apretón de manos más formal o gracioso',
      'Foto con alguien que vista el color de la empresa',
      'Foto en equipo celebrando un logro'
    ]
  }

  questForm.title = title
  questForm.description = 'Toma fotos divertidas de la fiesta según tus retos asignados y compártelas en el muro en vivo.'
  questForm.challengesPerUser = 3
  questForm.challenges = challenges.map((t) => ({
    title: t,
    description: '',
    icon: 'lucide:camera',
    points: 100
  }))

  saveQuestGame()
}

function addChallengeRow() {
  questForm.challenges.push({
    title: '',
    description: '',
    icon: 'lucide:camera',
    points: 100
  })
}

function removeChallengeRow(index: number) {
  questForm.challenges.splice(index, 1)
}

function addSuggestedChallenges() {
  const suggestions = [
    'Foto con alguien con gafas divertidas',
    'Foto haciendo un choque de puños con alguien nuevo',
    'Selfie grupal con al menos 4 personas sonriendo',
    'Foto del postre o pastel antes de que se acabe',
    'El mejor paso de baile con tus amigos'
  ]
  suggestions.forEach((s) => {
    questForm.challenges.push({
      title: s,
      description: '',
      icon: 'lucide:camera',
      points: 100
    })
  })
  toast.success('Retos agregados', 'Se han sumado 5 retos populares al banco.')
}

async function saveQuestGame() {
  if (!questForm.title.trim()) {
    toast.error('Título requerido', 'Por favor ingresa un título para la dinámica.')
    return
  }

  savingQuest.value = true
  try {
    const payload = {
      title: questForm.title,
      description: questForm.description,
      gameType: 'PHOTO_QUEST',
      challengesPerUser: questForm.challengesPerUser,
      active: true,
      challenges: questForm.challenges
    }

    const res: any = await $api(`/events/${props.eventId}/games`, {
      method: 'POST',
      body: payload
    })

    questGame.value = res
    toast.success('¡Dinámica guardada!', 'Los retos y configuración se han guardado con éxito.')
  } catch (e: any) {
    toast.error('Error al guardar', e.message || 'No se pudo guardar la configuración.')
  } finally {
    savingQuest.value = false
  }
}

async function loadLiveFeed() {
  if (!questGame.value?.uuid) return
  try {
    const res: any = await $api(`/games/${questGame.value.uuid}/live-feed?limit=20`)
    liveFeed.value = res || []
  } catch (err) {
    console.error('Error loading live feed:', err)
  }
}

// -------------------------------------------------------------
// CONTEST GAME LOGIC
// -------------------------------------------------------------
async function initContestGame() {
  try {
    const payload = {
      title: '🏆 Concurso: La Mejor Foto de la Noche',
      description: '¡Sube tus mejores fotos de la fiesta! Todos los invitados votarán con likes y la foto con más votos se llevará el podio al final del evento.',
      gameType: 'PHOTO_CONTEST',
      challengesPerUser: 1,
      active: true,
      challenges: []
    }

    const res: any = await $api(`/events/${props.eventId}/games`, {
      method: 'POST',
      body: payload
    })

    contestGame.value = res
    toast.success('¡Concurso activado!', 'Se ha creado el torneo de fotos con podio para tu evento.')
    fetchContestStatus()
  } catch (e: any) {
    toast.error('Error', e.message || 'No se pudo activar el concurso de fotos.')
  }
}

async function fetchContestStatus() {
  if (!contestGame.value?.uuid) return
  try {
    const res: any = await $api(`/games/${contestGame.value.uuid}/contest`)
    contestStatusData.value = res
  } catch (err) {
    console.error('Error fetching contest status:', err)
  }
}

async function changeContestStatus(status: string) {
  if (!contestGame.value?.uuid) return
  try {
    const res: any = await $api(`/games/${contestGame.value.uuid}/contest/status`, {
      method: 'POST',
      body: { status }
    })
    contestStatusData.value = res
    toast.success('Estado actualizado', `El concurso ahora está: ${status}`)
  } catch (err: any) {
    toast.error('Error', err.message || 'No se pudo actualizar el estado del concurso.')
  }
}

async function crownWinner(photoId: number) {
  if (!contestGame.value?.uuid) return
  try {
    const res: any = await $api(`/games/${contestGame.value.uuid}/contest/winner/${photoId}`, {
      method: 'POST'
    })
    contestStatusData.value = res
    toast.success('👑 ¡Ganador Oficial Coronado!', 'Se ha coronado la foto ganadora del evento con éxito.')
  } catch (err: any) {
    toast.error('Error', err.message || 'No se pudo coronar al ganador.')
  }
}

async function deleteContestPhoto(photoId: number) {
  if (!confirm('¿Estás seguro de eliminar esta fotografía del concurso?')) return
  if (!contestGame.value?.uuid) return
  try {
    await $api(`/games/${contestGame.value.uuid}/contest/photos/${photoId}`, {
      method: 'DELETE'
    })
    toast.success('Foto eliminada', 'La fotografía fue retirada del concurso.')
    fetchContestStatus()
  } catch (err: any) {
    toast.error('Error', err.message || 'No se pudo eliminar la foto.')
  }
}

function openContestBigScreen() {
  showBigScreenModal.value = true
  fetchContestStatus()
}

async function importAlbumPhotos() {
  if (!contestGame.value?.uuid) return
  importingAlbumPhotos.value = true
  try {
    const res: any = await $api(`/games/${contestGame.value.uuid}/contest/import-album-photos`, {
      method: 'POST'
    })
    contestStatusData.value = res
    toast.success('¡Fotos cargadas al concurso!', 'Se han importado las fotografías del álbum para la votación.')
  } catch (err: any) {
    toast.error('Error al importar fotos', err.message || 'No se pudieron importar las fotos del álbum.')
  } finally {
    importingAlbumPhotos.value = false
  }
}

async function handleDirectContestUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0 || !contestGame.value?.uuid) return
  uploadingContestPhoto.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || ''
    let uploadedCount = 0
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      formData.append('caption', 'Foto oficial del evento')
      await $fetch(`${apiBase}/games/${contestGame.value.uuid}/contest/photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        },
        body: formData
      })
      uploadedCount++
    }
    toast.success('¡Fotos subidas al concurso!', `Se han cargado ${uploadedCount} fotografías al concurso.`)
    await fetchContestStatus()
  } catch (err: any) {
    toast.error('Error al subir fotos al concurso', (err as any).message || 'No se pudo subir la foto.')
  } finally {
    uploadingContestPhoto.value = false
    target.value = ''
  }
}

// -------------------------------------------------------------
// ARCADE GAME LOGIC (RETO PAPARAZZI 2D)
// -------------------------------------------------------------
async function initArcadeGame() {
  try {
    const payload = {
      title: '📸 Reto Paparazzi 2D: Enfoque Perfecto',
      description: '¡Apunta el visor de tu cámara réflex 2D, enfoca en verde neon a novios, copas y bailarines, y compite por el top 1 del ranking!',
      gameType: 'PAPARAZZI_ARCADE',
      challengesPerUser: 1,
      active: true,
      challenges: []
    }

    const res: any = await $api(`/events/${props.eventId}/games`, {
      method: 'POST',
      body: payload
    })

    arcadeGame.value = res
    toast.success('¡Reto Paparazzi 2D activado!', 'Se ha creado el juego de cámara interactiva para tu evento.')
    fetchArcadeLeaderboard()
  } catch (e: any) {
    toast.error('Error', e.message || 'No se pudo activar el juego de cámara.')
  }
}

async function fetchArcadeLeaderboard() {
  if (!arcadeGame.value?.uuid) return
  try {
    const res: any = await $api(`/games/${arcadeGame.value.uuid}/arcade/leaderboard`)
    arcadeLeaderboard.value = res || []
  } catch (err) {
    console.error('Error fetching arcade leaderboard:', err)
  }
}

// -------------------------------------------------------------
// QR AND PRINTING
// -------------------------------------------------------------
function openQrModalFor(uuid: string, title: string) {
  const origin = window.location.origin
  activeQrUrl.value = `${origin}/game/${uuid}`
  activeQrTitle.value = title
  showQrModal.value = true
  nextTick(() => renderQrCanvas())
}

async function renderQrCanvas() {
  if (!activeQrUrl.value || !qrCanvas.value) return
  try {
    await QRCode.toCanvas(qrCanvas.value, activeQrUrl.value, {
      width: 250,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('Error rendering QR:', err)
  }
}

function copyActiveGameLink() {
  if (navigator.clipboard && activeQrUrl.value) {
    navigator.clipboard.writeText(activeQrUrl.value)
    toast.success('Enlace copiado', 'El enlace directo del juego ha sido copiado al portapapeles.')
  }
}

function downloadQrPng() {
  if (!qrCanvas.value) return
  const a = document.createElement('a')
  a.href = qrCanvas.value.toDataURL('image/png')
  a.download = `QR_${activeQrTitle.value.replace(/\\s+/g, '_')}.png`
  a.click()
}

function printTableCardsFor(uuid: string, title: string, type: 'QUEST' | 'CONTEST' | 'ARCADE') {
  const origin = window.location.origin
  const qrUrl = `${origin}/game/${uuid}`
  const eventName = props.eventTitle

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  QRCode.toDataURL(qrUrl, { width: 300, margin: 1 }, (err, url) => {
    if (err) return
    const badgeText = type === 'CONTEST' ? '🏆 CONCURSO DE FOTOS & PODIO' : (type === 'ARCADE' ? '🎮 RETO PAPARAZZI 2D' : '📸 RETOS FOTOGRÁFICOS')
    const step1 = '1. Escanea el código con la cámara de tu celular'
    const step2 = type === 'CONTEST' ? '2. Sube tus mejores fotos de la fiesta' : (type === 'ARCADE' ? '2. Mueve la cámara 2D y enfoca objetivos flotantes' : '2. Recibe tus retos fotográficos secretos')
    const step3 = type === 'CONTEST' ? '3. Vota con ❤️ por tus favoritas y ¡gana el podio!' : (type === 'ARCADE' ? '3. Dispara a tiempo, acumula combos y ¡sé el #1!' : '3. Toma o sube las fotos y ¡gana en la fiesta!')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fichas de Mesa - ${eventName}</title>
        <style>
          @page { size: letter portrait; margin: 1cm; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background: #fff; color: #1e293b; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .card { border: 2px dashed #cbd5e1; border-radius: 20px; padding: 30px; text-align: center; page-break-inside: avoid; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 10px; }
          h2 { margin: 5px 0; font-size: 20px; font-weight: 900; color: #0f172a; }
          p.sub { font-size: 12px; color: #64748b; margin: 0 0 15px; }
          .qr-img { width: 170px; height: 170px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 6px; }
          .instructions { margin-top: 15px; font-size: 11px; color: #334155; line-height: 1.5; font-weight: 600; }
          .step { background: #f8fafc; border-radius: 8px; padding: 6px 10px; margin: 4px 0; text-align: left; }
          .brand { margin-top: 15px; font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="grid">
          ${[1, 2, 3, 4].map(() => `
            <div class="card">
              <span class="badge">${badgeText}</span>
              <h2>${title}</h2>
              <p class="sub">${eventName}</p>
              <img src="${url}" class="qr-img" />
              <div class="instructions">
                <div class="step">${step1}</div>
                <div class="step">${step2}</div>
                <div class="step">${step3}</div>
              </div>
              <div class="brand">Moments • Galería Oficial del Evento</div>
            </div>
          `).join('')}
        </div>
        <script>
          window.onload = function() { window.print(); }
        <\\/script>
      </body>
      </html>
    `)
    printWindow.document.close()
  })
}

function formatTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatUser(username?: string, fullName?: string) {
  if (username && username.trim()) {
    const clean = username.trim().replace(/^@+/, '')
    if (clean) return `@${clean}`
  }
  if (fullName && fullName.trim()) {
    return fullName.trim()
  }
  return 'Invitado'
}

onMounted(() => {
  loadAllGames()
})
</script>
