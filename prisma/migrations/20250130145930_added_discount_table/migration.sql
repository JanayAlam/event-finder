-- CreateTable
CREATE TABLE `Discount` (
    `id` VARCHAR(191) NOT NULL,
    `discountType` ENUM('FLAT', 'PERCENT') NOT NULL DEFAULT 'PERCENT',
    `flat` DECIMAL(65, 30) NOT NULL,
    `percent` DECIMAL(65, 30) NOT NULL,
    `startsFrom` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NULL,
    `outletId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscountsOnProducts` (
    `productId` VARCHAR(191) NOT NULL,
    `discountId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`productId`, `discountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscountsOnProducts` ADD CONSTRAINT `DiscountsOnProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscountsOnProducts` ADD CONSTRAINT `DiscountsOnProducts_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `Discount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
