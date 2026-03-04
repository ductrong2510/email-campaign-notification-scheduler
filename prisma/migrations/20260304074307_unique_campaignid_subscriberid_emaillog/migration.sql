/*
  Warnings:

  - A unique constraint covering the columns `[campaignId,subscriberId]` on the table `EmailLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EmailLog_campaignId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_campaignId_subscriberId_key" ON "EmailLog"("campaignId", "subscriberId");
