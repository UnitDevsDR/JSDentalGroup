-- Un mensaje no tiene estado propio: en qué va la conversación lo dice la
-- etapa de la persona (Contact.stage), que es lo que el panel usa desde
-- 8adc2a9. El `status` por mensaje era del modelo viejo, cuando la unidad
-- era el mensaje y no la persona.
--
-- Esto borra datos y no se deshace. Lo que decían esos estados ya está en
-- las fichas: la migración de contactos (20260909140000) derivó la etapa
-- inicial de cada persona del estado de su mensaje más reciente.

-- DropIndex (se va con la columna, explícito para que se lea)
DROP INDEX IF EXISTS "Lead_status_idx";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "status";

-- DropEnum
DROP TYPE "LeadStatus";
