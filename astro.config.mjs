// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Tailwind 4 va vía PostCSS (postcss.config.mjs): el plugin @tailwindcss/vite
// es incompatible con el rolldown-vite de Astro 6.4.
export default defineConfig({
  site: 'https://jsdentalgroup.com',
  integrations: [
    react(),
    sitemap(),
    // GTM corre en un web worker para no bloquear el hilo principal
    // https://docs.astro.build/en/guides/integrations-guide/partytown/
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  vite: {
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
