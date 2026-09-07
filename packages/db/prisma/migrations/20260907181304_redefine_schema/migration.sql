/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,name]` on the table `organisations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `organisations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organisations" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organisations_ownerId_name_key" ON "organisations"("ownerId", "name");

-- AddForeignKey
ALTER TABLE "organisations" ADD CONSTRAINT "organisations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
