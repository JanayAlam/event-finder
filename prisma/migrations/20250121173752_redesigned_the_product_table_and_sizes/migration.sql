/*
  Warnings:

  - You are about to drop the column `estimatedMaximumDeliveryHours` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedMinimumDeliveryHours` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `hasMultipleVariants` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `metaImage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pdfLink` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailPhoto` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductColor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTag` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `productCategoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_productCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductColor` DROP FOREIGN KEY `ProductColor_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPrice` DROP FOREIGN KEY `ProductPrice_productColorId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPrice` DROP FOREIGN KEY `ProductPrice_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductPrice` DROP FOREIGN KEY `ProductPrice_productSizeId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductSize` DROP FOREIGN KEY `ProductSize_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductTag` DROP FOREIGN KEY `ProductTag_productId_fkey`;

-- DropIndex
DROP INDEX `Product_productCategoryId_fkey` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `estimatedMaximumDeliveryHours`,
    DROP COLUMN `estimatedMinimumDeliveryHours`,
    DROP COLUMN `hasMultipleVariants`,
    DROP COLUMN `metaImage`,
    DROP COLUMN `pdfLink`,
    DROP COLUMN `thumbnailPhoto`,
    ADD COLUMN `hasMultipleSizes` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `productCategoryId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ProductColor`;

-- DropTable
DROP TABLE `ProductPrice`;

-- DropTable
DROP TABLE `ProductSize`;

-- DropTable
DROP TABLE `ProductTag`;

-- CreateTable
CREATE TABLE `ProductPriceAndSize` (
    `id` VARCHAR(191) NOT NULL,
    `sizeName` VARCHAR(50) NULL,
    `sizeType` ENUM('STANDARD', 'WEIGHT') NULL DEFAULT 'STANDARD',
    `weight` DOUBLE NULL,
    `weightUnit` ENUM('KILOGRAM', 'POUND', 'GRAM', 'OUNCE', 'MILLIGRAM', 'TON', 'MILLILITRE', 'LITRE') NULL,
    `shortDescription` VARCHAR(150) NULL,
    `price` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `SKU` VARCHAR(100) NULL,
    `barcode` VARCHAR(100) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 10,
    `criticalStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `productId` VARCHAR(191) NOT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProductPriceAndSize_SKU_key`(`SKU`),
    UNIQUE INDEX `ProductPriceAndSize_barcode_key`(`barcode`),
    INDEX `ProductPriceAndSize_productId_sizeName_sizeType_isActive_sto_idx`(`productId`, `sizeName`, `sizeType`, `isActive`, `stock`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productCategoryId_fkey` FOREIGN KEY (`productCategoryId`) REFERENCES `ProductCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPriceAndSize` ADD CONSTRAINT `ProductPriceAndSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
