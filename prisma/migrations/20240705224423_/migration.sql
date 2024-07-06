/*
  Warnings:

  - You are about to drop the column `bookingId` on the `ParkingSpot` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ParkingSpot_bookingId_key";

-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "bookingId";
