-- La pieza central deja de ser el mensaje y pasa a ser la persona.
--
-- Los mensajes que ya existen se agrupan en contactos aquí mismo: si esto
-- quedara para después, "Lead"."contactId" no podría ser NOT NULL y el
-- modelo nacería con un agujero. Por eso la migración crea las tablas,
-- reparte los mensajes existentes y recién entonces exige la columna.

-- CreateEnum
CREATE TYPE "ContactStage" AS ENUM ('NEW', 'CONTACTED', 'APPOINTMENT_SET', 'ATTENDED', 'TREATMENT_ACCEPTED', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LossReason" AS ENUM ('PRICE', 'SCHEDULE', 'LOCATION', 'NO_ANSWER', 'OTHER');

-- CreateEnum
CREATE TYPE "InteractionChannel" AS ENUM ('CALL', 'WHATSAPP', 'EMAIL', 'IN_PERSON', 'NOTE');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "phoneNormalized" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'es',
    "stage" "ContactStage" NOT NULL DEFAULT 'NEW',
    "lossReason" "LossReason",
    "lossNote" TEXT,
    "ownerId" TEXT,
    "nextFollowUpAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "authorId" TEXT,
    "channel" "InteractionChannel" NOT NULL,
    "body" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- AlterTable: nullable por ahora; el backfill de más abajo la llena y al
-- final se exige NOT NULL
ALTER TABLE "Lead" ADD COLUMN     "contactId" TEXT;

-- Backfill: un Contact por persona a partir de los mensajes que ya hay.
--
-- Se agrupa por correo en minúsculas, que es el único campo obligatorio del
-- formulario. Por teléfono NO se une: en una casa se comparte el número, y
-- juntar a la mamá con el hijo mezclaría dos historiales en una sola ficha.
-- El teléfono se guarda normalizado y con índice para que el panel pueda
-- señalar los contactos que lo comparten y alguien decida a mano. Misma
-- regla que sigue el backend al guardar (backend/src/contacts.ts).
WITH digitos AS (
    SELECT
        "id",
        "name",
        "locale",
        "status",
        "phone",
        "createdAt",
        lower(btrim("email")) AS correo,
        NULLIF(regexp_replace(coalesce("phone", ''), '\D', '', 'g'), '') AS solo_digitos
    FROM "Lead"
),
normalizado AS (
    SELECT
        d.*,
        -- 1 de país fuera: +1 809 555 0101 y 809-555-0101 son el mismo número
        CASE
            WHEN length(d.solo_digitos) = 11 AND left(d.solo_digitos, 1) = '1'
                THEN right(d.solo_digitos, 10)
            ELSE d.solo_digitos
        END AS telefono_normalizado
    FROM digitos d
),
-- el mensaje más reciente manda para nombre, idioma y etapa: es donde está
-- la persona hoy
reciente AS (
    SELECT DISTINCT ON (correo) correo, "name", "locale", "status"
    FROM normalizado
    ORDER BY correo, "createdAt" DESC
),
-- el teléfono más reciente que no venga vacío, aunque el último mensaje no
-- lo traiga
telefono AS (
    SELECT DISTINCT ON (correo) correo, "phone", telefono_normalizado
    FROM normalizado
    WHERE telefono_normalizado IS NOT NULL
    ORDER BY correo, "createdAt" DESC
),
primera_vez AS (
    SELECT correo, min("createdAt") AS desde
    FROM normalizado
    GROUP BY correo
),
creados AS (
    INSERT INTO "Contact" ("id", "name", "email", "phone", "phoneNormalized", "locale", "stage", "firstSeenAt", "createdAt", "updatedAt")
    SELECT
        gen_random_uuid()::text,
        r."name",
        r.correo,
        t."phone",
        t.telefono_normalizado,
        r."locale",
        CASE r."status"
            WHEN 'NEW' THEN 'NEW'::"ContactStage"
            WHEN 'CONTACTED' THEN 'CONTACTED'::"ContactStage"
            ELSE 'ARCHIVED'::"ContactStage"
        END,
        p.desde,
        p.desde,
        CURRENT_TIMESTAMP
    FROM reciente r
    JOIN primera_vez p ON p.correo = r.correo
    LEFT JOIN telefono t ON t.correo = r.correo
    RETURNING "id", "email"
)
UPDATE "Lead" l
SET "contactId" = c."id"
FROM creados c
WHERE lower(btrim(l."email")) = c."email";

-- Si algún mensaje quedó sin persona, la migración se cae aquí y revierte
-- entera: mejor eso que un CRM con mensajes huérfanos
ALTER TABLE "Lead" ALTER COLUMN "contactId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Contact_stage_idx" ON "Contact"("stage");

-- CreateIndex
CREATE INDEX "Contact_nextFollowUpAt_idx" ON "Contact"("nextFollowUpAt");

-- CreateIndex
CREATE INDEX "Contact_phoneNormalized_idx" ON "Contact"("phoneNormalized");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Interaction_contactId_occurredAt_idx" ON "Interaction"("contactId", "occurredAt");

-- CreateIndex
CREATE INDEX "Lead_contactId_idx" ON "Lead"("contactId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
