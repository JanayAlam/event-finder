/*
  Warnings:

  - You are about to drop the column `externalLink` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `externalLinkText` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `youTubeVideoId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Product_isActive_isFeatured_isNewArrival_isBestSeller_name_idx` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `externalLink`,
    DROP COLUMN `externalLinkText`,
    DROP COLUMN `youTubeVideoId`,
    ADD COLUMN `slug` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_slug_key` ON `Product`(`slug`);

-- CreateIndex
CREATE INDEX `Product_isActive_isFeatured_isNewArrival_isBestSeller_name_s_idx` ON `Product`(`isActive`, `isFeatured`, `isNewArrival`, `isBestSeller`, `name`, `slug`);
