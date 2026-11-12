/**
 * FHU charity-auction fields: payment & pickup info (auctions) and donor
 * credit (items). Shared validation + privacy rules.
 */
import { z } from "zod";

export const PAYMENT_TEXT_MAX = 2000;
export const DONOR_NAME_MAX = 200;
export const URL_MAX = 500;

/** Only http(s) links: blocks javascript:, data:, etc. in user-supplied URLs */
export const httpUrlSchema = z
  .url({ protocol: /^https?$/, message: "Enter a full http(s):// link" })
  .max(URL_MAX);

/** Optional text that may be cleared: "" and whitespace become null */
const clearableText = (max: number) =>
  z
    .string()
    .max(max)
    .transform((v) => v.trim() || null)
    .nullable()
    .optional();

/** Optional URL that may be cleared ("" becomes null) */
const clearableUrl = z
  .union([z.literal(""), httpUrlSchema])
  .transform((v) => v || null)
  .nullable()
  .optional();

export const paymentFieldsSchema = {
  paymentUrl: clearableUrl,
  paymentInstructions: clearableText(PAYMENT_TEXT_MAX),
  pickupInstructions: clearableText(PAYMENT_TEXT_MAX),
};

export const donorFieldsSchema = {
  donorName: clearableText(DONOR_NAME_MAX),
  donorUrl: clearableUrl,
  showDonor: z.boolean().optional(),
};

export interface DonorFields {
  donorName: string | null;
  donorUrl: string | null;
  showDonor: boolean;
}

/**
 * Hide an anonymous donor from viewers who aren't allowed to see it.
 * Item creators and auction owners/admins always see the donor (they record
 * it for Advancement); everyone else only when showDonor is true.
 */
export function redactDonor<T extends DonorFields>(
  item: T,
  canSeeHiddenDonor: boolean,
): T {
  if (item.showDonor || canSeeHiddenDonor) return item;
  return { ...item, donorName: null, donorUrl: null };
}

/** Whether an auction has any payment/pickup info worth showing */
export function hasPaymentInfo(a: {
  paymentUrl?: string | null;
  paymentInstructions?: string | null;
  pickupInstructions?: string | null;
}): boolean {
  return !!(a.paymentUrl || a.paymentInstructions || a.pickupInstructions);
}
