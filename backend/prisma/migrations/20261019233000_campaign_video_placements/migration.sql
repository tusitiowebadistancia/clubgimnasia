ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'BOWLING_AFTER_INCLUDES';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'BOWLING_AFTER_PROMOS';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'POOL_AFTER_ENVIRONMENT';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'POOL_AFTER_TOURNAMENTS';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'EVENTS_AFTER_INCLUDES';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'EVENTS_AFTER_PLANS';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'CONTACT_AFTER_INFO';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'CONTACT_AFTER_HOURS';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'MENU_AFTER_INTRO';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'MENU_QR_AFTER_GENERATOR';
ALTER TYPE "CampaignPlacement" ADD VALUE IF NOT EXISTS 'BOWLING_RULES_AFTER_INTRO';

CREATE TABLE "CampaignVideoPlacement" (
  "id" TEXT NOT NULL,
  "videoId" TEXT NOT NULL,
  "placement" "CampaignPlacement" NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "CampaignVideoPlacement_pkey" PRIMARY KEY ("id")
);

INSERT INTO "CampaignVideoPlacement" ("id", "videoId", "placement", "sortOrder")
SELECT "id" || '-placement', "id", "placement", "sortOrder" FROM "CampaignVideo";

CREATE UNIQUE INDEX "CampaignVideoPlacement_videoId_placement_key" ON "CampaignVideoPlacement"("videoId", "placement");
CREATE INDEX "CampaignVideoPlacement_placement_active_sortOrder_idx" ON "CampaignVideoPlacement"("placement", "active", "sortOrder");
ALTER TABLE "CampaignVideoPlacement" ADD CONSTRAINT "CampaignVideoPlacement_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "CampaignVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX "CampaignVideo_campaign_placement_active_sortOrder_idx";
ALTER TABLE "CampaignVideo" DROP COLUMN "placement", DROP COLUMN "sortOrder";
CREATE INDEX "CampaignVideo_campaign_active_idx" ON "CampaignVideo"("campaign", "active");
