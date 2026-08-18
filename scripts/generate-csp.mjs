// Genera la CSP definitiva para script-src (sin 'unsafe-inline') a partir
// del HTML ya construido: recorre dist/**/*.html, saca el hash sha256 de
// cada <script> inline distinto, y sustituye el placeholder de nginx.conf
// y public/_headers por la lista real de hashes.
//
// style-src NO se hashea a propósito: GSAP anima aplicando propiedades CSS
// directo por JS (element.style.x = ...) en cada frame — eso no es un
// <style> del HTML ni un atributo estático, ningún hash lo cubre, así que
// style-src se queda con 'unsafe-inline' (ver el comentario en nginx.conf).
//
// Por qué en cada build y no a mano: hay un único inline <script> cuyo
// contenido varía por página (ScrollRail usa define:vars={{ total }}, y el
// número de secciones no es igual en todas las páginas), así que la lista
// de hashes solo puede calcularse después de construir. Escribir los hashes
// a mano se rompería en silencio (CSP bloquea el script sin avisar en
// consola de forma visible) en cuanto alguien tocara un script del layout.
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = path.join(ROOT, 'dist');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function sha256b64(text) {
  return createHash('sha256').update(text, 'utf8').digest('base64');
}

const scriptHashes = new Set();

const files = await walk(DIST);
for (const file of files) {
  const html = await readFile(file, 'utf8');

  // <script> inline (sin src): se excluye application/ld+json porque no es
  // JS y script-src no lo gobierna
  for (const m of html.matchAll(/<script((?:(?!\bsrc=)[^>])*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    const body = m[2];
    if (!body.trim()) continue;
    if (/type\s*=\s*["']application\/ld\+json["']/.test(attrs)) continue;
    scriptHashes.add(sha256b64(body));
  }
}

if (scriptHashes.size === 0) {
  throw new Error(
    `generate-csp: no se encontró ningún <script> inline en ${files.length} páginas. ` +
      'Antes de dejar esto en 0 por accidente y publicar una CSP rota, revisa el build.',
  );
}

const scriptList = [...scriptHashes].map((h) => `'sha256-${h}'`).join(' ');

console.log(`generate-csp: ${scriptHashes.size} scripts inline únicos en ${files.length} páginas`);

async function patch(srcPath, destPath = srcPath) {
  let content = await readFile(srcPath, 'utf8');
  const before = content;
  content = content.replace('__CSP_SCRIPT_HASHES__', scriptList);
  if (content === before) {
    throw new Error(`generate-csp: ${srcPath} no tenía el placeholder esperado — revisa que no se haya editado a mano`);
  }
  if (content.includes('__CSP_')) {
    throw new Error(`generate-csp: quedó un placeholder sin reemplazar en ${srcPath}`);
  }
  await writeFile(destPath, content);
  console.log(`generate-csp: ${path.relative(ROOT, destPath)} generado a partir de ${path.relative(ROOT, srcPath)}`);
}

// nginx.conf es la plantilla versionada (con el placeholder); el resultado
// con los hashes reales es un artefacto de build, no se commitea
await patch(path.join(ROOT, 'nginx.conf'), path.join(ROOT, 'nginx.generated.conf'));
// dist/_headers ya existe (Astro copia public/_headers al construir):
// se reescribe en el propio artefacto de build con los hashes reales, por
// si algún día se despliega en Netlify/Cloudflare Pages en vez de Nginx
await patch(path.join(DIST, '_headers'));
