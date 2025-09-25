/*
  Warnings:

  - You are about to drop the column `available` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "available",
DROP COLUMN "published",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
