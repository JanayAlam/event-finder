/*
  Warnings:

  - You are about to drop the column `isEmailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isPhoneVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isEmailVerified`,
    DROP COLUMN `isPhoneVerified`,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `isUserBlocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastName` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OTPDetails` (
    `id` VARCHAR(191) NOT NULL,
    `optType` ENUM('LOGIN_EMAIL_OTP', 'LOGIN_PHONE_OTP') NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `expireAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
