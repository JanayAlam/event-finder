-- AlterTable
ALTER TABLE `ProductPriceAndSize` MODIFY `sizeType` ENUM('STANDARD', 'WEIGHT') NULL DEFAULT 'WEIGHT';
