/*
  Warnings:

  - You are about to drop the column `productPhoto` on the `ProductPrice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ProductPrice` DROP COLUMN `productPhoto`;

-- CreateTable
CREATE TABLE `ProductAdditionalPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `photoURL` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductAdditionalPhoto` ADD CONSTRAINT `ProductAdditionalPhoto_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
