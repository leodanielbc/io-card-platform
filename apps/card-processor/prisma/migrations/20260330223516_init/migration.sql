-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "card_number_hash" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "cvv_hash" TEXT NOT NULL,
    "cvv_salt" TEXT NOT NULL,
    "card_type" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "issued_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_request_id_key" ON "cards"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "cards_customer_id_key" ON "cards"("customer_id");
