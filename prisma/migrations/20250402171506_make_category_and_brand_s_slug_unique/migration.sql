/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ProductBrand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `ProductBrand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `ProductCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ProductBrand` MODIFY `slug` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `ProductCategory` MODIFY `slug` VARCHAR(150) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProductBrand_slug_key` ON `ProductBrand`(`slug`);

-- CreateIndex
CREATE INDEX `ProductBrand_slug_idx` ON `ProductBrand`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductCategory_slug_key` ON `ProductCategory`(`slug`);

-- CreateIndex
CREATE INDEX `ProductCategory_slug_idx` ON `ProductCategory`(`slug`);
