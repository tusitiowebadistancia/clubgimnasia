CREATE TYPE "CampaignType" AS ENUM ('NONE', 'YEAR_ROUND', 'CHRISTMAS', 'NEW_YEAR', 'SUMMER');
CREATE TYPE "CampaignPlacement" AS ENUM ('HOME_AFTER_SERVICES', 'HOME_AFTER_PROMOS');

CREATE TABLE "CampaignConfig" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "activeCampaign" "CampaignType" NOT NULL DEFAULT 'NONE',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CampaignConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CampaignVideo" (
  "id" TEXT NOT NULL,
  "campaign" "CampaignType" NOT NULL,
  "placement" "CampaignPlacement" NOT NULL,
  "name" TEXT NOT NULL,
  "desktopUrl" TEXT NOT NULL,
  "mobileUrl" TEXT NOT NULL,
  "posterUrl" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CampaignVideo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CampaignVideo_campaign_placement_active_sortOrder_idx" ON "CampaignVideo"("campaign", "placement", "active", "sortOrder");
