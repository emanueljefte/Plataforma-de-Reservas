/*
  Warnings:

  - Added the required column `price` to the `Reserves` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserves" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'confirmed';
