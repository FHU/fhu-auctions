import { useTranslations } from "next-intl";
import { hasPaymentInfo } from "@/lib/charity-fields";

interface PaymentPickupInfoProps {
  paymentUrl: string | null;
  paymentInstructions: string | null;
  pickupInstructions: string | null;
  /** Heading shown above the info (omit for none) */
  title?: string;
  /** Show a "contact the organizer" note when nothing is set */
  showEmptyNote?: boolean;
  className?: string;
}

/** Read-only "How to pay / Picking up your item" block (FHU). */
export function PaymentPickupInfo({
  paymentUrl,
  paymentInstructions,
  pickupInstructions,
  title,
  showEmptyNote = false,
  className = "",
}: PaymentPickupInfoProps) {
  const t = useTranslations("auction.payment");
  const hasInfo = hasPaymentInfo({
    paymentUrl,
    paymentInstructions,
    pickupInstructions,
  });

  if (!hasInfo && !showEmptyNote) return null;

  return (
    <section className={className}>
      {title && <h3 className="font-bold text-base mb-3">{title}</h3>}

      {!hasInfo && (
        <p className="text-sm text-base-content/70">{t("noInfo")}</p>
      )}

      {(paymentInstructions || paymentUrl) && (
        <div className="mb-4 last:mb-0">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
            <span
              className="icon-[tabler--credit-card] size-4 text-primary"
              aria-hidden="true"
            ></span>
            {t("howToPay")}
          </h4>
          {paymentInstructions && (
            <p className="text-sm text-base-content/80 whitespace-pre-line break-words">
              {paymentInstructions}
            </p>
          )}
          {paymentUrl && (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm mt-2"
            >
              {t("payOnline")}
              <span
                className="icon-[tabler--external-link] size-4"
                aria-hidden="true"
              ></span>
            </a>
          )}
        </div>
      )}

      {pickupInstructions && (
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
            <span
              className="icon-[tabler--package] size-4 text-primary"
              aria-hidden="true"
            ></span>
            {t("pickup")}
          </h4>
          <p className="text-sm text-base-content/80 whitespace-pre-line break-words">
            {pickupInstructions}
          </p>
        </div>
      )}
    </section>
  );
}
