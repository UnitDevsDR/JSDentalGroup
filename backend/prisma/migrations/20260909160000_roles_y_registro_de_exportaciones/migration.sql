-- Roles en el panel y rastro de las exportaciones (decisión 6.2 de
-- docs/crm-propuesta.md): con historial clínico colgando de cada contacto,
-- bajarse la base entera en un CSV no puede seguir siendo algo que cualquiera
-- haga sin dejar huella.

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'STAFF');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'STAFF';

-- Los usuarios que ya existen son quienes montaron el panel: se quedan como
-- administradores. Sin esto el DEFAULT los dejaría a todos en STAFF y la
-- clínica no podría exportar su propia base.
UPDATE "AdminUser" SET "role" = 'ADMIN';

-- CreateTable
CREATE TABLE "ExportLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "adminEmail" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "rowCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExportLog_createdAt_idx" ON "ExportLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ExportLog" ADD CONSTRAINT "ExportLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
