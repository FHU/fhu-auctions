import { useState } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/common/BrandLockup";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlertMessage, SEO } from "@/components/common";
import { Button } from "@/components/ui/button";
import { getMessages, Locale } from "@/i18n";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || tErrors("generic"));
      } else {
        setSuccess(true);
      }
    } catch {
      setError(tErrors("generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title={t("title")} description={t("brandingDescription")} noindex />
      <div className="min-h-screen flex flex-col lg:flex-row bg-base-100">
        {/* Left side - Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-base-200 overflow-hidden items-center justify-center">
          {/* Background effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center max-w-lg">
            <Link href="/" aria-label={tCommon("appName")} className="mb-10">
              <BrandLockup variant="auto" />
            </Link>
            <h1 className="sr-only">{tCommon("appName")}</h1>

            <h2 className="text-2xl font-bold mb-4">{t("brandingTitle")}</h2>
            <p className="text-base-content/60 text-lg leading-relaxed">
              {t("brandingDescription")}
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-6 pt-24 sm:p-12 sm:pt-28 lg:pt-12 relative bg-base-100">
          <Link
            href="/"
            aria-label={tCommon("appName")}
            className="lg:hidden absolute top-8 left-6 flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BrandLockup variant="auto" size="sm" />
          </Link>

          <div className="w-full max-w-[400px]">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-base-content mb-2">
                {t("title")}
              </h2>
              <p className="text-base-content/60">{t("subtitle")}</p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="alert alert-success shadow-lg border-none bg-success/10 text-success-content">
                  <span className="icon-[tabler--mail-check] size-6"></span>
                  <div>
                    <h3 className="font-bold">{t("successTitle")}</h3>
                    <div className="text-sm opacity-90 mt-1">
                      {t("successMessage")}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-base-content/60 bg-base-200/50 p-4 rounded-xl">
                  <span className="font-semibold block mb-1">{t("note")}</span>
                  {t("successNote")}
                </p>

                <Link
                  href="/login"
                  className="btn btn-primary w-full shadow-lg shadow-primary/20"
                >
                  {t("backToSignIn")}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <AlertMessage type="error">{error}</AlertMessage>}

                <div className="form-control">
                  <label className="label pl-0" htmlFor="email">
                    <span className="label-text font-medium text-base-content/80">
                      {t("email")}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 icon-[tabler--mail] size-5"></span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      autoComplete="email"
                      className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-colors"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  modifier="block"
                  isLoading={isLoading}
                  loadingText={t("submitting")}
                  className="btn-lg text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                  icon={<span className="icon-[tabler--send] size-5"></span>}
                >
                  {t("submitButton")}
                </Button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-base-content/60">
                {t("rememberPassword")}{" "}
                <Link
                  href="/login"
                  className="link link-primary font-bold hover:text-primary/80 transition-colors"
                >
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const messages = await getMessages(context.locale as Locale);

  return {
    props: {
      messages,
    },
  };
};
