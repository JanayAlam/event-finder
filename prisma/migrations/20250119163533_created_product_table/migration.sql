/*
  Warnings:

  - You are about to drop the column `SKU` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `baseQty` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `hasMultipleSizes` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productPhoto` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductSizeAndPrice` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[baseSKU]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[baseBarcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outletId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductSizeAndPrice` DROP FOREIGN KEY `ProductSizeAndPrice_productId_fkey`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `SKU`,
    DROP COLUMN `baseQty`,
    DROP COLUMN `hasMultipleSizes`,
    DROP COLUMN `productPhoto`,
    DROP COLUMN `subtitle`,
    DROP COLUMN `title`,
    ADD COLUMN `averageRating` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `baseBarcode` VARCHAR(191) NULL,
    ADD COLUMN `basePhoto` VARCHAR(191) NULL,
    ADD COLUMN `baseSKU` VARCHAR(191) NULL,
    ADD COLUMN `baseStock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `externalLink` VARCHAR(191) NULL,
    ADD COLUMN `externalLinkText` VARCHAR(191) NULL,
    ADD COLUMN `hasMultipleVariants` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isBestSeller` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isNewArrival` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isRefundable` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `metaDescription` LONGTEXT NULL,
    ADD COLUMN `metaImage` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `outletId` VARCHAR(191) NOT NULL,
    ADD COLUMN `pdfLink` VARCHAR(191) NULL,
    ADD COLUMN `ratingCount` INTEGER NULL DEFAULT 0,
    ADD COLUMN `shortDescription` VARCHAR(191) NULL,
    ADD COLUMN `thumbnailPhoto` VARCHAR(191) NULL,
    ADD COLUMN `youTubeVideoLink` VARCHAR(191) NULL,
    MODIFY `isFeatured` BOOLEAN NULL DEFAULT false,
    MODIFY `isActive` BOOLEAN NULL DEFAULT true;

-- DropTable
DROP TABLE `ProductSizeAndPrice`;

-- CreateTable
CREATE TABLE `FrequentlyBoughtProduct` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `frequentlyBoughtProductId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FrequentlyBoughtProduct_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductTag` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductTag_title_productId_idx`(`title`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductColor` (
    `id` VARCHAR(191) NOT NULL,
    `colorName` VARCHAR(50) NOT NULL,
    `colorHexCode` VARCHAR(7) NULL,
    `productPhoto` VARCHAR(255) NULL,
    `productId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductColor_productId_colorName_idx`(`productId`, `colorName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` VARCHAR(191) NOT NULL,
    `sizeName` VARCHAR(50) NULL,
    `sizeType` ENUM('STANDARD', 'WEIGHT') NULL DEFAULT 'STANDARD',
    `weight` DOUBLE NULL,
    `weightUnit` ENUM('KILOGRAM', 'POUND', 'GRAM', 'OUNCE', 'MILLIGRAM', 'TON', 'MILLILITRE', 'LITRE') NULL,
    `shortDescription` VARCHAR(150) NULL,
    `productId` VARCHAR(191) NOT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductSize_productId_sizeName_sizeType_idx`(`productId`, `sizeName`, `sizeType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPrice` (
    `id` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `SKU` VARCHAR(100) NULL,
    `barcode` VARCHAR(100) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 10,
    `criticalStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `productId` VARCHAR(191) NOT NULL,
    `productSizeId` VARCHAR(191) NULL,
    `productColorId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProductPrice_SKU_key`(`SKU`),
    UNIQUE INDEX `ProductPrice_barcode_key`(`barcode`),
    INDEX `ProductPrice_productId_productSizeId_productColorId_isActive_idx`(`productId`, `productSizeId`, `productColorId`, `isActive`, `stock`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Product_baseSKU_key` ON `Product`(`baseSKU`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_baseBarcode_key` ON `Product`(`baseBarcode`);

-- CreateIndex
CREATE INDEX `Product_isFeatured_isNewArrival_isBestSeller_name_idx` ON `Product`(`isFeatured`, `isNewArrival`, `isBestSeller`, `name`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrequentlyBoughtProduct` ADD CONSTRAINT `FrequentlyBoughtProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrequentlyBoughtProduct` ADD CONSTRAINT `FrequentlyBoughtProduct_frequentlyBoughtProductId_fkey` FOREIGN KEY (`frequentlyBoughtProductId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTag` ADD CONSTRAINT `ProductTag_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrice` ADD CONSTRAINT `ProductPrice_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrice` ADD CONSTRAINT `ProductPrice_productSizeId_fkey` FOREIGN KEY (`productSizeId`) REFERENCES `ProductSize`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPrice` ADD CONSTRAINT `ProductPrice_productColorId_fkey` FOREIGN KEY (`productColorId`) REFERENCES `ProductColor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
