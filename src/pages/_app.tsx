import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { UpdateBanner } from "@/components/common";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AppProvider } from "@/contexts/AppContext";
import { Montserrat, Zilla_Slab } from "next/font/google";
import { brand } from "@/config/brand";

// FHU brand fonts (self-hosted by next/font)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <>
      <style jsx global>{`
        :root {
          --font-montserrat: ${montserrat.style.fontFamily};
          --font-zilla-slab: ${zillaSlab.style.fontFamily};
        }
      `}</style>
      <NextIntlClientProvider
        locale={router.locale}
        timeZone={brand.timeZone}
        messages={pageProps.messages}
      >
        <SessionProvider session={session}>
          <AppProvider>
            <NotificationProvider>
              <ThemeProvider>
                <ToastProvider>
                  <UpdateBanner />
                  <Component {...pageProps} />
                  <Analytics />
                </ToastProvider>
              </ThemeProvider>
            </NotificationProvider>
          </AppProvider>
        </SessionProvider>
      </NextIntlClientProvider>
    </>
  );
}
