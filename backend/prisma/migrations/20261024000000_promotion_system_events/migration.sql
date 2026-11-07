CREATE TYPE "PromotionSystemEventType" AS ENUM ('PRICE_CHANGED', 'PRODUCT_INACTIVE', 'INVALID_OFFICIAL_PRICE', 'HISTORICAL_REFERENCE_EXPIRED', 'PROMOTION_EXPIRED');
CREATE TABLE "PromotionSystemEvent" ("id" TEXT NOT NULL, "promotionId" TEXT NOT NULL, "eventType" "PromotionSystemEventType" NOT NULL, "reason" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PromotionSystemEvent_pkey" PRIMARY KEY ("id"));
CREATE INDEX "PromotionSystemEvent_promotionId_createdAt_idx" ON "PromotionSystemEvent"("promotionId", "createdAt");
ALTER TABLE "PromotionSystemEvent" ADD CONSTRAINT "PromotionSystemEvent_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT;
