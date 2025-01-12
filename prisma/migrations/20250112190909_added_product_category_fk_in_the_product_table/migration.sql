-- AlterTable
ALTER TABLE `Product` ADD COLUMN `productCategoryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_productCategoryId_fkey` FOREIGN KEY (`productCategoryId`) REFERENCES `ProductCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
