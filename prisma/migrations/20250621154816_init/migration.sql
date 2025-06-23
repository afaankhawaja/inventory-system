-- CreateTable
CREATE TABLE "Audit_Log" (
    "auditID" TEXT NOT NULL,
    "table_name" TEXT,
    "entity_id" TEXT,
    "action_type" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "is_successful" BOOLEAN,
    "userID" TEXT,
    "timestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_Log_pkey" PRIMARY KEY ("auditID")
);

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "is_active" BOOLEAN,
    "age" INTEGER,
    "cnic" TEXT,
    "roleID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Role" (
    "roleID" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleID")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "permissionID" TEXT NOT NULL,
    "permission_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("permissionID")
);

-- CreateTable
CREATE TABLE "Role_Permissions" (
    "permissionID" TEXT NOT NULL,
    "roleID" TEXT NOT NULL,

    CONSTRAINT "Role_Permissions_pkey" PRIMARY KEY ("permissionID","roleID")
);

-- CreateTable
CREATE TABLE "Domain" (
    "domainID" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "parent_domain_ID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("domainID")
);

-- CreateTable
CREATE TABLE "User_Domain" (
    "userID" TEXT NOT NULL,
    "domainID" TEXT NOT NULL,

    CONSTRAINT "User_Domain_pkey" PRIMARY KEY ("userID","domainID")
);

-- CreateTable
CREATE TABLE "Location" (
    "locationID" TEXT NOT NULL,
    "location_name" TEXT,
    "location_address" TEXT,
    "domainID" TEXT,
    "parent_location_ID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("locationID")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryID" TEXT NOT NULL,
    "name" TEXT,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "parent_category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryID")
);

-- CreateTable
CREATE TABLE "Maintenance_Schedule" (
    "maintenance_schedule_ID" TEXT NOT NULL,
    "maintenance_type" TEXT,
    "status" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "itemID" TEXT,
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_Schedule_pkey" PRIMARY KEY ("maintenance_schedule_ID")
);

-- CreateTable
CREATE TABLE "Item" (
    "itemID" TEXT NOT NULL,
    "name" TEXT,
    "manufacturing_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "price" DECIMAL,
    "condition" TEXT,
    "quantity_in_stock" INTEGER,
    "reorder_threshold" INTEGER,
    "is_high_value" BOOLEAN,
    "brand" TEXT,
    "barcode" TEXT,
    "locationID" TEXT,
    "categoryID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemID")
);

-- CreateTable
CREATE TABLE "Alert" (
    "alertID" TEXT NOT NULL,
    "alert_type" TEXT,
    "message" TEXT,
    "severity" TEXT,
    "alert_date" TIMESTAMP(3),
    "is_active" BOOLEAN,
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("alertID")
);

-- CreateTable
CREATE TABLE "Item_Alert" (
    "alertID" TEXT NOT NULL,
    "itemID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_Alert_pkey" PRIMARY KEY ("alertID","itemID")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "vendorID" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN,
    "rating" DECIMAL(3,2),
    "age" INTEGER,
    "cnic" TEXT,
    "locationID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("vendorID")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "receiptID" TEXT NOT NULL,
    "receipt_number" INTEGER NOT NULL,
    "total_amount" DECIMAL NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "image_path" TEXT,
    "ocr_text" TEXT,
    "status" TEXT,
    "uploaded_date" TIMESTAMP(3),
    "vendorID" TEXT,
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("receiptID")
);

-- CreateTable
CREATE TABLE "Receipt_Item" (
    "receipt_item_ID" TEXT NOT NULL,
    "price" DECIMAL,
    "quantity" INTEGER,
    "receiptID" TEXT,
    "itemID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receipt_Item_pkey" PRIMARY KEY ("receipt_item_ID")
);

-- CreateTable
CREATE TABLE "Purchase_History" (
    "purchaseID" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3),
    "quantity" INTEGER,
    "unit_price" DECIMAL,
    "total_cost" DECIMAL,
    "itemID" TEXT,
    "vendorID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_History_pkey" PRIMARY KEY ("purchaseID")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "favoriteID" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3),
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("favoriteID")
);

-- CreateTable
CREATE TABLE "Favorite_Item" (
    "favorite_item_ID" TEXT NOT NULL,
    "favoriteID" TEXT,
    "itemID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_Item_pkey" PRIMARY KEY ("favorite_item_ID")
);

-- CreateTable
CREATE TABLE "Template" (
    "templateID" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "description" TEXT,
    "created_date" TIMESTAMP(3),
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("templateID")
);

-- CreateTable
CREATE TABLE "Template_Item" (
    "template_item_ID" TEXT NOT NULL,
    "notes" TEXT,
    "default_quantity" INTEGER,
    "default_name" TEXT,
    "itemID" TEXT,
    "templateID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_Item_pkey" PRIMARY KEY ("template_item_ID")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionID" TEXT NOT NULL,
    "transaction_type" TEXT,
    "quantity" INTEGER,
    "unit_price" DECIMAL,
    "status" TEXT,
    "transaction_date" TIMESTAMP(3),
    "to_location" TEXT,
    "from_location" TEXT,
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionID")
);

-- CreateTable
CREATE TABLE "Transaction_Item" (
    "transactionID" TEXT NOT NULL,
    "itemID" TEXT NOT NULL,

    CONSTRAINT "Transaction_Item_pkey" PRIMARY KEY ("transactionID","itemID")
);

-- CreateTable
CREATE TABLE "Sync_Log" (
    "syncID" TEXT NOT NULL,
    "device_id" TEXT,
    "data_payload" JSONB,
    "status" TEXT,
    "sync_timestamp" TIMESTAMP(3),
    "userID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sync_Log_pkey" PRIMARY KEY ("syncID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");

-- AddForeignKey
ALTER TABLE "Audit_Log" ADD CONSTRAINT "Audit_Log_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("roleID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Permissions" ADD CONSTRAINT "Role_Permissions_permissionID_fkey" FOREIGN KEY ("permissionID") REFERENCES "Permissions"("permissionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Permissions" ADD CONSTRAINT "Role_Permissions_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("roleID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_parent_domain_ID_fkey" FOREIGN KEY ("parent_domain_ID") REFERENCES "Domain"("domainID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Domain" ADD CONSTRAINT "User_Domain_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Domain" ADD CONSTRAINT "User_Domain_domainID_fkey" FOREIGN KEY ("domainID") REFERENCES "Domain"("domainID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_domainID_fkey" FOREIGN KEY ("domainID") REFERENCES "Domain"("domainID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parent_location_ID_fkey" FOREIGN KEY ("parent_location_ID") REFERENCES "Location"("locationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_category_fkey" FOREIGN KEY ("parent_category") REFERENCES "Category"("categoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance_Schedule" ADD CONSTRAINT "Maintenance_Schedule_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance_Schedule" ADD CONSTRAINT "Maintenance_Schedule_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location"("locationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("categoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Alert" ADD CONSTRAINT "Item_Alert_alertID_fkey" FOREIGN KEY ("alertID") REFERENCES "Alert"("alertID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Alert" ADD CONSTRAINT "Item_Alert_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location"("locationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_vendorID_fkey" FOREIGN KEY ("vendorID") REFERENCES "Vendor"("vendorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt_Item" ADD CONSTRAINT "Receipt_Item_receiptID_fkey" FOREIGN KEY ("receiptID") REFERENCES "Receipt"("receiptID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt_Item" ADD CONSTRAINT "Receipt_Item_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_History" ADD CONSTRAINT "Purchase_History_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_History" ADD CONSTRAINT "Purchase_History_vendorID_fkey" FOREIGN KEY ("vendorID") REFERENCES "Vendor"("vendorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite_Item" ADD CONSTRAINT "Favorite_Item_favoriteID_fkey" FOREIGN KEY ("favoriteID") REFERENCES "Favorites"("favoriteID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite_Item" ADD CONSTRAINT "Favorite_Item_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template_Item" ADD CONSTRAINT "Template_Item_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template_Item" ADD CONSTRAINT "Template_Item_templateID_fkey" FOREIGN KEY ("templateID") REFERENCES "Template"("templateID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_location_fkey" FOREIGN KEY ("to_location") REFERENCES "Location"("locationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_location_fkey" FOREIGN KEY ("from_location") REFERENCES "Location"("locationID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_Item" ADD CONSTRAINT "Transaction_Item_transactionID_fkey" FOREIGN KEY ("transactionID") REFERENCES "Transaction"("transactionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction_Item" ADD CONSTRAINT "Transaction_Item_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "Item"("itemID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sync_Log" ADD CONSTRAINT "Sync_Log_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;
