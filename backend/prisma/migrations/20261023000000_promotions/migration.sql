CREATE TYPE "PromotionStatus" AS ENUM ('APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TABLE "Promotion" ("id" TEXT NOT NULL, "productId" TEXT NOT NULL, "previousPrice" DECIMAL(12,2) NOT NULL, "currentPrice" DECIMAL(12,2) NOT NULL, "previousObservedAt" TIMESTAMP(3) NOT NULL, "approvedAt" TIMESTAMP(3), "approvedById" TEXT, "status" "PromotionStatus" NOT NULL DEFAULT 'REJECTED', "expiresAt" TIMESTAMP(3), "placements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id"));
CREATE INDEX "Promotion_productId_status_idx" ON "Promotion"("productId","status");
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE;
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Admin"("id") ON DELETE SET NULL;
