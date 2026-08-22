# JS Dental Group — jsdentalgroup.com

Migración del sitio Odoo (Theme Prime) a **Astro 6** estático. Contenido real
migrado 1:1 con los **mismos slugs** del sitio original para no perder SEO.

Son **dos servicios independientes**:

| Qué | Dónde | Runtime |
| --- | --- | --- |
| Sitio público (estático, bilingüe) | raíz del repo | Nginx sirviendo `dist/` |
| API de leads + panel admin | `backend/` | Node + Express + PostgreSQL |

El sitio funciona sin el backend: si `PUBLIC_API_URL` no está definido, el
formulario de contacto sigue abriendo WhatsApp y redirigiendo a la página de
gracias, solo deja de guardar el lead en base de datos.

```
/                     sitio estático (Astro)
  src/i18n/           todo el contenido (es.ts / en.ts)
  src/data/site.ts    datos de la clínica, equipo, especialidades
  scripts/            optimización de imágenes + generación de CSP
backend/
  src/                API Express (rutas, auth, mailer, prisma)
  prisma/             esquema y migraciones
  admin-src/          SPA del panel (React + Vite), compila a backend/public/admin
```

## Stack

### Sitio

- **Astro 6** (salida estática) + **React 19** (islas, solo donde hay interacción)
- **Tailwind CSS 4** (vía PostCSS — el plugin de Vite es incompatible con el rolldown-vite de Astro 6.4)
- **shadcn/ui + bloques de shadcnblocks** (registro privado, ver abajo)
- **GSAP + ScrollTrigger** para animaciones (`data-animate`, `data-stagger`, `data-parallax`, `data-count`, arco de sonrisa con scrub)
- Fuentes self-hosted: Bricolage Grotesque (display) + Instrument Sans (cuerpo)

### Backend

- **Express 5** + **Prisma 6** + **PostgreSQL**
- **zod** valida las variables de entorno al arrancar (si falta algo crítico, el proceso muere de una con mensaje claro) y también el body de cada request
- Sesión del panel: **argon2** para el hash de contraseña + JWT firmado con **jose** en cookie `httpOnly`
- **helmet**, CORS con allowlist explícita (`ALLOWED_ORIGINS`) y **express-rate-limit** (global, y más estricto en login y en creación de leads)
- **nodemailer** opcional: sin SMTP configurado el lead igual se guarda, solo no se manda el correo de aviso
- Panel admin: **React 19 + Vite + shadcn/ui**, servido por el mismo proceso Express bajo `/admin` (sin otro servicio que mantener)

## Desarrollo

### Sitio

```bash
npm install
cp .env.example .env.local   # poner SHADCNBLOCKS_API_KEY
npm run dev
npm run build                # genera dist/
```

Variables de build (todas opcionales, prefijo `PUBLIC_` porque las lee el cliente):

| Variable | Para qué |
| --- | --- |
| `PUBLIC_API_URL` | origen del backend de leads. Vacío = formulario solo por WhatsApp |
| `PUBLIC_GTM_ID` | contenedor de Google Tag Manager (por defecto, el de la clínica) |
| `PUBLIC_GSC_VERIFICATION` | token de verificación de Search Console |

### Backend

```bash
cd backend
npm install
npx prisma migrate dev                              # crea el esquema local
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:dev  # primer usuario del panel
npm run dev                                          # tsx watch, :3001

npm --prefix admin-src install
npm --prefix admin-src run build   # el panel sale a backend/public/admin
```

Variables de entorno del backend (`backend/src/env.ts` es la fuente de verdad):

| Variable | Requerida | Para qué |
| --- | --- | --- |
| `DATABASE_URL` | sí | PostgreSQL |
| `SESSION_SECRET` | sí | firma de la cookie de sesión, mínimo 32 caracteres |
| `ALLOWED_ORIGINS` | sí | orígenes CORS permitidos, separados por coma |
| `PORT` | no | por defecto `3001` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` / `NOTIFY_EMAIL` | no | aviso por correo de cada lead nuevo |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | no | si están definidas al arrancar el contenedor, crea (o actualiza la contraseña de) ese admin; se pueden borrar después del primer acceso |

## Registro shadcnblocks

`components.json` declara el registro `@shadcnblocks` autenticado con
`${SHADCNBLOCKS_API_KEY}` (vive solo en `.env.local`, gitignorado).
Para traer un bloque nuevo:

```bash
npx shadcn@latest add @shadcnblocks/<nombre>
```

Este repo es **privado**; el código de los bloques puede vivir aquí.
**No** copiar bloques a repos públicos (la licencia lo prohíbe).

## Recorrido de un lead

1. El visitante envía el formulario de `/contactus`.
2. Si hay `PUBLIC_API_URL`, el cliente hace `POST /api/leads` con
   `keepalive: true` — imprescindible, porque justo después se navega a la
   página de gracias y sin esa opción el navegador cancela el fetch.
3. Se abre WhatsApp con el mensaje ya compuesto y se redirige a
   `/your-ticket-has-been-submitted` (misma URL que el sitio anterior, para
   que las conversiones de Google Ads sigan midiendo; está fuera del sitemap).
4. El backend guarda el `Lead` y dispara el correo de aviso sin bloquear la
   respuesta. El formulario trae un honeypot (`company`): si viene relleno se
   responde `201` igual, pero no se guarda ni se notifica.

## API

Todo cuelga de `/api` y pasa por un rate limit global de 60 req/min.

| Método | Ruta | Acceso | Qué hace |
| --- | --- | --- | --- |
| `GET` | `/api/health` | público | healthcheck del contenedor |
| `POST` | `/api/leads` | público (rate limit propio) | crea un lead desde el formulario |
| `GET` | `/api/leads` | sesión | lista paginada, la más reciente primero |
| `GET` | `/api/leads/export` | sesión | exporta los leads a CSV |
| `PATCH` | `/api/leads/:id` | sesión | cambia el estado (`NEW` / `CONTACTED` / `ARCHIVED`) |
| `POST` | `/api/auth/login` | público (rate limit propio) | inicia sesión, deja la cookie |
| `POST` | `/api/auth/logout` | — | borra la cookie |
| `GET` | `/api/auth/me` | sesión | usuario actual |
| `GET` | `/api/settings/public` | público | `gtmId` y `gscVerification`, cacheado 5 min |
| `GET` | `/api/settings` | sesión | valores actuales para el panel |
| `PUT` | `/api/settings/:key` | sesión | cambia un ajuste (solo las keys de la whitelist) |

### Modelos (`backend/prisma/schema.prisma`)

- **`Lead`** — mismos campos que capturaba el Odoo (nombre, teléfono, correo,
  asunto, mensaje) más `source`, `locale`, `userAgent` y `status`.
- **`AdminUser`** — no hay endpoint público de registro: el acceso al panel se
  otorga solo desde el servidor, con el seed.
- **`SiteSetting`** — pares key/value con whitelist (`gtmId`, `gscVerification`).

> **Ojo:** hoy el sitio estático **no** consume `/api/settings/public` — lee el
> GTM ID y el token de Search Console de las variables de build
> (`src/layouts/Layout.astro`). El endpoint y la pantalla de ajustes ya están,
> pero falta cablear el fetch en el cliente para que cambiarlos no exija
> rehacer el build.

## Panel admin

En `/admin` del backend. SPA de React con ruteo del lado del cliente (cualquier
`/admin/*` que no sea un archivo real cae al mismo `index.html`) y su propia
CSP, más estricta que la del sitio público.

- **Leads** — tabla, cambio de estado y exportación a CSV
- **Ajustes** — SEO y analítica (GTM ID, verificación de Search Console) y un
  enlace al `sitemap-index.xml`, que el sitio estático regenera solo en cada
  build

El primer usuario se crea con `backend/src/scripts/seed.ts`, nunca desde el
navegador.

## SEO

- Mismos slugs que el Odoo original (`/ortodoncia`, `/about-us`, `/contactus`, …)
- Title + meta description únicos por página (corrigen los truncados del sitio viejo)
- JSON-LD: `Dentist` global + `FAQPage` (home) + `BreadcrumbList`/`MedicalProcedure` (servicios)
- OG/Twitter cards con dominio correcto (el sitio viejo apuntaba a `jsdentralgroup.com`, con errata)
- `sitemap-index.xml` (@astrojs/sitemap) + `robots.txt`
- Imágenes optimizadas a WebP responsive por `astro:assets`

## Seguridad

**Sitio:** `public/_headers` define CSP, HSTS, nosniff, frame-options, etc.
(formato Netlify/Cloudflare Pages). El despliegue real es Nginx, y esos headers
están replicados en `nginx.conf`; `scripts/generate-csp.mjs` corre después del
build y calcula los hashes sha256 reales de los `<script>`/`<style>` inline para
que la CSP no necesite `'unsafe-inline'` (y agrega el origen de
`PUBLIC_API_URL` a `connect-src`).

**Backend:** helmet, CORS con allowlist, rate limits, validación con zod,
cookie de sesión `httpOnly`, y el contenedor corre como usuario `node`, no root.

## Deploy

**Sitio** — `Dockerfile` de la raíz: build multi-stage que termina en
`nginx:alpine` sirviendo `dist/` con `nginx.generated.conf`. Las variables
`PUBLIC_*` se pasan como `--build-arg` (no por `.env`: ese archivo está en
`.dockerignore` a propósito). Dominio canónico: `https://jsdentalgroup.com`
(en `astro.config.mjs`).

**Backend** — `backend/Dockerfile`: compila el API y el panel, y al arrancar
corre `prisma migrate deploy` (seguro en cada deploy: Migrate no reaplica lo ya
aplicado), opcionalmente el seed del admin, y luego el servidor en `:3001`.
