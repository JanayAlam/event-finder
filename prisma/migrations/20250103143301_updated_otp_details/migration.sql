/*
  Warnings:

  - You are about to drop the column `email` on the `OTPDetails` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `OTPDetails` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `OTPDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OTPDetails` DROP COLUMN `email`,
    DROP COLUMN `phone`,
    ADD COLUMN `identifier` VARCHAR(191) NOT NULL;
