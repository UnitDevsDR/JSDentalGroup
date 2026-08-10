# JS Dental Group — jsdentalgroup.com

Migración del sitio Odoo (Theme Prime) a **Astro 6** estático. Contenido real
migrado 1:1 con los **mismos slugs** del sitio original para no perder SEO.

## Stack

- **Astro 6** (salida estática) + **React 19** (islas, solo donde hay interacción)
- **Tailwind CSS 4** (vía PostCSS — el plugin de Vite es incompatible con el rolldown-vite de Astro 6.4)
- **shadcn/ui + bloques de shadcnblocks** (registro privado, ver abajo)
- **GSAP + ScrollTrigger** para animaciones (`data-animate`, `data-stagger`, `data-parallax`, `data-count`, arco de sonrisa con scrub)
- Fuentes self-hosted: Bricolage Grotesque (display) + Instrument Sans (cuerpo)

## Desarrollo

```bash
npm install
cp .env.example .env.local   # poner SHADCNBLOCKS_API_KEY
npm run dev
npm run build                # genera dist/
```

## Registro shadcnblocks

`components.json` declara el registro `@shadcnblocks` autenticado con
`${SHADCNBLOCKS_API_KEY}` (vive solo en `.env.local`, gitignorado).
Para traer un bloque nuevo:

```bash
npx shadcn@latest add @shadcnblocks/<nombre>
```

Este repo es **privado**; el código de los bloques puede vivir aquí.
**No** copiar bloques a repos públicos (la licencia lo prohíbe).

## SEO

- Mismos slugs que el Odoo original (`/ortodoncia`, `/about-us`, `/contactus`, …)
- Title + meta description únicos por página (corrigen los truncados del sitio viejo)
- JSON-LD: `Dentist` global + `FAQPage` (home) + `BreadcrumbList`/`MedicalProcedure` (servicios)
- OG/Twitter cards con dominio correcto (el sitio viejo apuntaba a `jsdentralgroup.com`, con errata)
- `sitemap-index.xml` (@astrojs/sitemap) + `robots.txt`
- Imágenes optimizadas a WebP responsive por `astro:assets`

## Seguridad (sitio estático)

`public/_headers` define CSP, HSTS, nosniff, frame-options, etc.
(formato Netlify/Cloudflare Pages). **Si se despliega en Nginx/Dokploy,
replicar esos headers en el server.** No hay backend: el formulario de
contacto compone un mensaje de WhatsApp (wa.me) en el cliente.

## Deploy

`npm run build` → servir `dist/` como estático. El dominio canónico
configurado es `https://jsdentalgroup.com` (en `astro.config.mjs`).
