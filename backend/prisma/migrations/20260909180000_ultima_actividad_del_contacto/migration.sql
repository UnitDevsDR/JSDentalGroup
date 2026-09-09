-- El orden natural de una lista de personas es por su último movimiento:
-- quien acaba de escribir va arriba. No sirve `updatedAt`, que cambia
-- también al asignarle dueño o fecha de seguimiento.

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill: el mensaje más reciente de cada persona. Sin esto todos
-- quedarían con la fecha de la migración y la lista saldría en desorden.
UPDATE "Contact" c
SET "lastActivityAt" = COALESCE(
    (SELECT max(l."createdAt") FROM "Lead" l WHERE l."contactId" = c."id"),
    c."firstSeenAt"
);

-- CreateIndex
CREATE INDEX "Contact_lastActivityAt_idx" ON "Contact"("lastActivityAt");
