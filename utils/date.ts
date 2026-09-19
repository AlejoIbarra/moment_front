/**
 * Date and time formatting utilities for Moments Gallery.
 * Guarantees all dates and hours are shown in Colombia local time (America/Bogota, UTC-5)
 * with the Spanish (Colombia) locale (es-CO).
 */

export const COLOMBIA_TIMEZONE = 'America/Bogota'
export const COLOMBIA_LOCALE = 'es-CO'

/**
 * Safely parses an API/database date string into a Date object.
 * If the string does not have a timezone offset or 'Z' (which Spring Boot / Jackson outputs
 * when serializing UTC LocalDateTime), we append 'Z' so JavaScript interprets it as UTC,
 * preventing local browser timezone distortions.
 */
export function parseDate(dateInput: string | number | Date | null | undefined): Date | null {
  if (!dateInput) return null
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput
  if (typeof dateInput === 'number') return new Date(dateInput)

  let str = String(dateInput).trim()
  if (!str) return null

  // If format is like "2026-09-18T20:15:30" without offset or Z, append 'Z'
  if (str.includes('T') && !str.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(str)) {
    str += 'Z'
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(str)) {
    // Format "2026-09-18 20:15:30"
    str = str.replace(' ', 'T') + 'Z'
  }

  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Returns formatted hour in Colombia time: e.g. "3:15 p. m." or "11:42 a. m."
 */
export function formatColombiaHour(dateInput: any): string {
  const d = parseDate(dateInput)
  if (!d) return ''
  return d.toLocaleTimeString(COLOMBIA_LOCALE, {
    timeZone: COLOMBIA_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Returns formatted date in Colombia time: e.g. "18 sept 2026" or "18 de septiembre de 2026"
 */
export function formatColombiaDate(dateInput: any, options?: Intl.DateTimeFormatOptions): string {
  const d = parseDate(dateInput)
  if (!d) return ''
  const defaultOpts: Intl.DateTimeFormatOptions = {
    timeZone: COLOMBIA_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  }
  return d.toLocaleDateString(COLOMBIA_LOCALE, defaultOpts)
}

/**
 * Returns full date and hour in Colombia time: e.g. "18 sept 2026, 3:15 p. m."
 */
export function formatColombiaDateTime(dateInput: any): string {
  const d = parseDate(dateInput)
  if (!d) return ''
  return d.toLocaleString(COLOMBIA_LOCALE, {
    timeZone: COLOMBIA_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Relative time ago calculated against current Colombia time.
 * "justo ahora", "hace 5 min", "hace 2 h", "ayer", "hace 3 d", etc.
 */
export function formatTimeAgo(dateInput: any): string {
  const d = parseDate(dateInput)
  if (!d) return ''
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 45) return 'justo ahora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} d`
  const months = Math.floor(days / 30)
  if (months < 12) return `hace ${months} mes${months > 1 ? 'es' : ''}`
  const years = Math.floor(months / 12)
  return `hace ${years} año${years > 1 ? 's' : ''}`
}

/**
 * Formats time for chat conversation list in Colombia time:
 * - Same day: "3:15 p. m."
 * - Yesterday: "Ayer"
 * - Within a week: "jueves"
 * - Older: "18 sept"
 */
export function formatChatConversationTime(dateInput: any): string {
  const d = parseDate(dateInput)
  if (!d) return ''
  const now = new Date()

  // Compare calendar days formatted in Colombia timezone
  const dateCal = d.toLocaleDateString(COLOMBIA_LOCALE, { timeZone: COLOMBIA_TIMEZONE })
  const nowCal = now.toLocaleDateString(COLOMBIA_LOCALE, { timeZone: COLOMBIA_TIMEZONE })

  if (dateCal === nowCal) {
    return formatColombiaHour(d)
  }

  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) {
    return d.toLocaleDateString(COLOMBIA_LOCALE, { timeZone: COLOMBIA_TIMEZONE, weekday: 'short' })
  }
  return d.toLocaleDateString(COLOMBIA_LOCALE, { timeZone: COLOMBIA_TIMEZONE, month: 'short', day: 'numeric' })
}
