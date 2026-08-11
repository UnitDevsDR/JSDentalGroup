import type { Lang, ServiceKey } from '../i18n';
import { SERVICE_KEYS } from '../i18n';

/** Datos de la clínica que no dependen del idioma. */
export const SITE = {
  url: 'https://jsdentalgroup.com',
  name: 'JS Dental Group',
  legalName: 'J Saint Hilaire Dental Expert Group',
  founded: 2020,
  phone: '+18099663113',
  phoneDisplay: '+1 (809) 966-3113',
  emergencyPhone: '+18099472400',
  emergencyPhoneDisplay: '+1 (809) 947-2400',
  whatsapp: 'https://api.whatsapp.com/message/V7DLSNIT2ZATE1',
  email: 'jsainthilaireclinic@gmail.com',
  instagram: 'https://www.instagram.com/jsdentalgrouprd/',
  instagramUser: 'jsdentalgrouprd',
  address: {
    street: 'Calle México No. 42, Reparto del Este; Plaza Catrina, módulo 103',
    city: 'Santiago de los Caballeros',
    region: 'Santiago',
    country: 'DO',
    /** lugar tal como lo conoce Google Maps */
    mapQuery: 'Plaza Catrina, Calle México, Santiago de los Caballeros, República Dominicana',
  },
  geo: { latitude: '19.4442', longitude: '-70.6668' },
};

/** Horario, con el formato de hora según el idioma. */
export const hours = (lang: Lang) =>
  lang === 'en'
    ? { weekdays: 'Monday to Friday · 8:00 a.m. – 6:00 p.m.', saturday: 'Saturdays · 8:00 a.m. – 12:00 p.m.' }
    : { weekdays: 'Lunes a Viernes · 8:00 a.m. – 6:00 p.m.', saturday: 'Sábados · 8:00 a.m. – 12:00 p.m.' };

export interface TeamMember {
  /** clave estable: nombre del archivo de su foto y de su rol en el diccionario */
  key: string;
  /** nombre sin tratamiento profesional (el prefijo viene del idioma) */
  name: string;
  title: 'dra' | 'dr' | null;
}

export const TEAM: TeamMember[] = [
  { key: 'julissa-saint-hilaire', name: 'Julissa Saint-Hilaire Espinal', title: 'dra' },
  { key: 'rosangel-tatis', name: 'Rosangel A. Tatis Soto', title: 'dra' },
  { key: 'melissa-lantigua', name: 'Melissa Lantigua Domínguez', title: 'dra' },
  { key: 'mairenys-estevez', name: 'Mairenys J. Estévez García', title: 'dra' },
  { key: 'denisse-dominguez', name: 'Denisse Domínguez Iglesia', title: 'dra' },
  { key: 'siddy-dominguez', name: 'Siddy Domínguez', title: 'dra' },
  { key: 'laura-bueno', name: 'Laura P. Bueno', title: 'dra' },
  { key: 'simon-dominguez', name: 'Simón Domínguez', title: 'dr' },
  { key: 'rosanny-minaya', name: 'Rosanny Minaya', title: 'dra' },
  { key: 'arianny-pena', name: 'Arianny Peña', title: null },
];

/** Especialista a cargo de cada especialidad (clave del equipo). */
export const SERVICE_SPECIALIST: Record<ServiceKey, string> = {
  'rehabilitacion-bucal': 'julissa-saint-hilaire',
  implantologia: 'simon-dominguez',
  endodoncia: 'rosangel-tatis',
  ortodoncia: 'siddy-dominguez',
  periodoncia: 'denisse-dominguez',
  'cirugia-maxilofacial': 'laura-bueno',
  'odontologia-general': 'mairenys-estevez',
  odontopediatria: 'rosanny-minaya',
};

/**
 * Especialidad de cada miembro del equipo, para enlazar su tarjeta a la
 * página del servicio. `null` = no tiene página propia (personal
 * administrativo). Melissa comparte Endodoncia con Rosangel, que es la
 * especialista a cargo de esa página.
 */
export const TEAM_SERVICE: Record<string, ServiceKey | null> = {
  'julissa-saint-hilaire': 'rehabilitacion-bucal',
  'rosangel-tatis': 'endodoncia',
  'melissa-lantigua': 'endodoncia',
  'mairenys-estevez': 'odontologia-general',
  'denisse-dominguez': 'periodoncia',
  'siddy-dominguez': 'ortodoncia',
  'laura-bueno': 'cirugia-maxilofacial',
  'simon-dominguez': 'implantologia',
  'rosanny-minaya': 'odontopediatria',
  'arianny-pena': null,
};

export { SERVICE_KEYS };
export type { ServiceKey };
