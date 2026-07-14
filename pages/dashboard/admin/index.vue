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

      <!-- MAIN SECTION GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- LEFT/MID: USERS MANAGEMENT TABLE (Span 2) -->
        <div class="lg:col-span-2 bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div class="p-6 border-b border-[#dbdbdb] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h2 class="text-lg font-extrabold text-gray-800">Directorio y Gestión de Saldos</h2>
              <p class="text-xs text-gray-500">Busca usuarios y modifica sus fondos directamente</p>
            </div>
            
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <!-- Search -->
              <div class="relative min-w-[200px]">
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
          <div class="overflow-x-auto flex-grow">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-[#dbdbdb] bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th class="py-4 px-6">Usuario</th>
                  <th class="py-4 px-6">Rol</th>
                  <th class="py-4 px-6">Saldo Actual</th>
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
                  <td colspan="4" class="py-12 text-center text-gray-400 font-medium">
                    <Icon name="lucide:user-x" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No se encontraron usuarios
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- RIGHT: AUDIT LOGS (Span 1) -->
        <div class="bg-white border border-[#dbdbdb] rounded-2xl shadow-sm flex flex-col overflow-hidden max-h-[600px]">
          <div class="p-6 border-b border-[#dbdbdb] bg-gray-50/50">
            <h2 class="text-lg font-extrabold text-gray-800">Trazabilidad y Auditoría</h2>
            <p class="text-xs text-gray-500">Historial completo de recargas y ajustes manuales</p>
          </div>
          
          <div class="overflow-y-auto flex-grow divide-y divide-[#dbdbdb] p-2">
            <div v-for="log in auditLogs" :key="log.id" class="p-4 hover:bg-gray-50 rounded-xl transition-all space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-purple-600 uppercase tracking-wide">Audit ID #{{ log.id }}</span>
                <span class="text-gray-400 font-medium">{{ formatDate(log.createdAt) }}</span>
              </div>
              <p class="text-xs text-gray-700">
                El administrador <strong class="text-gray-900">{{ log.adminUsername }}</strong> 
                ajustó a <strong class="text-gray-900">{{ log.targetUsername }}</strong> en 
                <span :class="log.amount >= 0 ? 'text-green-600 font-extrabold' : 'text-red-500 font-extrabold'">
                  {{ log.amount >= 0 ? '+' : '' }}${{ formatCurrency(log.amount) }}
                </span>.
              </p>
              <div class="bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] text-gray-500 italic flex items-start gap-1.5">
                <Icon name="lucide:info" class="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                <span>{{ log.reason }}</span>
              </div>
              <div class="flex items-center gap-3 text-[10px] text-gray-400 font-semibold pt-1">
                <span>Antes: ${{ formatCurrency(log.previousBalance) }}</span>
                <span>•</span>
                <span>Después: ${{ formatCurrency(log.newBalance) }}</span>
              </div>
            </div>
            <div v-if="auditLogs.length === 0" class="py-12 text-center text-gray-400 font-medium">
              <Icon name="lucide:history" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
              Sin logs de auditoría disponibles
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

// Modal States
const showModal = ref(false)
const selectedUser = ref(null)
const submitting = ref(false)
const adjustmentForm = ref({
  amount: null,
  reason: ''
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
    const [usersRes, earningsRes, auditRes] = await Promise.all([
      $api('/admin/users'),
      $api('/admin/earnings'),
      $api('/admin/audit-logs')
    ])
    users.value = usersRes
    platformEarnings.value = earningsRes
    auditLogs.value = auditRes
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
