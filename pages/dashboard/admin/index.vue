<template>
  <div class="min-h-screen bg-[#fafafa] p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
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

      <!-- TAB: PLATFORM EARNINGS -->
      <div v-if="adminTab === 'earnings'" class="space-y-6 animate-scale-up">
        <!-- Earnings Metrics Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      earn.earningType === 'PACKAGE' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600']">
                      {{ earn.earningType === 'PACKAGE' ? 'Paquete' : 'Foto Individual' }}
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
      <div v-if="adminTab === 'giftcards'" class="animate-scale-up">
        <!-- ADMIN GIFT CARD GENERATOR -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="lucide:gift" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-sm font-bold text-gray-800">Generador de Tarjetas de Regalo (Gift Cards)</h2>
              <p class="text-xs text-gray-500">Crea códigos de regalo que los clientes pueden usar para comprar fotos o paquetes.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Monto por Tarjeta</label>
              <input 
                v-model.number="adminGcAmount" 
                type="number" 
                placeholder="Ej: 10000" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:border-purple-500" 
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-500 uppercase">Cantidad a Generar</label>
              <input 
                v-model.number="adminGcCount" 
                type="number" 
                placeholder="Ej: 5" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:border-purple-500" 
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-500 uppercase">ID del Fotógrafo (Opcional)</label>
              <input 
                v-model.number="adminGcPhotographerId" 
                type="number" 
                placeholder="En blanco para global" 
                class="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:border-purple-500" 
              />
            </div>
            <button 
              @click="handleAdminGenerateGc" 
              :disabled="generatingAdminGc"
              class="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {{ generatingAdminGc ? 'Generando...' : 'Generar Códigos' }}
            </button>
          </div>

          <!-- Generated Codes List -->
          <div v-if="generatedCodesList.length > 0" class="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-3">
            <h4 class="text-xs font-bold text-purple-900 uppercase">Códigos Generados Exitosamente:</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div 
                v-for="code in generatedCodesList" 
                :key="code"
                class="bg-white border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-purple-700 flex items-center justify-between"
              >
                <span>{{ code }}</span>
                <button @click="copyToClipboard(code)" class="text-purple-400 hover:text-purple-600" title="Copiar">
                  <Icon name="lucide:copy" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
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

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
  } catch (e) {
    console.error('Error loading admin dashboard data:', e)
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
  if (val === null || val === undefined) return '0.00'
  return Number(val).toFixed(2)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
const adminGcCount = ref(5)
const adminGcPhotographerId = ref(null)
const generatingAdminGc = ref(false)
const generatedCodesList = ref([])

async function handleAdminGenerateGc() {
  if (adminGcAmount.value <= 0 || adminGcCount.value <= 0) {
    alert('Monto y cantidad deben ser mayores a 0.')
    return
  }
  generatingAdminGc.value = true
  try {
    const res = await $api('/giftcards/admin/generate', {
      method: 'POST',
      body: {
        amount: adminGcAmount.value,
        count: adminGcCount.value,
        photographerId: adminGcPhotographerId.value || null
      }
    })
    generatedCodesList.value = res.codes
    alert('Códigos de regalo generados con éxito.')
  } catch (error) {
    console.error('Error generating gift cards:', error)
    alert('Error al generar códigos de regalo: ' + (error.response?._data?.error || error.message))
  } finally {
    generatingAdminGc.value = false
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  alert('Copiado: ' + text)
}
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
