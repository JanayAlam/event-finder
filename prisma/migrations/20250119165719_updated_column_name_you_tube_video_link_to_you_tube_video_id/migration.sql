/*
  Warnings:

  - You are about to drop the column `youTubeVideoLink` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `youTubeVideoLink`,
    ADD COLUMN `youTubeVideoId` VARCHAR(150) NULL;
