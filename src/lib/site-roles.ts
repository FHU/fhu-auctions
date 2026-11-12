/**
 * Site-wide roles (FHU Auctions).
 *
 * Separate from per-auction MemberRole (OWNER/ADMIN/CREATOR/BIDDER):
 * - USER: can join auctions and bid
 * - ORGANIZER: can also create auctions
 * - SITE_ADMIN: can also grant and revoke site roles
 *
 * Emails listed in SITE_ADMIN_EMAILS (comma-separated) are always SITE_ADMIN,
 * which bootstraps the first admin and prevents locking everyone out.
 */
import type { SiteRole } from "@/generated/prisma/client";

export const SITE_ROLES = ["USER", "ORGANIZER", "SITE_ADMIN"] as const;

export function parseAdminEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEnvSiteAdmin(
  email: string | null | undefined,
  adminEmails: Set<string> = parseAdminEmails(process.env.SITE_ADMIN_EMAILS),
): boolean {
  return !!email && adminEmails.has(email.trim().toLowerCase());
}

/** The role that applies: SITE_ADMIN_EMAILS overrides the stored role. */
export function effectiveSiteRole(
  email: string | null | undefined,
  storedRole: SiteRole,
  adminEmails?: Set<string>,
): SiteRole {
  return isEnvSiteAdmin(email, adminEmails) ? "SITE_ADMIN" : storedRole;
}

export function canCreateAuctions(role: SiteRole): boolean {
  return role === "ORGANIZER" || role === "SITE_ADMIN";
}

export function isSiteAdminRole(role: SiteRole): boolean {
  return role === "SITE_ADMIN";
}
