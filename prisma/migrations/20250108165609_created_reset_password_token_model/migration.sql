/*
  Warnings:

  - The values [RESET_PASSWORD_EMAIL_OTP,RESET_PASSWORD_PHONE_OTP] on the enum `OTPDetails_otpType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `OTPDetails` MODIFY `otpType` ENUM('LOGIN_EMAIL_OTP', 'LOGIN_PHONE_OTP') NOT NULL;

-- CreateTable
CREATE TABLE `ResetPasswordToken` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ResetPasswordToken_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResetPasswordToken` ADD CONSTRAINT `ResetPasswordToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
