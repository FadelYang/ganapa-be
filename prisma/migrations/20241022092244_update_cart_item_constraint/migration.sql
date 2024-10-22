/*
  Warnings:

  - You are about to drop the column `qunatity` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "qunatity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
