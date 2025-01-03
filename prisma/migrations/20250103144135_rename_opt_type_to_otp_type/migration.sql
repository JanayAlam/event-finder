/*
  Warnings:

  - You are about to drop the column `optType` on the `OTPDetails` table. All the data in the column will be lost.
  - Added the required column `otpType` to the `OTPDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OTPDetails` DROP COLUMN `optType`,
    ADD COLUMN `otpType` ENUM('LOGIN_EMAIL_OTP', 'LOGIN_PHONE_OTP') NOT NULL;
