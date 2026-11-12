import { useTranslations } from "next-intl";
import { DONOR_NAME_MAX, URL_MAX } from "@/lib/charity-fields";

interface DonorFieldsProps {
  defaultValues?: {
    donorName: string | null;
    donorUrl: string | null;
    showDonor: boolean;
  };
  errors?: { donorName?: string; donorUrl?: string };
}

/**
 * Item form section: donor credit (FHU). Uncontrolled inputs named
 * donorName / donorUrl / showDonor; read them from FormData on submit.
 */
export function DonorFields({ defaultValues, errors = {} }: DonorFieldsProps) {
  const t = useTranslations("item.donor");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
        <span className="icon-[tabler--heart-handshake] size-5"></span>
        {t("sectionTitle")}
      </h2>
      <p className="text-sm text-base-content/70">{t("sectionDescription")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label" htmlFor="donorName">
            <span className="label-text font-medium">{t("donorName")}</span>
          </label>
          <input
            id="donorName"
            name="donorName"
            type="text"
            className={`input input-bordered w-full ${errors.donorName ? "input-error" : ""}`}
            placeholder={t("donorNamePlaceholder")}
            maxLength={DONOR_NAME_MAX}
            defaultValue={defaultValues?.donorName ?? ""}
          />
          {errors.donorName && (
            <span className="text-xs mt-1 text-error">{errors.donorName}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="donorUrl">
            <span className="label-text font-medium">{t("donorUrl")}</span>
          </label>
          <input
            id="donorUrl"
            name="donorUrl"
            type="url"
            inputMode="url"
            className={`input input-bordered w-full ${errors.donorUrl ? "input-error" : ""}`}
            placeholder={t("donorUrlPlaceholder")}
            maxLength={URL_MAX}
            pattern="https?://.+"
            defaultValue={defaultValues?.donorUrl ?? ""}
            aria-describedby="donorUrl-hint"
          />
          <span
            id="donorUrl-hint"
            className={`text-xs mt-1 ${errors.donorUrl ? "text-error" : "text-base-content/70"}`}
          >
            {errors.donorUrl || t("donorUrlHint")}
          </span>
        </div>
      </div>

      <label className="label cursor-pointer justify-start gap-3 p-0">
        <input
          type="checkbox"
          name="showDonor"
          className="toggle toggle-primary"
          defaultChecked={defaultValues?.showDonor ?? true}
        />
        <div>
          <span className="label-text font-medium">{t("showDonor")}</span>
          <p className="text-xs text-base-content/70 mt-0.5">
            {t("showDonorDescription")}
          </p>
        </div>
      </label>
    </div>
  );
}

/** Read donor fields from a submitted item form */
export function readDonorFields(formData: FormData) {
  return {
    donorName: (formData.get("donorName") as string | null) ?? "",
    donorUrl: (formData.get("donorUrl") as string | null) ?? "",
    showDonor: formData.get("showDonor") === "on",
  };
}
