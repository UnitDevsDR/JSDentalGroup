// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Tailwind 4 va vía PostCSS (postcss.config.mjs): el plugin @tailwindcss/vite
// es incompatible con el rolldown-vite de Astro 6.4.
export default defineConfig({
  site: 'https://jsdentalgroup.com',
  // URLs sin barra final, idénticas a las que Google ya indexó del Odoo
  // (/ortodoncia, no /ortodoncia/). `format: 'file'` genera ortodoncia.html,
  // así el canonical, el sitemap y la URL servida coinciden exactamente.
  trailingSlash: 'never',
  build: { format: 'file' },
  // Español en la raíz (mantiene los slugs que ya indexó Google desde Odoo),
  // inglés bajo /en/ con slugs traducidos.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    // el sitemap emite <xhtml:link rel="alternate"> entre idiomas
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-DO', en: 'en-US' },
      },
      // páginas noindex fuera del sitemap: la de gracias solo se llega por
      // el redirect del formulario o el link de una campaña, nunca debe
      // ofrecerse como resultado de búsqueda
      filter: (page) => !page.includes('/your-ticket-has-been-submitted'),
    }),
    // GTM corre en un web worker para no bloquear el hilo principal
    // https://docs.astro.build/en/guides/integrations-guide/partytown/
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  vite: {
    // Túneles para compartir el preview (cloudflared, ngrok): Vite bloquea
    // hosts desconocidos por defecto
    server: { allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.io'] },
    preview: { allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.io'] },
    resolve: {
      alias: {
        // lucide-react no declara "exports": Node cae al build CJS y el
        // prerender no encuentra los named exports — forzamos el ESM
        'lucide-react': 'lucide-react/dist/esm/lucide-react.mjs',
      },
    },
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});
