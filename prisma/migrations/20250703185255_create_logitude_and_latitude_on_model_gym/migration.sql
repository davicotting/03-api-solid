/*
  Warnings:

  - Added the required column `Logitude` to the `gyms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `gyms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gyms" ADD COLUMN     "Logitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL;
