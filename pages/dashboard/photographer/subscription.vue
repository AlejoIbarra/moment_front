<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 font-sans pb-24 relative overflow-hidden">
    <!-- Glowing background elements with gold & indigo accents -->
    <div class="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
    <div class="fixed top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 pt-10 sm:pt-14 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Top Navigation & Current Plan Indicator -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button 
          @click="router.push('/dashboard/photographer?tab=events')" 
          class="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md cursor-pointer hover:bg-white/10"
        >
          <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
          Volver a Mi Panel de Fotógrafo
        </button>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md border shadow-sm"
          :class="{
            'bg-amber-500/20 text-amber-300 border-amber-500/40': currentPlan === 'PREMIUM',
            'bg-indigo-500/20 text-indigo-300 border-indigo-500/40': currentPlan === 'BASIC',
            'bg-slate-800/80 text-slate-300 border-slate-700': currentPlan === 'FREE'
          }"
        >
          <Icon v-if="currentPlan === 'PREMIUM'" name="lucide:crown" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <Icon v-else-if="currentPlan === 'BASIC'" name="lucide:zap" class="w-3.5 h-3.5 text-indigo-400" />
          <Icon v-else name="lucide:camera" class="w-3.5 h-3.5 text-slate-400" />
          <span>Tu Plan Actual: {{ getPlanDisplayName(currentPlan) }}</span>
        </div>
      </div>

      <!-- Separation Notice: Link to Buyer PRO -->
      <div class="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-indigo-600/10 border border-indigo-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div class="flex items-center gap-3.5 text-center sm:text-left">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Icon name="lucide:user" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs sm:text-sm font-bold text-indigo-300">¿Eres Comprador o Coleccionista de Fotos?</p>
            <p class="text-xs text-slate-300">Si buscas recibir +1 foto gratis en cada paquete y descargas Ultra HD, consulta el plan de comprador.</p>
          </div>
        </div>
        <NuxtLink 
          to="/subscription"
          class="shrink-0 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Icon name="lucide:sparkles" class="w-4 h-4 text-emerald-300" />
          Moments PRO para Compradores
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-6 backdrop-blur-md shadow-2xl">
          <Icon name="lucide:crown" class="w-4 h-4 text-amber-400 fill-amber-400" />
          PLANES Y SUSCRIPCIONES PARA FOTÓGRAFOS
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Maximiza tus Ingresos con
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mt-1">
            Menor Comisión y Álbumes Privados
          </span>
        </h1>

        <p class="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          Elige el plan ideal para tu ritmo de trabajo. Reduce la comisión de venta de tus fotos, amplía el tiempo de retención de tus eventos y desbloquea <strong class="text-white font-semibold">álbumes privados protegidos</strong> para clientes VIP.
        </p>
      </div>

      <!-- Active Subscription Card (if on Basic or Premium) -->
      <div v-if="subscriptionStore.isActive && currentPlan !== 'FREE'" class="mb-14 bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg">
              <Icon name="lucide:crown" class="w-8 h-8 fill-amber-400" />
            </div>
            <div>
              <div class="flex items-center gap-2.5">
                <h2 class="text-xl font-black text-white">Membresía {{ getPlanDisplayName(currentPlan) }} Activa</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/30">ACTIVO</span>
              </div>
              <p class="text-sm text-slate-300 mt-1">
                Disfrutas de una comisión reducida del <strong class="text-amber-300 font-bold">{{ currentPlan === 'PREMIUM' ? '15%' : '20%' }}</strong> y entrega de álbumes privados VIP.
              </p>
              <div v-if="subscriptionStore.activeSubscription.endDate" class="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <span class="text-slate-300">
                  🗓️ Válido hasta: <strong class="text-amber-400">{{ formatDate(subscriptionStore.activeSubscription.endDate) }}</strong>
                </span>
                <span v-if="subscriptionStore.daysRemaining" class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {{ subscriptionStore.daysRemaining }} días restantes
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              @click="router.push('/dashboard/photographer?tab=events')"
              class="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:calendar-plus" class="w-4 h-4 text-slate-950" />
              Crear Nuevo Evento
            </button>
            <button
              v-if="currentPlan === 'BASIC'"
              @click="handleSubscribe('PREMIUM')"
              :disabled="subscriptionStore.isSubscribing"
              class="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon name="lucide:sparkles" class="w-4 h-4 text-slate-950" />
              Subir a Premium
            </button>
          </div>
        </div>
      </div>

      <!-- Currency Selector & Flash Sale Banner -->
      <div class="mb-12 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div class="flex items-center gap-3.5 text-center md:text-left">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
            <Icon name="lucide:flame" class="w-6 h-6 animate-pulse text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div class="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-0.5">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                ⚡ OFERTA FLASH ACTIVA
              </span>
              <span class="text-xs font-extrabold text-amber-300">¡70% OFF en Premium y 50% OFF en Básico!</span>
            </div>
            <p class="text-xs text-slate-300">
              Todos los planes conservan su precio de lista, pero hoy los adquieres con super descuento liquidado en tu <strong class="text-white">moneda local vía Mercado Pago</strong>.
            </p>
          </div>
        </div>

        <!-- Currency Selector Pills -->
        <div class="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 shrink-0 overflow-x-auto max-w-full">
          <button
            v-for="(cur, code) in currencies"
            :key="code"
            @click="selectedCurrencyCode = code"
            class="px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            :class="selectedCurrencyCode === code ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'"
            :title="cur.name"
          >
            <span>{{ cur.flag }}</span>
            <span>{{ cur.code }}</span>
          </button>
        </div>
      </div>

      <!-- 3-TIER PRICING CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">

        <!-- 1. PLAN FREE -->
        <div 
          class="rounded-3xl p-7 sm:p-8 bg-slate-900/60 border transition-all duration-300 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden"
          :class="currentPlan === 'FREE' ? 'border-indigo-500/40 ring-1 ring-indigo-500/30' : 'border-white/10 hover:border-white/20'"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                Para Empezar
              </span>
              <span v-if="currentPlan === 'FREE'" class="text-[11px] font-extrabold text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Plan Actual
              </span>
            </div>

            <h3 class="text-2xl font-black text-white mb-2">Plan Free</h3>
            <p class="text-xs text-slate-400 mb-6">Ideal para fotógrafos que inician o cubren eventos esporádicos.</p>

            <!-- Price -->
            <div class="p-5 rounded-2xl bg-white/5 border border-white/5 mb-6">
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl font-black text-white">$0</span>
                <span class="text-slate-400 text-xs font-bold">{{ currentCurrency.code }} / mes</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-1">Sin costo fijo mensual para siempre</p>
            </div>

            <!-- Features List -->
            <ul class="space-y-3.5 mb-8 text-xs text-slate-300">
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:percent" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>25% de comisión</strong> por foto vendida (te quedas el 75%)</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:clock" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Eventos activos por <strong>30 días</strong> (luego se eliminan)</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:layers" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Hasta <strong>2 eventos activos</strong> simultáneos</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:image" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Hasta <strong>500 fotos</strong> por evento</span>
              </li>
              <li class="flex items-start gap-2.5 text-slate-400">
                <Icon name="lucide:x" class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Sin álbumes privados para clientes</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:shield" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Marca de agua de texto estándar</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              v-if="currentPlan === 'FREE'"
              disabled
              class="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-slate-400 bg-white/5 border border-white/10 cursor-not-allowed text-center"
            >
              Plan Activo por Defecto
            </button>
            <button
              v-else
              @click="router.push('/dashboard/photographer?tab=events')"
              class="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center cursor-pointer"
            >
              Ir a Mis Eventos
            </button>
          </div>
        </div>

        <!-- 2. PLAN BÁSICO (50% DESCUENTO) -->
        <div 
          class="rounded-3xl p-7 sm:p-8 bg-slate-900/70 border transition-all duration-300 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden"
          :class="currentPlan === 'BASIC' ? 'border-indigo-400 ring-2 ring-indigo-500/30' : 'border-indigo-500/30 hover:border-indigo-500/50'"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Icon name="lucide:zap" class="w-3 h-3 text-indigo-400" />
                50% OFF • CRECIMIENTO
              </span>
              <span v-if="currentPlan === 'BASIC'" class="text-[11px] font-extrabold text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Plan Actual
              </span>
            </div>

            <h3 class="text-2xl font-black text-white mb-2">Plan Básico</h3>
            <p class="text-xs text-slate-400 mb-6">Para fotógrafos activos que cubren eventos deportivos y sociales con regularidad.</p>

            <!-- Price with 50% Discount -->
            <div class="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 mb-6 relative">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-bold text-slate-400 line-through">
                  {{ currentCurrency.format(currentCurrency.basicRegular) }}
                </span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                  -50% DESCUENTO
                </span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl font-black text-white">{{ currentCurrency.format(currentCurrency.basicPromo) }}</span>
                <span class="text-indigo-300 text-xs font-bold">/ mes</span>
              </div>
              <p class="text-[11px] text-indigo-300/90 mt-1 flex items-center gap-1">
                <Icon name="lucide:check-circle" class="w-3.5 h-3.5 text-emerald-400" />
                <span>Ahorras <strong>{{ currentCurrency.format(currentCurrency.basicRegular - currentCurrency.basicPromo) }}</strong> al mes</span>
              </p>
            </div>

            <!-- Features List -->
            <ul class="space-y-3.5 mb-8 text-xs text-slate-200">
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:percent" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>20% de comisión</strong> por foto vendida (¡ganas el 80%!)</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:clock" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Eventos activos por <strong>90 días</strong> (3 meses)</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:layers" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Hasta <strong>8 eventos activos</strong> simultáneos</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:image" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Hasta <strong>2.500 fotos</strong> por evento</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:lock" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Hasta <strong>3 álbumes privados</strong> para clientes VIP</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Marca de agua con texto personalizado</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              v-if="currentPlan === 'BASIC'"
              disabled
              class="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 cursor-not-allowed text-center"
            >
              Tu Plan Actual Activo
            </button>
            <button
              v-else
              @click="handleSubscribe('BASIC')"
              :disabled="subscriptionStore.isSubscribing"
              class="w-full py-3.5 px-4 rounded-xl font-black text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Icon v-if="subscriptionStore.isSubscribing" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:credit-card" class="w-4 h-4 text-white" />
              <span>{{ subscriptionStore.isSubscribing ? 'Conectando con Mercado Pago...' : `Pagar Plan Básico con Mercado Pago (${currentCurrency.format(currentCurrency.basicPromo)})` }}</span>
            </button>
          </div>
        </div>

        <!-- 3. PLAN PREMIUM (70% DESCUENTO - DESTACADO) -->
        <div 
          class="rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 border-2 transition-all duration-300 flex flex-col justify-between backdrop-blur-2xl relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)]"
          :class="currentPlan === 'PREMIUM' ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-500/70 hover:border-amber-400'"
        >
          <!-- Corner Glow -->
          <div class="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 shadow-md animate-pulse">
                <Icon name="lucide:flame" class="w-3.5 h-3.5 fill-slate-950" />
                70% OFF • MÁS POPULAR
              </span>
              <span v-if="currentPlan === 'PREMIUM'" class="text-[11px] font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Plan Actual
              </span>
            </div>

            <h3 class="text-2xl font-black text-white mb-2">Plan Premium</h3>
            <p class="text-xs text-slate-300 mb-6">Para fotógrafos profesionales y agencias que exigen el máximo poder y la menor comisión.</p>

            <!-- Price with 70% Discount -->
            <div class="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/40 mb-6 relative">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-bold text-slate-400 line-through">
                  {{ currentCurrency.format(currentCurrency.premiumRegular) }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  🔥 -70% DE DESCUENTO
                </span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl font-black text-white">{{ currentCurrency.format(currentCurrency.premiumPromo) }}</span>
                <span class="text-amber-300 text-xs font-bold">/ mes</span>
              </div>
              <p class="text-[11px] text-amber-300 font-bold mt-1 flex items-center gap-1">
                <Icon name="lucide:award" class="w-3.5 h-3.5 text-amber-400" />
                <span>¡Comisión mínima del 15% y ahorras <strong>{{ currentCurrency.format(currentCurrency.premiumRegular - currentCurrency.premiumPromo) }}</strong>!</span>
              </p>
            </div>

            <!-- Features List -->
            <ul class="space-y-3.5 mb-8 text-xs text-slate-100">
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:percent" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>15% de comisión por venta</strong> (¡Te quedas el 85% de tus ventas!)</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:infinity" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Permanencia ilimitada</strong> de eventos mientras pagues</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:layers" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Eventos activos ilimitados</strong> simultáneos</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:image" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Fotos ilimitadas</strong> por evento</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:lock" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Álbumes privados ilimitados</strong> con entrega VIP</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:badge-check" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Logo PNG propio</strong> para marca de agua de tus fotos</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:crown" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Insignia Dorada Moments PRO</strong> en vitrina y buscador</span>
              </li>
              <li class="flex items-start gap-2.5">
                <Icon name="lucide:trending-up" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Posicionamiento VIP prioritario en búsquedas</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              v-if="currentPlan === 'PREMIUM'"
              disabled
              class="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-amber-300 bg-amber-500/20 border border-amber-500/40 cursor-not-allowed text-center"
            >
              Tu Plan Premium Está Activo
            </button>
            <button
              v-else
              @click="handleSubscribe('PREMIUM')"
              :disabled="subscriptionStore.isSubscribing"
              class="w-full py-3.5 px-4 rounded-xl font-black text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Icon v-if="subscriptionStore.isSubscribing" name="lucide:loader-2" class="w-4 h-4 animate-spin text-slate-950" />
              <Icon v-else name="lucide:crown" class="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>{{ subscriptionStore.isSubscribing ? 'Conectando con Mercado Pago...' : `Pagar Plan Premium con Mercado Pago (${currentCurrency.format(currentCurrency.premiumPromo)})` }}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- POLICY & RETENTION NOTICE (LETRA PEQUEÑA TRANSPARENTE) -->
      <div class="mb-20 rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 mt-1">
            <Icon name="lucide:info" class="w-5 h-5" />
          </div>
          <div class="text-xs text-slate-300 space-y-2">
            <h4 class="font-bold text-sm text-white">Política de Retención y Periodo de Gracia para Álbumes Creados</h4>
            <p>
              • <strong class="text-amber-300">Plan Free:</strong> Los eventos permanecen disponibles en la plataforma durante <strong>30 días continuos</strong> a partir de su publicación. Cumplido este plazo, el evento y sus fotos caducan automáticamente para liberar espacio.
            </p>
            <p>
              • <strong class="text-indigo-300">Plan Básico:</strong> La duración activa de cada evento se extiende a <strong>90 días (3 meses)</strong>, ofreciendo amplio tiempo de venta para eventos de mediano plazo.
            </p>
            <p>
              • <strong class="text-amber-400">Plan Premium:</strong> Los eventos permanecen alojados de forma permanente mientras mantengas activa tu suscripción. Si decides pausar o dejar de pagar tu membresía Premium, cuentas con un <strong class="text-white">periodo de gracia extendido de 6 meses (180 días)</strong> antes de que tus eventos y fotos archivadas sean depurados de nuestros servidores de almacenamiento, garantizando que tus clientes sigan teniendo acceso sin interrupciones abruptas.
            </p>
          </div>
        </div>
      </div>

      <!-- DETAILED COMPARISON TABLE -->
      <div class="mb-24 rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <span>⚡ Tarifas con Descuento Flash Incluidas</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white">Comparativa Completa de Planes</h2>
          <p class="text-sm text-slate-400 mt-2">Transparencia total para que impulses tu negocio fotográfico sin sorpresas</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th class="pb-4 pl-4">Característica</th>
                <th class="pb-4 text-center">Plan Free ($0)</th>
                <th class="pb-4 text-center text-indigo-300">
                  <div>Plan Básico</div>
                  <div class="text-[11px] font-extrabold text-emerald-400 mt-0.5">{{ currentCurrency.format(currentCurrency.basicPromo) }} (50% OFF)</div>
                </th>
                <th class="pb-4 text-center text-amber-400 font-black">
                  <div>Plan Premium</div>
                  <div class="text-[11px] font-extrabold text-amber-300 mt-0.5">{{ currentCurrency.format(currentCurrency.premiumPromo) }} (70% OFF)</div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="row in comparisonRows" :key="row.feature" class="hover:bg-white/5 transition-colors">
                <td class="py-4 pl-4 font-semibold text-slate-200">{{ row.feature }}</td>
                
                <!-- Free -->
                <td class="py-4 text-center text-slate-400">
                  <span v-if="typeof row.free === 'boolean'">
                    <Icon v-if="row.free" name="lucide:check" class="w-4 h-4 text-emerald-400 mx-auto" />
                    <Icon v-else name="lucide:x" class="w-4 h-4 text-slate-600 mx-auto" />
                  </span>
                  <span v-else>{{ row.free }}</span>
                </td>

                <!-- Basic -->
                <td class="py-4 text-center font-semibold text-indigo-200">
                  <span v-if="typeof row.basic === 'boolean'">
                    <Icon v-if="row.basic" name="lucide:check" class="w-4 h-4 text-emerald-400 mx-auto" />
                    <Icon v-else name="lucide:x" class="w-4 h-4 text-rose-500 mx-auto" />
                  </span>
                  <span v-else>{{ row.basic }}</span>
                </td>

                <!-- Premium -->
                <td class="py-4 text-center font-bold text-amber-300">
                  <span v-if="typeof row.premium === 'boolean'">
                    <Icon v-if="row.premium" name="lucide:check-circle-2" class="w-4 h-4 text-amber-400 mx-auto" />
                    <Icon v-else name="lucide:x" class="w-4 h-4 text-rose-500 mx-auto" />
                  </span>
                  <span v-else>{{ row.premium }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-black text-white">Preguntas Frecuentes</h2>
          <p class="text-sm text-slate-400 mt-2">Respuestas claras sobre los planes y pagos para fotógrafos</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer text-sm"
            >
              <span>{{ faq.q }}</span>
              <Icon :name="openFaq === idx ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4 text-amber-400 flex-shrink-0" />
            </button>
            <div v-if="openFaq === idx" class="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>

      <!-- Security / Payment Gateways Badge (Mercado Pago) -->
      <div class="text-center text-xs text-slate-400 max-w-xl mx-auto space-y-2.5 bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
        <p class="flex items-center justify-center gap-2 text-white font-bold text-sm">
          <Icon name="lucide:shield-check" class="w-5 h-5 text-emerald-400" />
          <span>Pagos de suscripción procesados de forma 100% segura mediante <strong class="text-sky-400">Mercado Pago</strong></span>
        </p>
        <p class="text-xs text-slate-300">
          Aceptamos Tarjetas de Crédito, Débito, PSE, Nequi, Daviplata, transferencias en moneda local y saldo en cuenta Mercado Pago.
        </p>
        <div class="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
          <span class="inline-flex items-center gap-1">🔒 Encriptación SSL 256 bits</span>
          <span>•</span>
          <span class="inline-flex items-center gap-1">⚡ Activación Inmediata</span>
          <span>•</span>
          <span class="inline-flex items-center gap-1">❌ Sin Cláusulas de Permanencia</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import { useToast } from '~/composables/useToast'
import { formatColombiaDate } from '~/utils/date'

const router = useRouter()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()

useHead({
  title: 'Planes para Fotógrafos - Moments',
  meta: [
    { name: 'description', content: 'Descubre los planes Free, Básico y Premium para fotógrafos en Moments. Menor comisión, álbumes privados y retención permanente.' }
  ]
})

// Currencies mapping and localized prices
const currencies: Record<string, { code: string; symbol: string; name: string; flag: string; basicRegular: number; basicPromo: number; premiumRegular: number; premiumPromo: number; format: (v: number) => string }> = {
  COP: { code: 'COP', symbol: '$', name: 'Colombia (COP)', flag: '🇨🇴', basicRegular: 24900, basicPromo: 12450, premiumRegular: 59900, premiumPromo: 17970, format: (v: number) => `$${Math.round(v).toLocaleString('es-CO')} COP` },
  MXN: { code: 'MXN', symbol: '$', name: 'México (MXN)', flag: '🇲🇽', basicRegular: 120, basicPromo: 60, premiumRegular: 300, premiumPromo: 90, format: (v: number) => `$${Math.round(v).toLocaleString('es-MX')} MXN` },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentina (ARS)', flag: '🇦🇷', basicRegular: 6000, basicPromo: 3000, premiumRegular: 15000, premiumPromo: 4500, format: (v: number) => `$${Math.round(v).toLocaleString('es-AR')} ARS` },
  CLP: { code: 'CLP', symbol: '$', name: 'Chile (CLP)', flag: '🇨🇱', basicRegular: 5800, basicPromo: 2900, premiumRegular: 14000, premiumPromo: 4200, format: (v: number) => `$${Math.round(v).toLocaleString('es-CL')} CLP` },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Perú (PEN)', flag: '🇵🇪', basicRegular: 24, basicPromo: 12, premiumRegular: 58, premiumPromo: 17.5, format: (v: number) => `S/ ${v.toFixed(1)} PEN` },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brasil (BRL)', flag: '🇧🇷', basicRegular: 35, basicPromo: 17.5, premiumRegular: 85, premiumPromo: 25.5, format: (v: number) => `R$ ${v.toFixed(2)} BRL` },
  USD: { code: 'USD', symbol: '$', name: 'Dólares (USD)', flag: '🇺🇸', basicRegular: 6, basicPromo: 3, premiumRegular: 15, premiumPromo: 4.5, format: (v: number) => `$${v.toFixed(2)} USD` }
}

const initialCountry = (authStore.user?.country || 'CO').toUpperCase()
const defaultCurrencyCode = 
  initialCountry === 'MX' ? 'MXN' :
  initialCountry === 'AR' ? 'ARS' :
  initialCountry === 'CL' ? 'CLP' :
  initialCountry === 'PE' ? 'PEN' :
  initialCountry === 'BR' ? 'BRL' :
  (initialCountry === 'US' || initialCountry === 'EC' || initialCountry === 'PA') ? 'USD' : 'COP'

const selectedCurrencyCode = ref<string>(defaultCurrencyCode)
const currentCurrency = computed(() => currencies[selectedCurrencyCode.value] || currencies.COP)

const currentPlan = computed(() => {
  return subscriptionStore.activeSubscription?.plan || 'FREE'
})

function getPlanDisplayName(plan: string) {
  if (plan === 'PREMIUM') return 'Plan Premium'
  if (plan === 'BASIC') return 'Plan Básico'
  return 'Plan Free'
}

const openFaq = ref(0)
function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? -1 : idx
}

function formatDate(dateStr: string) {
  return formatColombiaDate(dateStr, { year: 'numeric', month: 'long', day: 'numeric' })
}

const comparisonRows = [
  { feature: 'Comisión de venta de la plataforma', free: '25%', basic: '20%', premium: '15%' },
  { feature: 'Tus ingresos netos por foto', free: '75%', basic: '80%', premium: '85%' },
  { feature: 'Duración de los eventos en línea', free: '30 días (1 mes)', basic: '90 días (3 meses)', premium: 'Permanente mientras pagues' },
  { feature: 'Límite de eventos activos simultáneos', free: 'Máx. 2 eventos', basic: 'Hasta 8 eventos', premium: 'Ilimitados' },
  { feature: 'Límite de fotos por evento', free: 'Máx. 500 fotos', basic: 'Hasta 2.500 fotos', premium: 'Ilimitadas' },
  { feature: 'Álbumes privados para clientes VIP', free: 'No incluidos (0)', basic: 'Hasta 3 álbumes', premium: 'Ilimitados' },
  { feature: 'Personalización de marca de agua', free: 'Estándar', basic: 'Texto propio', premium: 'Logo PNG oficial propio' },
  { feature: 'Insignia de verificación en perfil', free: false, basic: 'Fotógrafo Verificado', premium: 'Insignia Dorada VIP PRO' },
  { feature: 'Posicionamiento en búsquedas locales', free: 'Estándar', basic: 'Prioritario', premium: 'Máxima Prioridad VIP' },
  { feature: 'Periodo de gracia en caso de pausar plan', free: 'No aplica', basic: '15 días', premium: '6 meses (180 días)' }
]

const faqs = [
  {
    q: '¿Cómo aplican los descuentos promocionales del 70% y 50%?',
    a: 'Actualmente todos los planes mantienen su precio base, pero cuentas con un descuento especial temporal: 70% de descuento en el Plan Premium ($17.970 COP) y 50% de descuento en el Plan Básico ($12.450 COP). La tarifa con descuento se liquida automáticamente al pagar con Mercado Pago.'
  },
  {
    q: '¿Cómo funciona la comisión de venta de la plataforma?',
    a: 'Por cada foto que vendas, la plataforma deduce una pequeña comisión para cubrir los costos de servidores e inteligencia artificial: 25% en Plan Free, 20% en Plan Básico y solo el 15% en Plan Premium. El resto del dinero va directo a tu cuenta.'
  },
  {
    q: '¿Qué son los álbumes privados protegidos?',
    a: 'Son galerías diseñadas para eventos privados (bodas, sesiones corporativas, quinceañeros) que no aparecen en el marketplace público. Puedes restringir el acceso únicamente a los correos de tus clientes y permitir descargas libres sin marca o venta protegida.'
  },
  {
    q: '¿Qué ocurre con mis álbumes si dejo de pagar el Plan Premium?',
    a: 'En el Plan Premium cuentas con un periodo de gracia de 6 meses (180 días). Durante este tiempo tus álbumes se mantendrán intactos para que tus clientes puedan seguir accediendo a sus fotos mientras decides reactivar tu membresía.'
  },
  {
    q: '¿Qué métodos de pago acepta Mercado Pago?',
    a: 'Aceptamos transferencias inmediatas por PSE desde cualquier banco colombiano, billeteras móviles como Nequi y Daviplata, todas las tarjetas de crédito y débito (Visa, Mastercard, American Express), y saldo disponible en tu cuenta de Mercado Pago.'
  },
  {
    q: '¿Puedo cambiar de plan o cancelar en cualquier momento?',
    a: 'Sí. No tienes cláusulas de permanencia mínima. Puedes ascender de plan cuando tu volumen de trabajo crezca o cancelar cuando lo desees directamente desde la plataforma.'
  }
]

async function handleSubscribe(plan: 'BASIC' | 'PREMIUM') {
  if (!authStore.isAuthenticated) {
    toast.info('Inicia sesión', 'Debes iniciar sesión para suscribirte.')
    router.push('/login?redirect=/dashboard/photographer/subscription')
    return
  }

  try {
    await subscriptionStore.startSubscriptionFlow(plan, () => {
      authStore.updateUserData({ isPro: true, photographerPlan: plan })
      toast.success('¡Felicitaciones!', `Tu suscripción al ${getPlanDisplayName(plan)} ha sido activada con éxito.`)
      router.push('/dashboard/photographer?tab=events')
    })
  } catch (e: any) {
    toast.error('Error', e.message || 'No se pudo iniciar el proceso de pago con Mercado Pago.')
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await subscriptionStore.fetchActiveSubscription()
  }
})
</script>
