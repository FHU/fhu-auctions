/** Every locale with translations in messages/<locale>/ */
export type Locale = "en" | "pl" | "hu" | "de" | "es";

/**
 * Locales this deployment serves. FHU Auctions is English only; the other
 * translations stay in messages/ so a locale can be re-enabled by adding it
 * here AND to `i18n.locales` in next.config.ts. Language switchers hide
 * themselves when only one locale is enabled.
 */
export const locales: readonly Locale[] = ["en"];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  hu: "Magyar",
  de: "Deutsch",
  es: "Español",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  pl: "🇵🇱",
  hu: "🇭🇺",
  de: "🇩🇪",
  es: "🇪🇸",
};
