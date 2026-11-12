import { ForbiddenError } from "../errors";
import type { Middleware } from "../types";
import type { SiteRole } from "@/generated/prisma/client";
import { getUserSiteRole } from "@/lib/services/site-role.service";
import { canCreateAuctions, isSiteAdminRole } from "@/lib/site-roles";

/**
 * Site-role checks (FHU Auctions). Require withAuth first.
 * The role is read from the database on every request, so grants and
 * revocations take effect immediately (no re-login needed).
 */
function requireSiteRole(
  allowed: (role: SiteRole) => boolean,
  message: string,
): Middleware {
  return (next) => async (req, res, ctx) => {
    const userId = ctx.session?.user?.id;
    if (!userId || !allowed(await getUserSiteRole(userId))) {
      throw new ForbiddenError(message);
    }
    return next(req, res, ctx);
  };
}

/** Only organizers and site admins may create auctions. */
export const requireOrganizer = requireSiteRole(
  canCreateAuctions,
  "Only approved organizers can create auctions",
);

/** Only site admins may manage site roles. */
export const requireSiteAdmin = requireSiteRole(
  isSiteAdminRole,
  "Site admin access required",
);
