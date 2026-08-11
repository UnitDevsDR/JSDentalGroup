/**
 * Rutas de imágenes con nombres descriptivos para SEO.
 *
 * Todas viven pre-optimizadas en `public/img/` (webp, generadas con sharp sin
 * escalado hacia arriba), así la URL final es legible —
 * `/img/equipo/dr-simon-dominguez-implantologia-oral.webp` — en vez del hash
 * que genera astro:assets. Google usa el nombre del archivo como señal.
 *
 * Para regenerarlas: scripts/optimizar-imagenes.mjs
 */

/** clave en TEAM (data/site.ts) → nombre SEO del archivo */
const TEAM_SLUGS: Record<string, string> = {
  'julissa-saint-hilaire': 'dra-julissa-saint-hilaire-rehabilitacion-bucal',
  'rosangel-tatis': 'dra-rosangel-tatis-endodoncia',
  'melissa-lantigua': 'dra-melissa-lantigua-endodoncia',
  'mairenys-estevez': 'dra-mairenys-estevez-odontologia-general',
  'denisse-dominguez': 'dra-denisse-dominguez-periodoncia',
  'siddy-dominguez': 'dra-siddy-dominguez-ortodoncia',
  'laura-bueno': 'dra-laura-bueno-cirugia-maxilofacial',
  'simon-dominguez': 'dr-simon-dominguez-implantologia-oral',
  'rosanny-minaya': 'dra-rosanny-minaya-odontopediatria',
  'arianny-pena': 'arianny-pena-asistente-administrativa',
};

/** Retrato de un miembro del equipo. `size`: lg 800px, md 480px, sm 160px */
export const teamPhoto = (key: string, size: 'lg' | 'md' | 'sm' = 'md') => {
  const name = TEAM_SLUGS[key] ?? key;
  const suffix = size === 'lg' ? '' : `-${size}`;
  return `/img/equipo/${name}${suffix}.webp`;
};

/** Icono 3D de una especialidad (300px) */
export const serviceIcon = (slug: string) => `/img/servicios/iconos/${slug}-icono-3d.webp`;

/** Foto del tratamiento de una especialidad (hasta 1600px) */
export const servicePhoto = (slug: string) =>
  `/img/servicios/${slug}-clinica-dental-santiago.webp`;

export const IMAGES = {
  heroEspecialistas: '/img/especialistas-js-dental-group-santiago.webp',
  dienteCuidado3d: '/img/cuidado-dental-profesional-3d.webp',
  agendaCita3d: '/img/agenda-tu-cita-dental-3d.webp',
  clinica: '/img/clinica-dental-js-dental-group-santiago.webp',
  logo: '/img/marca/js-dental-group-logo.webp',
  logoBlanco: '/img/marca/js-dental-group-logo-blanco.webp',
  og: '/img/marca/js-dental-group-og.png',
};
