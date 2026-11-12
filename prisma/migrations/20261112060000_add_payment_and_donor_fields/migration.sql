-- AlterTable: payment & pickup instructions per auction
ALTER TABLE "auctions" ADD COLUMN "paymentUrl" TEXT;
ALTER TABLE "auctions" ADD COLUMN "paymentInstructions" TEXT;
ALTER TABLE "auctions" ADD COLUMN "pickupInstructions" TEXT;

-- AlterTable: donor credit per item
ALTER TABLE "auction_items" ADD COLUMN "donorName" TEXT;
ALTER TABLE "auction_items" ADD COLUMN "donorUrl" TEXT;
ALTER TABLE "auction_items" ADD COLUMN "showDonor" BOOLEAN NOT NULL DEFAULT true;
