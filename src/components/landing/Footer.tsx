import Link from "next/link";
import { useTranslations } from "next-intl";
import { brand, supportMailto } from "@/config/brand";
import { BrandLockup } from "@/components/common/BrandLockup";

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-fhu-maroon-deep text-white border-t-4 border-fhu-gold pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link
              href="/"
              aria-label={t("common.appName")}
              className="inline-block mb-6"
            >
              <BrandLockup variant="white" />
            </Link>
            <p className="text-white/80 max-w-md mb-2">
              {t("footer.description")}
            </p>
            <p className="text-white/80 text-sm max-w-md">
              <a
                href={brand.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fhu-gold transition-colors"
              >
                {brand.orgName}
              </a>
              <br />
              {brand.postalAddress}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg text-fhu-gold">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-4 text-white/80">
              {brand.helpUrl && (
                <li>
                  <Link
                    href={brand.helpUrl}
                    className="hover:text-fhu-gold transition-colors"
                    target="_blank"
                  >
                    {t("nav.documentation")}
                  </Link>
                </li>
              )}
              {supportMailto && (
                <li>
                  <a
                    href={supportMailto}
                    className="hover:text-fhu-gold transition-colors"
                  >
                    {t("footer.contact")}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg text-fhu-gold">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-4 text-white/80">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-fhu-gold transition-colors"
                >
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-fhu-gold transition-colors"
                >
                  {t("footer.termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
          <p>
            © {new Date().getFullYear()} {brand.orgName}.{" "}
            {t("footer.allRightsReserved")}
          </p>
          <p>
            {t.rich("footer.poweredBy", {
              link: (chunks) => (
                <a
                  href={brand.upstream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline decoration-white/40 hover:text-fhu-gold hover:decoration-fhu-gold transition-colors"
                >
                  {chunks}
                </a>
              ),
            })}
            {" · "}
            {t("footer.designedBy")}{" "}
            <a
              href="https://tamaslorincz.com"
              className="text-white underline decoration-white/40 hover:text-fhu-gold hover:decoration-fhu-gold transition-colors"
            >
              Tamas Lorincz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
