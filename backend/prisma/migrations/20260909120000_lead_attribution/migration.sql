-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "landingPath" TEXT,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmTerm" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "gclid" TEXT,
ADD COLUMN     "fbclid" TEXT;

-- CreateIndex
CREATE INDEX "Lead_utmSource_utmCampaign_idx" ON "Lead"("utmSource", "utmCampaign");
