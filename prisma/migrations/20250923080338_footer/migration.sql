-- CreateTable
CREATE TABLE "public"."footer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactUrl" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,

    CONSTRAINT "footer_pkey" PRIMARY KEY ("id")
);
