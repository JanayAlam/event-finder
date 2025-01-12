/*
  Warnings:

  - Added the required column `title` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductCategory` ADD COLUMN `subtitle` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
