export interface ClientAnnouncementTip {
  icon: string
  title: string
  description: string
}

export interface ClientAnnouncement {
  /** Identificador único de la campaña. Cambia o agrega un nuevo ID para mostrar un nuevo banner una sola vez a cada usuario. */
  id: string
  /** Activa o desactiva este banner sin borrarlo. */
  active: boolean
  /** Público objetivo: 'customer' (solo clientes), 'photographer' (solo fotógrafos) o 'all' (todos los autenticados). */
  audience: 'customer' | 'photographer' | 'all'
  badge: string
  title: string
  subtitle: string
  /** Ruta de imagen real (por ejemplo en /public/img/...) o URL absoluta. */
  imageUrl: string
  imageAlt?: string
  imageCaption?: string
  tips: ClientAnnouncementTip[]
  /** Muestra un botón rápido para copiar el enlace público del perfil del usuario (ideal para Instagram). */
  showProfileLinkCopy?: boolean
  primaryCta?: {
    label: string
    to: string
  }
  secondaryCtaLabel?: string
}

/**
 * Espacio centralizado para gestionar banners y mensajes de bienvenida/campañas
 * que se muestran UNA SOLA VEZ cuando un usuario inicia sesión.
 *
 * Para lanzar un nuevo mensaje en el futuro:
 * 1. Agrega un nuevo objeto al principio o final de este arreglo con un `id` único.
 * 2. Pon `active: true` y define `audience` ('customer', 'photographer' o 'all').
 * 3. Opcionalmente pon `active: false` en campañas anteriores que ya no quieras mostrar.
 */
export const CLIENT_ANNOUNCEMENTS: ClientAnnouncement[] = [
  {
    id: 'client-showcase-moments-2026-v1',
    active: true,
    audience: 'customer',
    badge: '✨ Impulsa tu perfil deportivo',
    title: 'Destaca tus momentos y haz que todos te vean brillar',
    subtitle:
      'Tu perfil en Moments es tu vitrina deportiva profesional. Reúne tus mejores fotos en acción, compártelas en redes y deja que más personas te descubran haciendo el deporte que amas.',
    imageUrl: '/img/blog/fotos-deportivas-maraton-congelado.jpg',
    imageAlt: 'Deportista en acción capturado en fotografía profesional de Moments',
    imageCaption: 'Tu galería deportiva lista para compartir en redes',
    tips: [
      {
        icon: 'lucide:instagram',
        title: 'Pon tu enlace de Moments en tu bio de Instagram',
        description:
          'Agrega el link de tu perfil público en tu biografía o historias para redirigir a tus seguidores, amigos y clubes directo a tu galería.'
      },
      {
        icon: 'lucide:sparkles',
        title: '¿Cómo mostrar tus fotos sin marca de agua?',
        description:
          'Al adquirir tus fotos en HD y activar la vista «Sin marca de agua» en tu panel, todas las personas que visiten tu perfil las verán limpias y con calidad profesional.'
      },
      {
        icon: 'lucide:trophy',
        title: 'Construye tu galería para destacarte',
        description:
          'Organiza tus carreras, partidos y torneos en un solo lugar. Entre más compartas tus logros, más visibilidad ganarás en la comunidad.'
      }
    ],
    showProfileLinkCopy: true,
    primaryCta: {
      label: 'Configurar mi galería',
      to: '/dashboard/customer'
    },
    secondaryCtaLabel: 'Explorar eventos'
  }
]
