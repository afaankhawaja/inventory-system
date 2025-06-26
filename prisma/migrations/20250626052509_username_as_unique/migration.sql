/*
  Warnings:

  - A unique constraint covering the columns `[receipt_number]` on the table `Receipt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Receipt_Item" DROP CONSTRAINT "Receipt_Item_receiptID_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receipt_number_key" ON "Receipt"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Receipt_Item" ADD CONSTRAINT "Receipt_Item_receiptID_fkey" FOREIGN KEY ("receiptID") REFERENCES "Receipt"("receiptID") ON DELETE CASCADE ON UPDATE CASCADE;
