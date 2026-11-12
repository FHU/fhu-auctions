import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "@/lib/auth";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/config";
import {
  SEO,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/components/common";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";

// Dynamically import below-the-fold components to reduce initial bundle
const FeatureGrid = dynamic(
  () =>
    import("@/components/landing/FeatureGrid").then((mod) => mod.FeatureGrid),
  { ssr: true },
);

const HowItWorks = dynamic(
  () => import("@/components/landing/HowItWorks").then((mod) => mod.HowItWorks),
  { ssr: true },
);

const UseCases = dynamic(
  () => import("@/components/landing/UseCases").then((mod) => mod.UseCases),
  { ssr: true },
);

const CallToAction = dynamic(
  () =>
    import("@/components/landing/CallToAction").then((mod) => mod.CallToAction),
  { ssr: true },
);

// Heavy animation component - no SSR needed
const ImpactVisualization = dynamic(
  () =>
    import("@/components/landing/ImpactVisualization").then(
      (mod) => mod.ImpactVisualization,
    ),
  { ssr: false },
);

export default function LandingPage() {
  return (
    <>
      <SEO
        description={SITE_DESCRIPTION}
        keywords={SITE_KEYWORDS}
        canonical={SITE_URL}
      />

      <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary/20">
        <Navbar />

        <main>
          <Hero />
          <FeatureGrid />
          <UseCases />
          <HowItWorks />
          <ImpactVisualization />
          <CallToAction />
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If logged in, redirect to dashboard
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const messages = await getMessages(context.locale as Locale);

  // Show landing page for non-authenticated users
  return {
    props: {
      messages,
    },
  };
};
