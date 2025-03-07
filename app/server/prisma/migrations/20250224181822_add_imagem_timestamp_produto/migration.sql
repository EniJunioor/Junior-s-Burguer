/*
  Warnings:

  - Added the required column `updatedAt` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imagem" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
