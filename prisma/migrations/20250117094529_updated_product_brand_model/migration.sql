-- AlterTable
ALTER TABLE `ProductBrand` ADD COLUMN `brandPhoto` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` LONGTEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NULL;
