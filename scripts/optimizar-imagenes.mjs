// Genera todas las imágenes de public/img/ desde los originales de
// src/assets/img/, con nombres descriptivos para SEO y sin escalar hacia
// arriba. Ejecutar tras cambiar cualquier original:  node scripts/optimizar-imagenes.mjs
import sharp from 'sharp';
import { mkdirSync, readdirSync } from 'fs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const A = `${ROOT}/src/assets/img`;
const OUT = `${ROOT}/public/img`;

mkdirSync(`${OUT}/equipo`, { recursive: true });
mkdirSync(`${OUT}/servicios/iconos`, { recursive: true });
mkdirSync(`${OUT}/marca`, { recursive: true });

// nombre SEO por doctor: nombre-apellido-especialidad
const TEAM = {
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

const gen = async (src, dest, width, quality = 88) => {
  const m = await sharp(src).metadata();
  const w = Math.min(width, m.width); // nunca escalar hacia arriba
  await sharp(src).resize(w).webp({ quality }).toFile(dest);
  return w;
};

// 1. Equipo: retrato (800), tarjeta (480), avatar (160)
const teamFiles = readdirSync(`${A}/team`);
for (const [key, seoName] of Object.entries(TEAM)) {
  const file = teamFiles.find((f) => f.startsWith(key + '.'));
  if (!file) { console.log('FALTA', key); continue; }
  const src = `${A}/team/${file}`;
  await gen(src, `${OUT}/equipo/${seoName}.webp`, 800);
  await gen(src, `${OUT}/equipo/${seoName}-md.webp`, 480);
  await gen(src, `${OUT}/equipo/${seoName}-sm.webp`, 160);
  console.log('equipo:', seoName);
}

// 2. Iconos 3D por especialidad
for (const f of readdirSync(`${A}/services/iconos-3d`)) {
  const slug = f.replace(/\.\w+$/, '');
  await gen(`${A}/services/iconos-3d/${f}`, `${OUT}/servicios/iconos/${slug}-icono-3d.webp`, 300);
  console.log('icono:', slug);
}

// 3. Fotos de tratamiento por especialidad (originales en services/*-foto.jpg)
mkdirSync(`${OUT}/servicios`, { recursive: true });
for (const f of readdirSync(`${A}/services`).filter((f) => f.endsWith('-foto.jpg'))) {
  const slug = f.replace('-foto.jpg', '');
  const got = await gen(`${A}/services/${f}`, `${OUT}/servicios/${slug}-clinica-dental-santiago.webp`, 1600);
  console.log('foto:', slug, got + 'w');
}

// 4. Home / marca
const singles = [
  [`${A}/home/clinica-1.png`, `${OUT}/especialistas-js-dental-group-santiago.webp`, 900],
  [`${A}/home/diente-3d.png`, `${OUT}/cuidado-dental-profesional-3d.webp`, 1000],
  [`${A}/home/agenda-3d.webp`, `${OUT}/agenda-tu-cita-dental-3d.webp`, 560],
  [`${A}/home/banner-2.jpg`, `${OUT}/clinica-dental-js-dental-group-santiago.webp`, 1200],
  [`${A}/brand/logo.png`, `${OUT}/marca/js-dental-group-logo.webp`, 300],
  [`${A}/brand/logo-blanco-trim.png`, `${OUT}/marca/js-dental-group-logo-blanco.webp`, 300],
];
for (const [src, dest, w] of singles) {
  const got = await gen(src, dest, w);
  console.log('single:', dest.split('/img/')[1], got + 'w');
}

// 5. OG image: png (mejor soporte en redes), 1200x630
await sharp(`${A}/brand/logo-og.png`)
  .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile(`${OUT}/marca/js-dental-group-og.png`);
console.log('og OK');
