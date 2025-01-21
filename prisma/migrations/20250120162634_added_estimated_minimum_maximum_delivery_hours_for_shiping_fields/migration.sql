-- DropIndex
DROP INDEX `Product_isFeatured_isNewArrival_isBestSeller_name_idx` ON `Product`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `estimatedMaximumDeliveryHours` INTEGER NULL DEFAULT 72,
    ADD COLUMN `estimatedMinimumDeliveryHours` INTEGER NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX `Product_isActive_isFeatured_isNewArrival_isBestSeller_name_idx` ON `Product`(`isActive`, `isFeatured`, `isNewArrival`, `isBestSeller`, `name`);
