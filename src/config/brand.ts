/**
 * FHU Auctions brand configuration.
 *
 * Everything brand-specific lives here so upstream (Auktiva) changes merge
 * cleanly: call sites read from `brand` instead of hard-coding values.
 * Deployment-specific values come from env vars (NEXT_PUBLIC_* are inlined
 * at build time and safe to use in client components).
 *
 * User-facing copy in messages/<locale>/*.json also names the app; update
 * those strings if `appName` changes.
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export const brand = {
  appName: "FHU Auctions",
  /** Shown beside the FHU logo in the header lockup */
  siteLabel: "Auctions",
  orgName: "Freed-Hardeman University",
  orgUrl: "https://www.fhu.edu",
  description:
    "Charity auctions supporting Freed-Hardeman University students, faculty, and staff",
  postalAddress: "158 E. Main St., Henderson, TN 38340",

  /** Public base URL of this deployment (no trailing slash). */
  siteUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  /** Where "Feedback" / "Report issue" / "Contact" links go. Hidden if unset. */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || null,
  /** IANA time zone used to display dates (Henderson, TN is Central). */
  timeZone: process.env.NEXT_PUBLIC_TIME_ZONE || "America/Chicago",
  /** Help/documentation page. Help links are hidden if unset. */
  helpUrl: process.env.NEXT_PUBLIC_HELP_URL || null,

  /** The open-source project this site is built on (footer attribution). */
  upstream: {
    name: "Auktiva",
    url: "https://github.com/thomsa/auktiva",
  },
};

export const supportMailto = brand.supportEmail
  ? `mailto:${brand.supportEmail}`
  : null;

/** Email sender identity (server-side). */
export function getMailFrom(): { email: string; name: string } {
  return {
    email: process.env.MAIL_FROM || brand.supportEmail || "",
    name: process.env.MAIL_FROM_NAME || brand.appName,
  };
}
