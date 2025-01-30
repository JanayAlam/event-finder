/*
  Warnings:

  - You are about to alter the column `flat` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `percent` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Discount` MODIFY `flat` DOUBLE NULL,
    MODIFY `percent` DOUBLE NULL;
