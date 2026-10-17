<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 font-sans pb-24 relative overflow-hidden">
    <!-- Glowing background elements -->
    <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
    <div class="fixed top-[40%] right-[-10%] w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed bottom-[-10%] left-[20%] w-[550px] h-[550px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="max-w-2xl mx-auto px-4 pt-6 sm:pt-10 sm:px-6 relative z-10">

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 text-center">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <h3 class="text-base font-bold text-white">Cargando dinámica del evento...</h3>
        <p class="text-xs text-slate-400 mt-1">Preparando la cámara y la diversión</p>
      </div>

      <!-- Game Not Found or Inactive -->
      <div v-else-if="error" class="bg-slate-900/80 border border-white/10 rounded-3xl p-8 text-center space-y-4 backdrop-blur-xl">
        <div class="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <Icon name="lucide:alert-circle" class="w-7 h-7" />
        </div>
        <h3 class="text-xl font-black text-white">Dinámica no disponible</h3>
        <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">{{ error }}</p>
        <button
          @click="router.push('/marketplace')"
          class="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Ir al Inicio
        </button>
      </div>

      <!-- UNAUTHENTICATED GUEST HERO -->
      <div v-else-if="!authStore.isAuthenticated" class="bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-center backdrop-blur-xl shadow-2xl space-y-6">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <Icon :name="publicGameInfo?.gameType === 'PHOTO_CONTEST' ? 'lucide:trophy' : (publicGameInfo?.gameType === 'PAPARAZZI_ARCADE' ? 'lucide:crosshair' : 'lucide:gamepad-2')" class="w-9 h-9" />
        </div>

        <div>
          <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {{ publicGameInfo?.gameType === 'PHOTO_CONTEST' ? 'TORNEO DE FOTOS DEL EVENTO' : (publicGameInfo?.gameType === 'PAPARAZZI_ARCADE' ? 'RETO PAPARAZZI 2D INTERACTIVO' : 'DINÁMICA OFICIAL DEL EVENTO') }}
          </span>
          <h1 class="text-2xl sm:text-3xl font-black text-white mt-3">
            {{ publicGameInfo?.title || 'Dinámica del Evento' }}
          </h1>
          <p class="text-xs sm:text-sm text-amber-400 font-bold mt-1">
            {{ publicGameInfo?.eventTitle || 'Evento Oficial' }}
          </p>
          <p class="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-md mx-auto">
            <template v-if="publicGameInfo?.gameType === 'PHOTO_CONTEST'">
              ¡Sube tus mejores fotos de la fiesta, <strong class="text-white">recibe likes de todos los invitados</strong> y compite por el primer lugar en el podio!
            </template>
            <template v-else-if="publicGameInfo?.gameType === 'PAPARAZZI_ARCADE'">
              ¡Conviértete en el fotógrafo estrella del evento! Controla el visor 2D de una cámara retro, <strong class="text-white">consigue el enfoque perfecto</strong> en objetivos flotantes, acumula combos y compite en el ranking en vivo.
            </template>
            <template v-else>
              ¡Bienvenido a la dinámica! Para recibir tus <strong class="text-white">retos fotográficos secretos</strong>, tomar fotos divertidas de la fiesta y compartirlas en el muro en vivo, inicia sesión o regístrate en segundos.
            </template>
          </p>
        </div>

        <!-- Auth Actions with Clean Redirects -->
        <div class="space-y-3 pt-2 max-w-xs mx-auto">
          <NuxtLink
            :to="`/login?redirect=/game/${route.params.uuid}`"
            class="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Icon name="lucide:log-in" class="w-4 h-4" />
            <span>{{ publicGameInfo?.gameType === 'PHOTO_CONTEST' ? 'Iniciar Sesión para Votar y Subir' : 'Iniciar Sesión para Jugar' }}</span>
          </NuxtLink>

          <NuxtLink
            :to="`/register?redirect=/game/${route.params.uuid}`"
            class="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Icon name="lucide:user-plus" class="w-4 h-4" />
            <span>¿No tienes cuenta? Regístrate</span>
          </NuxtLink>
        </div>

        <div class="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <Icon name="lucide:camera" class="w-3.5 h-3.5 text-amber-400" />
          <span>Toma fotos directamente desde la cámara sin descargar nada</span>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- VIEW A: PHOTO CONTEST (TORNEO DE LIKES & PODIO)             -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div v-else-if="isContestMode && contestData" class="space-y-6">

        <!-- Top Header Card -->
        <div class="bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-amber-950/40 border border-yellow-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 flex items-center justify-center shrink-0">
                <Icon name="lucide:trophy" class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-yellow-400">Torneo en Vivo</span>
                <h2 class="text-lg sm:text-xl font-black text-white leading-tight">{{ contestData.gameTitle }}</h2>
                <p class="text-xs text-slate-400">{{ contestData.eventTitle }}</p>
              </div>
            </div>

            <div class="text-right">
              <span
                class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                :class="contestData.contestStatus === 'CLOSED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'"
              >
                {{ contestData.contestStatus === 'CLOSED' ? '🔴 Finalizado' : '🔥 Votaciones Abiertas' }}
              </span>
            </div>
          </div>

          <!-- Official Winner Callout if Crowned -->
          <div v-if="crownedWinnerPhoto" class="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/30 to-yellow-500/20 border border-yellow-400/50 flex items-center gap-3.5 shadow-lg">
            <div class="w-12 h-12 rounded-xl overflow-hidden border-2 border-yellow-400 shrink-0">
              <img :src="crownedWinnerPhoto.photoUrl" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-black uppercase tracking-wider text-yellow-400 flex items-center gap-1">
                <Icon name="lucide:crown" class="w-3.5 h-3.5" /> GANADOR OFICIAL DEL EVENTO
              </span>
              <p class="text-xs sm:text-sm font-black text-white truncate">@{{ crownedWinnerPhoto.uploaderUsername }}</p>
              <p class="text-[11px] text-yellow-200/80">{{ crownedWinnerPhoto.likeCount }} votos conseguidos</p>
            </div>
          </div>

          <!-- Mini Podium (Top 3) Preview -->
          <div v-if="contestData.podium?.length" class="pt-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Líderes Actuales del Podio</span>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(item, idx) in contestData.podium"
                :key="item.id"
                class="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-left"
              >
                <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0 border" :class="idx === 0 ? 'border-yellow-400' : (idx === 1 ? 'border-slate-300' : 'border-amber-600')">
                  <img :src="item.photoUrl" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[9px] font-black uppercase block truncate" :class="idx === 0 ? 'text-yellow-400' : 'text-slate-300'">
                    {{ idx === 0 ? '🥇 #1' : (idx === 1 ? '🥈 #2' : '🥉 #3') }}
                  </span>
                  <span class="text-[11px] font-bold text-rose-400 flex items-center gap-0.5">
                    <Icon name="lucide:heart" class="w-2.5 h-2.5 fill-rose-500" />
                    {{ item.likeCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Action Button to Upload Photo -->
          <div v-if="contestData.contestStatus !== 'CLOSED'" class="pt-2">
            <button
              type="button"
              @click="openContestUploadModal"
              class="w-full py-3.5 px-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Icon name="lucide:camera" class="w-5 h-5 text-slate-950" />
              <span>¡Subir mi Foto al Concurso!</span>
            </button>
          </div>
        </div>

        <!-- Filter / Sorter Tabs -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex p-1 bg-slate-900 rounded-xl border border-white/10">
            <button
              type="button"
              @click="contestSort = 'rank'"
              class="px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer"
              :class="contestSort === 'rank' ? 'bg-yellow-400 text-slate-950' : 'text-slate-400 hover:text-white'"
            >
              🔥 Podio / Más Votadas
            </button>
            <button
              type="button"
              @click="contestSort = 'recent'"
              class="px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer"
              :class="contestSort === 'recent' ? 'bg-yellow-400 text-slate-950' : 'text-slate-400 hover:text-white'"
            >
              ✨ Más Recientes
            </button>
          </div>

          <span class="text-xs text-slate-400 font-semibold">{{ contestData.totalPhotos }} fotos</span>
        </div>

        <!-- Contest Photos Feed -->
        <div v-if="!sortedContestPhotos.length" class="py-16 text-center text-slate-400 space-y-3 bg-slate-900/50 rounded-3xl border border-white/5">
          <Icon name="lucide:camera-off" class="w-10 h-10 mx-auto text-slate-600" />
          <h4 class="text-sm font-bold text-white">Aún no hay fotos en este concurso</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">¡Sé el primero en subir una foto y liderar el podio con los primeros votos!</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="photo in sortedContestPhotos"
            :key="photo.id"
            class="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md"
          >
            <!-- Card Header: User info + Rank badge -->
            <div class="p-4 flex items-center justify-between border-b border-white/5">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-yellow-400 overflow-hidden">
                  <img v-if="photo.uploaderAvatar" :src="photo.uploaderAvatar" class="w-full h-full object-cover" />
                  <span v-else>{{ photo.uploaderUsername?.[0]?.toUpperCase() || 'U' }}</span>
                </div>
                <div>
                  <span class="text-xs font-bold text-white block">@{{ photo.uploaderUsername }}</span>
                  <span class="text-[10px] text-slate-400">{{ formatRelativeTime(photo.createdAt) }}</span>
                </div>
              </div>

              <!-- Rank Badge -->
              <div class="flex items-center gap-2">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1"
                  :class="photo.rank === 1 ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/20' : (photo.rank === 2 ? 'bg-slate-300 text-slate-950' : (photo.rank === 3 ? 'bg-amber-600 text-white' : 'bg-white/10 text-slate-300'))"
                >
                  <span>#{{ photo.rank }}</span>
                  <span v-if="photo.rank === 1">🥇</span>
                  <span v-else-if="photo.rank === 2">🥈</span>
                  <span v-else-if="photo.rank === 3">🥉</span>
                </span>
              </div>
            </div>

            <!-- Image with double tap to like -->
            <div class="relative aspect-square sm:aspect-[4/3] bg-black overflow-hidden select-none cursor-pointer" @dblclick="triggerDoubleTapLike(photo)">
              <img :src="photo.photoUrl" class="w-full h-full object-cover" />
              
              <!-- Floating Heart Burst Animation on Double Tap -->
              <Transition name="heart-pop">
                <div v-if="photo._doubleTapEffect" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Icon name="lucide:heart" class="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-ping" />
                </div>
              </Transition>

              <!-- Crown on Photo if Winner -->
              <div v-if="photo.winner" class="absolute top-3 left-3 bg-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                <Icon name="lucide:crown" class="w-3.5 h-3.5 fill-slate-950" />
                <span>GANADOR OFICIAL</span>
              </div>
            </div>

            <!-- Card Footer: Likes, Caption, Delete -->
            <div class="p-4 space-y-2">
              <div class="flex items-center justify-between">
                <!-- Like Button -->
                <button
                  type="button"
                  @click="toggleLike(photo)"
                  :disabled="contestData.contestStatus === 'CLOSED'"
                  class="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90 cursor-pointer"
                  :class="photo.likedByCurrentUser 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'"
                >
                  <Icon 
                    name="lucide:heart" 
                    class="w-4 h-4 transition-transform duration-200" 
                    :class="photo.likedByCurrentUser ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300'" 
                  />
                  <span>{{ photo.likeCount }} {{ photo.likeCount === 1 ? 'voto' : 'votos' }}</span>
                </button>

                <!-- Delete if photo owner -->
                <button
                  v-if="photo.uploaderUsername === authStore.user?.username || contestData.isOwner"
                  type="button"
                  @click="deleteMyContestPhoto(photo.id)"
                  class="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Eliminar mi foto"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>

              <!-- Caption -->
              <p v-if="photo.caption" class="text-xs sm:text-sm text-slate-200">
                <strong class="text-white">@{{ photo.uploaderUsername }}</strong> {{ photo.caption }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- VIEW B: PHOTO QUEST (RETOS FOTOGRÁFICOS & RULETA)           -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div v-else-if="status" class="space-y-6">

        <!-- Header Card -->
        <div class="bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-xl">
          <div class="flex items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Icon name="lucide:camera" class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-400">Juego en Vivo</span>
                <h2 class="text-lg sm:text-xl font-black text-white leading-tight">{{ status.gameTitle }}</h2>
                <p class="text-xs text-slate-400">{{ status.eventTitle }}</p>
              </div>
            </div>

            <div class="text-right">
              <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {{ status.completedCount }} / {{ status.totalAssigned }} Retos
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-1.5 pt-2">
            <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
              <div
                class="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>{{ progressPercentage }}% Completado</span>
              <span class="text-amber-400">Puntaje: {{ totalScore }} pts</span>
            </div>
          </div>

          <!-- All Completed Victory Callout -->
          <div v-if="status.isCompleted" class="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-400/40 text-center space-y-1 animate-bounce" style="animation-duration: 2s;">
            <p class="text-sm font-black text-emerald-300 flex items-center justify-center gap-1.5">
              <Icon name="lucide:trophy" class="w-4 h-4 text-yellow-300" />
              ¡FELICITACIONES, MISIÓN CUMPLIDA!
            </p>
            <p class="text-xs text-slate-300">Has completado todos tus retos fotográficos. ¡Eres el alma de la fiesta!</p>
          </div>
        </div>

        <!-- Gameplay Navigation Tabs -->
        <div class="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            @click="activeTab = 'challenges'"
            :class="['flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                     activeTab === 'challenges' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white']"
          >
            <Icon name="lucide:list-checks" class="w-4 h-4" />
            <span>Mis Retos ({{ status.assignments?.length || 0 }})</span>
          </button>
          <button
            @click="activeTab = 'roulette'"
            :class="['flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                     activeTab === 'roulette' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white']"
          >
            <Icon name="lucide:sparkles" class="w-4 h-4" />
            <span>Ruleta de Retos Extra</span>
          </button>
          <button
            @click="activeTab = 'feed'; loadFeed()"
            :class="['flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                     activeTab === 'feed' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white']"
          >
            <Icon name="lucide:activity" class="w-4 h-4" />
            <span>Muro en Vivo</span>
          </button>
        </div>

        <!-- TAB: MY CHALLENGES -->
        <div v-if="activeTab === 'challenges'" class="space-y-4">
          <div
            v-for="(item, idx) in status.assignments"
            :key="item.assignmentId"
            class="bg-slate-900/90 border rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all"
            :class="item.completed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-white/10 hover:border-amber-500/40'"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3.5 flex-1">
                <div
                  class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                  :class="item.completed ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'"
                >
                  <Icon :name="item.completed ? 'lucide:check-circle-2' : (item.icon || 'lucide:camera')" class="w-5 h-5" />
                </div>

                <div class="space-y-1 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Reto #{{ idx + 1 }}</span>
                    <span class="text-[10px] font-bold text-amber-400">+{{ item.points }} pts</span>
                  </div>
                  <h3 class="text-base font-bold text-white leading-snug">{{ item.title }}</h3>
                  <p v-if="item.description" class="text-xs text-slate-400">{{ item.description }}</p>
                </div>
              </div>

              <!-- Completion Status Badge -->
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0"
                :class="item.completed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'"
              >
                {{ item.completed ? 'Completado' : 'Pendiente' }}
              </span>
            </div>

            <!-- Completed Photo Preview or Upload Trigger -->
            <div class="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div v-if="item.completed && item.photoUrl" class="flex items-center gap-3">
                <img :src="item.photoUrl" class="w-12 h-12 rounded-xl object-cover border border-emerald-500/30 shadow-md" />
                <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Icon name="lucide:check" class="w-3.5 h-3.5" />
                  Foto subida con éxito
                </span>
              </div>
              <div v-else class="text-xs text-slate-400">
                Toma la foto con tu celular para superar esta misión.
              </div>

              <!-- Camera / Upload Button with capture="environment" -->
              <div class="flex items-center gap-2">
                <label
                  class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
                  :class="item.completed ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/20'"
                >
                  <Icon name="lucide:camera" class="w-4 h-4" />
                  <span>{{ item.completed ? 'Cambiar Foto' : 'Tomar Foto / Subir' }}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    class="hidden"
                    @change="handleFileUpload($event, item.assignmentId)"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: ROULETTE -->
        <div v-if="activeTab === 'roulette'" class="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-xl text-center space-y-6">
          <div>
            <div class="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
              <Icon name="lucide:sparkles" class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-black text-white">Ruleta de Retos Espontáneos</h3>
            <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              ¿Quieres un reto sorpresa? Gira la ruleta para obtener una misión fotográfica espontánea en este instante.
            </p>
          </div>

          <!-- Roulette Display Box -->
          <div class="p-6 sm:p-8 bg-slate-950/80 rounded-2xl border border-amber-500/20 min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden">
            <Transition name="scale" mode="out-in">
              <div v-if="spinningRoulette" class="flex flex-col items-center gap-2 text-amber-400">
                <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin" />
                <span class="text-xs font-black uppercase tracking-widest animate-pulse">Girando la ruleta...</span>
              </div>
              <div v-else-if="rouletteChallenge" :key="rouletteChallenge.id" class="space-y-2 animate-scale-up">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ¡Tu Reto Sorpresa!
                </span>
                <h4 class="text-lg sm:text-xl font-black text-white">{{ rouletteChallenge.title }}</h4>
                <p v-if="rouletteChallenge.description" class="text-xs text-slate-400">{{ rouletteChallenge.description }}</p>
              </div>
              <div v-else class="text-xs text-slate-500">
                Presiona el botón para girar la ruleta
              </div>
            </Transition>
          </div>

          <button
            type="button"
            @click="spinRoulette"
            :disabled="spinningRoulette"
            class="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Icon name="lucide:refresh-cw" class="w-4 h-4" :class="{ 'animate-spin': spinningRoulette }" />
            <span>Girar Ruleta</span>
          </button>
        </div>

        <!-- TAB: LIVE FEED -->
        <div v-if="activeTab === 'feed'" class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <span class="text-xs font-bold text-slate-400">Fotos subidas por otros invitados</span>
            <button @click="loadFeed" class="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              <Icon name="lucide:refresh-cw" class="w-3 h-3" /> Actualizar
            </button>
          </div>

          <div v-if="feedItems.length === 0" class="py-16 text-center text-slate-500 text-xs">
            Aún no hay fotos en el muro. ¡Sé el primero en subir una!
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="item in feedItems"
              :key="item.assignmentId"
              class="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-sm"
            >
              <img :src="item.photoUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                <span class="text-[9px] font-black uppercase text-amber-400 truncate">{{ item.challengeTitle }}</span>
                <span class="text-[11px] font-bold truncate">@{{ item.participantUsername }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- VIEW C: PAPARAZZI ARCADE (JUEGO 2D INTERACTIVO DE CÁMARA)   -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div v-else-if="isArcadeMode" class="space-y-6">
        <CameraArcadeGame
          :game-uuid="String(route.params.uuid)"
          :event-title="publicGameInfo?.eventTitle || ''"
        />
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- MODAL: SUBIR FOTO AL CONCURSO                               -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showContestUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-5 animate-scale-up shadow-2xl text-white">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 class="text-base font-bold text-white flex items-center gap-2">
              <Icon name="lucide:camera" class="w-5 h-5 text-yellow-400" />
              Subir Foto al Concurso
            </h4>
            <button @click="closeContestUploadModal" class="text-slate-400 hover:text-white cursor-pointer">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Preview or Picker -->
          <div
            v-if="!contestFilePreview"
            class="border-2 border-dashed border-white/20 hover:border-yellow-400/60 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/5"
            @click="contestFileInput?.click()"
          >
            <div class="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center mx-auto mb-3">
              <Icon name="lucide:cloud-upload" class="w-6 h-6" />
            </div>
            <p class="text-sm font-bold text-white">Toca para tomar foto o elegir de tu galería</p>
            <p class="text-xs text-slate-400 mt-1">Sube la foto que creas que ganará más likes</p>
          </div>

          <div v-else class="space-y-3">
            <div class="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black">
              <img :src="contestFilePreview" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="clearContestFile"
                class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-500"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </div>

            <!-- Optional caption -->
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Descripción o pie de foto (Opcional)</label>
              <input
                v-model="contestCaption"
                type="text"
                maxlength="150"
                class="w-full px-3.5 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Ej: Los mejores pasos de baile en la pista 🕺💃"
              />
            </div>
          </div>

          <input
            ref="contestFileInput"
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            @change="handleContestFileSelected"
          />

          <!-- Action buttons -->
          <div class="flex items-center gap-2 pt-2">
            <button
              type="button"
              @click="closeContestUploadModal"
              class="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="submitContestPhoto"
              :disabled="!selectedContestFile || uploadingContest"
              class="flex-1 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Icon v-if="uploadingContest" name="lucide:loader-2" class="w-4 h-4 animate-spin text-slate-950" />
              <span>{{ uploadingContest ? 'Subiendo...' : 'Publicar Foto' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import confetti from 'canvas-confetti'
import CameraArcadeGame from '~/components/game/CameraArcadeGame.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'https://moment-back.onrender.com/api'
const gameUuid = computed(() => String(route.params.uuid))

const loading = ref(true)
const error = ref('')
const publicGameInfo = ref<any>(null)

// Quest state
const status = ref<any>(null)
const activeTab = ref<'challenges' | 'roulette' | 'feed'>('challenges')
const spinningRoulette = ref(false)
const rouletteChallenge = ref<any>(null)
const feedItems = ref<any[]>([])

// Contest state
const contestData = ref<any>(null)
const contestSort = ref<'rank' | 'recent'>('rank')
const showContestUploadModal = ref(false)
const selectedContestFile = ref<File | null>(null)
const contestFilePreview = ref<string | null>(null)
const contestCaption = ref('')
const uploadingContest = ref(false)
const contestFileInput = ref<HTMLInputElement | null>(null)

const isContestMode = computed(() => {
  return publicGameInfo.value?.gameType === 'PHOTO_CONTEST' || contestData.value?.gameType === 'PHOTO_CONTEST'
})

const isArcadeMode = computed(() => {
  return publicGameInfo.value?.gameType === 'PAPARAZZI_ARCADE'
})

const progressPercentage = computed(() => {
  if (!status.value?.totalAssigned) return 0
  return Math.round((status.value.completedCount / status.value.totalAssigned) * 100)
})

const totalScore = computed(() => {
  if (!status.value?.assignments) return 0
  return status.value.assignments
    .filter((a: any) => a.completed)
    .reduce((sum: number, a: any) => sum + (a.points || 100), 0)
})

const crownedWinnerPhoto = computed(() => {
  if (!contestData.value?.photos?.length) return null
  return contestData.value.photos.find((p: any) => p.winner) || null
})

const sortedContestPhotos = computed(() => {
  if (!contestData.value?.photos) return []
  const list = [...contestData.value.photos]
  if (contestSort.value === 'recent') {
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return list.sort((a, b) => a.rank - b.rank)
})

async function fetchGameData() {
  loading.value = true
  error.value = ''

  try {
    const uuid = gameUuid.value

    // 1. Fetch public metadata
    const gameInfo: any = await $fetch(`${apiBase}/games/${uuid}`)
    publicGameInfo.value = gameInfo

    if (!gameInfo.active) {
      error.value = 'Esta dinámica ha sido pausada o finalizada por el fotógrafo.'
      loading.value = false
      return
    }

    // 2. If Photo Contest
    if (gameInfo.gameType === 'PHOTO_CONTEST') {
      const headers: Record<string, string> = {}
      if (authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }
      const contestRes: any = await $fetch(`${apiBase}/games/${uuid}/contest`, { headers })
      contestData.value = contestRes
      loading.value = false
      return
    }

    // 2.5 If Paparazzi Arcade
    if (gameInfo.gameType === 'PAPARAZZI_ARCADE') {
      loading.value = false
      return
    }

    // 3. If Photo Quest and Authenticated
    if (authStore.isAuthenticated) {
      const participantStatus: any = await $fetch(`${apiBase}/games/${uuid}/my-challenges`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      status.value = participantStatus
    }
  } catch (err: any) {
    console.error('Error fetching game:', err)
    error.value = err.response?._data?.message || err.message || 'No se pudo cargar la información del juego.'
  } finally {
    loading.value = false
  }
}

// -------------------------------------------------------------
// QUEST GAME ACTIONS
// -------------------------------------------------------------
async function handleFileUpload(event: Event, assignmentId: number) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    toast.info('Subiendo fotografía...', 'Espera un segundo mientras se valida tu reto.')
    const uuid = gameUuid.value

    const updatedStatus: any = await $fetch(`${apiBase}/games/${uuid}/assignments/${assignmentId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: formData
    })

    status.value = updatedStatus
    toast.success('¡Reto Superado! 🎉', 'Tu foto ha sido subida y asignada al evento.')

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (_) {}
  } catch (err: any) {
    toast.error('Error al subir foto', err.response?._data?.message || err.message || 'No se pudo completar el reto.')
  } finally {
    target.value = ''
  }
}

async function spinRoulette() {
  spinningRoulette.value = true
  try {
    const uuid = gameUuid.value

    const challenge: any = await $fetch(`${apiBase}/games/${uuid}/roulette-spin`, {
      method: 'POST'
    })

    setTimeout(() => {
      rouletteChallenge.value = challenge
      spinningRoulette.value = false
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        })
      } catch (_) {}
    }, 700)
  } catch (err: any) {
    spinningRoulette.value = false
    toast.error('Error', 'No se pudo girar la ruleta.')
  }
}

async function loadFeed() {
  try {
    const uuid = gameUuid.value
    const res: any = await $fetch(`${apiBase}/games/${uuid}/live-feed?limit=25`)
    feedItems.value = res || []
  } catch (err) {
    console.error('Error loading feed:', err)
  }
}

// -------------------------------------------------------------
// CONTEST GAME ACTIONS
// -------------------------------------------------------------
function openContestUploadModal() {
  if (!authStore.isAuthenticated) {
    router.push(`/login?redirect=/game/${route.params.uuid}`)
    return
  }
  showContestUploadModal.value = true
}

function closeContestUploadModal() {
  showContestUploadModal.value = false
  clearContestFile()
}

function handleContestFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  selectedContestFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    contestFilePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function clearContestFile() {
  selectedContestFile.value = null
  contestFilePreview.value = null
  contestCaption.value = ''
  if (contestFileInput.value) contestFileInput.value.value = ''
}

async function submitContestPhoto() {
  if (!selectedContestFile.value) return
  uploadingContest.value = true

  const formData = new FormData()
  formData.append('file', selectedContestFile.value)
  if (contestCaption.value.trim()) {
    formData.append('caption', contestCaption.value.trim())
  }

  try {
    const uuid = gameUuid.value

    await $fetch(`${apiBase}/games/${uuid}/contest/photos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: formData
    })

    toast.success('¡Foto Publicada! 📸', 'Tu foto ya está compitiendo en el podio del evento.')
    closeContestUploadModal()
    await refreshContest()

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      })
    } catch (_) {}
  } catch (err: any) {
    toast.error('Error al subir foto', err.response?._data?.message || err.message || 'No se pudo subir la foto.')
  } finally {
    uploadingContest.value = false
  }
}

async function toggleLike(photo: any) {
  if (!authStore.isAuthenticated) {
    router.push(`/login?redirect=/game/${route.params.uuid}`)
    return
  }

  // Optimistic UI update
  const previousLiked = photo.likedByCurrentUser
  const previousLikes = photo.likeCount

  photo.likedByCurrentUser = !previousLiked
  photo.likeCount = previousLiked ? Math.max(0, photo.likeCount - 1) : photo.likeCount + 1

  try {
    const uuid = gameUuid.value

    const res: any = await $fetch(`${apiBase}/games/${uuid}/contest/photos/${photo.id}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    photo.likedByCurrentUser = res.liked
    photo.likeCount = res.likeCount

    if (res.liked) {
      triggerHeartAnimation(photo)
    }
  } catch (err: any) {
    // Revert optimistic update on failure
    photo.likedByCurrentUser = previousLiked
    photo.likeCount = previousLikes
    toast.error('Error', err.response?._data?.message || 'No se pudo registrar tu voto.')
  }
}

function triggerDoubleTapLike(photo: any) {
  if (!photo.likedByCurrentUser) {
    toggleLike(photo)
  }
  photo._doubleTapEffect = true
  setTimeout(() => {
    photo._doubleTapEffect = false
  }, 800)
}

function triggerHeartAnimation(photo: any) {
  photo._doubleTapEffect = true
  setTimeout(() => {
    photo._doubleTapEffect = false
  }, 700)
}

async function deleteMyContestPhoto(photoId: number) {
  if (!confirm('¿Deseas retirar esta fotografía del concurso?')) return
  try {
    const uuid = gameUuid.value

    await $fetch(`${apiBase}/games/${uuid}/contest/photos/${photoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success('Foto eliminada', 'La foto fue retirada del concurso.')
    await refreshContest()
  } catch (err: any) {
    toast.error('Error', err.message || 'No se pudo eliminar la foto.')
  }
}

async function refreshContest() {
  const uuid = gameUuid.value
  const headers: Record<string, string> = {}
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }
  const contestRes: any = await $fetch(`${apiBase}/games/${uuid}/contest`, { headers })
  contestData.value = contestRes
}

function formatRelativeTime(iso: string) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Hace un momento'
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours} h`
  return 'Ayer'
}

onMounted(() => {
  fetchGameData()
})
</script>

<style scoped>
.heart-pop-enter-active,
.heart-pop-leave-active {
  transition: all 0.5s ease-out;
}
.heart-pop-enter-from {
  opacity: 0;
  transform: scale(0.3);
}
.heart-pop-leave-to {
  opacity: 0;
  transform: scale(1.6);
}
</style>
