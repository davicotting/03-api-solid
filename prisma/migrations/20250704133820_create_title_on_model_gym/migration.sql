/*
  Warnings:

  - Added the required column `title` to the `gyms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gyms" ADD COLUMN     "title" TEXT NOT NULL;
