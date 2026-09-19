/*
  Warnings:

  - You are about to drop the column `recipient` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `to` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "recipient",
ADD COLUMN     "to" TEXT NOT NULL;
