/*
  Warnings:

  - You are about to alter the column `externalLinkText` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `metaTitle` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `shortDescription` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `basePhoto` VARCHAR(255) NULL,
    MODIFY `externalLink` VARCHAR(255) NULL,
    MODIFY `externalLinkText` VARCHAR(50) NULL,
    MODIFY `metaImage` VARCHAR(255) NULL,
    MODIFY `metaTitle` VARCHAR(150) NULL,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `pdfLink` VARCHAR(255) NULL,
    MODIFY `shortDescription` VARCHAR(150) NULL,
    MODIFY `thumbnailPhoto` VARCHAR(255) NULL,
    MODIFY `youTubeVideoLink` VARCHAR(255) NULL;
