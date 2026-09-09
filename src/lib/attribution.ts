/**
 * De dónde vino el visitante.
 *
 * El sitio es estático: cuando alguien llega por un anuncio, los parámetros
 * de campaña vienen en la URL de esa primera página y se pierden en cuanto
 * navega a otra. Por eso se capturan al cargar cualquier página y se guardan
 * en la sesión del navegador, para poder adjuntarlos al lead cuando —dos o
 * tres clics después— llene el formulario.
 *
 * sessionStorage y no localStorage a propósito: la atribución interesa
 * dentro de la visita, no meses después. Se borra al cerrar la pestaña y no
 * deja un identificador persistente de la persona en su equipo, que es lo
 * mínimo razonable tratándose de un formulario donde la gente cuenta su caso
 * dental.
 */

const KEY = 'jsdg_attr';

/** Tope por campo: el backend corta igual, esto evita guardar basura de una
 *  URL manipulada en el almacenamiento del visitante. */
const MAX_LEN = 200;

export interface Attribution {
  /** primera página de la sesión (o la del anuncio, si llegó por uno) */
  landingPath?: string;
  /** de dónde venía: dominio + ruta, sin query */
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** click id de Google Ads: es lo que permite cruzar el lead con la campaña */
  gclid?: string;
  /** click id de Meta (Facebook/Instagram Ads) */
  fbclid?: string;
}

/** Parámetro en la URL -> campo del lead. */
const PARAM_FIELD: Record<string, keyof Attribution> = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_term: 'utmTerm',
  utm_content: 'utmContent',
  gclid: 'gclid',
  fbclid: 'fbclid',
};

const clean = (value: string | null | undefined): string | undefined => {
  const v = value?.trim().slice(0, MAX_LEN);
  return v ? v : undefined;
};

/** Lo que trae la URL actual. Vacío si la visita no viene de una campaña. */
function fromUrl(search: string): Attribution {
  const params = new URLSearchParams(search);
  const found: Attribution = {};
  for (const [param, field] of Object.entries(PARAM_FIELD)) {
    const value = clean(params.get(param));
    if (value) found[field] = value;
  }
  return found;
}

/** El referente, solo si es externo. Se le quita la query: puede traer datos
 *  del buscador que no hacen falta y que no queremos guardar. */
function externalReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const url = new URL(document.referrer);
    if (url.host === window.location.host) return undefined;
    return clean(url.host + (url.pathname === '/' ? '' : url.pathname));
  } catch {
    return undefined;
  }
}

/**
 * Guarda el origen de esta visita. Se llama en todas las páginas.
 *
 * Gana el primer toque de la sesión, salvo que más adelante llegue un clic
 * con parámetros de campaña: ahí se sobrescribe. Es el modelo que espera
 * quien paga la pauta — si la persona entró por búsqueda orgánica, se fue y
 * volvió por el anuncio, el lead es del anuncio.
 */
export function captureAttribution(): void {
  try {
    const campaign = fromUrl(window.location.search);
    const hasCampaign = Object.keys(campaign).length > 0;
    if (!hasCampaign && window.sessionStorage.getItem(KEY)) return;

    const record: Attribution = {
      landingPath: clean(window.location.pathname),
      referrer: externalReferrer(),
      ...campaign,
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // sessionStorage puede estar bloqueado (modo privado, ajustes del
    // navegador). Sin atribución, pero el formulario sigue funcionando.
  }
}

/** Lo capturado en esta sesión, para adjuntarlo al enviar el formulario. */
export function getAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Attribution) : {};
  } catch {
    return {};
  }
}
