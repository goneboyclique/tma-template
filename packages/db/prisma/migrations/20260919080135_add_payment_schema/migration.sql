-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('TON', 'USDT');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "recipient" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" TEXT NOT NULL,
    "jettonMaster" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
