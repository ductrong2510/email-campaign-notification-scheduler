/*
  Warnings:

  - Added the required column `titleNormalized` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "titleNormalized" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Campaign_titleNormalized_idx" ON "Campaign"("titleNormalized");
