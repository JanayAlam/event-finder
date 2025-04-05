-- DropForeignKey
ALTER TABLE `ProductCategory` DROP FOREIGN KEY `ProductCategory_patentCategoryId_fkey`;

-- DropIndex
DROP INDEX `ProductBrand_slug_key` ON `ProductBrand`;

-- DropIndex
DROP INDEX `ProductCategory_slug_key` ON `ProductCategory`;

-- AddForeignKey
ALTER TABLE `ProductCategory` ADD CONSTRAINT `ProductCategory_parentCategoryId_fkey` FOREIGN KEY (`parentCategoryId`) REFERENCES `ProductCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
