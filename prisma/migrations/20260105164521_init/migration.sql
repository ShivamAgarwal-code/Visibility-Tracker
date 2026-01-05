-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "brands" TEXT[],
    "results" JSONB NOT NULL,
    "visibilityScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
