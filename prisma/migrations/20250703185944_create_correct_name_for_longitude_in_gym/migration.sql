/*
  Warnings:

  - You are about to drop the column `Logitude` on the `gyms` table. All the data in the column will be lost.
  - Added the required column `Longitude` to the `gyms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "Logitude",
ADD COLUMN     "Longitude" DECIMAL(65,30) NOT NULL;
