/*
  Warnings:

  - You are about to drop the column `genreId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genre` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_genreId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "genreId",
ADD COLUMN     "genre" TEXT NOT NULL,
ALTER COLUMN "publicationDate" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Genre";
