import {
  createHandler,
  withAuth,
  withValidation,
  requireOrganizer,
} from "@/lib/api";
import { auctionHandlers, createAuctionSchema } from "@/lib/api/handlers";

export default createHandler({
  GET: [[withAuth], auctionHandlers.listAuctions],
  POST: [
    // FHU: only approved organizers (or site admins) can create auctions
    [withAuth, requireOrganizer, withValidation(createAuctionSchema)],
    auctionHandlers.createAuction,
  ],
});
