/*
  Warnings:

  - You are about to alter the column `name` on the `Subscriber` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "nameNormalized" VARCHAR(255) NOT NULL DEFAULT '',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "Subscriber_nameNormalized_idx" ON "Subscriber"("nameNormalized");
