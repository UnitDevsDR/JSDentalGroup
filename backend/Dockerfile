FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
COPY public ./public
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:3001/api/health >/dev/null || exit 1
# migra el esquema y arranca — seguro de correr en cada deploy: Prisma
# Migrate no reaplica lo que ya está aplicado
CMD npx prisma migrate deploy && node dist/server.js
