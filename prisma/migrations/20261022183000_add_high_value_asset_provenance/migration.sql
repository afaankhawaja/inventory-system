-- AlterTable: Add high-value asset provenance, certification, and valuation columns to Item
ALTER TABLE "Item"
  ADD COLUMN IF NOT EXISTS "serial_number" TEXT,
  ADD COLUMN IF NOT EXISTS "certificate_id" TEXT,
  ADD COLUMN IF NOT EXISTS "weight_grams" DECIMAL,
  ADD COLUMN IF NOT EXISTS "purity_karat" TEXT,
  ADD COLUMN IF NOT EXISTS "appraised_value" DECIMAL,
  ADD COLUMN IF NOT EXISTS "insured_policy_no" TEXT,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB;

-- CreateIndex: Ensure serial_number is unique for serialized high-value items
CREATE UNIQUE INDEX IF NOT EXISTS "Item_serial_number_key" ON "Item"("serial_number");

-- AlterTable: Add custody governance columns to Transaction
ALTER TABLE "Transaction"
  ADD COLUMN IF NOT EXISTS "purpose" TEXT,
  ADD COLUMN IF NOT EXISTS "approved_by" TEXT,
  ADD COLUMN IF NOT EXISTS "expected_return" TIMESTAMP(3);
