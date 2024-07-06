/*
  Warnings:

  - Made the column `startDateTime` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "startDateTime" SET NOT NULL,
ALTER COLUMN "startDateTime" SET DEFAULT CURRENT_TIMESTAMP;
