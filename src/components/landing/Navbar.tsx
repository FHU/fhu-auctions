import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslations } from "next-intl";
import { brand } from "@/config/brand";
import { BrandLockup } from "@/components/common/BrandLockup";

export function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is an intentional hydration pattern to prevent SSR mismatch
    setMounted(true); // eslint-disable-line
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-fhu-maroon text-white border-b-4 border-fhu-gold py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          aria-label={tCommon("appName")}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <BrandLockup variant="white" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm font-semibold text-white">
            <Link
              href="#features"
              className="hover:text-fhu-gold transition-colors"
            >
              {t("features")}
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-fhu-gold transition-colors"
            >
              {t("howItWorks")}
            </Link>
            {brand.helpUrl && (
              <a
                href={brand.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fhu-gold transition-colors"
              >
                {t("docs")}
              </a>
            )}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-white/30">
            <LanguageSwitcher compact />
            {mounted && (
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10 border-none"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <span className="icon-[tabler--sun] size-5"></span>
                ) : (
                  <span className="icon-[tabler--moon] size-5"></span>
                )}
              </button>
            )}
            <Link
              href="/login"
              className="btn btn-ghost btn-sm text-white hover:bg-white/10 border-none"
            >
              {t("signIn")}
            </Link>
            <Link
              href="/register"
              className="btn btn-sm bg-fhu-gold text-fhu-maroon-deep border-none hover:bg-white"
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher compact />
          {mounted && (
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10 border-none"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <span className="icon-[tabler--sun] size-5"></span>
              ) : (
                <span className="icon-[tabler--moon] size-5"></span>
              )}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10 border-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <span className="icon-[tabler--x] size-6"></span>
            ) : (
              <span className="icon-[tabler--menu-2] size-6"></span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-base-100 text-base-content border-b border-base-300">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="#features"
              onClick={closeMobileMenu}
              className="btn btn-ghost justify-start"
            >
              {t("features")}
            </Link>
            <Link
              href="#how-it-works"
              onClick={closeMobileMenu}
              className="btn btn-ghost justify-start"
            >
              {t("howItWorks")}
            </Link>
            {brand.helpUrl && (
              <a
                href={brand.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost justify-start"
              >
                {t("docs")}
              </a>
            )}
            <div className="divider my-1"></div>
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="btn btn-ghost justify-start"
            >
              {t("signIn")}
            </Link>
            <Link
              href="/register"
              onClick={closeMobileMenu}
              className="btn btn-primary"
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
