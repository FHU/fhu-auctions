import Link from "next/link";
import { useTranslations } from "next-intl";
import packageJson from "../../../package.json";

export function Hero() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-200/50 border border-base-content/10 backdrop-blur-sm mb-8 hover:border-primary/50 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-base-content/80">
              {t("badge", { version: packageJson.version })}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            {t("title")} <br />
            <span className="text-primary">{t("titleHighlight")}</span>
          </h1>

          <p className="text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="btn btn-primary btn-lg h-14 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="icon-[tabler--rocket] size-6"></span>
              {t("startAuction")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
