import { z } from "zod";
import type { ApiHandler } from "@/lib/api/types";
import * as siteRoleService from "@/lib/services/site-role.service";
import { SITE_ROLES } from "@/lib/site-roles";

export const updateSiteRoleSchema = z.object({
  siteRole: z.enum(SITE_ROLES),
});

export type UpdateSiteRoleBody = z.infer<typeof updateSiteRoleSchema>;

/**
 * GET /api/admin/users?search= - List users with their site roles
 */
export const listUsers: ApiHandler = async (_req, res, ctx) => {
  const users = await siteRoleService.listUsersForAdmin({
    search: ctx.params.search,
  });
  res.status(200).json({ users });
};

/**
 * PATCH /api/admin/users/[id] - Change a user's site role
 */
export const updateUserRole: ApiHandler = async (req, res, ctx) => {
  const { siteRole } = req.body as UpdateSiteRoleBody;
  const user = await siteRoleService.setUserSiteRole(
    ctx.session!.user.id,
    ctx.params.id,
    siteRole,
  );
  res.status(200).json({ user });
};
