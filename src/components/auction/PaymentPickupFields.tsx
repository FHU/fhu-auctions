import { useTranslations } from "next-intl";
import { PAYMENT_TEXT_MAX, URL_MAX } from "@/lib/charity-fields";

export interface PaymentPickupValues {
  paymentUrl: string;
  paymentInstructions: string;
  pickupInstructions: string;
}

interface PaymentPickupFieldsProps {
  values: PaymentPickupValues;
  onChange: (field: keyof PaymentPickupValues, value: string) => void;
  errors?: Partial<Record<keyof PaymentPickupValues, string>>;
}

/** Auction form section: how winners pay and pick up (FHU). */
export function PaymentPickupFields({
  values,
  onChange,
  errors = {},
}: PaymentPickupFieldsProps) {
  const t = useTranslations("auction.payment");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
        <span className="icon-[tabler--receipt] size-5"></span>
        {t("sectionTitle")}
      </h2>
      <p className="text-sm text-base-content/70">{t("sectionDescription")}</p>

      <div className="form-control">
        <label className="label" htmlFor="paymentInstructions">
          <span className="label-text font-medium">
            {t("paymentInstructions")}
          </span>
        </label>
        <textarea
          id="paymentInstructions"
          name="paymentInstructions"
          className="textarea textarea-bordered w-full min-h-24"
          placeholder={t("paymentInstructionsPlaceholder")}
          maxLength={PAYMENT_TEXT_MAX}
          value={values.paymentInstructions}
          onChange={(e) => onChange("paymentInstructions", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="paymentUrl">
          <span className="label-text font-medium">{t("paymentUrl")}</span>
        </label>
        <input
          id="paymentUrl"
          name="paymentUrl"
          type="url"
          inputMode="url"
          className={`input input-bordered w-full ${errors.paymentUrl ? "input-error" : ""}`}
          placeholder={t("paymentUrlPlaceholder")}
          maxLength={URL_MAX}
          pattern="https?://.+"
          value={values.paymentUrl}
          onChange={(e) => onChange("paymentUrl", e.target.value)}
          aria-describedby="paymentUrl-hint"
        />
        <span
          id="paymentUrl-hint"
          className={`text-xs mt-1 ${errors.paymentUrl ? "text-error" : "text-base-content/70"}`}
        >
          {errors.paymentUrl || t("paymentUrlHint")}
        </span>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="pickupInstructions">
          <span className="label-text font-medium">
            {t("pickupInstructions")}
          </span>
        </label>
        <textarea
          id="pickupInstructions"
          name="pickupInstructions"
          className="textarea textarea-bordered w-full min-h-24"
          placeholder={t("pickupInstructionsPlaceholder")}
          maxLength={PAYMENT_TEXT_MAX}
          value={values.pickupInstructions}
          onChange={(e) => onChange("pickupInstructions", e.target.value)}
        />
      </div>
    </div>
  );
}
