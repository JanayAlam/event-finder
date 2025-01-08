/*
  Warnings:

  - Added the required column `expireAt` to the `ResetPasswordToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ResetPasswordToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ResetPasswordToken` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expireAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
