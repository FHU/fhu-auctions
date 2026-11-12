import { createHandler, withAuth, requireSiteAdmin } from "@/lib/api";
import { siteAdminHandlers } from "@/lib/api/handlers";

export default createHandler({
  GET: [[withAuth, requireSiteAdmin], siteAdminHandlers.listUsers],
});
