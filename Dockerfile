# Build estático (no necesita SHADCNBLOCKS_API_KEY: el token es solo
# para el CLI de shadcn en desarrollo, no para `astro build`)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
# CSP sin 'unsafe-inline': calcula los hashes sha256 reales de los
# <script>/<style> inline del HTML ya construido y genera
# nginx.generated.conf a partir de nginx.conf (ver scripts/generate-csp.mjs)
RUN node scripts/generate-csp.mjs

# Runtime: Nginx sirviendo dist/ con headers de seguridad
FROM nginx:alpine
COPY --from=build /app/nginx.generated.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null || exit 1
