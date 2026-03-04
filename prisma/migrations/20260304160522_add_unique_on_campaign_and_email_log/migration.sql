/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EmailLog_status_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_id_userId_key" ON "Campaign"("id", "userId");

-- CreateIndex
CREATE INDEX "EmailLog_campaignId_status_idx" ON "EmailLog"("campaignId", "status");
