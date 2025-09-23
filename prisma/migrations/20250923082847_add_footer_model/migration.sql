/*
  Warnings:

  - You are about to drop the `footer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."footer";

-- CreateTable
CREATE TABLE "public"."Footer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactUrl" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Footer_userId_key" ON "public"."Footer"("userId");

-- AddForeignKey
ALTER TABLE "public"."Footer" ADD CONSTRAINT "Footer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
