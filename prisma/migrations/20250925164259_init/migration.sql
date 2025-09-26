-- CreateTable
CREATE TABLE "public"."pricing" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "vcpuRate" DOUBLE PRECISION NOT NULL,
    "memoryRate" DOUBLE PRECISION NOT NULL,
    "storageRate" DOUBLE PRECISION NOT NULL,
    "bandwidthRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usages" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pricingId" INTEGER NOT NULL,
    "vcpu" INTEGER NOT NULL,
    "memoryGb" INTEGER NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "bandwidthGb" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL DEFAULT 730,

    CONSTRAINT "usages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."usages" ADD CONSTRAINT "usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usages" ADD CONSTRAINT "usages_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "public"."pricing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
