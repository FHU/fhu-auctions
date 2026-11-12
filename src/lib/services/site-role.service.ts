import { prisma } from "@/lib/prisma";
import type { SiteRole } from "@/generated/prisma/client";
import { effectiveSiteRole, isEnvSiteAdmin } from "@/lib/site-roles";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";

/** Effective site role for a user (SITE_ADMIN_EMAILS applied). */
export async function getUserSiteRole(userId: string): Promise<SiteRole> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, siteRole: true },
  });
  if (!user) return "USER";
  return effectiveSiteRole(user.email, user.siteRole);
}

export interface SiteUserRow {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  siteRole: SiteRole;
  /** True when SITE_ADMIN_EMAILS makes this user an admin (role can't be changed here) */
  managedByEnv: boolean;
}

/** Users for the site-admin page: organizers/admins first, then newest. */
export async function listUsersForAdmin(options: {
  search?: string;
  limit?: number;
}): Promise<SiteUserRow[]> {
  const search = options.search?.trim();
  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [{ email: { contains: search } }, { name: { contains: search } }],
        }
      : undefined,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      siteRole: true,
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(options.limit ?? 200, 500),
  });

  const rank: Record<SiteRole, number> = {
    SITE_ADMIN: 0,
    ORGANIZER: 1,
    USER: 2,
  };
  return users
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt.toISOString(),
      siteRole: effectiveSiteRole(u.email, u.siteRole),
      managedByEnv: isEnvSiteAdmin(u.email),
    }))
    .sort((a, b) => rank[a.siteRole] - rank[b.siteRole]);
}

/** Change a user's stored site role (site admins only; checked by middleware). */
export async function setUserSiteRole(
  actorId: string,
  targetId: string,
  role: SiteRole,
): Promise<SiteUserRow> {
  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, email: true },
  });
  if (!target) throw new NotFoundError("User not found");

  if (isEnvSiteAdmin(target.email)) {
    throw new BadRequestError(
      "This user is a site admin through SITE_ADMIN_EMAILS; change it there.",
    );
  }
  if (actorId === targetId && role !== "SITE_ADMIN") {
    throw new BadRequestError("You can't remove your own site admin role.");
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { siteRole: role },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      siteRole: true,
    },
  });

  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    managedByEnv: false,
  };
}
