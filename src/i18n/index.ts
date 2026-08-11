import { es } from './es';
import { en } from './en';
import type { Dictionary } from './es';

export type { Dictionary };

export const LOCALES = ['es', 'en'] as const;
export type Lang = (typeof LOCALES)[number];

/** Español es el idioma por defecto: vive en la raíz, sin prefijo. */
export const DEFAULT_LOCALE: Lang = 'es';

const DICTIONARIES: Record<Lang, Dictionary> = { es, en };

export const useTranslations = (lang: Lang): Dictionary => DICTIONARIES[lang];

/** Idioma a partir de la URL (`/en/...` → en, resto → es). */
export const getLangFromUrl = (url: URL): Lang =>
  url.pathname.startsWith('/en/') || url.pathname === '/en' ? 'en' : DEFAULT_LOCALE;

/**
 * Rutas de las páginas fijas en cada idioma. Los slugs en español son los
 * mismos que tenía el sitio en Odoo (no se rompe el SEO ya ganado); los
 * ingleses usan los términos que realmente se buscan en inglés.
 */
export const ROUTES = {
  home: { es: '/', en: '/en/' },
  services: { es: '/our-services', en: '/en/services' },
  about: { es: '/about-us', en: '/en/about-us' },
  contact: { es: '/contactus', en: '/en/contact' },
  terms: { es: '/terms', en: '/en/terms' },
} as const;

export type PageKey = keyof typeof ROUTES;

/** URLs equivalentes de una página fija en cada idioma (hreflang + selector). */
export const pagePaths = (key: PageKey): Record<Lang, string> => ({
  es: ROUTES[key].es,
  en: ROUTES[key].en,
});

/** Slug de cada especialidad por idioma. La clave es el slug español. */
export const SERVICE_SLUGS = {
  'rehabilitacion-bucal': { es: 'rehabilitacion-bucal', en: 'oral-rehabilitation' },
  implantologia: { es: 'implantologia', en: 'dental-implants' },
  endodoncia: { es: 'endodoncia', en: 'root-canal-treatment' },
  ortodoncia: { es: 'ortodoncia', en: 'orthodontics' },
  periodoncia: { es: 'periodoncia', en: 'periodontics' },
  'cirugia-maxilofacial': { es: 'cirugia-maxilofacial', en: 'maxillofacial-surgery' },
  'odontologia-general': { es: 'odontologia-general', en: 'general-dentistry' },
  odontopediatria: { es: 'odontopediatria', en: 'pediatric-dentistry' },
} as const;

export type ServiceKey = keyof typeof SERVICE_SLUGS;
export const SERVICE_KEYS = Object.keys(SERVICE_SLUGS) as ServiceKey[];

/** Ruta de una especialidad en un idioma. */
export const servicePath = (key: ServiceKey, lang: Lang): string =>
  lang === 'en' ? `/en/${SERVICE_SLUGS[key].en}` : `/${SERVICE_SLUGS[key].es}`;

/** URLs equivalentes de una especialidad en cada idioma. */
export const servicePaths = (key: ServiceKey): Record<Lang, string> => ({
  es: servicePath(key, 'es'),
  en: servicePath(key, 'en'),
});

/** Prefijo de idioma para enlaces internos sueltos (`localePath('#contacto')`). */
export const withLang = (lang: Lang, path: string): string =>
  lang === 'en' ? `/en${path === '/' ? '/' : path}` : path;
