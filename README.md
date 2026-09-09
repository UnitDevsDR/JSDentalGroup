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

1. Al cargar cualquier página, `src/lib/attribution.ts` guarda en
   `sessionStorage` de dónde vino la visita: página de entrada, referente
   externo y parámetros de campaña (`utm_*`, `gclid`, `fbclid`).
2. El visitante envía el formulario (está en el inicio, servicios, cada
   especialidad, «nosotros» y contacto).
3. Si hay `PUBLIC_API_URL`, el cliente hace `POST /api/leads` con
   `keepalive: true` — imprescindible, porque justo después se navega a la
   página de gracias y sin esa opción el navegador cancela el fetch. Al
   payload se le suman la ruta de la página (`source`), el idioma y lo que
   se capturó en el paso 1.
4. Se abre WhatsApp con el mensaje ya compuesto y se redirige a
   `/your-ticket-has-been-submitted` (misma URL que el sitio anterior, para
   que las conversiones de Google Ads sigan midiendo; está fuera del sitemap).
5. El backend busca a quién pertenece el mensaje (o crea la ficha si es la
   primera vez), guarda el `Lead` colgando de ese `Contact` —las dos cosas en
   una transacción— y dispara el correo de aviso sin bloquear la respuesta. El
   formulario trae un honeypot (`company`): si viene relleno se responde `201`
   igual, pero no se guarda ni se notifica.

### Cuándo dos mensajes son de la misma persona

Se unen **por correo** en minúsculas, que es el único campo obligatorio del
formulario. **Por teléfono no**, aunque se guarde normalizado (solo dígitos,
sin el 1 de país) y con índice: en una casa se comparte el número, y juntar a
la mamá con el hijo dejaría el dolor de muela de uno colgando de la ficha del
otro. Separar a una persona en dos fichas es molesto; mezclar a dos personas
en una con historial clínico no se desenreda después. El índice sobre el
teléfono está para que el panel pueda señalar los contactos que lo comparten
y alguien decida a mano.

Tampoco hay índice único sobre el correo: detectar duplicados es una
heurística, y un constraint la volvería una regla dura que tarde o temprano
rechazaría un lead legítimo. Perder un lead es lo peor que puede pasar aquí.

### Origen del lead

Gana el primer toque de la sesión, salvo que después llegue un clic con
parámetros de campaña: ahí manda el anuncio. Es lo que espera quien paga la
pauta — si alguien entró por búsqueda orgánica, se fue y volvió por el
anuncio, el lead es del anuncio.

Se usa `sessionStorage` y no `localStorage` a propósito: la atribución
interesa dentro de la visita y así no queda un identificador persistente en
el equipo del visitante. Si el navegador lo tiene bloqueado, el lead se
guarda igual, solo sin origen.

El panel lo muestra en el detalle del lead y el CSV lo exporta en columnas
al final (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
`utm_content`, `gclid`, `fbclid`, más página de entrada y referente).

## API

Todo cuelga de `/api` y pasa por un rate limit global de 60 req/min.

| Método | Ruta | Acceso | Qué hace |
| --- | --- | --- | --- |
| `GET` | `/api/health` | público | healthcheck del contenedor |
| `POST` | `/api/leads` | público (rate limit propio) | crea un lead desde el formulario |
| `GET` | `/api/leads` | sesión | lista paginada, la más reciente primero |
| `GET` | `/api/leads/export` | **admin** | exporta los leads a CSV (queda registrado) |
| `GET` | `/api/leads/exports` | **admin** | quién exportó, cuándo, con qué filtro y cuántas filas |
| `PATCH` | `/api/leads/:id` | sesión | cambia el estado (`NEW` / `CONTACTED` / `ARCHIVED`) |
| `GET` | `/api/contacts` | sesión | lista de personas; filtra por `stage`, `ownerId`, `vencidos=1` y busca con `q` |
| `GET` | `/api/contacts/:id` | sesión | la ficha: datos, mensajes, anotaciones y posibles duplicados |
| `PATCH` | `/api/contacts/:id` | sesión | etapa, responsable, próximo seguimiento, motivo de pérdida, datos de contacto |
| `POST` | `/api/contacts/:id/interactions` | sesión | anota qué se habló |
| `DELETE` | `/api/contacts/:id/interactions/:id` | sesión (autor, 15 min) | borra una anotación recién escrita |
| `POST` | `/api/auth/login` | público (rate limit propio) | inicia sesión, deja la cookie |
| `POST` | `/api/auth/logout` | — | borra la cookie |
| `GET` | `/api/auth/me` | sesión | usuario actual |
| `GET` | `/api/auth/users` | sesión | colegas del panel, para el desplegable de responsable |
| `GET` | `/api/settings/public` | público | `gtmId` y `gscVerification`, cacheado 5 min |
| `GET` | `/api/settings` | sesión | valores actuales para el panel |
| `PUT` | `/api/settings/:key` | **admin** | cambia un ajuste (solo las keys de la whitelist) |

### Modelos (`backend/prisma/schema.prisma`)

- **`Contact`** — la persona. Agrupa todos sus mensajes y todo lo que se ha
  hablado con ella: etapa (`NEW` → `CONTACTED` → `APPOINTMENT_SET` →
  `ATTENDED` → `TREATMENT_ACCEPTED` → `LOST`, más `ARCHIVED`), motivo de
  pérdida, responsable y fecha del próximo seguimiento.
- **`Interaction`** — qué se habló y cuándo (llamada, WhatsApp, correo, en
  persona o nota), con autor y fecha real del hecho. WhatsApp se registra a
  mano: el sitio abre un enlace `wa.me` y esa conversación no llega aquí.
- **`Lead`** — un mensaje, colgando de su `Contact`. Mismos campos que
  capturaba el Odoo (nombre, teléfono, correo, asunto, mensaje) más `source`
  (ruta de la página del formulario), `locale`, `userAgent`, `status` y el
  origen de la visita (`landingPath`, `referrer`, `utmSource`, `utmMedium`,
  `utmCampaign`, `utmTerm`, `utmContent`, `gclid`, `fbclid`).
- **`AdminUser`** — no hay endpoint público de registro: el acceso al panel se
  otorga solo desde el servidor, con el seed. Tiene rol `ADMIN` o `STAFF`.
- **`ExportLog`** — quién descargó el CSV, cuándo, con qué filtro y cuántas
  filas. El correo se copia dentro para que el rastro sobreviva al borrado
  del usuario.
- **`SiteSetting`** — pares key/value con whitelist (`gtmId`, `gscVerification`).

> **Ojo:** hoy el sitio estático **no** consume `/api/settings/public` — lee el
> GTM ID y el token de Search Console de las variables de build
> (`src/layouts/Layout.astro`). El endpoint y la pantalla de ajustes ya están,
> pero falta cablear el fetch en el cliente para que cambiarlos no exija
> rehacer el build.

## Trabajar una ficha

`GET /api/contacts` ordena por último movimiento —quien acaba de escribir va
arriba—, que es como se trabaja una bandeja. `?vencidos=1` cambia el orden a
los que tienen el seguimiento pasado de fecha, del más viejo primero: esa es
la cola con la que se empieza el día. `?ownerId=mios` filtra por quien esté
dentro, sin que el panel tenga que saber su id.

La búsqueda con `?q=` mira nombre, correo y teléfono; el teléfono se compara
normalizado, así que da igual cómo lo escriba quien busca.

Dos detalles de comportamiento que no se ven en la firma de los endpoints:

- **El motivo de pérdida se limpia solo** al sacar una ficha de `LOST`. Un
  «le pareció caro» viejo colgando de alguien que sí volvió es peor que no
  tener nada.
- **Una anotación con fecha vieja no sube la ficha en la lista.** Anotar el
  martes una llamada del jueves pasado es normal, y no debería hacerla
  saltar al tope como si acabara de pasar.

Las anotaciones las borra solo quien las escribió y solo dentro de los 15
minutos siguientes: es para el que se equivocó de ficha, no para reescribir
el historial.

## Roles

Dos roles, y el corte va por la exportación masiva, no por ver: atender un
lead es el trabajo de todos los días, bajarse la base entera en un archivo es
la forma real de que estos datos salgan por la puerta.

| | `STAFF` | `ADMIN` |
| --- | --- | --- |
| Ver y atender leads | sí | sí |
| Exportar a CSV | no | sí, y queda registrado |
| Ajustes del sitio | no | sí |

Se otorgan con el seed, que es también la única forma de cambiarle el rol a
alguien mientras no exista una pantalla de usuarios — se le vuelve a correr
con el mismo correo:

```bash
# administradora
ADMIN_EMAIL=... ADMIN_PASSWORD=... node dist/scripts/seed.js
# recepción
ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_ROLE=STAFF node dist/scripts/seed.js
```

El rol se comprueba contra la base en cada request, no dentro del JWT: la
sesión dura 8 horas, así que si viajara en el token, a quien se le quita el
acceso hoy le seguiría sirviendo la cookie hasta mañana. Por lo mismo se
comprueba que la cuenta siga existiendo. Esconder un botón en el panel es
comodidad; la barrera está en el backend.

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
