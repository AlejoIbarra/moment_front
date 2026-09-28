import { ref, computed } from 'vue'

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
  flag: string
  rateFromCOP: number // 1 unit of this currency = X COP
  decimals: number
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴', rateFromCOP: 1, decimals: 0 },
  { code: 'USD', name: 'Dólar (USD)', symbol: '$', flag: '🇺🇸', rateFromCOP: 4100, decimals: 2 },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽', rateFromCOP: 225, decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateFromCOP: 4400, decimals: 2 },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪', rateFromCOP: 1100, decimals: 2 },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱', rateFromCOP: 4.3, decimals: 0 },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷', rateFromCOP: 4.1, decimals: 0 },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷', rateFromCOP: 730, decimals: 2 },
]

const currentCurrencyCode = ref<string>('COP')
let isInitialized = false

export function useCurrency() {
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true
    const saved = localStorage.getItem('moment_selected_currency')
    if (saved && CURRENCIES.some(c => c.code === saved)) {
      currentCurrencyCode.value = saved
    } else {
      // Auto-detect based on locale/timezone if not set
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        if (tz.includes('Bogota')) currentCurrencyCode.value = 'COP'
        else if (tz.includes('Mexico')) currentCurrencyCode.value = 'MXN'
        else if (tz.includes('Buenos_Aires')) currentCurrencyCode.value = 'ARS'
        else if (tz.includes('Santiago')) currentCurrencyCode.value = 'CLP'
        else if (tz.includes('Lima')) currentCurrencyCode.value = 'PEN'
        else if (tz.includes('Sao_Paulo')) currentCurrencyCode.value = 'BRL'
        else if (tz.includes('Madrid') || tz.includes('Paris') || tz.includes('Berlin')) currentCurrencyCode.value = 'EUR'
        else currentCurrencyCode.value = 'USD'
      } catch {
        currentCurrencyCode.value = 'COP'
      }
    }
  }

  const currentCurrency = computed(() => {
    return CURRENCIES.find(c => c.code === currentCurrencyCode.value) || CURRENCIES[0]
  })

  function setCurrency(code: string) {
    const found = CURRENCIES.find(c => c.code === code)
    if (found) {
      currentCurrencyCode.value = code
      if (typeof window !== 'undefined') {
        localStorage.setItem('moment_selected_currency', code)
      }
    }
  }

  function formatPrice(amountInCOP: number | string | null | undefined, targetCode?: string): string {
    if (amountInCOP === null || amountInCOP === undefined || isNaN(Number(amountInCOP))) {
      return '$0'
    }

    const valCOP = Number(amountInCOP)
    const code = targetCode || currentCurrencyCode.value
    const curr = CURRENCIES.find(c => c.code === code) || CURRENCIES[0]

    if (curr.code === 'COP') {
      return `$${Math.round(valCOP).toLocaleString('es-CO')} COP`
    }

    const converted = valCOP / curr.rateFromCOP
    const formattedNum = converted.toLocaleString('en-US', {
      minimumFractionDigits: curr.decimals,
      maximumFractionDigits: curr.decimals
    })

    return `${curr.symbol}${formattedNum} ${curr.code}`
  }

  function convertFromCOP(amountInCOP: number, targetCode?: string): number {
    const code = targetCode || currentCurrencyCode.value
    const curr = CURRENCIES.find(c => c.code === code) || CURRENCIES[0]
    return amountInCOP / curr.rateFromCOP
  }

  function convertToCOP(amount: number, sourceCode?: string): number {
    const code = sourceCode || currentCurrencyCode.value
    const curr = CURRENCIES.find(c => c.code === code) || CURRENCIES[0]
    return Math.round(amount * curr.rateFromCOP)
  }

  return {
    currencies: CURRENCIES,
    currentCurrencyCode,
    currentCurrency,
    setCurrency,
    formatPrice,
    convertFromCOP,
    convertToCOP
  }
}
