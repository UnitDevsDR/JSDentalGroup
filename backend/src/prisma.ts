import { PrismaClient } from "./generated/prisma/index.js";

// Instancia única: en desarrollo con tsx watch, cada recarga de módulo
// crearía un nuevo pool de conexiones si no se cachea en globalThis.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
