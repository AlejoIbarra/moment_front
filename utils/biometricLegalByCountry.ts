export type CountryLegalCode = 'CO' | 'MX' | 'AR' | 'CL' | 'PE' | 'EC' | 'BR' | 'ES' | 'INTL'

export interface CountryLegalProfile {
  code: CountryLegalCode
  name: string
  flag: string
  dataLaw: string
  consumerLaw: string
  authority: string
  authorityUrl: string
  responseSla: string
  whyPermissionBody: string
  minorsRule: string
  rightsSummary: string
}

export const BIOMETRIC_CONSENT_VERSION = 'biometria-v1-2026-11-20'

export const COUNTRY_LEGAL_PROFILES: Record<CountryLegalCode, CountryLegalProfile> = {
  CO: {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    dataLaw: 'Ley 1581 de 2012, Decreto 1377 de 2013 y Decreto 1074 de 2015',
    consumerLaw: 'Ley 1480 de 2011 (Estatuto del Consumidor)',
    authority: 'Superintendencia de Industria y Comercio (SIC)',
    authorityUrl: 'https://www.sic.gov.co',
    responseSla: 'Consultas en máximo 10 días hábiles y reclamos en máximo 15 días hábiles.',
    whyPermissionBody:
      'Tu cara es un dato sensible y la ley colombiana (Ley 1581 de 2012) le da protección especial. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de 18 años en Colombia, la autorización debe darla su padre, madre o representante legal, respetando el interés superior del menor.',
    rightsSummary: 'Conocer, actualizar, rectificar, suprimir y revocar la autorización (Hábeas Data).'
  },
  MX: {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    dataLaw: 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)',
    consumerLaw: 'Ley Federal de Protección al Consumidor (PROFECO)',
    authority: 'Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) / autoridad competente',
    authorityUrl: 'https://home.inai.org.mx',
    responseSla: 'Respuestas a solicitudes ARCO en un máximo de 20 días hábiles (y ejecución en 15 días hábiles).',
    whyPermissionBody:
      'Tu rostro es un dato personal biométrico sensible y la ley mexicana (LFPDPPP) exige tu consentimiento expreso. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de 18 años en México, el consentimiento debe otorgarlo quien ejerza la patria potestad o tutela.',
    rightsSummary: 'Derechos ARCO: Acceso, Rectificación, Cancelación y Oposición al tratamiento.'
  },
  AR: {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    dataLaw: 'Ley 25.326 de Protección de los Datos Personales y Res. AAIP 4/2019',
    consumerLaw: 'Ley 24.240 de Defensa del Consumidor',
    authority: 'Agencia de Acceso a la Información Pública (AAIP)',
    authorityUrl: 'https://www.argentina.gob.ar/aaip',
    responseSla: 'Derecho de acceso en máximo 10 días corridos y rectificación/supresión en máximo 5 días hábiles.',
    whyPermissionBody:
      'Tu rostro es un dato biométrico sensible y la ley argentina (Ley 25.326) prohíbe tratarlo sin tu consentimiento expreso. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de edad en Argentina, la autorización debe ser otorgada por sus padres, madres o representantes legales.',
    rightsSummary: 'Acceso, rectificación, actualización, confidencialidad y supresión gratuita de datos.'
  },
  CL: {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    dataLaw: 'Ley N° 19.628 sobre Protección de la Vida Privada y Ley N° 21.719',
    consumerLaw: 'Ley N° 19.496 sobre Protección de los Derechos de los Consumidores (SERNAC)',
    authority: 'Agencia de Protección de Datos Personales / tribunales competentes',
    authorityUrl: 'https://www.bcn.cl',
    responseSla: 'Respuestas a solicitudes de acceso, rectificación o cancelación dentro de los plazos legales vigentes (2 a 15 días hábiles).',
    whyPermissionBody:
      'Tu rostro es un dato biométrico sensible y la ley chilena exige tu consentimiento expreso e informado. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de edad en Chile, el consentimiento debe ser otorgado por quien ejerza su representación legal o patria potestad.',
    rightsSummary: 'Acceso, rectificación, cancelación, oposición y portabilidad de datos.'
  },
  PE: {
    code: 'PE',
    name: 'Perú',
    flag: '🇵🇪',
    dataLaw: 'Ley N° 29733 de Protección de Datos Personales y su Reglamento (D.S. N° 003-2013-JUS)',
    consumerLaw: 'Código de Protección y Defensa del Consumidor (Ley N° 29571 — INDECOPI)',
    authority: 'Autoridad Nacional de Protección de Datos Personales (ANPD - MINJUSDH)',
    authorityUrl: 'https://www.gob.pe/anpd',
    responseSla: 'Derecho de información en 8 días hábiles, acceso en 20 días hábiles y rectificación/cancelación en 10 días hábiles.',
    whyPermissionBody:
      'Tu rostro es un dato biométrico sensible y la ley peruana (Ley 29733) exige tu consentimiento expreso y por escrito/digital. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de 18 años en Perú, se requiere autorización de los titulares de la patria potestad o tutela (con consentimiento adicional entre 14 y 18 años cuando aplique).',
    rightsSummary: 'Derechos ARCO: Acceso, Rectificación, Cancelación y Oposición.'
  },
  EC: {
    code: 'EC',
    name: 'Ecuador',
    flag: '🇪🇨',
    dataLaw: 'Ley Orgánica de Protección de Datos Personales (LOPDP)',
    consumerLaw: 'Ley Orgánica de Defensa del Consumidor',
    authority: 'Superintendencia de Protección de Datos Personales (SPDP)',
    authorityUrl: 'https://www.registrospublicos.gob.ec',
    responseSla: 'Atención a solicitudes de acceso, rectificación, eliminación y oposición en máximo 15 días.',
    whyPermissionBody:
      'Tu rostro es un dato biométrico de categoría especial y la ley ecuatoriana (LOPDP) exige tu consentimiento explícito. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de edad en Ecuador, la autorización debe darla su representante legal (y a partir de 15 años conforme a la LOPDP).',
    rightsSummary: 'Acceso, rectificación, actualización, eliminación, oposición y portabilidad.'
  },
  BR: {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    dataLaw: 'Lei Geral de Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018)',
    consumerLaw: 'Código de Defesa do Consumidor (Lei nº 8.078/1990)',
    authority: 'Autoridade Nacional de Proteção de Dados (ANPD)',
    authorityUrl: 'https://www.gov.br/anpd',
    responseSla: 'Confirmação e acesso imediato ou completo em até 15 dias corridos (art. 19 da LGPD).',
    whyPermissionBody:
      'Tu rostro es un dato biométrico sensible y la ley brasileña (LGPD, art. 11) exige tu consentimiento específico y destacado. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores en Brasil (art. 14 de la LGPD), el tratamiento requiere el consentimiento específico y en destaque de al menos uno de los padres o del responsable legal.',
    rightsSummary: 'Confirmação, acesso, correção, anonimização, eliminação e revogação do consentimento.'
  },
  ES: {
    code: 'ES',
    name: 'España / UE',
    flag: '🇪🇸',
    dataLaw: 'Reglamento General de Protección de Datos (RGPD / GDPR, art. 9) y LOPDGDD (LO 3/2018)',
    consumerLaw: 'Texto Refundido de la Ley General para la Defensa de los Consumidores y Usuarios',
    authority: 'Agencia Española de Protección de Datos (AEPD) / autoridad de control europea',
    authorityUrl: 'https://www.aepd.es',
    responseSla: 'Respuesta a derechos RGPD en máximo 1 mes desde la recepción de la solicitud.',
    whyPermissionBody:
      'Tu rostro es un dato biométrico de categoría especial y la normativa europea y española (RGPD art. 9) exige tu consentimiento explícito. Por eso te lo pedimos aparte y no escondido dentro de otro texto.',
    minorsRule:
      'Para menores de 14 años en España (o la edad mínima aplicable en tu país de la UE), es imprescindible la autorización de quien ostente la patria potestad o tutela.',
    rightsSummary: 'Acceso, rectificación, supresión (olvido), limitación, portabilidad, oposición y retirada del consentimiento.'
  },
  INTL: {
    code: 'INTL',
    name: 'Internacional / EE. UU.',
    flag: '🌐',
    dataLaw: 'Estándares internacionales de privacidad biométrica (CCPA/CPRA y leyes aplicables de privacidad)',
    consumerLaw: 'Normativa aplicable de protección al consumidor del país de residencia',
    authority: 'Autoridad competente de protección de datos o consumo de tu jurisdicción',
    authorityUrl: 'https://www.moments-gallery.com/legal',
    responseSla: 'Respuestas dentro de un plazo máximo de 15 a 30 días calendario.',
    whyPermissionBody:
      'Tu rostro es información biométrica sensible protegida por leyes internacionales de privacidad. Por eso te pedimos autorización aparte y transparente, sin esconderla en otros textos.',
    minorsRule:
      'Si la persona en las fotos es menor de edad según la ley de su país, la autorización debe darla su padre, madre o tutor legal.',
    rightsSummary: 'Acceso, eliminación, corrección y revocación del consentimiento en cualquier momento.'
  }
}

export const COUNTRY_LEGAL_LIST: CountryLegalProfile[] = Object.values(COUNTRY_LEGAL_PROFILES)

export function detectUserCountryCode(eventLocation?: string | null): CountryLegalCode {
  try {
    if (typeof Intl !== 'undefined') {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      if (tz.includes('Bogota')) return 'CO'
      if (tz.includes('Mexico') || tz.includes('Monterrey') || tz.includes('Tijuana') || tz.includes('Cancun') || tz.includes('Merida')) return 'MX'
      if (tz.includes('Argentina') || tz.includes('Buenos_Aires') || tz.includes('Cordoba') || tz.includes('Mendoza')) return 'AR'
      if (tz.includes('Santiago')) return 'CL'
      if (tz.includes('Lima')) return 'PE'
      if (tz.includes('Guayaquil')) return 'EC'
      if (tz.includes('Sao_Paulo') || tz.includes('Fortaleza') || tz.includes('Recife') || tz.includes('Manaus') || tz.includes('Belem')) return 'BR'
      if (tz.startsWith('Europe/')) return 'ES'
    }
  } catch {}

  const loc = (eventLocation || '').toLowerCase()
  if (/colombia|bogot|medell|cali|pasto|barranquilla|cartagena|bucaramanga|pereira/.test(loc)) return 'CO'
  if (/m[eé]xico|cdmx|guadalajara|monterrey|puebla|canc[uú]n/.test(loc)) return 'MX'
  if (/argentina|buenos aires|c[oó]rdoba|rosario|mendoza/.test(loc)) return 'AR'
  if (/chile|santiago|valpara[ií]so|concepci[oó]n/.test(loc)) return 'CL'
  if (/per[uú]|lima|arequipa|cusco/.test(loc)) return 'PE'
  if (/ecuador|quito|guayaquil|cuenca/.test(loc)) return 'EC'
  if (/brasil|brazil|s[aã]o paulo|rio de janeiro/.test(loc)) return 'BR'
  if (/espa[nñ]a|madrid|barcelona|valencia|sevilla/.test(loc)) return 'ES'

  return 'CO'
}

export function getBiometricConsentSections(countryCode: CountryLegalCode) {
  const profile = COUNTRY_LEGAL_PROFILES[countryCode] || COUNTRY_LEGAL_PROFILES.CO
  return [
    {
      title: 'Por qué te pedimos permiso',
      body: profile.whyPermissionBody
    },
    {
      title: 'Qué hacemos exactamente',
      body: 'Comparamos tu selfie con las fotos del evento para encontrar en cuáles apareces. Nada más.'
    },
    {
      title: 'Qué pasa con tu selfie',
      body: 'Se borra apenas termina la búsqueda. No queda guardada en nuestros servidores.'
    },
    {
      title: 'Y con las fotos del evento',
      body: 'Los datos que usamos para buscar caras en ellas se borran al año de la fecha del evento.'
    },
    {
      title: 'Lo que nunca hacemos',
      body: 'Nunca usamos tu cara para entrenar sistemas de inteligencia artificial, ni nosotros ni nuestros proveedores. Nunca comparamos tu cara con las fotos de otro evento.'
    },
    {
      title: 'Qué guardamos de esta autorización',
      body: 'Para poder demostrar que nos diste permiso, guardamos la fecha, la hora, el país seleccionado, la versión de este texto y los datos técnicos de tu conexión, incluida tu dirección IP. La ley nos obliga a poder probarlo.'
    },
    {
      title: 'Si no quieres',
      body: 'Estás en tu derecho. Sin esa autorización no podemos buscar tus fotos por selfie, pero puedes buscar por número de dorsal o revisar la galería.'
    }
  ]
}
