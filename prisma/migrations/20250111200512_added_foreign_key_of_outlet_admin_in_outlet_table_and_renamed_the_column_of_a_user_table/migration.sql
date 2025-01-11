/*
  Warnings:

  - A unique constraint covering the columns `[outletAdminId]` on the table `Outlet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outletAdminId` to the `Outlet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Outlet` ADD COLUMN `outletAdminId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Outlet_outletAdminId_key` ON `Outlet`(`outletAdminId`);

-- AddForeignKey
ALTER TABLE `Outlet` ADD CONSTRAINT `Outlet_outletAdminId_fkey` FOREIGN KEY (`outletAdminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
