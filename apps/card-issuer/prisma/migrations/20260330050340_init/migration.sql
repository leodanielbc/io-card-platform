-- CreateTable customers
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "document_type" VARCHAR(10) NOT NULL,
    "document_number" VARCHAR(8) NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_document_type_key" ON "customers"("document_type");
CREATE UNIQUE INDEX "customers_document_number_key" ON "customers"("document_number");
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateTable card_requests
CREATE TABLE "card_requests" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "card_type" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "force_error" BOOLEAN NOT NULL DEFAULT false,
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "card_requests" ADD CONSTRAINT "card_requests_customer_id_fkey"
    FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
