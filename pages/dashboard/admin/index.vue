<template>
  <div class="min-h-screen bg-[#fafafa] p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-[#3ef4a1] rounded-xl flex items-center justify-center shadow-md">
            <Icon name="lucide:shield-alert" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Panel de Control - Super Admin</h1>
            <p class="text-xs text-gray-500 font-medium">Gestiona saldos, audita transacciones y monitorea usuarios</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-bold text-gray-800">{{ authStore.user?.username }}</p>
            <p class="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Super Administrador</p>
          </div>
          <button @click="handleLogout" class="flex items-center justify-center p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all">
            <Icon name="lucide:log-out" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- METRICS CARD ROW -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Metric 1: Total Users -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuarios Registrados</p>
            <h3 class="text-3xl font-black text-gray-800 mt-2">{{ totalUsers }}</h3>
          </div>
          <div class="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Icon name="lucide:users" class="w-6 h-6" />
          </div>
        </div>

        <!-- Metric 2: Total Wallet Balances -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Saldo Total en Plataforma</p>
            <h3 class="text-3xl font-black text-gray-800 mt-2">${{ formatCurrency(totalBalance) }}</h3>
          </div>
          <div class="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
            <Icon name="lucide:wallet" class="w-6 h-6" />
          </div>
        </div>

        <!-- Metric 3: Platform Net Earnings -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Ganancias de Plataforma</p>
            <h3 class="text-3xl font-black text-gray-800 mt-2">${{ formatCurrency(platformEarnings.totalEarnings || 0) }}</h3>
          </div>
          <div class="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
            <Icon name="lucide:trending-up" class="w-6 h-6" />
          </div>
        </div>

        <!-- Metric 4: Photographer Total Assets -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Mayor Balance Individual</p>
            <h3 class="text-lg font-black text-purple-700 truncate mt-3">{{ topUser?.username || 'N/A' }}</h3>
            <p class="text-xs font-bold text-gray-500">${{ formatCurrency(topUser?.balance || 0) }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center">
            <Icon name="lucide:trophy" class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Admin Tab Navigation -->
      <div class="flex flex-wrap justify-start gap-1 md:gap-4 border-b border-gray-200 bg-white border border-[#dbdbdb] rounded-2xl p-2 shadow-sm">
        <button @click="adminTab = 'users'" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:users" class="w-4 h-4" />
          Directorio
        </button>
        <button @click="adminTab = 'purchases'" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'purchases' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:shopping-bag" class="w-4 h-4" />
          Trazabilidad de Compras
          <span v-if="purchases.length > 0" class="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-purple-200 text-purple-900 font-extrabold">{{ purchases.length }}</span>
        </button>
        <button @click="adminTab = 'earnings'" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'earnings' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:trending-up" class="w-4 h-4" />
          Ingresos Plataforma
        </button>
        <button @click="adminTab = 'giftcards'" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'giftcards' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:gift" class="w-4 h-4" />
          Tarjetas Regalo
        </button>
        <button @click="adminTab = 'audit'" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'audit' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:file-text" class="w-4 h-4" />
          Auditoría de Fondos
        </button>
        <button @click="adminTab = 'reports'" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'reports' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:shield-alert" class="w-4 h-4" />
          Denuncias / Retiro Fotos
          <span v-if="pendingReportsCount > 0" class="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-extrabold animate-pulse">
            {{ pendingReportsCount }}
          </span>
        </button>
        <button @click="adminTab = 'analytics'; loadAnalytics()" :class="['flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200',
          adminTab === 'analytics' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:bar-chart-3" class="w-4 h-4" />
          Analítica Avanzada
        </button>
      </div>

      <!-- TAB: USERS DIRECTORY -->
      <div v-if="adminTab === 'users'" class="space-y-8 animate-scale-up">
        <!-- GLOBAL PLATFORM SETTINGS -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:percent" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-800">Comisión Global de la Plataforma</h2>
              <p class="text-xs text-gray-500">Porcentaje que la plataforma retendrá de cada venta de forma predeterminada para todos los fotógrafos.</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative max-w-[120px]">
              <input 
                v-model="globalFeeValue" 
                type="number" 
                step="0.01" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2 px-3 text-sm font-bold outline-none focus:border-purple-500 transition-all text-right pr-7" 
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">%</span>
            </div>
            <button 
              @click="saveGlobalFee" 
              class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              :disabled="savingGlobalFee"
            >
              {{ savingGlobalFee ? 'Guardando...' : 'Guardar Comisión' }}
            </button>
          </div>
        </div>

        <!-- USERS MANAGEMENT TABLE -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div class="p-6 border-b border-[#dbdbdb] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h2 class="text-lg font-extrabold text-gray-800">Directorio y Gestión de Saldos</h2>
              <p class="text-xs text-gray-500">Busca usuarios y modifica sus fondos directamente</p>
            </div>
            
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <!-- Search -->
              <div class="relative min-w-[250px]">
                <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Buscar usuario o correo..." 
                  class="w-full bg-white border border-[#dbdbdb] rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                />
              </div>

              <!-- Filter Role -->
              <select 
                v-model="roleFilter" 
                class="bg-white border border-[#dbdbdb] rounded-xl py-2 px-3 text-xs outline-none focus:border-purple-500 transition-all font-semibold text-gray-600"
              >
                <option value="ALL">Todos los Roles</option>
                <option value="PHOTOGRAPHER">Fotógrafos</option>
                <option value="CUSTOMER">Clientes</option>
                <option value="ADMIN">Administradores</option>
              </select>
            </div>
          </div>

          <!-- Table Content -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-[#dbdbdb] bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th class="py-4 px-6">Usuario</th>
                  <th class="py-4 px-6">Rol</th>
                  <th class="py-4 px-6">Saldo Actual</th>
                  <th class="py-4 px-6">Comisión Plataforma</th>
                  <th class="py-4 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#dbdbdb]">
                <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-gray-50/55 transition-all text-sm">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {{ u.username.substring(0, 2) }}
                      </div>
                      <div>
                        <p class="font-bold text-gray-800">{{ u.username }}</p>
                        <p class="text-[11px] text-gray-400">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <span 
                      class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                      :class="getRoleClass(u.role)"
                    >
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="py-4 px-6 font-extrabold text-gray-900">
                    ${{ formatCurrency(u.balance) }}
                  </td>
                  <td class="py-4 px-6 text-xs text-gray-600">
                    <span v-if="u.role === 'PHOTOGRAPHER'" class="flex items-center gap-2">
                      <span class="font-bold text-indigo-600">{{ u.customPlatformFeePercentage != null ? `${u.customPlatformFeePercentage}%` : 'Por Defecto' }}</span>
                      <button @click="openCustomFeeModal(u)" class="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all" title="Editar comisión">
                        <Icon name="lucide:pencil" class="w-3.5 h-3.5" />
                      </button>
                    </span>
                    <span v-else class="text-gray-400 font-medium">-</span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button 
                      @click="openAdjustmentModal(u)" 
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 text-purple-600 bg-purple-50 hover:bg-purple-100 font-bold text-xs transition-all active:scale-[0.97]"
                    >
                      <Icon name="lucide:plus-circle" class="w-4 h-4" />
                      Ajustar Saldo
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="5" class="py-12 text-center text-gray-400 font-medium">
                    <Icon name="lucide:user-x" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No se encontraron usuarios
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: PURCHASES TRACEABILITY (QUIÉN COMPRÓ QUÉ FOTOS Y A QUIÉN) -->
      <div v-if="adminTab === 'purchases'" class="space-y-6 animate-scale-up">
        
        <!-- Filters & Search Toolbar -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                <Icon name="lucide:search-check" class="w-5 h-5 text-purple-600" />
                Trazabilidad Completa de Compras
              </h2>
              <p class="text-xs text-gray-500">Audita exactamente quién compró cada foto, a qué fotógrafo pertenecía, y el desglose financiero exacto</p>
            </div>
            <button 
              @click="loadPurchasesTraceability" 
              class="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition-all"
              :disabled="loadingPurchases"
            >
              <Icon name="lucide:refresh-cw" :class="['w-4 h-4', loadingPurchases ? 'animate-spin' : '']" />
              <span>Actualizar Registros</span>
            </button>
          </div>

          <!-- Filter Controls Grid -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <!-- Search Query -->
            <div class="md:col-span-5 relative">
              <Icon name="lucide:search" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                v-model="purchasesSearch" 
                type="text" 
                placeholder="Buscar por comprador, fotógrafo, evento o ID..." 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            <!-- Type Filter Select -->
            <div class="md:col-span-3 relative">
              <select 
                v-model="purchasesTypeFilter"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">Todos los tipos de compra</option>
                <option value="INDIVIDUAL_PHOTO">Foto Individual</option>
                <option value="CART_PURCHASE">Carrito Múltiple</option>
                <option value="PACKAGE_PURCHASE">Paquete de Fotos</option>
              </select>
              <Icon name="lucide:chevron-down" class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <!-- Start Date -->
            <div class="md:col-span-2">
              <input 
                v-model="purchasesStartDate" 
                type="date" 
                title="Fecha inicio"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <!-- End Date -->
            <div class="md:col-span-2 flex items-center gap-2">
              <input 
                v-model="purchasesEndDate" 
                type="date" 
                title="Fecha fin"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-3 text-xs font-bold text-gray-700 outline-none focus:border-purple-500 transition-all"
              />
              <button 
                v-if="purchasesSearch || purchasesTypeFilter !== 'ALL' || purchasesStartDate || purchasesEndDate" 
                @click="resetPurchaseFilters" 
                title="Limpiar filtros"
                class="p-2.5 text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-xl transition-all"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Metrics Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Facturado</p>
              <h4 class="text-2xl font-black text-gray-800 mt-1">${{ formatCurrency(filteredPurchasesVolume) }}</h4>
              <p class="text-[11px] text-gray-500 font-medium">{{ filteredPurchases.length }} transacciones</p>
            </div>
            <div class="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:dollar-sign" class="w-5 h-5" />
            </div>
          </div>

          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fotos Entregadas</p>
              <h4 class="text-2xl font-black text-gray-800 mt-1">{{ filteredPurchasesPhotosCount }}</h4>
              <p class="text-[11px] text-gray-500 font-medium">Fotos compradas en total</p>
            </div>
            <div class="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:image" class="w-5 h-5" />
            </div>
          </div>

          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pagos a Fotógrafos</p>
              <h4 class="text-2xl font-black text-emerald-600 mt-1">${{ formatCurrency(filteredPurchasesPhotographerPayout) }}</h4>
              <p class="text-[11px] text-gray-500 font-medium">Neto acreditado a fotógrafos</p>
            </div>
            <div class="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:user-check" class="w-5 h-5" />
            </div>
          </div>

          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Comisión Plataforma</p>
              <h4 class="text-2xl font-black text-indigo-600 mt-1">${{ formatCurrency(filteredPurchasesPlatformFee) }}</h4>
              <p class="text-[11px] text-gray-500 font-medium">Ingresos de intermediación</p>
            </div>
            <div class="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:percent" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Traceability Table -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-[#dbdbdb] bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-extrabold text-gray-900">Historial Detallado de Compras y Trazabilidad</h3>
              <p class="text-xs text-gray-500">Mostrando {{ filteredPurchases.length }} de {{ purchases.length }} registros</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-[#dbdbdb] bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th class="py-4 px-5">ID / Tipo / Fecha</th>
                  <th class="py-4 px-5">¿Quién Compró?</th>
                  <th class="py-4 px-5">¿A Quién Compró?</th>
                  <th class="py-4 px-5">Fotos y Evento</th>
                  <th class="py-4 px-5">Monto y Desglose</th>
                  <th class="py-4 px-5">Estado</th>
                  <th class="py-4 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#dbdbdb] text-xs text-gray-700">
                <tr v-for="item in filteredPurchases" :key="item.purchaseId" class="hover:bg-purple-50/20 transition-colors">
                  
                  <!-- ID, Tipo y Fecha -->
                  <td class="py-4 px-5">
                    <div class="space-y-1">
                      <div class="flex items-center gap-1.5">
                        <span :class="['px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider',
                          item.purchaseType === 'INDIVIDUAL_PHOTO' ? 'bg-indigo-100 text-indigo-700' :
                          item.purchaseType === 'CART_PURCHASE' ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700']">
                          {{ item.purchaseType === 'INDIVIDUAL_PHOTO' ? 'Individual' :
                             item.purchaseType === 'CART_PURCHASE' ? 'Carrito' : 'Paquete' }}
                        </span>
                        <span class="font-mono text-[11px] font-bold text-gray-800">{{ item.purchaseId }}</span>
                      </div>
                      <p class="text-[11px] text-gray-400 font-medium">{{ formatDate(item.createdAt) }}</p>
                      <p v-if="item.paymentReference" class="text-[10px] font-mono text-gray-400 truncate max-w-[140px]" :title="'Ref: ' + item.paymentReference">
                        Ref: {{ item.paymentReference }}
                      </p>
                    </div>
                  </td>

                  <!-- Comprador -->
                  <td class="py-4 px-5">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 shadow-sm overflow-hidden">
                        <img v-if="item.buyerAvatarUrl" :src="item.buyerAvatarUrl" class="w-full h-full object-cover" />
                        <span v-else>{{ (item.buyerUsername || 'U').charAt(0) }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-gray-900 truncate">@{{ item.buyerUsername }}</p>
                        <p v-if="item.buyerFullName" class="text-[11px] text-gray-500 truncate">{{ item.buyerFullName }}</p>
                        <p class="text-[10px] text-gray-400 truncate max-w-[180px]" :title="item.buyerEmail">{{ item.buyerEmail }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Fotógrafo(s) -->
                  <td class="py-4 px-5">
                    <div v-if="item.photographerUsername" class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 shadow-sm overflow-hidden">
                        <img v-if="item.photographerAvatarUrl" :src="item.photographerAvatarUrl" class="w-full h-full object-cover" />
                        <span v-else>{{ item.photographerUsername.charAt(0) }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-gray-900 truncate">@{{ item.photographerUsername }}</p>
                        <p class="text-[10px] text-gray-400 truncate max-w-[180px]" :title="item.photographerEmail">{{ item.photographerEmail }}</p>
                      </div>
                    </div>
                    <div v-else class="space-y-1">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold">
                        <Icon name="lucide:users" class="w-3 h-3" />
                        Varios fotógrafos
                      </span>
                      <p class="text-[10px] text-gray-400">Ver fotos para detalle individual</p>
                    </div>
                  </td>

                  <!-- Fotos y Evento -->
                  <td class="py-4 px-5">
                    <div class="space-y-2">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <div 
                          v-for="(photo, pIdx) in (item.photos || []).slice(0, 3)" 
                          :key="photo.photoId || pIdx"
                          class="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          @click="openPurchaseDetail(item)"
                        >
                          <img :src="photo.watermarkedUrl || photo.hdUrl" class="w-full h-full object-cover" />
                        </div>
                        <button 
                          v-if="(item.photos || []).length > 3" 
                          @click="openPurchaseDetail(item)"
                          class="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-extrabold flex items-center justify-center hover:bg-purple-100 transition-colors"
                        >
                          +{{ item.photos.length - 3 }}
                        </button>
                      </div>
                      <div>
                        <p class="text-[11px] font-bold text-gray-800 truncate max-w-[190px]" :title="item.eventTitle || 'Evento general'">
                          {{ item.eventTitle || 'Evento general' }}
                        </p>
                        <span class="text-[10px] text-purple-600 font-bold">{{ item.photoCount || (item.photos ? item.photos.length : 1) }} foto(s)</span>
                      </div>
                    </div>
                  </td>

                  <!-- Monto y Desglose -->
                  <td class="py-4 px-5">
                    <div class="space-y-1">
                      <p class="font-extrabold text-sm text-gray-900">${{ formatCurrency(item.totalAmount) }}</p>
                      <div class="flex items-center gap-2 text-[10px] font-semibold text-gray-500">
                        <span class="text-emerald-600" title="Pago al fotógrafo">Fot: ${{ formatCurrency(item.photographerPayout) }}</span>
                        <span>•</span>
                        <span class="text-indigo-600" title="Comisión plataforma">Plat: ${{ formatCurrency(item.platformFee) }}</span>
                      </div>
                      <div v-if="item.giftCardCode" class="flex items-center gap-1 text-[10px] text-pink-600 font-bold">
                        <Icon name="lucide:gift" class="w-3 h-3" />
                        <span>Cupón: {{ item.giftCardCode }} (-${{ formatCurrency(item.discountAmount) }})</span>
                      </div>
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="py-4 px-5">
                    <span :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold',
                      item.status === 'APPROVED' || item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                      item.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700']">
                      <span class="w-1.5 h-1.5 rounded-full" :class="item.status === 'APPROVED' || item.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                      {{ item.status === 'APPROVED' || item.status === 'COMPLETED' ? 'Aprobado' : item.status }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="py-4 px-5 text-right">
                    <button 
                      @click="openPurchaseDetail(item)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <Icon name="lucide:eye" class="w-3.5 h-3.5" />
                      <span>Ver Fotos</span>
                    </button>
                  </td>

                </tr>
                
                <!-- Estado Vacío -->
                <tr v-if="filteredPurchases.length === 0 && !loadingPurchases">
                  <td colspan="7" class="py-16 text-center text-gray-400 font-medium">
                    <Icon name="lucide:shopping-bag" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p class="text-sm font-bold text-gray-600">No se encontraron compras registradas</p>
                    <p class="text-xs text-gray-400 mt-1">Prueba cambiando los filtros de búsqueda o fecha.</p>
                  </td>
                </tr>

                <!-- Loader -->
                <tr v-if="loadingPurchases">
                  <td colspan="7" class="py-16 text-center text-purple-600 font-bold">
                    <Icon name="lucide:loader-2" class="w-8 h-8 mx-auto mb-2 animate-spin" />
                    Cargando trazabilidad de compras...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- TAB: PLATFORM EARNINGS -->
      <div v-if="adminTab === 'earnings'" class="space-y-6 animate-scale-up">
        
        <!-- Filtro por fecha -->
        <div class="flex items-center gap-4 bg-white border border-[#dbdbdb] rounded-2xl p-4 shadow-sm">
          <label class="text-sm font-bold text-gray-700">Filtrar por fecha:</label>
          <input 
            type="date" 
            v-model="earningsDateFilter"
            @change="loadEarningsFiltered"
            class="bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2 px-3 text-sm font-bold outline-none focus:border-purple-500 transition-all"
          />
          <button v-if="earningsDateFilter" @click="earningsDateFilter = ''; loadEarningsFiltered()" class="text-xs text-red-500 hover:text-red-700 font-bold ml-2 transition-all">Limpiar Filtro</button>
        </div>

        <!-- Earnings Metrics Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="p-6 bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Venta de Fotos Individuales</p>
              <h4 class="text-2xl font-black text-gray-800 mt-1">${{ formatCurrency(platformEarnings.individualEarnings || 0) }}</h4>
            </div>
            <div class="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
              <Icon name="lucide:image" class="w-5 h-5" />
            </div>
          </div>
          <div class="p-6 bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Venta de Paquetes</p>
              <h4 class="text-2xl font-black text-gray-800 mt-1">${{ formatCurrency(platformEarnings.packageEarnings || 0) }}</h4>
            </div>
            <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
              <Icon name="lucide:package" class="w-5 h-5" />
            </div>
          </div>
          <div class="p-6 bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Transacciones</p>
              <h4 class="text-2xl font-black text-gray-800 mt-1">{{ platformEarnings.totalTransactions || 0 }} transacciones</h4>
            </div>
            <div class="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
              <Icon name="lucide:credit-card" class="w-5 h-5" />
            </div>
          </div>
          <div class="p-6 bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Venta de Cupones</p>
              <h4 class="text-2xl font-black text-gray-800 mt-1">${{ formatCurrency(platformEarnings.giftCardEarnings || 0) }}</h4>
            </div>
            <div class="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
              <Icon name="lucide:gift" class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Recent Platform Earnings Table -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-[#dbdbdb] bg-gray-50/50">
            <h3 class="text-lg font-extrabold text-gray-800">Transacciones e Ingresos de Plataforma</h3>
            <p class="text-xs text-gray-500">Historial en tiempo real de la participación/comisión cobrada por cada compra</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-[#dbdbdb] bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th class="py-4 px-6">Tipo</th>
                  <th class="py-4 px-6">Evento / Comprador</th>
                  <th class="py-4 px-6">Fotógrafo</th>
                  <th class="py-4 px-6">Monto Total</th>
                  <th class="py-4 px-6">Comisión %</th>
                  <th class="py-4 px-6">Ganancia Plataforma</th>
                  <th class="py-4 px-6">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#dbdbdb] text-sm text-gray-700">
                <tr v-for="earn in platformEarnings.recentEarnings" :key="earn.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-4 px-6">
                    <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase',
                      earn.earningType === 'PACKAGE_SALE' ? 'bg-emerald-50 text-emerald-600' : 
                      earn.earningType === 'GIFT_CARD_BATCH' ? 'bg-pink-50 text-pink-600' : 
                      'bg-indigo-50 text-indigo-600']">
                      {{ earn.earningType === 'PACKAGE_SALE' ? 'Paquete' : 
                         earn.earningType === 'GIFT_CARD_BATCH' ? 'Lote de Cupones' : 
                         'Foto Individual' }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <p class="font-bold text-gray-800 truncate max-w-[200px]" :title="earn.eventTitle">{{ earn.eventTitle }}</p>
                    <p class="text-[11px] text-gray-400">Comprador: @{{ earn.buyerUsername }}</p>
                  </td>
                  <td class="py-4 px-6 font-semibold text-gray-800">
                    @{{ earn.photographerUsername }}
                  </td>
                  <td class="py-4 px-6 font-bold text-gray-900">
                    ${{ formatCurrency(earn.amount) }}
                  </td>
                  <td class="py-4 px-6 font-medium text-indigo-600">
                    {{ earn.feePercentage }}%
                  </td>
                  <td class="py-4 px-6 font-black text-purple-600">
                    ${{ formatCurrency(earn.amount * (earn.feePercentage / 100)) }}
                  </td>
                  <td class="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {{ formatDate(earn.createdAt) }}
                  </td>
                </tr>
                <tr v-if="!platformEarnings.recentEarnings || platformEarnings.recentEarnings.length === 0">
                  <td colspan="7" class="py-12 text-center text-gray-400 font-medium">
                    <Icon name="lucide:info" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    Sin transacciones registradas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: GIFT CARDS -->
      <div v-if="adminTab === 'giftcards'" class="animate-scale-up space-y-6">

        <!-- ── Generator Card ── -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:gift" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-800">Generador de Tarjetas de Regalo</h2>
              <p class="text-xs text-gray-500">Genera lotes de códigos de regalo al instante. Los códigos se agrupan por lote para facilitar su gestión y exportación.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto por Tarjeta (COP)</label>
              <input
                v-model.number="adminGcAmount"
                type="number"
                placeholder="Ej: 10000"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Cantidad</label>
              <input
                v-model.number="adminGcCount"
                type="number"
                placeholder="Ej: 10"
                min="1"
                max="500"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Fotógrafo (Opcional)</label>
              <input
                v-model.number="adminGcPhotographerId"
                type="number"
                placeholder="En blanco = global"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-4 text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <button
              @click="handleAdminGenerateGc"
              :disabled="generatingAdminGc"
              class="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Icon name="lucide:zap" class="w-4 h-4" />
              {{ generatingAdminGc ? 'Generando...' : 'Generar Lote' }}
            </button>
          </div>

          <!-- Last generated batch result -->
          <div v-if="lastGeneratedBatch" class="border border-purple-100 bg-purple-50/70 rounded-2xl p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-purple-900 uppercase tracking-wider">✅ Lote generado exitosamente</p>
                <p class="text-[11px] font-mono text-purple-500 mt-0.5">{{ lastGeneratedBatch.batchReference }}</p>
              </div>
              <button
                @click="downloadBatchXml(lastGeneratedBatch.batchReference)"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
              >
                <Icon name="lucide:download" class="w-3.5 h-3.5" />
                Descargar XML
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <div
                v-for="code in lastGeneratedBatch.codes"
                :key="code"
                class="bg-white border border-purple-200 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold text-purple-700 flex items-center justify-between gap-1"
              >
                <span class="truncate">{{ code }}</span>
                <button @click="copyCode(code)" class="text-purple-400 hover:text-purple-600 flex-shrink-0">
                  <Icon name="lucide:copy" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Batch History ── -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <Icon name="lucide:layers" class="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-800">Mis Lotes Generados</h3>
                <p class="text-xs text-gray-400">Historial completo de lotes con estadísticas de uso</p>
              </div>
            </div>
            <button @click="loadAdminBatches" class="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
              <Icon name="lucide:refresh-cw" class="w-3.5 h-3.5" />
              Actualizar
            </button>
          </div>

          <div v-if="adminBatchesLoading" class="py-12 flex justify-center">
            <div class="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else-if="adminBatches.length === 0" class="py-14 flex flex-col items-center gap-2 text-gray-400">
            <Icon name="lucide:gift" class="w-10 h-10" />
            <p class="text-sm font-medium">Aún no has generado ningún lote.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50/80">
                <tr class="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th class="px-5 py-3">Referencia del Lote</th>
                  <th class="px-5 py-3 text-center">Total</th>
                  <th class="px-5 py-3 text-center">Disponibles</th>
                  <th class="px-5 py-3 text-center">Usados</th>
                  <th class="px-5 py-3">Monto</th>
                  <th class="px-5 py-3">Fecha</th>
                  <th class="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="batch in adminBatches" :key="batch.batchReference" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-5 py-3">
                    <span class="font-mono text-xs text-purple-700 font-bold">{{ batch.batchReference }}</span>
                  </td>
                  <td class="px-5 py-3 text-center">
                    <span class="font-bold text-gray-700">{{ batch.total }}</span>
                  </td>
                  <td class="px-5 py-3 text-center">
                    <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{{ batch.active }}</span>
                  </td>
                  <td class="px-5 py-3 text-center">
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">{{ batch.used }}</span>
                  </td>
                  <td class="px-5 py-3 text-sm font-semibold text-gray-700">${{ Number(batch.amount).toLocaleString('es-CO') }}</td>
                  <td class="px-5 py-3 text-xs text-gray-400">{{ formatDate(batch.createdAt) }}</td>
                  <td class="px-5 py-3 text-right">
                    <button
                      @click="downloadBatchXml(batch.batchReference)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-all"
                    >
                      <Icon name="lucide:file-xml" class="w-3.5 h-3.5" />
                      XML
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: AUDIT LOGS -->
      <div v-if="adminTab === 'audit'" class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex flex-col overflow-hidden animate-scale-up">
        <div class="p-6 border-b border-[#dbdbdb] bg-gray-50/50">
          <h2 class="text-lg font-extrabold text-gray-800">Trazabilidad y Auditoría de Fondos</h2>
          <p class="text-xs text-gray-500">Historial completo de recargas y ajustes manuales realizados por el equipo de administración</p>
        </div>
        
        <div class="divide-y divide-[#dbdbdb] p-4 space-y-4">
          <div v-for="log in auditLogs" :key="log.id" class="p-4 bg-gray-50/50 hover:bg-gray-50 border border-gray-150 rounded-2xl transition-all space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-purple-600 uppercase tracking-wide">Log de Auditoría #{{ log.id }}</span>
              <span class="text-gray-400 font-semibold">{{ formatDate(log.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-700">
              El administrador <strong class="text-gray-900">@{{ log.adminUsername }}</strong> 
              ajustó el balance del usuario <strong class="text-gray-900">@{{ log.targetUsername }}</strong> en 
              <span :class="log.amount >= 0 ? 'text-green-600 font-black' : 'text-red-500 font-black'">
                {{ log.amount >= 0 ? '+' : '' }}${{ formatCurrency(log.amount) }}
              </span> COP.
            </p>
            <div class="bg-white border border-gray-100 rounded-xl p-3 text-xs text-gray-600 italic flex items-start gap-2 shadow-sm">
              <Icon name="lucide:info" class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>Motivo del cambio: {{ log.reason }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-400 font-semibold pt-1">
              <span>Saldo anterior: ${{ formatCurrency(log.previousBalance) }}</span>
              <span>•</span>
              <span>Nuevo saldo: ${{ formatCurrency(log.newBalance) }}</span>
            </div>
          </div>
          <div v-if="auditLogs.length === 0" class="py-12 text-center text-gray-400 font-medium">
            <Icon name="lucide:history" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
            Sin logs de auditoría disponibles
          </div>
        </div>
      </div>

      <!-- TAB: CONTENT REPORTS / RETIRO FOTOS -->
      <div v-if="adminTab === 'reports'" class="space-y-6 animate-scale-up">
        <!-- Indicadores Rápidos -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Denuncias</p>
              <h3 class="text-2xl font-black text-gray-900 mt-1">{{ reports.length }}</h3>
            </div>
            <div class="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <Icon name="lucide:flag" class="w-6 h-6" />
            </div>
          </div>
          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-amber-600 uppercase tracking-wider">Pendientes de Revisión</p>
              <h3 class="text-2xl font-black text-amber-600 mt-1">{{ pendingReportsCount }}</h3>
            </div>
            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Icon name="lucide:clock" class="w-6 h-6" />
            </div>
          </div>
          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Derecho de Imagen</p>
              <h3 class="text-2xl font-black text-indigo-600 mt-1">
                {{ reports.filter(r => r.reason === 'IMAGE_RIGHTS_REMOVAL').length }}
              </h3>
            </div>
            <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Icon name="lucide:user-x" class="w-6 h-6" />
            </div>
          </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span class="text-xs font-bold text-gray-500 uppercase flex-shrink-0">Estado:</span>
            <div class="flex gap-1.5 flex-shrink-0">
              <button 
                v-for="status in ['ALL', 'PENDING', 'RESOLVED', 'DISMISSED']" 
                :key="status"
                @click="reportsFilter = status; loadReports()"
                :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  reportsFilter === status ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                {{ status === 'ALL' ? 'Todas' : status === 'PENDING' ? 'Pendientes' : status === 'RESOLVED' ? 'Resueltas' : 'Descartadas' }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="relative flex-1 md:w-64">
              <Icon name="lucide:search" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                v-model="reportsSearch" 
                type="text" 
                placeholder="Buscar por denunciante, evento..." 
                class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-red-500 outline-none transition-all"
              />
            </div>
            <button 
              @click="loadReports" 
              class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all"
              title="Refrescar denuncias">
              <Icon name="lucide:refresh-cw" :class="['w-4 h-4', loadingReports ? 'animate-spin' : '']" />
            </button>
          </div>
        </div>

        <!-- Tabla de Denuncias -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th class="py-4 px-4">ID / Fecha</th>
                  <th class="py-4 px-4">Motivo</th>
                  <th class="py-4 px-4">Evento / Fotógrafo</th>
                  <th class="py-4 px-4">Denunciante</th>
                  <th class="py-4 px-4">Detalle / Notas</th>
                  <th class="py-4 px-4">Estado</th>
                  <th class="py-4 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="filteredReports.length === 0">
                  <td colspan="7" class="py-12 text-center text-gray-400">
                    <Icon name="lucide:shield-check" class="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    No hay denuncias registradas en esta vista.
                  </td>
                </tr>
                <tr v-for="rep in filteredReports" :key="rep.id" class="hover:bg-gray-50/80 transition-colors">
                  <!-- ID & Fecha -->
                  <td class="py-4 px-4">
                    <span class="font-bold text-gray-900 block">#{{ rep.id }}</span>
                    <span class="text-[11px] text-gray-500">{{ formatDate(rep.createdAt) }}</span>
                  </td>

                  <!-- Motivo -->
                  <td class="py-4 px-4">
                    <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold',
                      rep.reason === 'IMAGE_RIGHTS_REMOVAL' ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300' :
                      rep.reason === 'INAPPROPRIATE_CONTENT' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-700']">
                      <Icon :name="rep.reason === 'IMAGE_RIGHTS_REMOVAL' ? 'lucide:user-x' : 'lucide:alert-triangle'" class="w-3.5 h-3.5" />
                      {{ rep.reasonLabel || rep.reason }}
                    </span>
                  </td>

                  <!-- Evento / Fotógrafo -->
                  <td class="py-4 px-4">
                    <NuxtLink 
                      :to="`/marketplace/events/${rep.eventId}`" 
                      target="_blank"
                      class="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      {{ rep.eventTitle || ('Evento #' + rep.eventId) }}
                      <Icon name="lucide:external-link" class="w-3 h-3" />
                    </NuxtLink>
                    <span class="text-[11px] text-gray-500 block">Fotógrafo: @{{ rep.photographerUsername || 'N/A' }}</span>
                  </td>

                  <!-- Denunciante -->
                  <td class="py-4 px-4">
                    <span class="font-bold text-gray-800 block">{{ rep.reporterUsername || 'Anónimo / Visitante' }}</span>
                    <span class="text-[11px] text-gray-500">{{ rep.reporterEmail || 'Sin correo' }}</span>
                  </td>

                  <!-- Detalle / Notas -->
                  <td class="py-4 px-4 max-w-xs">
                    <p class="line-clamp-2 text-gray-700 font-medium" :title="rep.description">
                      {{ rep.description || 'Sin comentarios adicionales.' }}
                    </p>
                    <p v-if="rep.adminNotes" class="text-[10px] text-purple-700 font-bold mt-1 bg-purple-50 p-1 rounded">
                      Admin: {{ rep.adminNotes }}
                    </p>
                  </td>

                  <!-- Estado -->
                  <td class="py-4 px-4">
                    <span :class="['px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                      rep.status === 'PENDING' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' :
                      rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-600']">
                      {{ rep.status === 'PENDING' ? 'Pendiente' : rep.status === 'RESOLVED' ? 'Resuelta' : 'Descartada' }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="py-4 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button 
                        @click="openReportDetail(rep)"
                        class="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
                        title="Ver detalle y gestionar">
                        Gestionar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: ADVANCED ANALYTICS -->
      <div v-if="adminTab === 'analytics'" class="space-y-8 animate-scale-up">
        
        <!-- Header & Refresh -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-xs">
              <Icon name="lucide:bar-chart-2" class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-lg font-black text-gray-900 tracking-tight">Inteligencia de Negocio y Métricas en Tiempo Real</h2>
              <p class="text-xs text-gray-500 font-medium">Volumen bruto transaccionado (GMV), ticket promedio, velocidad de ventas y distribución de métodos de pago</p>
            </div>
          </div>
          <button 
            @click="loadAnalytics"
            :disabled="loadingAnalytics"
            class="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto active:scale-95"
          >
            <Icon name="lucide:refresh-cw" :class="['w-4 h-4', loadingAnalytics ? 'animate-spin' : '']" />
            Actualizar Métricas
          </button>
        </div>

        <!-- Loader -->
        <div v-if="loadingAnalytics" class="p-16 bg-white border border-[#dbdbdb] rounded-2xl text-center text-purple-600 font-bold">
          <Icon name="lucide:loader-2" class="w-10 h-10 mx-auto mb-3 animate-spin" />
          <p class="text-sm">Analizando transacciones, ventas y base de datos...</p>
        </div>

        <div v-else-if="analyticsData" class="space-y-8">
          
          <!-- Key High Level Financial KPIs -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- GMV -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Volumen Bruto (GMV)</span>
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon name="lucide:dollar-sign" class="w-5 h-5" />
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-2xl sm:text-3xl font-black text-gray-900">${{ formatCurrency(analyticsData.grossMerchandiseValue || 0) }}</h3>
                <p class="text-[11px] text-gray-500 mt-1 font-medium">Total facturado a clientes en COP</p>
              </div>
            </div>

            <!-- Net Platform Earnings -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Ganancia Neta Plataforma</span>
                <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Icon name="lucide:trending-up" class="w-5 h-5" />
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-2xl sm:text-3xl font-black text-purple-700">${{ formatCurrency(analyticsData.totalPlatformEarnings || 0) }}</h3>
                <p class="text-[11px] text-gray-500 mt-1 font-medium">Comisiones cobradas por Moments</p>
              </div>
            </div>

            <!-- Average Order Value (AOV) -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket Promedio (AOV)</span>
                <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon name="lucide:receipt" class="w-5 h-5" />
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-2xl sm:text-3xl font-black text-gray-900">
                  ${{ formatCurrency(analyticsData.totalTransactions > 0 ? Math.round((analyticsData.grossMerchandiseValue || 0) / analyticsData.totalTransactions) : 0) }}
                </h3>
                <p class="text-[11px] text-gray-500 mt-1 font-medium">Promedio facturado por compra</p>
              </div>
            </div>

            <!-- Total Transactions -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Transacciones Completadas</span>
                <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Icon name="lucide:check-circle" class="w-5 h-5" />
                </div>
              </div>
              <div class="mt-4">
                <h3 class="text-2xl sm:text-3xl font-black text-gray-900">{{ analyticsData.totalTransactions || 0 }}</h3>
                <p class="text-[11px] text-gray-500 mt-1 font-medium">Órdenes procesadas exitosamente</p>
              </div>
            </div>
          </div>

          <!-- Payment Methods Breakdown & Volume Streams -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Methods Breakdown Card -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <h4 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  <Icon name="lucide:credit-card" class="w-4 h-4 text-purple-600" />
                  Canales y Medios de Pago
                </h4>
                <p class="text-xs text-gray-500 mt-1">Cómo pagan los usuarios al comprar fotos y paquetes.</p>
              </div>

              <div class="space-y-3">
                <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <div>
                      <p class="text-xs font-bold text-gray-800">Wompi (Pasarela Externa)</p>
                      <p class="text-[10px] text-gray-400">Tarjetas, PSE, Nequi y Bancolombia</p>
                    </div>
                  </div>
                  <span class="text-sm font-black text-gray-900">{{ analyticsData.wompiTransactions || 0 }}</span>
                </div>

                <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                    <div>
                      <p class="text-xs font-bold text-gray-800">Billetera Virtual (Wallet)</p>
                      <p class="text-[10px] text-gray-400">Saldo prepagado de clientes</p>
                    </div>
                  </div>
                  <span class="text-sm font-black text-gray-900">{{ analyticsData.walletTransactions || 0 }}</span>
                </div>

                <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-purple-500"></span>
                    <div>
                      <p class="text-xs font-bold text-gray-800">Tarjetas de Regalo (Gift Cards)</p>
                      <p class="text-[10px] text-gray-400">Cupones canjeados</p>
                    </div>
                  </div>
                  <span class="text-sm font-black text-gray-900">{{ analyticsData.giftCardTransactions || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Revenue Source Split -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <h4 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  <Icon name="lucide:pie-chart" class="w-4 h-4 text-purple-600" />
                  Origen de Comisiones
                </h4>
                <p class="text-xs text-gray-500 mt-1">Desglose de ingresos según tipo de venta.</p>
              </div>

              <div class="space-y-3">
                <div class="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-800">Fotos Individuales</span>
                  <span class="text-xs font-black text-purple-700">${{ formatCurrency(analyticsData.individualEarnings || 0) }}</span>
                </div>
                <div class="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-800">Paquetes de Fotos</span>
                  <span class="text-xs font-black text-indigo-700">${{ formatCurrency(analyticsData.packageEarnings || 0) }}</span>
                </div>
                <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-800">Emisión de Gift Cards</span>
                  <span class="text-xs font-black text-emerald-700">${{ formatCurrency(analyticsData.giftCardEarnings || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Platform Ecosystem & Assets -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <h4 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  <Icon name="lucide:server" class="w-4 h-4 text-purple-600" />
                  Ecosistema & Almacenamiento
                </h4>
                <p class="text-xs text-gray-500 mt-1">Métricas de infraestructura y activos.</p>
              </div>

              <div class="grid grid-cols-2 gap-3 text-center">
                <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p class="text-[10px] font-bold text-gray-400 uppercase">Fotógrafos</p>
                  <p class="text-xl font-black text-purple-700 mt-1">{{ analyticsData.photographersCount || 0 }}</p>
                </div>
                <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p class="text-[10px] font-bold text-gray-400 uppercase">Compradores</p>
                  <p class="text-xl font-black text-blue-600 mt-1">{{ analyticsData.customersCount || 0 }}</p>
                </div>
                <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p class="text-[10px] font-bold text-gray-400 uppercase">Eventos Creados</p>
                  <p class="text-xl font-black text-gray-800 mt-1">{{ analyticsData.totalEvents || 0 }}</p>
                </div>
                <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p class="text-[10px] font-bold text-gray-400 uppercase">Fotos en R2</p>
                  <p class="text-xl font-black text-emerald-600 mt-1">{{ analyticsData.totalPhotos || 0 }}</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Daily Sales Activity Trend (14 days) -->
          <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                  <Icon name="lucide:activity" class="w-4 h-4 text-purple-600" />
                  Actividad Diaria de Ventas (Últimos 14 Días)
                </h4>
                <p class="text-xs text-gray-500 mt-0.5">Evolución día a día de comisiones y transacciones registradas.</p>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
              <div 
                v-for="d in analyticsData.dailyTrend" 
                :key="d.date"
                class="p-3 rounded-xl border text-center transition-all hover:border-purple-300"
                :class="d.transactions > 0 ? 'bg-purple-50/60 border-purple-200 shadow-2xs' : 'bg-gray-50/50 border-gray-100'"
              >
                <p class="text-[10px] font-bold text-gray-400">{{ d.date.slice(5) }}</p>
                <p class="text-sm font-black text-gray-900 mt-1">{{ d.transactions }} tx</p>
                <p class="text-[10px] font-extrabold text-purple-700 mt-0.5">${{ formatCurrency(d.earnings || 0) }}</p>
              </div>
            </div>
          </div>

          <!-- Top Photographers & Top Events -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Top Photographers -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm space-y-4">
              <h4 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <Icon name="lucide:award" class="w-4 h-4 text-amber-500" />
                Top 5 Fotógrafos por Facturación
              </h4>
              <div v-if="analyticsData.topPhotographers && analyticsData.topPhotographers.length > 0" class="space-y-2.5">
                <div 
                  v-for="(p, idx) in analyticsData.topPhotographers" 
                  :key="p.username"
                  class="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100"
                >
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                      {{ idx + 1 }}
                    </span>
                    <div>
                      <p class="text-xs font-bold text-gray-900">@{{ p.username }}</p>
                      <p class="text-[10px] text-gray-400">{{ p.photosSold }} fotos vendidas</p>
                    </div>
                  </div>
                  <span class="text-xs font-black text-purple-700">${{ formatCurrency(p.revenue) }} COP</span>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 text-center py-6">Sin registros de ventas aún.</p>
            </div>

            <!-- Top Events -->
            <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm space-y-4">
              <h4 class="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <Icon name="lucide:calendar-check" class="w-4 h-4 text-indigo-500" />
                Top 5 Eventos con Mayor Demanda
              </h4>
              <div v-if="analyticsData.topEvents && analyticsData.topEvents.length > 0" class="space-y-2.5">
                <div 
                  v-for="(e, idx) in analyticsData.topEvents" 
                  :key="e.title"
                  class="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                      {{ idx + 1 }}
                    </span>
                    <p class="text-xs font-bold text-gray-900 truncate" :title="e.title">{{ e.title }}</p>
                  </div>
                  <span class="text-xs font-black text-indigo-700 flex-shrink-0">{{ e.photosSold }} fotos</span>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 text-center py-6">Sin registros de eventos vendidos aún.</p>
            </div>

          </div>

        </div>

      </div>

      <!-- MODAL GESTIONAR DENUNCIA -->
      <div v-if="showReportDetailModal && activeReport" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white border border-[#dbdbdb] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
          <div class="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Icon name="lucide:shield-alert" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-black text-gray-900 text-sm">Denuncia #{{ activeReport.id }}</h3>
                <p class="text-[11px] text-gray-500">{{ formatDate(activeReport.createdAt) }}</p>
              </div>
            </div>
            <button @click="showReportDetailModal = false" class="text-gray-400 hover:text-gray-600">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span class="text-[10px] font-black uppercase text-amber-700 block tracking-wider mb-0.5">Motivo reportado</span>
              <p class="font-bold text-amber-900 text-sm">{{ activeReport.reasonLabel || activeReport.reason }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span class="text-gray-400 font-bold uppercase text-[10px] block">Evento</span>
                <NuxtLink :to="`/marketplace/events/${activeReport.eventId}`" target="_blank" class="font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-0.5">
                  {{ activeReport.eventTitle || ('Evento #' + activeReport.eventId) }}
                  <Icon name="lucide:external-link" class="w-3 h-3" />
                </NuxtLink>
              </div>
              <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span class="text-gray-400 font-bold uppercase text-[10px] block">Fotógrafo</span>
                <p class="font-bold text-gray-800 mt-0.5">@{{ activeReport.photographerUsername }}</p>
              </div>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span class="text-gray-400 font-bold uppercase text-[10px] block">Datos del Denunciante</span>
              <p class="text-gray-800 font-medium"><strong class="text-gray-900">Usuario:</strong> {{ activeReport.reporterUsername || 'Anónimo / Sin cuenta' }}</p>
              <p class="text-gray-800 font-medium"><strong class="text-gray-900">Email de Contacto:</strong> {{ activeReport.reporterEmail || 'No especificado' }}</p>
            </div>

            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span class="text-gray-400 font-bold uppercase text-[10px] block">Detalles explicados por el usuario</span>
              <p class="text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">{{ activeReport.description || 'Sin detalles adicionales proporcionados.' }}</p>
            </div>

            <div class="space-y-1.5 pt-2">
              <label class="font-bold text-gray-700 uppercase tracking-wider text-[11px] block">Notas del Administrador / Resolución</label>
              <textarea 
                v-model="activeReportAdminNotes" 
                rows="3"
                placeholder="Ej: Se contactó al fotógrafo y se eliminaron las fotos solicitadas..."
                class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-500 outline-none transition-all"
              ></textarea>
            </div>
          </div>

          <div class="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
            <button 
              @click="showReportDetailModal = false" 
              class="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-white transition-colors">
              Cerrar
            </button>
            <div class="flex items-center gap-2">
              <button 
                @click="changeReportStatus(activeReport.id, 'DISMISSED')" 
                class="px-3.5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-colors">
                Descartar
              </button>
              <button 
                @click="changeReportStatus(activeReport.id, 'RESOLVED')" 
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5">
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                Marcar Resuelta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL DE AJUSTE DE SALDO -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div class="bg-white border border-[#dbdbdb] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
          
          <div class="p-6 border-b border-[#dbdbdb] flex items-center justify-between bg-gray-50">
            <h3 class="font-extrabold text-gray-800 flex items-center gap-2">
              <Icon name="lucide:wallet" class="text-purple-600 w-5 h-5" />
              Ajustar Saldo: {{ selectedUser?.username }}
            </h3>
            <button @click="closeAdjustmentModal" class="text-gray-400 hover:text-gray-600 transition-all">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submitAdjustment" class="p-6 space-y-5">
            <!-- Balance actual -->
            <div class="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
              <span class="text-xs font-bold text-purple-700">Saldo Actual:</span>
              <span class="text-lg font-black text-purple-900">${{ formatCurrency(selectedUser?.balance || 0) }}</span>
            </div>

            <!-- Cantidad a Ajustar -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide">Monto del Ajuste (COP)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                <input 
                  v-model.number="adjustmentForm.amount"
                  type="number"
                  step="0.01"
                  placeholder="Ej: 50.00 o -20.00" 
                  class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-3 pl-8 pr-4 text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                  required
                />
              </div>
              <p class="text-[10px] text-gray-400 font-medium">Usa valores positivos para recargar, y valores negativos para restar del saldo.</p>
            </div>

            <!-- Motivo/Razón -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide">Motivo o Razón del Ajuste</label>
              <textarea 
                v-model="adjustmentForm.reason"
                rows="3"
                placeholder="Indica detalladamente por qué se realiza este cambio (ej. Recarga de prueba, reembolso por paquete cancelado, etc.)"
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-3 px-4 text-xs outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                required
              ></textarea>
            </div>

            <!-- Botones de Acción -->
            <div class="flex gap-3 pt-2">
              <button 
                type="button" 
                @click="closeAdjustmentModal"
                class="flex-1 py-3 border border-[#dbdbdb] rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5"
                :disabled="submitting"
              >
                <Icon v-if="submitting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <span>Confirmar Ajuste</span>
              </button>
            </div>
          </form>

        </div>
      </div>

      <!-- MODAL DE COMISIÓN PERSONALIZADA DE FOTÓGRAFO -->
      <div v-if="showFeeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div class="bg-white border border-[#dbdbdb] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
          
          <div class="p-6 border-b border-[#dbdbdb] flex items-center justify-between bg-gray-50">
            <h3 class="font-extrabold text-gray-800 flex items-center gap-2">
              <Icon name="lucide:percent" class="text-purple-600 w-5 h-5" />
              Comisión de Fotógrafo: {{ selectedUser?.username }}
            </h3>
            <button @click="closeFeeModal" class="text-gray-400 hover:text-gray-600 transition-all">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submitCustomFee" class="p-6 space-y-5">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide">Porcentaje de Comisión Personalizado (%)</label>
              <div class="relative">
                <input 
                  v-model.number="customFeeForm.fee"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="Ej: 12.50 (dejar vacío para usar la comisión global)" 
                  class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-right pr-8"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
              </div>
              <p class="text-[10px] text-gray-400 font-medium">Si se deja vacío o en blanco, este fotógrafo usará el porcentaje de comisión global de la plataforma.</p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button 
                type="button" 
                @click="closeFeeModal"
                class="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="flex-1 py-3 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
                :disabled="savingFee"
              >
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                {{ savingFee ? 'Guardando...' : 'Establecer Comisión' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL DE DETALLE DE COMPRA E INSPECCIÓN DE FOTOS -->
      <div v-if="showPurchaseModal && selectedPurchaseDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="bg-white border border-[#dbdbdb] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl animate-scale-up my-8 max-h-[90vh] flex flex-col">
          
          <!-- Modal Header -->
          <div class="p-6 border-b border-[#dbdbdb] flex items-center justify-between bg-gray-50/80">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Icon name="lucide:receipt" class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-black text-gray-900 text-base">Detalle de Compra: {{ selectedPurchaseDetail.purchaseId }}</h3>
                  <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase',
                    selectedPurchaseDetail.purchaseType === 'INDIVIDUAL_PHOTO' ? 'bg-indigo-100 text-indigo-700' :
                    selectedPurchaseDetail.purchaseType === 'CART_PURCHASE' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700']">
                    {{ selectedPurchaseDetail.purchaseType === 'INDIVIDUAL_PHOTO' ? 'Foto Individual' :
                       selectedPurchaseDetail.purchaseType === 'CART_PURCHASE' ? 'Carrito Múltiple' : 'Paquete' }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 font-medium">Registrado el {{ formatDate(selectedPurchaseDetail.createdAt) }}</p>
              </div>
            </div>
            <button @click="closePurchaseDetail" class="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-6 overflow-y-auto space-y-6 flex-1">
            
            <!-- Buyer and Photographer Info Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Comprador -->
              <div class="bg-gradient-to-br from-purple-50/60 to-white border border-purple-100 rounded-2xl p-4 space-y-2">
                <p class="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="lucide:user" class="w-3.5 h-3.5" />
                  Información del Comprador
                </p>
                <div class="flex items-center gap-3 pt-1">
                  <div class="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm uppercase overflow-hidden shadow-sm">
                    <img v-if="selectedPurchaseDetail.buyerAvatarUrl" :src="selectedPurchaseDetail.buyerAvatarUrl" class="w-full h-full object-cover" />
                    <span v-else>{{ (selectedPurchaseDetail.buyerUsername || 'U').charAt(0) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-black text-gray-900 text-sm">@{{ selectedPurchaseDetail.buyerUsername }}</p>
                    <p v-if="selectedPurchaseDetail.buyerFullName" class="text-xs text-gray-600 font-semibold">{{ selectedPurchaseDetail.buyerFullName }}</p>
                    <p class="text-xs text-gray-400 font-medium truncate">{{ selectedPurchaseDetail.buyerEmail }}</p>
                  </div>
                </div>
              </div>

              <!-- Fotógrafo / Vendedor -->
              <div class="bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 rounded-2xl p-4 space-y-2">
                <p class="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="lucide:camera" class="w-3.5 h-3.5" />
                  Fotógrafo / Vendedor
                </p>
                <div v-if="selectedPurchaseDetail.photographerUsername" class="flex items-center gap-3 pt-1">
                  <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm uppercase overflow-hidden shadow-sm">
                    <img v-if="selectedPurchaseDetail.photographerAvatarUrl" :src="selectedPurchaseDetail.photographerAvatarUrl" class="w-full h-full object-cover" />
                    <span v-else>{{ selectedPurchaseDetail.photographerUsername.charAt(0) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-black text-gray-900 text-sm">@{{ selectedPurchaseDetail.photographerUsername }}</p>
                    <p class="text-xs text-gray-400 font-medium truncate">{{ selectedPurchaseDetail.photographerEmail }}</p>
                  </div>
                </div>
                <div v-else class="pt-1">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                    <Icon name="lucide:users" class="w-3.5 h-3.5" />
                    Múltiples Fotógrafos en Carrito
                  </span>
                  <p class="text-[11px] text-gray-500 mt-1">Revisa cada foto abajo para ver el fotógrafo correspondiente.</p>
                </div>
              </div>
            </div>

            <!-- Financial Breakdown Table -->
            <div class="bg-gray-50 border border-[#dbdbdb] rounded-2xl p-4 space-y-3">
              <h4 class="text-xs font-black text-gray-700 uppercase tracking-wider">Desglose Económico y Liquidación</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div class="bg-white border border-gray-200 rounded-xl p-3">
                  <span class="text-gray-400 block text-[10px] font-bold uppercase">Total Facturado</span>
                  <span class="text-base font-black text-gray-900">${{ formatCurrency(selectedPurchaseDetail.totalAmount) }}</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-3">
                  <span class="text-gray-400 block text-[10px] font-bold uppercase">Pago a Fotógrafo(s)</span>
                  <span class="text-base font-black text-emerald-600">${{ formatCurrency(selectedPurchaseDetail.photographerPayout) }}</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-3">
                  <span class="text-gray-400 block text-[10px] font-bold uppercase">Comisión Plataforma</span>
                  <span class="text-base font-black text-indigo-600">${{ formatCurrency(selectedPurchaseDetail.platformFee) }}</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-xl p-3">
                  <span class="text-gray-400 block text-[10px] font-bold uppercase">Referencia Wompi/Pago</span>
                  <span class="font-mono text-[11px] font-bold text-gray-700 truncate block" :title="selectedPurchaseDetail.paymentReference">
                    {{ selectedPurchaseDetail.paymentReference || 'N/A' }}
                  </span>
                </div>
              </div>
              <div v-if="selectedPurchaseDetail.giftCardCode" class="bg-pink-50 border border-pink-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 text-pink-700 font-bold">
                  <Icon name="lucide:gift" class="w-4 h-4 text-pink-600" />
                  <span>Código de Descuento Aplicado: <strong class="font-mono">{{ selectedPurchaseDetail.giftCardCode }}</strong></span>
                </div>
                <span class="font-black text-pink-700">-${{ formatCurrency(selectedPurchaseDetail.discountAmount) }} COP</span>
              </div>
            </div>

            <!-- Photos Gallery Traceability -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="lucide:images" class="w-4 h-4 text-purple-600" />
                  Fotos Incluidas en esta Compra ({{ (selectedPurchaseDetail.photos || []).length }})
                </h4>
                <span v-if="selectedPurchaseDetail.eventTitle" class="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  Evento: {{ selectedPurchaseDetail.eventTitle }}
                </span>
              </div>

              <!-- Photo Cards Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  v-for="(photo, index) in (selectedPurchaseDetail.photos || [])" 
                  :key="photo.photoId || index"
                  class="bg-white border border-[#dbdbdb] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:border-purple-300 transition-all"
                >
                  <!-- Photo Preview Container -->
                  <div class="relative aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      :src="photo.watermarkedUrl || photo.hdUrl" 
                      :alt="'Foto #' + photo.photoId"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      ID #{{ photo.photoId }}
                    </div>
                    <div v-if="photo.price" class="absolute bottom-2 right-2 bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                      ${{ formatCurrency(photo.price) }}
                    </div>
                  </div>

                  <!-- Photo Metadata Card Footer -->
                  <div class="p-3 space-y-1 text-xs bg-gray-50/50 flex-1 flex flex-col justify-between">
                    <div>
                      <p v-if="photo.photographerUsername" class="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                        <Icon name="lucide:camera" class="w-3 h-3 text-blue-500" />
                        <span>@{{ photo.photographerUsername }}</span>
                      </p>
                      <p v-if="photo.eventTitle" class="text-[10px] text-gray-500 truncate" :title="photo.eventTitle">
                        {{ photo.eventTitle }}
                      </p>
                    </div>

                    <div class="pt-2 flex items-center gap-2">
                      <a 
                        v-if="photo.hdUrl || photo.watermarkedUrl" 
                        :href="photo.hdUrl || photo.watermarkedUrl" 
                        target="_blank"
                        class="flex-1 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Icon name="lucide:external-link" class="w-3 h-3" />
                        Ver Original
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Fallback if no specific photo items -->
              <div v-if="(!selectedPurchaseDetail.photos || selectedPurchaseDetail.photos.length === 0)" class="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl">
                <Icon name="lucide:image-off" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p class="text-xs font-bold text-gray-500">No hay miniaturas directas disponibles para este paquete histórico.</p>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-[#dbdbdb] bg-gray-50 flex justify-end">
            <button 
              @click="closePurchaseDetail"
              class="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              Cerrar Detalle
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from '#app'

// Page Meta & Configuration
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const router = useRouter()
const { $api } = useNuxtApp()

// Component States
const users = ref([])
const platformEarnings = ref({})
const auditLogs = ref([])
const searchQuery = ref('')
const roleFilter = ref('ALL')
const adminTab = ref('users')
const earningsDateFilter = ref('')

// Analytics States
const analyticsData = ref(null)
const loadingAnalytics = ref(false)

async function loadAnalytics() {
  loadingAnalytics.value = true
  try {
    const res = await $api('/admin/analytics/overview')
    analyticsData.value = res
  } catch (e) {
    console.error('Error loading analytics:', e)
  } finally {
    loadingAnalytics.value = false
  }
}

// Traceability Component States
const purchases = ref([])
const loadingPurchases = ref(false)
const purchasesSearch = ref('')
const purchasesTypeFilter = ref('ALL')
const purchasesStartDate = ref('')
const purchasesEndDate = ref('')
const showPurchaseModal = ref(false)
const selectedPurchaseDetail = ref(null)

// Content Reports States
const reports = ref([])
const loadingReports = ref(false)
const reportsFilter = ref('ALL')
const reportsSearch = ref('')
const pendingReportsCount = ref(0)
const showReportDetailModal = ref(false)
const activeReport = ref(null)
const activeReportAdminNotes = ref('')

// Modal States
const showModal = ref(false)
const selectedUser = ref(null)
const submitting = ref(false)
const adjustmentForm = ref({
  amount: null,
  reason: ''
})

const globalFeeValue = ref(15)
const savingGlobalFee = ref(false)
const showFeeModal = ref(false)
const savingFee = ref(false)
const customFeeForm = ref({
  fee: null
})

// Authentication & Role Check
onMounted(async () => {
  authStore.init()
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push('/')
    return
  }
  await loadData()
})

// Load Stats and Listings
async function loadData() {
  try {
    const [usersRes, earningsRes, auditRes, globalFeeRes] = await Promise.all([
      $api('/admin/users'),
      $api('/admin/earnings'),
      $api('/admin/audit-logs'),
      $api('/admin/settings/global-fee')
    ])
    users.value = usersRes
    platformEarnings.value = earningsRes
    auditLogs.value = auditRes
    globalFeeValue.value = Number(globalFeeRes.globalFee || 15.00)
    
    // Also preload purchases traceability and pending reports in background
    loadPurchasesTraceability()
    loadPendingReportsCount()
  } catch (e) {
    console.error('Error loading admin dashboard data:', e)
  }
}

// Traceability Loader
async function loadPurchasesTraceability() {
  loadingPurchases.value = true
  try {
    let url = '/admin/purchases/traceability?'
    const params = new URLSearchParams()
    if (purchasesSearch.value) params.append('query', purchasesSearch.value)
    if (purchasesTypeFilter.value && purchasesTypeFilter.value !== 'ALL') params.append('type', purchasesTypeFilter.value)
    if (purchasesStartDate.value) params.append('startDate', purchasesStartDate.value)
    if (purchasesEndDate.value) params.append('endDate', purchasesEndDate.value)

    const res = await $api(url + params.toString())
    purchases.value = res || []
  } catch (e) {
    console.error('Error loading purchases traceability:', e)
  } finally {
    loadingPurchases.value = false
  }
}

function resetPurchaseFilters() {
  purchasesSearch.value = ''
  purchasesTypeFilter.value = 'ALL'
  purchasesStartDate.value = ''
  purchasesEndDate.value = ''
  loadPurchasesTraceability()
}

function openPurchaseDetail(item) {
  selectedPurchaseDetail.value = item
  showPurchaseModal.value = true
}

function closePurchaseDetail() {
  showPurchaseModal.value = false
  selectedPurchaseDetail.value = null
}

// Traceability Computed Filters and Stats
const filteredPurchases = computed(() => {
  return purchases.value.filter(p => {
    // Client-side quick filter
    if (purchasesTypeFilter.value !== 'ALL' && p.purchaseType !== purchasesTypeFilter.value) {
      return false
    }
    if (purchasesSearch.value) {
      const q = purchasesSearch.value.toLowerCase()
      const matchBuyer = (p.buyerUsername && p.buyerUsername.toLowerCase().includes(q)) ||
                         (p.buyerEmail && p.buyerEmail.toLowerCase().includes(q)) ||
                         (p.buyerFullName && p.buyerFullName.toLowerCase().includes(q))
      const matchPhotographer = (p.photographerUsername && p.photographerUsername.toLowerCase().includes(q)) ||
                                (p.photographerEmail && p.photographerEmail.toLowerCase().includes(q))
      const matchEvent = p.eventTitle && p.eventTitle.toLowerCase().includes(q)
      const matchId = (p.purchaseId && p.purchaseId.toLowerCase().includes(q)) ||
                      (p.paymentReference && p.paymentReference.toLowerCase().includes(q))
      if (!matchBuyer && !matchPhotographer && !matchEvent && !matchId) {
        return false
      }
    }
    return true
  })
})

const filteredPurchasesVolume = computed(() => {
  return filteredPurchases.value.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
})

const filteredPurchasesPhotosCount = computed(() => {
  return filteredPurchases.value.reduce((acc, curr) => acc + (curr.photoCount || (curr.photos ? curr.photos.length : 1)), 0)
})

const filteredPurchasesPhotographerPayout = computed(() => {
  return filteredPurchases.value.reduce((acc, curr) => acc + (curr.photographerPayout || 0), 0)
})

const filteredPurchasesPlatformFee = computed(() => {
  return filteredPurchases.value.reduce((acc, curr) => acc + (curr.platformFee || 0), 0)
})

async function loadEarningsFiltered() {
  try {
    let url = '/admin/earnings'
    if (earningsDateFilter.value) {
      url += `?startDate=${earningsDateFilter.value}&endDate=${earningsDateFilter.value}`
    }
    const res = await $api(url)
    platformEarnings.value = res
  } catch (e) {
    console.error('Error loading earnings', e)
  }
}

// Compute Metrics
const totalUsers = computed(() => users.value.length)
const totalBalance = computed(() => {
  return users.value.reduce((acc, curr) => acc + (curr.balance || 0), 0)
})
const topUser = computed(() => {
  if (users.value.length === 0) return null
  return [...users.value].sort((a, b) => (b.balance || 0) - (a.balance || 0))[0]
})

// Filtered Users List
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = roleFilter.value === 'ALL' || u.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

// Helpers
function getRoleClass(role) {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700'
    case 'PHOTOGRAPHER':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function formatCurrency(val) {
  if (val === null || val === undefined) return '0'
  return Number(val).toLocaleString('es-CO')
}

import { formatColombiaDateTime } from '~/utils/date'

function formatDate(dateStr) {
  return formatColombiaDateTime(dateStr)
}

// Actions
function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function openAdjustmentModal(user) {
  selectedUser.value = user
  adjustmentForm.value.amount = null
  adjustmentForm.value.reason = ''
  showModal.value = true
}

function closeAdjustmentModal() {
  showModal.value = false
  selectedUser.value = null
}

async function submitAdjustment() {
  if (submitting.value) return
  if (!adjustmentForm.value.amount || !adjustmentForm.value.reason.trim()) {
    alert('Por favor completa todos los campos del ajuste.')
    return
  }

  submitting.value = true
  try {
    const updatedUser = await $api(`/admin/users/${selectedUser.value.id}/balance`, {
      method: 'POST',
      body: {
        amount: adjustmentForm.value.amount,
        reason: adjustmentForm.value.reason
      }
    })

    // Update in UI list
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }

    // Refresh audit logs and stats
    const auditRes = await $api('/admin/audit-logs')
    auditLogs.value = auditRes

    closeAdjustmentModal()
  } catch (e) {
    console.error('Error submitting balance adjustment:', e)
    alert('Error al ajustar el saldo.')
  } finally {
    submitting.value = false
  }
}

async function saveGlobalFee() {
  if (savingGlobalFee.value) return
  savingGlobalFee.value = true
  try {
    await $api('/admin/settings/global-fee', {
      method: 'PUT',
      body: { globalFee: globalFeeValue.value.toString() }
    })
    alert('Comisión global de plataforma actualizada con éxito.')
  } catch (e) {
    console.error('Error saving global fee:', e)
    alert('Error al guardar la comisión global.')
  } finally {
    savingGlobalFee.value = false
  }
}

function openCustomFeeModal(user) {
  selectedUser.value = user
  customFeeForm.value.fee = user.customPlatformFeePercentage
  showFeeModal.value = true
}

function closeFeeModal() {
  showFeeModal.value = false
  selectedUser.value = null
}

async function submitCustomFee() {
  if (savingFee.value) return
  savingFee.value = true
  try {
    await $api(`/admin/users/${selectedUser.value.id}/custom-fee`, {
      method: 'PUT',
      body: { customFee: customFeeForm.value.fee }
    })
    
    // Update local user list
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index].customPlatformFeePercentage = customFeeForm.value.fee
    }
    
    closeFeeModal()
  } catch (e) {
    console.error('Error submitting custom fee:', e)
    alert('Error al guardar la comisión del fotógrafo.')
  } finally {
    savingFee.value = false
  }
}

// Admin Gift Card Generator state & logic
const adminGcAmount = ref(10000)
const adminGcCount = ref(10)
const adminGcPhotographerId = ref(null)
const generatingAdminGc = ref(false)
const lastGeneratedBatch = ref(null)
const adminBatches = ref([])
const adminBatchesLoading = ref(false)

async function loadAdminBatches() {
  adminBatchesLoading.value = true
  try {
    adminBatches.value = await $api('/giftcards/my-batches')
  } catch (e) {
    console.error('Error loading batches', e)
  } finally {
    adminBatchesLoading.value = false
  }
}

async function handleAdminGenerateGc() {
  if (adminGcAmount.value <= 0 || adminGcCount.value <= 0) {
    alert('Monto y cantidad deben ser mayores a 0.')
    return
  }
  generatingAdminGc.value = true
  lastGeneratedBatch.value = null
  try {
    const res = await $api('/giftcards/admin/generate', {
      method: 'POST',
      body: {
        amount: adminGcAmount.value,
        count: adminGcCount.value,
        photographerId: adminGcPhotographerId.value || null
      }
    })
    lastGeneratedBatch.value = res
    await loadAdminBatches()
  } catch (error) {
    console.error('Error generating gift cards:', error)
    alert('Error al generar códigos de regalo: ' + (error.response?._data?.error || error.message))
  } finally {
    generatingAdminGc.value = false
  }
}

function copyCode(text) {
  navigator.clipboard.writeText(text)
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  alert('Copiado: ' + text)
}

async function downloadBatchXml(batchRef) {
  try {
    const config = useRuntimeConfig()
    const token = useAuthStore().token
    const response = await fetch(`${config.public.apiBase}/giftcards/batch/${batchRef}/export.xml`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Error al descargar')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gift_cards_${batchRef}.xml`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Error al descargar el XML: ' + e.message)
  }
}

// Reports Methods
const filteredReports = computed(() => {
  if (!reportsSearch.value) return reports.value
  const q = reportsSearch.value.toLowerCase()
  return reports.value.filter(r => 
    (r.eventTitle && r.eventTitle.toLowerCase().includes(q)) ||
    (r.photographerUsername && r.photographerUsername.toLowerCase().includes(q)) ||
    (r.reporterUsername && r.reporterUsername.toLowerCase().includes(q)) ||
    (r.reporterEmail && r.reporterEmail.toLowerCase().includes(q)) ||
    (r.description && r.description.toLowerCase().includes(q)) ||
    (r.reasonLabel && r.reasonLabel.toLowerCase().includes(q))
  )
})

async function loadReports() {
  loadingReports.value = true
  try {
    const url = reportsFilter.value !== 'ALL' 
      ? `/reports/admin?status=${reportsFilter.value}` 
      : '/reports/admin'
    const res = await $api(url)
    reports.value = res || []
  } catch (err) {
    console.error('Error loading reports:', err)
  } finally {
    loadingReports.value = false
  }
}

async function loadPendingReportsCount() {
  try {
    const res = await $api('/reports/admin/pending-count')
    pendingReportsCount.value = res?.count || 0
  } catch (err) {
    console.error('Error loading pending reports count:', err)
  }
}

function openReportDetail(report) {
  activeReport.value = report
  activeReportAdminNotes.value = report.adminNotes || ''
  showReportDetailModal.value = true
}

async function changeReportStatus(reportId, status) {
  try {
    await $api(`/reports/admin/${reportId}/status`, {
      method: 'PATCH',
      body: {
        status: status,
        adminNotes: activeReportAdminNotes.value
      }
    })
    showReportDetailModal.value = false
    alert(status === 'RESOLVED' ? 'Denuncia marcada como resuelta con éxito.' : 'Denuncia descartada.')
    await loadReports()
    await loadPendingReportsCount()
  } catch (err) {
    console.error('Error updating report status:', err)
    alert('Error al actualizar el estado de la denuncia: ' + (err.response?._data?.error || err.message))
  }
}

// Watch tab changes to lazy load
watch(() => adminTab.value, (tab) => {
  if (tab === 'giftcards') loadAdminBatches()
  if (tab === 'purchases') loadPurchasesTraceability()
  if (tab === 'reports') loadReports()
})
watch([purchasesStartDate, purchasesEndDate, purchasesTypeFilter], () => {
  loadPurchasesTraceability()
})
</script>

<style scoped>
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up {
  animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
