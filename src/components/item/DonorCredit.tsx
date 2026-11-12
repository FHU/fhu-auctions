import { useTranslations } from "next-intl";

interface DonorCreditProps {
  donorName: string | null;
  donorUrl?: string | null;
  /** When false the viewer only sees it because they may (creator/admin) */
  showDonor?: boolean;
  className?: string;
}

/** "Donated by …" line for items (FHU). Renders nothing without a donor. */
export function DonorCredit({
  donorName,
  donorUrl,
  showDonor = true,
  className = "",
}: DonorCreditProps) {
  const t = useTranslations("item.donor");
  if (!donorName) return null;

  const name = donorUrl ? (
    <a
      href={donorUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="link link-primary font-medium"
    >
      {donorName}
    </a>
  ) : (
    <span className="font-medium">{donorName}</span>
  );

  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${className}`}
    >
      <span
        className="icon-[tabler--heart-handshake] size-4 text-primary"
        aria-hidden="true"
      ></span>
      <span>
        {t("donatedBy")} {name}
      </span>
      {!showDonor && (
        <span className="badge badge-ghost badge-sm">
          {t("hiddenFromBidders")}
        </span>
      )}
    </p>
  );
}
