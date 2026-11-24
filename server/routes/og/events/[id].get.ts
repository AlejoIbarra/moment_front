import { defineEventHandler, getRouterParam, setHeader, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id') || ''
  const eventId = rawId.replace(/\.(jpg|jpeg|png)$/i, '').trim()

  if (!eventId) {
    return sendRedirect(event, 'https://www.moments-gallery.com/logo.png', 302)
  }

  const config = useRuntimeConfig(event)
  const apiBase = (config.public?.apiBase || 'https://moment-back.onrender.com/api').replace(/\/$/, '')
  const upstreamUrl = `${apiBase}/events/${encodeURIComponent(eventId)}/og-image.jpg`

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: 'image/jpeg,image/*;q=0.8'
      },
      signal: AbortSignal.timeout(9000)
    })

    if (!response.ok) {
      return sendRedirect(event, 'https://www.moments-gallery.com/logo.png', 302)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length === 0) {
      return sendRedirect(event, 'https://www.moments-gallery.com/logo.png', 302)
    }

    setHeader(event, 'Content-Type', 'image/jpeg')
    setHeader(event, 'Content-Length', String(buffer.length))
    setHeader(event, 'Content-Disposition', 'inline; filename="moments-event-og.jpg"')
    setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
    setHeader(event, 'CDN-Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    setHeader(event, 'Vercel-CDN-Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')

    return buffer
  } catch {
    return sendRedirect(event, 'https://www.moments-gallery.com/logo.png', 302)
  }
})
