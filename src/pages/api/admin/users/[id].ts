import {
  createHandler,
  withAuth,
  withValidation,
  requireSiteAdmin,
} from "@/lib/api";
import { siteAdminHandlers, updateSiteRoleSchema } from "@/lib/api/handlers";

export default createHandler({
  PATCH: [
    [withAuth, requireSiteAdmin, withValidation(updateSiteRoleSchema)],
    siteAdminHandlers.updateUserRole,
  ],
});
