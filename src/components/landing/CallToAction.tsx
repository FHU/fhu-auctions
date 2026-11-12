"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function CallToAction() {
  const t = useTranslations("landing.cta");

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Main CTA */}
        <div className="relative overflow-hidden bg-primary text-primary-content px-8 py-20 text-center">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto font-light">
              {t("description")}
            </p>

            <div className="flex flex-col items-center gap-2">
              <Link
                href="/register"
                className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none shadow-xl h-14 px-8"
              >
                {t("getStarted")}{" "}
                <span className="icon-[tabler--rocket] size-6"></span>
              </Link>
              <p className="text-sm text-primary-content/90">
                {t("freeForever")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
