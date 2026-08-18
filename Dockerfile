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
# 127.0.0.1 explícito, no "localhost": nginx solo escucha en IPv4
# (0.0.0.0:80) y el resolver de musl/BusyBox prueba ::1 (IPv6) primero,
# así que "localhost" da "Connection refused" aunque el sitio funcione
# bien — eso disparaba un ciclo de caída-reinicio en Docker Swarm aunque
# el tráfico real (siempre IPv4 vía Docker/Traefik) nunca tuvo problema
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
